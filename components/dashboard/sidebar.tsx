"use client"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { LayoutDashboard, ClipboardList, Gift, LogOut, Leaf } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"

const navItems = [
  { icon: LayoutDashboard, label: "Dashboard", href: "/" },
  { icon: ClipboardList, label: "Log Action", href: "/log-action" },
  { icon: Gift, label: "Rewards", href: "/rewards" },
]

interface SidebarProps {
  user: {
    name: string
    email: string
    points: number
    co2Saved: number
  }
}

export function Sidebar({ user }: SidebarProps) {
  const pathname = usePathname()

  return (
    <aside className="flex h-screen w-64 flex-col border-r border-sidebar-border bg-sidebar">
      {/* Logo */}
      <div className="flex items-center gap-2 px-6 py-5">
        <div className="flex items-center gap-2">
          <Leaf className="h-6 w-6 text-primary" />
          <span className="text-xl font-bold text-foreground">CarbonWise</span>
        </div>
      </div>
      <p className="px-6 text-sm text-muted-foreground">Track Your Impact</p>

      {/* Navigation */}
      <nav className="mt-6 flex-1 space-y-1 px-3">
        {navItems.map((item) => {
          const isActive = pathname === item.href
          return (
            <Link key={item.href} href={item.href}>
              <Button
                variant={isActive ? "default" : "ghost"}
                className={cn(
                  "w-full justify-start gap-3",
                  isActive && "bg-primary text-primary-foreground"
                )}
              >
                <item.icon className="h-4 w-4" />
                {item.label}
              </Button>
            </Link>
          )
        })}
      </nav>

      {/* User Impact Stats */}
      <div className="border-t border-sidebar-border px-6 py-4">
        <div className="flex items-center gap-2 text-sm font-medium text-foreground">
          <Leaf className="h-4 w-4 text-primary" />
          Your Impact
        </div>
        <div className="mt-3 space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Points</span>
            <span className="font-medium text-primary">{user.points}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">CO2 Saved</span>
            <span className="font-medium text-primary">{user.co2Saved.toFixed(1)} kg</span>
          </div>
        </div>
      </div>

      {/* User Profile */}
      <div className="border-t border-sidebar-border px-6 py-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary font-medium">
            {(user.name || "G").charAt(0).toUpperCase()}
          </div>
          <div className="flex-1 overflow-hidden">
            <p className="truncate text-sm font-medium text-foreground">{user.name || "Guest"}</p>
            <p className="truncate text-xs text-muted-foreground">{user.email || "Not signed in"}</p>
          </div>
        </div>
        <Button
          variant="ghost"
          className="mt-3 w-full justify-start gap-2 text-destructive hover:bg-destructive/10 hover:text-destructive"
        >
          <LogOut className="h-4 w-4" />
          Logout
        </Button>
      </div>
    </aside>
  )
}
