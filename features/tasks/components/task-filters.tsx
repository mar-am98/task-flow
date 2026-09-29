import { List, LayoutGrid, BarChart2, ChevronDown } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"

export function TaskFilters() {
  return (
    <div className="flex flex-col sm:flex-row items-center justify-between border-b border-border px-4 sm:px-8 py-4 bg-background gap-4">
      <Tabs defaultValue="list" className="w-full sm:w-auto overflow-x-auto">
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
        <Button variant="outline" size="sm" className="h-8 border-border bg-transparent text-foreground hover:bg-accent rounded-full px-4 text-xs font-medium shrink-0">
          <span className="flex items-center gap-1.5 text-red-500">
            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z"/></svg>
            Urgent
          </span>
        </Button>
        <Button variant="outline" size="sm" className="h-8 border-border bg-transparent text-foreground hover:bg-accent rounded-full px-4 text-xs font-medium shrink-0">
          <span className="flex items-center gap-1.5 text-amber-500">
            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
            Overdue
          </span>
        </Button>
        <Button variant="ghost" size="sm" className="h-8 text-foreground hover:bg-accent rounded-full px-3 text-xs font-medium gap-1 flex items-center shrink-0">
          <span className="text-muted-foreground">↓</span> Sort: Due Date
          <ChevronDown className="h-3 w-3 ml-1 text-muted-foreground" />
        </Button>
      </div>
    </div>
  )
}
