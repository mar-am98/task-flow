import { PrismaClient } from "./lib/generated/prisma";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";
import dotenv from "dotenv";

dotenv.config();
const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });
try {
  const d = await prisma.subtask.deleteMany();
  console.log("deleteMany first ok", d.count);
} catch (e: any) {
  console.log("FAIL", e.code, JSON.stringify(e.meta), e.message?.slice(0, 300));
} finally {
  await prisma.$disconnect();
}
