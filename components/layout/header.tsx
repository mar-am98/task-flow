"use client"

import { useEffect, useState, useTransition } from "react"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { Search, Plus, Settings } from "lucide-react"

import { TaskDialog } from "@/features/tasks/components/task-dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { navTitle, parseTaskNav } from "@/features/tasks/lib/task-query"

export function Header() {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const [, startTransition] = useTransition()

  const nav = parseTaskNav(searchParams.get("nav") ?? undefined)
  const title = navTitle(nav)
  const qFromUrl = searchParams.get("q") ?? ""
  const [search, setSearch] = useState(qFromUrl)

  useEffect(() => {
    setSearch(qFromUrl)
  }, [qFromUrl])

  useEffect(() => {
    const handle = window.setTimeout(() => {
      if (search === qFromUrl) return
      const params = new URLSearchParams(searchParams.toString())
      if (search.trim()) {
        params.set("q", search.trim())
      } else {
        params.delete("q")
      }
      startTransition(() => {
        router.replace(`${pathname}?${params.toString()}`, { scroll: false })
      })
    }, 300)
    return () => window.clearTimeout(handle)
  }, [search, qFromUrl, pathname, router, searchParams])

  return (
    <header className="flex h-20 shrink-0 items-center justify-between border-b border-border bg-background px-8">
      <h1 className="text-2xl font-bold text-foreground tracking-tight">{title}</h1>

      <div className="flex items-center gap-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search tasks..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-70 bg-muted/50 border-none pl-10 text-sm text-foreground placeholder:text-muted-foreground focus-visible:ring-1 focus-visible:ring-primary rounded-full h-10"
          />
        </div>

        <TaskDialog>
          <Button className="rounded-full gap-2 font-medium h-10 px-5 shadow-lg shadow-primary/20">
            <Plus className="h-4 w-4" />
            New Task
          </Button>
        </TaskDialog>

        {/* <Button size="icon" variant="ghost" className="text-amber-400 hover:text-amber-300 hover:bg-amber-500/10">
          <Settings className="h-5 w-5" />
          <span className="sr-only">Settings</span>
        </Button> */}
      </div>
    </header>
  )
}
