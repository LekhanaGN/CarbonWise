"use client"

import { useState } from "react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
<<<<<<< HEAD
import { 
  LayoutDashboard, 
  ClipboardList, 
  Gift, 
  LogOut, 
  Leaf, 
  Chrome,
  Trophy,
  Award,
  Settings,
  Menu,
  X
} from "lucide-react"
=======
import { LayoutDashboard, ClipboardList, Gift, LogOut, Leaf, Chrome } from "lucide-react"
>>>>>>> b40f630abe6a884a2cdcc4c0e7b4051eca44b50b
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { clearState } from "@/lib/store"

const navItems = [
  { icon: LayoutDashboard, label: "Dashboard", href: "/" },
  { icon: ClipboardList, label: "Log Action", href: "/log-action" },
  { icon: Gift, label: "Rewards", href: "/rewards" },
<<<<<<< HEAD
  { icon: Trophy, label: "Leaderboards", href: "/leaderboards" },
  { icon: Award, label: "Badges", href: "/badges" },
  { icon: Chrome, label: "Extension", href: "/extension" },
  { icon: Settings, label: "Settings", href: "/settings" },
=======
  { icon: Chrome, label: "Extension", href: "/extension" },
>>>>>>> b40f630abe6a884a2cdcc4c0e7b4051eca44b50b
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
  const router = useRouter()
  const [isOpen, setIsOpen] = useState(false)

  const handleLogout = () => {
    clearState()
    router.push("/login")
  }

  const SidebarContent = () => (
    <>
      {/* Logo */}
      <div className="flex items-center justify-between px-6 py-5">
        <div className="flex items-center gap-2">
          <Leaf className="h-6 w-6 text-primary" />
          <span className="text-xl font-bold text-foreground">CarbonWise</span>
        </div>
        {/* Close button for mobile */}
        <button
          className="lg:hidden"
          onClick={() => setIsOpen(false)}
          aria-label="Close menu"
        >
          <X className="h-5 w-5 text-muted-foreground" />
        </button>
      </div>
      <p className="px-6 text-sm text-muted-foreground">Track Your Impact</p>

      {/* Navigation */}
      <nav className="mt-6 flex-1 space-y-1 px-3">
        {navItems.map((item) => {
          const isActive = pathname === item.href
          return (
            <Link key={item.href} href={item.href} onClick={() => setIsOpen(false)}>
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
          onClick={handleLogout}
        >
          <LogOut className="h-4 w-4" />
          Logout
        </Button>
      </div>
    </>
  )

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        className="fixed left-4 top-4 z-50 flex h-10 w-10 items-center justify-center rounded-lg bg-card shadow-md lg:hidden"
        onClick={() => setIsOpen(true)}
        aria-label="Open menu"
      >
        <Menu className="h-5 w-5 text-foreground" />
      </button>

      {/* Mobile Sidebar Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Mobile Sidebar */}
      <aside
        className={cn(
          "fixed left-0 top-0 z-50 flex h-screen w-64 flex-col border-r border-sidebar-border bg-sidebar transition-transform duration-300 lg:hidden",
          isOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <SidebarContent />
      </aside>

      {/* Desktop Sidebar */}
      <aside className="hidden h-screen w-64 flex-col border-r border-sidebar-border bg-sidebar lg:flex">
        <SidebarContent />
      </aside>
    </>
  )
}
