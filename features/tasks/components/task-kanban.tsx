"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { cn } from "@/lib/utils"
import { TASK_STATUSES, type TaskStatus } from "@/features/tasks/lib/task-status"
import { updateTaskStatus } from "../actions"
import type { Task } from "./task-list-card"
import { TaskKanbanCard } from "./task-kanban-card"

const columnDots: Record<TaskStatus, string> = {
  "To Do": "bg-blue-500",
  "In Progress": "bg-sky-400",
  Done: "bg-emerald-500",
}

const columns = TASK_STATUSES.map((status) => ({
  status,
  label: status,
  dot: columnDots[status],
}))

interface TaskKanbanProps {
  tasks: Task[]
}

export function TaskKanban({ tasks }: TaskKanbanProps) {
  const router = useRouter()
  // Local copy so the card jumps columns immediately on drop, before the
  // server round-trip finishes.
  const [board, setBoard] = useState<Task[]>(tasks)
  const [syncedFrom, setSyncedFrom] = useState(tasks)
  const [draggingId, setDraggingId] = useState<string | null>(null)
  const [overStatus, setOverStatus] = useState<TaskStatus | null>(null)

  // Re-sync when fresh server data arrives. Adjusting during render (rather than
  // in an effect) keeps the optimistic copy from lagging a render behind.
  if (tasks !== syncedFrom) {
    setSyncedFrom(tasks)
    setBoard(tasks)
  }

  const hasAny = board.length > 0

  const handleDrop = async (status: TaskStatus) => {
    const id = draggingId
    setDraggingId(null)
    setOverStatus(null)
    if (!id) return

    const current = board.find((t) => t.id === id)
    if (!current || current.status === status) return

    // Optimistic move — remember the previous state so a failure can revert it.
    const previous = board
    setBoard((prev) => prev.map((t) => (t.id === id ? { ...t, status } : t)))

    const result = await updateTaskStatus(id, status)
    if (result?.error) {
      setBoard(previous)
      return
    }
    router.refresh()
  }

  if (!hasAny) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-muted-foreground">
        <p className="text-lg font-medium">No tasks match</p>
        <p className="text-sm">Try another filter or create a new task.</p>
      </div>
    )
  }

  return (
    <div className="grid h-full min-h-0 grid-rows-[minmax(0,1fr)] gap-4 p-6 lg:grid-cols-3">
      {columns.map(({ status, label, dot }) => {
        const columnTasks = board.filter((t) => t.status === status)

        return (
          <section
            key={status}
            onDragOver={(e) => {
              e.preventDefault() // allow drop
              e.dataTransfer.dropEffect = "move"
              if (overStatus !== status) setOverStatus(status)
            }}
            onDragLeave={(e) => {
              // Ignore moves between children of the same column
              if (!e.currentTarget.contains(e.relatedTarget as Node)) {
                setOverStatus((prev) => (prev === status ? null : prev))
              }
            }}
            onDrop={(e) => {
              e.preventDefault()
              void handleDrop(status)
            }}
            className={cn(
              "flex min-h-0 flex-col rounded-xl border border-border/80 bg-muted/20 transition-colors",
              overStatus === status && "border-primary/60 bg-primary/5 ring-2 ring-primary/20"
            )}
          >
            <header className="flex shrink-0 items-center gap-2 border-b border-border/60 px-4 py-3">
              <span className={cn("h-2 w-2 rounded-full", dot)} aria-hidden />
              <h2 className="text-sm font-semibold text-foreground">{label}</h2>
              <span className="ml-auto flex h-5 min-w-5 items-center justify-center rounded-full bg-muted px-1.5 text-[10px] font-medium text-muted-foreground">
                {columnTasks.length}
              </span>
            </header>

            <div className="flex min-h-0 flex-1 flex-col gap-3 overflow-y-auto p-3">
              {columnTasks.length === 0 ? (
                <p
                  className={cn(
                    "py-8 text-center text-xs text-muted-foreground",
                    overStatus === status && "text-primary"
                  )}
                >
                  {overStatus === status ? "Drop here" : "No tasks here"}
                </p>
              ) : (
                columnTasks.map((task) => (
                  <TaskKanbanCard
                    key={task.id}
                    task={task}
                    dragging={draggingId === task.id}
                    onDragStart={(t) => setDraggingId(t.id)}
                    onDragEnd={() => {
                      setDraggingId(null)
                      setOverStatus(null)
                    }}
                  />
                ))
              )}
            </div>
          </section>
        )
      })}
    </div>
  )
}
