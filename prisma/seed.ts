import dotenv from 'dotenv'
import { PrismaClient } from '../lib/generated/prisma'
import { Pool } from 'pg'
import { PrismaPg } from '@prisma/adapter-pg'

dotenv.config()

const pool = new Pool({ connectionString: process.env.DATABASE_URL })
const adapter = new PrismaPg(pool)
const prisma = new PrismaClient({ adapter })

async function main() {
  await prisma.subtask.deleteMany()
  await prisma.task.deleteMany()
  
  // Insert Task 1
  await prisma.task.create({
    data: {
      title: "Review Monthly Subscription Budgets",
      priority: "HIGH",
      status: "To Do",
      description: "Check credit card statements for unused cloud services.",
      projectName: "Personal",
      projectColor: "bg-emerald-500",
      dueDate: new Date("2026-09-27T00:00:00.000Z"),
    },
  })

  // Insert Task 2
  await prisma.task.create({
    data: {
      title: "Design UI Wireframes for SaaS Dashboard",
      priority: "URGENT",
      status: "In Progress",
      description: "Create initial Figma prototypes for dark and light mode navigation bars.",
      projectName: "Work & Office",
      projectColor: "bg-blue-500",
      dueDate: new Date("2026-09-29T00:00:00.000Z"),
      subtasks: {
        create: [
          { text: "Dark mode variations", completed: true },
          { text: "Light mode variations", completed: false }
        ]
      }
    },
  })

  // Insert Task 3
  await prisma.task.create({
    data: {
      title: "Morning 5K Workout & Stretch",
      priority: "MEDIUM",
      status: "Done",
      description: "Cardio routine before heading to work.",
      projectName: "Health & Fitness",
      projectColor: "bg-orange-500",
      dueDate: new Date("2026-09-29T00:00:00.000Z"),
    },
  })

  // Insert Task 4
  await prisma.task.create({
    data: {
      title: "Prepare Quarterly Team Presentation",
      priority: "HIGH",
      status: "To Do",
      description: "Gather metrics on key performance indicators.",
      projectName: "Work & Office",
      projectColor: "bg-blue-500",
      dueDate: new Date("2026-10-02T00:00:00.000Z"),
    },
  })
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })
