"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { BarChart3, BookOpen, Database, Home, Menu } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { useSidebar } from "@/components/sidebar-provider"

export function AppSidebar() {
  const pathname = usePathname()
  const { open, toggleSidebar } = useSidebar()

  const routes = [
    {
      name: "Dashboard",
      path: "/",
      icon: Home,
    },
    {
      name: "News Feed",
      path: "/news",
      icon: BookOpen,
    },
    {
      name: "Statistics",
      path: "/statistics",
      icon: BarChart3,
    },
    {
      name: "Storage",
      path: "/storage",
      icon: Database,
    },
  ]

  return (
    <div
      className={cn(
        "fixed inset-y-0 z-50 flex h-full flex-col border-r bg-background transition-all duration-300",
        open ? "w-64" : "w-16",
      )}
    >
      <div className="flex h-16 items-center justify-between border-b px-4">
        {open && (
          <Link href="/" className="flex items-center gap-2 font-semibold">
            <span className="h-6 w-6 rounded-full bg-primary"></span>
            <span className="text-lg">Democracy Lens</span>
          </Link>
        )}
        <Button variant="ghost" size="icon" onClick={toggleSidebar} className="ml-auto">
          <Menu className="h-5 w-5" />
          <span className="sr-only">Toggle Sidebar</span>
        </Button>
      </div>
      <div className="flex-1 overflow-auto py-4">
        <nav className="grid gap-1 px-2">
          {routes.map((route) => (
            <Link
              key={route.path}
              href={route.path}
              className={cn(
                "flex h-10 items-center rounded-md px-3 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground",
                pathname === route.path ? "bg-accent text-accent-foreground" : "transparent",
              )}
            >
              <route.icon className={cn("mr-2 h-5 w-5", open ? "" : "mx-auto")} />
              {open && <span>{route.name}</span>}
            </Link>
          ))}
        </nav>
      </div>
      <div className="border-t p-4">
        {open && (
          <div className="flex flex-col gap-1">
            <div className="text-xs font-medium">Democracy Score</div>
            <div className="h-2 w-full rounded-full bg-muted">
              <div className="h-full w-3/4 rounded-full bg-primary"></div>
            </div>
            <div className="text-xs text-muted-foreground">75/100 - Good</div>
          </div>
        )}
      </div>
    </div>
  )
}

