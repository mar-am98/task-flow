"use client"

import Link from "next/link"
import { useSearchParams } from "next/navigation"
import {
  CheckCircle2,
  Calendar,
  CalendarDays,
  FolderDot,
  Flame,
  CheckSquare,
} from "lucide-react"

import { ScrollArea } from "@/components/ui/scroll-area"
import { projectNames, projectColors } from "@/lib/projects"
import type { SidebarStats } from "@/features/tasks/lib/task-query"
import { cn } from "@/lib/utils"

interface SidebarProps {
  stats: SidebarStats
}

function hrefWithNav(searchParams: URLSearchParams, nav: string | null) {
  const params = new URLSearchParams(searchParams.toString())
  if (!nav || nav === "all") {
    params.delete("nav")
  } else {
    params.set("nav", nav)
  }
  const qs = params.toString()
  return qs ? `/?${qs}` : "/"
}

function isNavActive(activeNav: string, nav: string) {
  if (nav === "all") return activeNav === "all" || !activeNav
  return activeNav === nav
}

export function Sidebar({ stats }: SidebarProps) {
  const searchParams = useSearchParams()
  const normalizedNav = searchParams.get("nav") || "all"

  const overviewLinks = [
    { nav: "all", label: "All Tasks", icon: FolderDot, iconClass: "text-blue-500", count: stats.all },
    { nav: "today", label: "Today", icon: Calendar, iconClass: "text-orange-500", count: stats.today },
    { nav: "upcoming", label: "Upcoming", icon: CalendarDays, iconClass: "text-purple-500", count: stats.upcoming },
    {
      nav: "completed",
      label: "Completed",
      icon: CheckCircle2,
      iconClass: "text-green-500",
      count: stats.completed,
    },
  ] as const

  return (
    <div className="flex h-screen w-64 flex-col bg-sidebar border-r border-sidebar-border text-sidebar-foreground">
      <div className="flex h-16 items-center px-6 py-4">
        <Link href="/" className="flex items-center gap-2 font-bold text-sidebar-foreground text-lg tracking-tight">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600 text-white">
            <CheckSquare className="h-5 w-5" />
          </div>
          <div className="flex flex-col leading-tight">
            <span>TaskFlow</span>
          </div>
        </Link>
      </div>

      <ScrollArea className="flex-1 px-4 py-2">
        <div className="space-y-6">
          <div className="space-y-1">
            <h4 className="px-2 py-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Overview
            </h4>
            <nav className="grid gap-1">
              {overviewLinks.map(({ nav, label, icon: Icon, iconClass, count }) => {
                const active = isNavActive(normalizedNav, nav)
                return (
                  <Link
                    key={nav}
                    href={hrefWithNav(searchParams, nav === "all" ? null : nav)}
                    className={cn(
                      "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                      active
                        ? "bg-sidebar-accent text-sidebar-accent-foreground"
                        : "hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                    )}
                  >
                    <Icon className={cn("h-4 w-4", iconClass)} />
                    {label}
                    <span
                      className={cn(
                        "ml-auto flex h-5 min-w-5 items-center justify-center rounded-full px-1 text-[10px]",
                        active ? "bg-blue-600/20 text-blue-400" : "bg-sidebar-accent"
                      )}
                    >
                      {count}
                    </span>
                  </Link>
                )
              })}
            </nav>
          </div>

          <div className="space-y-1">
            <div className="flex items-center justify-between px-2 py-2">
              <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Projects</h4>
              <span className="text-muted-foreground text-lg leading-none opacity-50" aria-hidden>
                +
              </span>
            </div>
            <nav className="grid gap-1">
              {projectNames.map((name) => {
                const nav = `project:${name}`
                const active = normalizedNav === nav
                const count = stats.projects[name] ?? 0
                return (
                  <Link
                    key={name}
                    href={hrefWithNav(searchParams, `project:${name}`)}
                    className={cn(
                      "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                      active
                        ? "bg-sidebar-accent text-sidebar-accent-foreground"
                        : "hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                    )}
                  >
                    <div className={cn("h-2 w-2 rounded-full", projectColors[name])} />
                    {name}
                    <span className="ml-auto flex h-5 min-w-5 items-center justify-center rounded-full bg-sidebar-accent px-1 text-[10px]">
                      {count}
                    </span>
                  </Link>
                )
              })}
            </nav>
          </div>
        </div>
      </ScrollArea>

      <div className="p-4 mt-auto">
        <div className="rounded-xl bg-gradient-to-br from-amber-500/10 to-orange-600/10 border border-amber-500/20 p-4 flex items-center gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-amber-500 to-orange-600 text-white shadow-sm">
            <Flame className="h-5 w-5" />
          </div>
          <div>
            <p className="text-xs font-medium text-amber-500">Streak active!</p>
            <p className="text-sm font-bold text-white">3 Days Completed</p>
          </div>
        </div>
      </div>
    </div>
  )
}
