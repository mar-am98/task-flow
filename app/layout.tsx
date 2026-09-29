import type { Metadata } from "next";
import { Geist, Geist_Mono, Roboto } from "next/font/google";
import { Suspense } from "react";
import "./globals.css";
import { cn } from "@/lib/utils";
import { Sidebar } from "@/components/layout/sidebar";
import { Header } from "@/components/layout/header";
import { getTasks } from "@/features/tasks/actions";
import { computeSidebarStats } from "@/features/tasks/lib/task-query";

const roboto = Roboto({subsets:['latin'],variable:'--font-sans'});

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "TaskFlow — Todo List",
  description: "TaskFlow Pro Edition — tasks built with Next.js, Prisma, and Supabase.",
};

export const dynamic = "force-dynamic";

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const { data: tasks } = await getTasks();
  const serialized = JSON.parse(JSON.stringify(tasks));
  const stats = computeSidebarStats(serialized);

  return (
    <html
      lang="en"
      className={cn("h-full", "antialiased", geistSans.variable, geistMono.variable, "font-sans", roboto.variable)}
    >
      <body className="min-h-full flex flex-col dark">
        <div className="mx-auto flex h-screen w-full max-w-[1600px] overflow-hidden bg-background font-sans selection:bg-primary/30">
          <div className="hidden md:block">
            <Suspense fallback={<div className="w-64 h-screen border-r border-sidebar-border" />}>
              <Sidebar stats={stats} />
            </Suspense>
          </div>
          <div className="flex flex-1 flex-col overflow-hidden border-l border-border">
            <Suspense fallback={<div className="h-20 border-b border-border" />}>
              <Header />
            </Suspense>
            <main className="min-h-0 flex-1 overflow-hidden bg-background">
              {children}
            </main>
          </div>
        </div>
      </body>
    </html>
  );
}
