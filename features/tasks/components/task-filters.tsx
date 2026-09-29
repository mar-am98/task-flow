"use client"

import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { List, LayoutGrid, BarChart2, ChevronDown, Flame, Clock } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { cn } from "@/lib/utils"
import type { TaskQuickFilter, TaskSort } from "@/features/tasks/lib/task-query"

const sortLabels: Record<TaskSort, string> = {
  dueDate: "Due Date",
  priority: "Priority",
  created: "Created",
  title: "Title",
}

export function TaskFilters() {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const view = searchParams.get("view") || "list"
  const filter = (searchParams.get("filter") || "all") as TaskQuickFilter
  const sort = (searchParams.get("sort") || "dueDate") as TaskSort

  function updateParams(updates: Record<string, string | null>) {
    const params = new URLSearchParams(searchParams.toString())
    for (const [key, value] of Object.entries(updates)) {
      if (value === null || value === "all" || (key === "view" && value === "list")) {
        params.delete(key)
      } else {
        params.set(key, value)
      }
    }
    const qs = params.toString()
    router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false })
  }

  function toggleQuickFilter(next: TaskQuickFilter) {
    updateParams({ filter: filter === next ? null : next })
  }

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between border-b border-border px-4 sm:px-8 py-4 bg-background gap-4">
      <Tabs
        value={view}
        onValueChange={(value) => updateParams({ view: value })}
        className="w-full sm:w-auto overflow-x-auto"
      >
        <TabsList className="bg-muted p-1 border-none rounded-lg h-9 w-max">
          <TabsTrigger
            value="list"
            className="text-xs font-medium data-[state=active]:bg-background data-[state=active]:text-foreground text-muted-foreground rounded-md px-4 py-1.5 flex items-center gap-2"
          >
            <List className="h-3.5 w-3.5" />
            List
          </TabsTrigger>
          <TabsTrigger
            value="kanban"
            className="text-xs font-medium data-[state=active]:bg-background data-[state=active]:text-foreground text-muted-foreground rounded-md px-4 py-1.5 flex items-center gap-2"
          >
            <LayoutGrid className="h-3.5 w-3.5" />
            Kanban
          </TabsTrigger>
          <TabsTrigger
            value="analytics"
            className="text-xs font-medium data-[state=active]:bg-background data-[state=active]:text-foreground text-muted-foreground rounded-md px-4 py-1.5 flex items-center gap-2"
          >
            <BarChart2 className="h-3.5 w-3.5" />
            Analytics
          </TabsTrigger>
        </TabsList>
      </Tabs>

      <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto">
        <Button
          variant="outline"
          size="sm"
          type="button"
          onClick={() => toggleQuickFilter("urgent")}
          className={cn(
            "h-8 border-border bg-transparent text-foreground hover:bg-accent rounded-full px-4 text-xs font-medium shrink-0",
            filter === "urgent" && "border-red-500/50 bg-red-500/10"
          )}
        >
          <span className="flex items-center gap-1.5 text-red-500">
            <Flame className="h-3 w-3" />
            Urgent
          </span>
        </Button>
        <Button
          variant="outline"
          size="sm"
          type="button"
          onClick={() => toggleQuickFilter("overdue")}
          className={cn(
            "h-8 border-border bg-transparent text-foreground hover:bg-accent rounded-full px-4 text-xs font-medium shrink-0",
            filter === "overdue" && "border-amber-500/50 bg-amber-500/10"
          )}
        >
          <span className="flex items-center gap-1.5 text-amber-500">
            <Clock className="h-3 w-3" />
            Overdue
          </span>
        </Button>

        <Select value={sort} onValueChange={(value) => updateParams({ sort: value })}>
          <SelectTrigger className="h-8 w-auto min-w-[140px] border-none bg-transparent text-xs font-medium gap-1 shadow-none focus:ring-0">
            <span className="text-muted-foreground">Sort:</span>
            <SelectValue>{sortLabels[sort]}</SelectValue>
          </SelectTrigger>
          <SelectContent align="end">
            {(Object.keys(sortLabels) as TaskSort[]).map((key) => (
              <SelectItem key={key} value={key}>
                {sortLabels[key]}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  )
}
