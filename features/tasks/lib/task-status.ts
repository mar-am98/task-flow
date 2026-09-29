// The three kanban columns. Shared by the board UI and the status server action
// so both sides always agree on the allowed values.

export const TASK_STATUSES = ["To Do", "In Progress", "Done"] as const

export type TaskStatus = (typeof TASK_STATUSES)[number]

export function isTaskStatus(value: string): value is TaskStatus {
  return (TASK_STATUSES as readonly string[]).includes(value)
}
