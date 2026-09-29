"use client"

import { useRef } from "react"
import { Calendar, CheckSquare, CheckCircle2, Edit2, Trash2 } from "lucide-react"
import { cn } from "@/lib/utils"
import { TaskDialog } from "./task-dialog"
import { projectColors, defaultProjectColor } from "@/lib/projects"
import { deleteTask } from "../actions"
import { ConfirmDialog } from "@/components/ui/confirm-dialog"
import type { Task } from "./task-list-card"
import {
  formatDueDate,
  isTaskOverdue,
  normalizePriority,
  priorityConfig,
} from "@/features/tasks/lib/task-display"

interface TaskKanbanCardProps {
  task: Task
  /** Provided by the board — omit to render a static, non-draggable card. */
  onDragStart?: (task: Task) => void
  onDragEnd?: () => void
  dragging?: boolean
}

const INTERACTIVE_SELECTOR = "button, a, input, textarea, select, [role='button']"

export function TaskKanbanCard({ task, onDragStart, onDragEnd, dragging = false }: TaskKanbanCardProps) {
  // True when the pointer went down on a button/link, so the card doesn't start
  // dragging while the user is trying to click edit or delete.
  const fromInteractive = useRef(false)

  const isCompleted = task.status === "Done"
  const projectColor = task.projectColor || projectColors[task.projectName] || defaultProjectColor
  const priorityKey = normalizePriority(task.priority)
  const dueDateStr = formatDueDate(task.dueDate)
  const overdue = isTaskOverdue(task.dueDate, isCompleted)
  const totalSubtasks = task.subtasks?.length ?? 0
  const completedSubtasks = task.subtasks?.filter((st) => st.completed).length ?? 0

  const handleDelete = () => deleteTask(task.id)
  const draggable = Boolean(onDragStart)

  return (
    <div
      draggable={draggable}
      onPointerDown={(e) => {
        fromInteractive.current = Boolean(
          (e.target as Element | null)?.closest?.(INTERACTIVE_SELECTOR)
        )
      }}
      onDragStart={(e) => {
        if (!onDragStart || fromInteractive.current) {
          e.preventDefault()
          return
        }
        e.dataTransfer.effectAllowed = "move"
        e.dataTransfer.setData("text/plain", task.id)
        onDragStart(task)
      }}
      onDragEnd={() => {
        fromInteractive.current = false
        onDragEnd?.()
      }}
      className={cn(
        "group relative rounded-xl border border-border bg-card p-4 shadow-sm transition-colors hover:bg-muted/40",
        draggable && "cursor-grab active:cursor-grabbing",
        isCompleted && "opacity-90",
        dragging && "opacity-40"
      )}
    >
      <div className="absolute right-2 top-2 flex items-center gap-0.5 opacity-0 transition-opacity group-hover:opacity-100">
        <TaskDialog title="Edit Task" task={task}>
          <button
            type="button"
            className="rounded-md p-1.5 text-muted-foreground transition-colors hover:bg-blue-500/10 hover:text-blue-500"
          >
            <Edit2 className="h-3.5 w-3.5" />
          </button>
        </TaskDialog>
        <ConfirmDialog
          title="Delete Task"
          description="Are you sure you want to delete this task? This action cannot be undone."
          onConfirm={handleDelete}
        >
          <button
            type="button"
            className="rounded-md p-1.5 text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive"
          >
            <Trash2 className="h-3.5 w-3.5" />
          </button>
        </ConfirmDialog>
      </div>

      <div className="flex items-start gap-2 pr-14">
        {isCompleted && (
          <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-500" aria-hidden />
        )}
        <div className="min-w-0 flex-1 space-y-2">
          <div className="flex flex-wrap items-center gap-2">
            <h3
              className={cn(
                "truncate text-sm font-semibold text-foreground",
                isCompleted && "text-muted-foreground line-through"
              )}
            >
              {task.title}
            </h3>
            {priorityConfig[priorityKey] && (
              <span
                className={cn(
                  "shrink-0 rounded px-1.5 py-0.5 text-[9px] font-bold tracking-wider",
                  priorityConfig[priorityKey].className
                )}
              >
                {priorityConfig[priorityKey].label}
              </span>
            )}
          </div>

          {task.description && (
            <p className="line-clamp-2 text-xs leading-relaxed text-muted-foreground">
              {task.description}
            </p>
          )}

          <div className="flex flex-wrap items-center gap-3 text-[11px] font-medium">
            <div className="flex items-center gap-1.5">
              <div className={cn("h-1.5 w-1.5 rounded-full", projectColor)} />
              <span className="text-foreground/80">{task.projectName}</span>
            </div>

            {dueDateStr && (
              <div
                className={cn(
                  "flex items-center gap-1",
                  overdue ? "text-destructive" : "text-muted-foreground"
                )}
              >
                <Calendar className="h-3 w-3" />
                <span>{overdue ? `Overdue: ${dueDateStr}` : dueDateStr}</span>
              </div>
            )}

            {totalSubtasks > 0 && (
              <div className="flex items-center gap-1 text-muted-foreground">
                <CheckSquare className="h-3 w-3" />
                <span>
                  {completedSubtasks}/{totalSubtasks} subtasks
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
