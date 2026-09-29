import Link from "next/link"
import {
  CheckCircle2,
  Calendar,
  CalendarDays,
  CheckCircle,
  FolderDot,
  Flame,
  CheckSquare
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"

export function Sidebar() {
  return (
    <div className="flex h-screen w-64 flex-col bg-sidebar border-r border-sidebar-border text-sidebar-foreground">
      <div className="flex h-16 items-center px-6 py-4">
        <Link href="/" className="flex items-center gap-2 font-bold text-sidebar-foreground text-lg tracking-tight">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600 text-white">
            <CheckSquare className="h-5 w-5" />
          </div>
          <div className="flex flex-col leading-none">
            <span>TaskFlow</span>
          </div>
        </Link>
      </div>

      <ScrollArea className="flex-1 px-4 py-2">
        <div className="space-y-6">
          <div className="space-y-1">
            <h4 className="px-2 py-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Overview</h4>
            <nav className="grid gap-1">
              <Link
                href="#"
                className="flex items-center gap-3 rounded-lg bg-sidebar-accent px-3 py-2 text-sm font-medium text-sidebar-accent-foreground"
              >
                <FolderDot className="h-4 w-4 text-blue-500" />
                All Tasks
                <span className="ml-auto flex h-5 w-5 items-center justify-center rounded-full bg-blue-600/20 text-[10px] text-blue-400">
                  3
                </span>
              </Link>
              <Link
                href="#"
                className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium hover:bg-sidebar-accent hover:text-sidebar-accent-foreground transition-colors"
              >
                <Calendar className="h-4 w-4 text-orange-500" />
                Today
                <span className="ml-auto flex h-5 w-5 items-center justify-center rounded-full bg-sidebar-accent text-[10px]">
                  1
                </span>
              </Link>
              <Link
                href="#"
                className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium hover:bg-sidebar-accent hover:text-sidebar-accent-foreground transition-colors"
              >
                <CalendarDays className="h-4 w-4 text-purple-500" />
                Upcoming
                <span className="ml-auto flex h-5 w-5 items-center justify-center rounded-full bg-sidebar-accent text-[10px]">
                  1
                </span>
              </Link>
              <Link
                href="#"
                className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium hover:bg-sidebar-accent hover:text-sidebar-accent-foreground transition-colors"
              >
                <CheckCircle2 className="h-4 w-4 text-green-500" />
                Completed
                <span className="ml-auto flex h-5 w-5 items-center justify-center rounded-full bg-sidebar-accent text-[10px]">
                  1
                </span>
              </Link>
            </nav>
          </div>

          <div className="space-y-1">
            <div className="flex items-center justify-between px-2 py-2">
              <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Projects</h4>
              <button className="text-muted-foreground hover:text-sidebar-foreground">
                <span className="text-lg leading-none">+</span>
              </button>
            </div>
            <nav className="grid gap-1">
              <Link
                href="#"
                className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium hover:bg-sidebar-accent hover:text-sidebar-accent-foreground transition-colors"
              >
                <div className="h-2 w-2 rounded-full bg-blue-500" />
                Work & Office
                <span className="ml-auto flex h-5 w-5 items-center justify-center rounded-full bg-sidebar-accent text-[10px]">
                  2
                </span>
              </Link>
              <Link
                href="#"
                className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium hover:bg-sidebar-accent hover:text-sidebar-accent-foreground transition-colors"
              >
                <div className="h-2 w-2 rounded-full bg-emerald-500" />
                Personal
                <span className="ml-auto flex h-5 w-5 items-center justify-center rounded-full bg-sidebar-accent text-[10px]">
                  1
                </span>
              </Link>
              <Link
                href="#"
                className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium hover:bg-sidebar-accent hover:text-sidebar-accent-foreground transition-colors"
              >
                <div className="h-2 w-2 rounded-full bg-orange-500" />
                Health & Fitness
                <span className="ml-auto flex h-5 w-5 items-center justify-center rounded-full bg-sidebar-accent text-[10px]">
                  0
                </span>
              </Link>
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
