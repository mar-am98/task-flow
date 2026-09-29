import type { Task } from "@/features/tasks/components/task-list-card"

export type TaskNav =
  | "all"
  | "today"
  | "upcoming"
  | "completed"
  | `project:${string}`

export type TaskQuickFilter = "all" | "urgent" | "overdue"

export type TaskSort = "dueDate" | "priority" | "created" | "title"

export interface TaskListQuery {
  nav?: string
  q?: string
  filter?: string
  sort?: string
}

const priorityOrder: Record<string, number> = {
  URGENT: 0,
  HIGH: 1,
  MEDIUM: 2,
  LOW: 3,
}

function startOfDay(date: Date) {
  const d = new Date(date)
  d.setHours(0, 0, 0, 0)
  return d
}

function endOfDay(date: Date) {
  const d = new Date(date)
  d.setHours(23, 59, 59, 999)
  return d
}

function isOverdue(task: Task, now = new Date()) {
  if (task.status === "Done" || !task.dueDate) return false
  return new Date(task.dueDate) < startOfDay(now)
}

function isToday(task: Task, now = new Date()) {
  if (!task.dueDate) return false
  const due = new Date(task.dueDate)
  return due >= startOfDay(now) && due <= endOfDay(now)
}

function isUpcoming(task: Task, now = new Date()) {
  if (!task.dueDate || task.status === "Done") return false
  return new Date(task.dueDate) > endOfDay(now)
}

export function parseTaskNav(raw?: string): TaskNav {
  if (!raw || raw === "all") return "all"
  if (raw === "today" || raw === "upcoming" || raw === "completed") return raw
  if (raw.startsWith("project:")) return raw as TaskNav
  return "all"
}

export function parseQuickFilter(raw?: string): TaskQuickFilter {
  if (raw === "urgent" || raw === "overdue") return raw
  return "all"
}

export function parseSort(raw?: string): TaskSort {
  if (raw === "priority" || raw === "created" || raw === "title") return raw
  return "dueDate"
}

export function navTitle(nav: TaskNav): string {
  if (nav === "all") return "All Tasks"
  if (nav === "today") return "Today"
  if (nav === "upcoming") return "Upcoming"
  if (nav === "completed") return "Completed"
  if (nav.startsWith("project:")) return nav.slice("project:".length)
  return "All Tasks"
}

export function filterAndSortTasks(tasks: Task[], query: TaskListQuery): Task[] {
  const nav = parseTaskNav(query.nav)
  const quickFilter = parseQuickFilter(query.filter)
  const sort = parseSort(query.sort)
  const search = query.q?.trim().toLowerCase() ?? ""
  const now = new Date()

  let result = [...tasks]

  switch (nav) {
    case "today":
      result = result.filter((t) => isToday(t, now))
      break
    case "upcoming":
      result = result.filter((t) => isUpcoming(t, now))
      break
    case "completed":
      result = result.filter((t) => t.status === "Done")
      break
    default:
      if (nav.startsWith("project:")) {
        const project = nav.slice("project:".length)
        result = result.filter((t) => t.projectName === project)
      }
      break
  }

  if (quickFilter === "urgent") {
    result = result.filter((t) => (t.priority || "").toUpperCase() === "URGENT")
  } else if (quickFilter === "overdue") {
    result = result.filter((t) => isOverdue(t, now))
  }

  if (search) {
    result = result.filter((t) => {
      const haystack = [t.title, t.description ?? "", t.projectName]
        .join(" ")
        .toLowerCase()
      return haystack.includes(search)
    })
  }

  result.sort((a, b) => {
    if (sort === "title") {
      return a.title.localeCompare(b.title)
    }
    if (sort === "priority") {
      const pa = priorityOrder[(a.priority || "MEDIUM").toUpperCase()] ?? 99
      const pb = priorityOrder[(b.priority || "MEDIUM").toUpperCase()] ?? 99
      return pa - pb
    }
    if (sort === "created") {
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    }
    // dueDate — tasks without due date go last
    const da = a.dueDate ? new Date(a.dueDate).getTime() : Number.MAX_SAFE_INTEGER
    const db = b.dueDate ? new Date(b.dueDate).getTime() : Number.MAX_SAFE_INTEGER
    return da - db
  })

  return result
}

export interface SidebarStats {
  all: number
  today: number
  upcoming: number
  completed: number
  projects: Record<string, number>
}

/** Compute sidebar badge counts from the full task list. */
export function computeSidebarStats(tasks: Task[]): SidebarStats {
  const now = new Date()
  const projects: Record<string, number> = {}

  for (const task of tasks) {
    projects[task.projectName] = (projects[task.projectName] ?? 0) + 1
  }

  return {
    all: tasks.length,
    today: tasks.filter((t) => isToday(t, now)).length,
    upcoming: tasks.filter((t) => isUpcoming(t, now)).length,
    completed: tasks.filter((t) => t.status === "Done").length,
    projects,
  }
}
