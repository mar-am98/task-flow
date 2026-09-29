import type { Metadata } from "next";
import { Geist, Geist_Mono, Roboto } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import { Sidebar } from "@/components/layout/sidebar";
import { Header } from "@/components/layout/header";

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
  title: "Todo List",
  description: "A simple MVP built with Next.js, Prisma, and Supabase.",
};

export default function RootLayout({ children }:{ children: React.ReactNode }) {
  return (
    <html
      lang="en"
      className={cn("h-full", "antialiased", geistSans.variable, geistMono.variable, "font-sans", roboto.variable)}
    >
      <body className="min-h-full flex flex-col dark">
        <div className="mx-auto flex h-screen w-full max-w-[1600px] overflow-hidden bg-background font-sans selection:bg-primary/30">
          <div className="hidden md:block">
            <Sidebar />
          </div>
          <div className="flex flex-1 flex-col overflow-hidden border-l border-border">
            <Header />
            <main className="flex-1 overflow-y-auto bg-background">
              {children}
            </main>
          </div>
        </div>
      </body>
    </html>
  );
}