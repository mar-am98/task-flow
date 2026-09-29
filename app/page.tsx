import { getTasks } from "@/features/tasks/actions"
import { TaskFilters } from "@/features/tasks/components/task-filters"
import { TaskList } from "@/features/tasks/components/task-list"

// Server component — fetches tasks from DB, serializes dates for client components
export default async function Home() {
  const { data: tasks } = await getTasks()

  // Serialize Date objects to strings for client component consumption
  const serialized = JSON.parse(JSON.stringify(tasks))

  return (
    <main>
      <TaskFilters />
      <TaskList tasks={serialized} />
    </main>
  )
}
