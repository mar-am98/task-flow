"use client"

import { TaskListCard, Task } from "./task-list-card"

interface TaskListProps {
  tasks: Task[]
}

export function TaskList({ tasks }: TaskListProps) {

  if (tasks.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-muted-foreground">
        <p className="text-lg font-medium">No tasks match</p>
        <p className="text-sm">Try another filter or create a new task.</p>
      </div>
    )
  }

  return (
    <div className="p-8">
      <div className="flex flex-col gap-4 max-w-4xl">
        {tasks.map((task) => (
          <TaskListCard key={task.id} task={task} />
        ))}
      </div>
    </div>
  )
}
