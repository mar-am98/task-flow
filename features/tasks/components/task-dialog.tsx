"use client"

import React, { useEffect, useRef, useState, useTransition } from "react"
import { useRouter } from "next/navigation"
import { CalendarIcon, X } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { createTask, updateTask } from "../actions"
import { projectNames } from "@/lib/projects"
import { normalizePriority } from "@/features/tasks/lib/task-display"

interface TaskData {
  id: string
  title: string
  description?: string | null
  priority: string
  status: string
  projectName: string
  dueDate?: string | null
  subtasks: { id: string; text: string; completed: boolean }[]
}

const statusOptions = ["To Do", "In Progress", "Done"] as const

export function TaskDialog({
  children,
  title = "Create New Task",
  task,
}: {
  children: React.ReactElement
  title?: string
  task?: TaskData
}) {
  const isEditing = !!task
  const router = useRouter()
  const formRef = useRef<HTMLFormElement>(null)
  const [open, setOpen] = useState(false)
  const [isPending, startTransition] = useTransition()
  const [error, setError] = useState<string | null>(null)

  const [subtasks, setSubtasks] = useState<{ id: string; text: string; completed: boolean }[]>([])
  const [projectName, setProjectName] = useState("Personal")
  const [priority, setPriority] = useState("MEDIUM")
  const [status, setStatus] = useState<string>("To Do")
  const [formSeed, setFormSeed] = useState(0)

  useEffect(() => {
    if (!open) return

    setError(null)
    if (task) {
      setSubtasks(task.subtasks.map((st) => ({ ...st })))
      setProjectName(task.projectName)
      setPriority(normalizePriority(task.priority))
      setStatus(task.status)
    } else {
      setSubtasks([])
      setProjectName("Personal")
      setPriority("MEDIUM")
      setStatus("To Do")
    }
    setFormSeed((n) => n + 1)
  }, [open, task])

  const addSubtask = () => {
    setSubtasks((prev) => [
      ...prev,
      { id: `${Date.now()}-${prev.length}`, text: "", completed: false },
    ])
  }

  const removeSubtask = (id: string) => {
    setSubtasks((prev) => prev.filter((st) => st.id !== id))
  }

  const updateSubtaskText = (id: string, text: string) => {
    setSubtasks((prev) => prev.map((st) => (st.id === id ? { ...st, text } : st)))
  }

  const toggleSubtaskCompleted = (id: string) => {
    setSubtasks((prev) =>
      prev.map((st) => (st.id === id ? { ...st, completed: !st.completed } : st))
    )
  }

  const handleSubmit = async (formData: FormData) => {
    setError(null)
    formData.set("projectName", projectName)
    formData.set("priority", priority)
    formData.set("status", status)
    formData.set("subtasks", JSON.stringify(subtasks))

    startTransition(async () => {
      const result = isEditing
        ? await updateTask(task!.id, formData)
        : await createTask(formData)

      if (result?.error) {
        setError(result.error)
      } else {
        formRef.current?.reset()
        setSubtasks([])
        setOpen(false)
        router.refresh()
      }
    })
  }

  const defaultDueDate = task?.dueDate
    ? new Date(task.dueDate).toISOString().split("T")[0]
    : ""

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger render={children} />
      <DialogContent className="gap-0 border-border bg-card p-0 sm:max-w-xl shadow-2xl">
        <DialogHeader className="border-b border-border px-6 py-5">
          <DialogTitle className="text-lg font-semibold text-foreground">{title}</DialogTitle>
        </DialogHeader>

        <form
          key={formSeed}
          ref={formRef}
          action={handleSubmit}
          className="grid max-h-[min(80vh,720px)] gap-5 overflow-y-auto px-6 py-5"
        >
          <div className="space-y-2">
            <label htmlFor="task-title" className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              Task Title *
            </label>
            <Input
              id="task-title"
              name="title"
              required
              placeholder="e.g., Finalize Q3 Marketing Report"
              className="h-11 border-border bg-muted/50"
              defaultValue={task?.title ?? ""}
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="task-description" className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              Description / Notes
            </label>
            <Textarea
              id="task-description"
              name="description"
              placeholder="Add additional details or links..."
              className="min-h-24 resize-none border-border bg-muted/50"
              defaultValue={task?.description ?? ""}
            />
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <span className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                Project / Tag
              </span>
              <Select value={projectName} onValueChange={(value) => value && setProjectName(value)}>
                <SelectTrigger className="h-11 w-full border-border bg-muted/50">
                  <SelectValue placeholder="Select project" />
                </SelectTrigger>
                <SelectContent>
                  {projectNames.map((name) => (
                    <SelectItem key={name} value={name}>
                      {name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <span className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                Priority
              </span>
              <Select value={priority} onValueChange={(value) => value && setPriority(value)}>
                <SelectTrigger className="h-11 w-full border-border bg-muted/50">
                  <SelectValue placeholder="Select priority" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="LOW">Low</SelectItem>
                  <SelectItem value="MEDIUM">Medium</SelectItem>
                  <SelectItem value="HIGH">High</SelectItem>
                  <SelectItem value="URGENT">Urgent</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label htmlFor="task-due-date" className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                Due Date
              </label>
              <div className="relative">
                <Input
                  id="task-due-date"
                  name="dueDate"
                  type="date"
                  className="h-11 w-full border-border bg-muted/50 pl-10"
                  defaultValue={defaultDueDate}
                />
                <CalendarIcon className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              </div>
            </div>

            <div className="space-y-2">
              <span className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                Status
              </span>
              <Select value={status} onValueChange={(value) => value && setStatus(value)}>
                <SelectTrigger className="h-11 w-full border-border bg-muted/50">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  {statusOptions.map((option) => (
                    <SelectItem key={option} value={option}>
                      {option}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                Subtasks Checklist
              </span>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="h-8 text-xs font-medium text-blue-500 hover:bg-blue-500/10 hover:text-blue-400"
                onClick={addSubtask}
              >
                + Add Subtask
              </Button>
            </div>

            <div className="space-y-2">
              {subtasks.length === 0 && (
                <p className="rounded-lg border border-dashed border-border bg-muted/20 px-3 py-4 text-center text-xs text-muted-foreground">
                  No subtasks yet. Add steps to break down this task.
                </p>
              )}
              {subtasks.map((st) => (
                <div
                  key={st.id}
                  className="flex items-center gap-3 rounded-lg border border-border bg-muted/30 p-2"
                >
                  <Checkbox
                    checked={st.completed}
                    onCheckedChange={() => toggleSubtaskCompleted(st.id)}
                  />
                  <Input
                    value={st.text}
                    onChange={(e) => updateSubtaskText(st.id, e.target.value)}
                    placeholder="Subtask details..."
                    className="h-8 flex-1 border-none bg-transparent px-0 focus-visible:ring-0"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7 shrink-0 text-muted-foreground hover:text-destructive"
                    onClick={() => removeSubtask(st.id)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          </div>

          {error && <p className="text-sm text-destructive">{error}</p>}

          <div className="flex justify-end gap-3 border-t border-border pt-4">
            <Button
              type="button"
              variant="ghost"
              className="text-muted-foreground hover:text-foreground"
              onClick={() => setOpen(false)}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isPending}
              className="rounded-lg bg-blue-600 px-6 text-white hover:bg-blue-700"
            >
              {isPending ? "Saving..." : isEditing ? "Update Task" : "Save Task"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
