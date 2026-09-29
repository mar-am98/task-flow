"use client"

import React, { useRef, useState, useTransition } from "react"
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

// Serialized Task shape — used to pre-fill the form in edit mode
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

  // Subtask list — initialized from existing task data when editing
  const [subtasks, setSubtasks] = useState<{ id: string; text: string; completed: boolean }[]>(
    () => task?.subtasks?.map((st) => ({ ...st })) ?? []
  )

  // Pre-fill values for edit mode
  const defaultPriority = task?.priority || "MEDIUM"
  const defaultStatus = task?.status || "To Do"
  const defaultProject = task?.projectName || "Personal"
  const defaultDueDate = task?.dueDate
    ? new Date(task.dueDate).toISOString().split("T")[0]
    : ""

  const addSubtask = () => {
    setSubtasks([...subtasks, { id: Date.now().toString(), text: "", completed: false }])
  }

  const removeSubtask = (id: string) => {
    setSubtasks(subtasks.filter((st) => st.id !== id))
  }

  const updateSubtaskText = (id: string, text: string) => {
    setSubtasks(subtasks.map((st) => (st.id === id ? { ...st, text } : st)))
  }

  const toggleSubtaskCompleted = (id: string) => {
    setSubtasks(
      subtasks.map((st) => (st.id === id ? { ...st, completed: !st.completed } : st))
    )
  }

  const handleSubmit = async (formData: FormData) => {
    setError(null)
    // Inject subtasks as JSON into the form data
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

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger render={children} />
      <DialogContent className="sm:max-w-150 bg-background border-border">
        <DialogHeader>
          <DialogTitle className="text-foreground">{title}</DialogTitle>
        </DialogHeader>

        <form ref={formRef} action={handleSubmit} className="grid gap-6 py-4">
          <div className="space-y-2">
            <label className="text-xs font-semibold text-muted-foreground uppercase">
              Task Title *
            </label>
            <Input
              name="title"
              required
              placeholder="e.g., Finalize Q3 Marketing Report"
              className="bg-muted/50 border-border"
              defaultValue={task?.title}
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-semibold text-muted-foreground uppercase">
              Description / Notes
            </label>
            <Textarea
              name="description"
              placeholder="Add additional details or links..."
              className="min-h-25 bg-muted/50 border-border"
              defaultValue={task?.description ?? ""}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-xs font-semibold text-muted-foreground uppercase">
                Project / Tag
              </label>
              <Select name="projectName" defaultValue={defaultProject}>
                <SelectTrigger className="bg-muted/50 border-border">
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
              <label className="text-xs font-semibold text-muted-foreground uppercase">
                Priority
              </label>
              <Select name="priority" defaultValue={defaultPriority}>
                <SelectTrigger className="bg-muted/50 border-border">
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
              <label className="text-xs font-semibold text-muted-foreground uppercase">
                Due Date
              </label>
              <div className="relative">
                <Input
                  name="dueDate"
                  type="date"
                  className="bg-muted/50 border-border pl-10 block w-full"
                  defaultValue={defaultDueDate}
                />
                <CalendarIcon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground pointer-events-none" />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-semibold text-muted-foreground uppercase">
                Status
              </label>
              <Select name="status" defaultValue={defaultStatus}>
                <SelectTrigger className="bg-muted/50 border-border">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="To Do">To Do</SelectItem>
                  <SelectItem value="In Progress">In Progress</SelectItem>
                  <SelectItem value="Done">Done</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold text-muted-foreground uppercase">
                Subtasks Checklist
              </label>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="h-8 text-blue-500 hover:text-blue-400 hover:bg-blue-500/10 text-xs font-medium"
                onClick={addSubtask}
              >
                + Add Subtask
              </Button>
            </div>

            <div className="space-y-2">
              {subtasks.map((st) => (
                <div
                  key={st.id}
                  className="flex items-center gap-3 bg-muted/30 p-2 rounded-lg border border-border"
                >
                  <Checkbox
                    checked={st.completed}
                    onCheckedChange={() => toggleSubtaskCompleted(st.id)}
                  />
                  <Input
                    value={st.text}
                    onChange={(e) => updateSubtaskText(st.id, e.target.value)}
                    placeholder="Subtask details..."
                    className="h-8 bg-transparent border-none focus-visible:ring-0 px-0"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6 text-muted-foreground hover:text-destructive shrink-0"
                    onClick={() => removeSubtask(st.id)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          </div>

          {error && (
            <p className="text-sm text-destructive">{error}</p>
          )}

          <div className="flex justify-end gap-3 mt-4">
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
              className="bg-blue-600 hover:bg-blue-700 text-white px-6"
            >
              {isPending ? "Saving..." : isEditing ? "Update Task" : "Save Task"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
