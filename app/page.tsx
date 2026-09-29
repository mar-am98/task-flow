import { Suspense } from "react"
import { getTasks } from "@/features/tasks/actions"
import { TaskFilters } from "@/features/tasks/components/task-filters"
import { TaskList } from "@/features/tasks/components/task-list"
import { TaskKanban } from "@/features/tasks/components/task-kanban"
import { filterAndSortTasks } from "@/features/tasks/lib/task-query"

export const dynamic = "force-dynamic"

interface HomeProps {
  searchParams: Promise<{
    nav?: string
    q?: string
    filter?: string
    sort?: string
    view?: string
  }>
}

export default async function Home({ searchParams }: HomeProps) {
  const params = await searchParams
  const { data: tasks } = await getTasks()

  const serialized = JSON.parse(JSON.stringify(tasks))
  const filtered = filterAndSortTasks(serialized, params)
  const view = params.view ?? "list"

  return (
    <div className="flex h-full min-h-0 flex-col">
      <Suspense fallback={null}>
        <TaskFilters />
      </Suspense>
      <div className="min-h-0 flex-1">
        {view === "list" ? (
          <div className="h-full overflow-y-auto">
            <TaskList tasks={filtered} />
          </div>
        ) : view === "kanban" ? (
          <TaskKanban tasks={filtered} />
        ) : (
          <div className="flex h-full flex-col items-center justify-center text-muted-foreground px-8 text-center">
            <p className="text-lg font-medium text-foreground">Analytics</p>
            <p className="text-sm mt-1 max-w-md">
              Coming in a later part — charts and completion stats.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
