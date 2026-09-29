import { Search, Plus } from "lucide-react"

import { TaskDialog } from "@/features/tasks/components/task-dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export function Header() {
  return (
    <header className="flex h-20 items-center justify-between border-b border-border bg-background px-8">
      <h1 className="text-2xl font-bold text-foreground tracking-tight">All Tasks</h1>
      
      <div className="flex items-center gap-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search tasks..."
            className="w-70 bg-muted/50 border-none pl-10 text-sm text-foreground placeholder:text-muted-foreground focus-visible:ring-1 focus-visible:ring-primary rounded-full h-10"
          />
        </div>
        
        <TaskDialog>
          <Button className="rounded-full gap-2 font-medium h-10 px-5 shadow-lg shadow-primary/20">
            <Plus className="h-4 w-4" />
            New Task
          </Button>
        </TaskDialog>
        
        <Button size="icon" variant="ghost">
          {/* this is for dark mode from shadcn */}
        </Button>
      </div>
    </header>
  )
}
