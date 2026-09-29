"use client"

import { useRouter } from "next/navigation"
import { Calendar, CheckSquare, Circle, CheckCircle2, Edit2, Trash2 } from "lucide-react"
import { cn } from "@/lib/utils"
import { TaskDialog } from "./task-dialog"
import { projectColors, defaultProjectColor } from "@/lib/projects"
import { toggleTaskStatus, deleteTask, toggleSubtask } from "../actions"
import { ConfirmDialog } from "@/components/ui/confirm-dialog"

// Serialized Prisma Task shape (dates are strings after JSON serialization)
export interface Task {
  id: string
  title: string
  description?: string | null
  priority: string
  status: string
  projectName: string
  projectColor: string
  dueDate?: string | null
  createdAt: string
  updatedAt: string
  subtasks: {
    id: string
    text: string
    completed: boolean
  }[]
}

interface TaskListCardProps {
  task: Task
}

const priorityConfig: Record<string, { className: string; label: string }> = {
  HIGH: { className: "bg-orange-500/10 text-orange-500", label: "HIGH" },
  URGENT: { className: "bg-red-500/10 text-red-500", label: "URGENT" },
  MEDIUM: { className: "bg-blue-500/10 text-blue-500", label: "MEDIUM" },
  LOW: { className: "bg-slate-500/10 text-slate-400", label: "LOW" },
}

export function TaskListCard({ task }: TaskListCardProps) {
  const router = useRouter()
  const isCompleted = task.status === "Done"
  const projectColor = task.projectColor || projectColors[task.projectName] || defaultProjectColor

  // Compute subtask counts from the array
  const totalSubtasks = task.subtasks?.length ?? 0
  const completedSubtasks = task.subtasks?.filter((st) => st.completed).length ?? 0

  // Format due date for display
  const dueDateStr = task.dueDate
    ? new Date(task.dueDate).toISOString().split("T")[0]
    : null

  // Check if overdue (due date is in the past and not completed)
  const isOverdue =
    !isCompleted && task.dueDate && new Date(task.dueDate) < new Date()

  // Map priority to uppercase for config lookup
  const priorityKey = (task.priority || "MEDIUM").toUpperCase()

  const handleToggleStatus = async () => {
    await toggleTaskStatus(task.id, task.status)
    router.refresh()
  }

  const handleDelete = () => deleteTask(task.id)

  const handleToggleSubtask = async (subtaskId: string, completed: boolean) => {
    await toggleSubtask(subtaskId, completed)
    router.refresh()
  }

  return (
    <div className="group flex items-start gap-4 rounded-xl border border-border bg-card p-5 hover:bg-muted/50 transition-colors">
      <button
        onClick={handleToggleStatus}
        className="mt-1 shrink-0 text-muted-foreground hover:text-primary transition-colors"
      >
        {isCompleted ? (
          <CheckCircle2 className="h-5 w-5 text-emerald-500" />
        ) : (
          <Circle className="h-5 w-5" />
        )}
      </button>

      <div className="flex flex-1 flex-col gap-2 relative">
        <div className="flex items-center gap-3 pr-20">
          <h3
            className={cn(
              "text-base font-semibold text-foreground tracking-tight",
              isCompleted && "text-muted-foreground line-through"
            )}
          >
            {task.title}
          </h3>
          {priorityConfig[priorityKey] && (
            <span
              className={cn(
                "rounded px-2 py-0.5 text-[10px] font-bold tracking-wider shrink-0",
                priorityConfig[priorityKey].className
              )}
            >
              {priorityConfig[priorityKey].label}
            </span>
          )}
        </div>

        {task.description && (
          <p className="text-sm text-muted-foreground leading-relaxed pr-20">
            {task.description}
          </p>
        )}

        <div className="mt-2 flex flex-wrap items-center gap-4 text-xs font-medium">
          <div className="flex items-center gap-2">
            <div className={cn("h-2 w-2 rounded-full", projectColor)} />
            <span className="text-foreground/80">{task.projectName}</span>
          </div>

          {dueDateStr && (
            <div
              className={cn(
                "flex items-center gap-1.5",
                isOverdue ? "text-destructive" : "text-muted-foreground"
              )}
            >
              <Calendar className="h-3.5 w-3.5" />
              <span>
                {isOverdue ? "Overdue: " : ""}
                {dueDateStr}
              </span>
            </div>
          )}

          {totalSubtasks > 0 && (
            <div className="flex items-center gap-1.5 text-muted-foreground">
              <CheckSquare className="h-3.5 w-3.5" />
              <span>
                {completedSubtasks}/{totalSubtasks} subtasks
              </span>
            </div>
          )}
        </div>

        {/* Inline subtask toggles */}
        {totalSubtasks > 0 && (
          <div className="mt-2 space-y-1">
            {task.subtasks.map((st) => (
              <button
                key={st.id}
                onClick={() => handleToggleSubtask(st.id, st.completed)}
                className="flex items-center gap-2 text-xs text-muted-foreground hover:text-foreground transition-colors"
              >
                {st.completed ? (
                  <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />
                ) : (
                  <Circle className="h-3.5 w-3.5" />
                )}
                <span className={cn(st.completed && "line-through")}>
                  {st.text}
                </span>
              </button>
            ))}
          </div>
        )}

        {/* Hover Actions */}
        <div className="absolute right-0 top-0 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <TaskDialog title="Edit Task" task={task}>
            <button className="p-2 text-muted-foreground hover:text-blue-500 hover:bg-blue-500/10 rounded-md transition-colors">
              <Edit2 className="h-4 w-4" />
            </button>
          </TaskDialog>
          <ConfirmDialog
            title="Delete Task"
            description="Are you sure you want to delete this task? This action cannot be undone."
            onConfirm={handleDelete}
          >
            <button className="p-2 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-md transition-colors">
              <Trash2 className="h-4 w-4" />
            </button>
          </ConfirmDialog>
        </div>
      </div>
    </div>
  )
}
