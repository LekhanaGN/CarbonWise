"use client"

import { useState, useEffect } from "react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
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
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { createClient } from "@/lib/supabaseClient"

const navItems = [
  { icon: LayoutDashboard, label: "Dashboard", href: "/dashboard" },
  { icon: ClipboardList, label: "Log Action", href: "/log-action" },
  { icon: Gift, label: "Rewards", href: "/rewards" },
  { icon: Trophy, label: "Leaderboards", href: "/leaderboards" },
  { icon: Award, label: "Badges", href: "/badges" },
  { icon: Chrome, label: "Extension", href: "/extension" },
  { icon: Settings, label: "Settings", href: "/settings" },
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
  // Sidebar is sticky so it stays fixed while scrolling
  const pathname = usePathname()
  const router = useRouter()
  const [isMobileOpen, setIsMobileOpen] = useState(false)
  const [isDesktopOpen, setIsDesktopOpen] = useState(true)
  const [mounted, setMounted] = useState(false)

  // Load sidebar state from localStorage on mount
  useEffect(() => {
    setMounted(true)
    const savedState = localStorage.getItem("sidebarOpen")
    if (savedState !== null) {
      setIsDesktopOpen(JSON.parse(savedState))
    }
  }, [])

  // Save sidebar state to localStorage when it changes
  useEffect(() => {
    if (mounted) {
      localStorage.setItem("sidebarOpen", JSON.stringify(isDesktopOpen))
    }
  }, [isDesktopOpen, mounted])

  const handleLogout = async () => {
    const supabaseClient = createClient()
    await supabaseClient.auth.signOut()
    router.push("/landing")
  }

  const SidebarContent = () => (
    <>
      {/* Logo */}
      <div className="flex items-center justify-between px-6 py-5">
        <div className="flex items-center gap-2">
          <Leaf className="h-6 w-6 text-primary" />
          {isDesktopOpen && (
            <span className="text-xl font-bold text-foreground">CarbonWise</span>
          )}
        </div>
        {/* Close button for mobile */}
        <button
          className="lg:hidden"
          onClick={() => setIsMobileOpen(false)}
          aria-label="Close menu"
        >
          <X className="h-5 w-5 text-muted-foreground" />
        </button>
      </div>
      {isDesktopOpen && (
        <p className="px-6 text-sm text-muted-foreground">Track Your Impact</p>
      )}

      {/* Navigation */}
      <nav className="mt-6 flex-1 space-y-1 px-3">
        {navItems.map((item) => {
          const isActive = pathname === item.href
          return (
            <Link key={item.href} href={item.href} onClick={() => setIsMobileOpen(false)}>
              <Button
                variant={isActive ? "default" : "ghost"}
                size={isDesktopOpen ? "default" : "icon"}
                className={cn(
                  isDesktopOpen ? "w-full justify-start gap-3" : "w-full justify-center",
                  isActive && "bg-primary text-primary-foreground"
                )}
                title={!isDesktopOpen ? item.label : undefined}
              >
                <item.icon className="h-4 w-4" />
                {isDesktopOpen && item.label}
              </Button>
            </Link>
          )
        })}
      </nav>

      {/* User Impact Stats */}
      {isDesktopOpen && (
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
      )}

      {/* User Profile */}
      {isDesktopOpen && (
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
      )}
    </>
  )

  // Don't render until mounted to avoid hydration mismatch
  if (!mounted) {
    return null
  }

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        className="fixed left-4 top-4 z-50 flex h-10 w-10 items-center justify-center rounded-lg bg-card shadow-md lg:hidden"
        onClick={() => setIsMobileOpen(true)}
        aria-label="Open menu"
      >
        <Menu className="h-5 w-5 text-foreground" />
      </button>

      {/* Mobile Sidebar Overlay */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      {/* Mobile Sidebar */}
      <aside
        className={cn(
          "fixed left-0 top-0 z-50 flex h-screen w-64 flex-col border-r border-sidebar-border bg-sidebar transition-transform duration-300 lg:hidden",
          isMobileOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <SidebarContent />
      </aside>

      {/* Desktop Sidebar - Collapsible */}
      <aside
        className={cn(
          "sticky top-0 hidden h-screen flex-col border-r border-sidebar-border bg-sidebar transition-all duration-300 ease-in-out lg:flex",
          isDesktopOpen ? "w-64" : "w-20"
        )}
      >
        <SidebarContent />
      </aside>

      {/* Desktop Toggle Button */}
      <button
        className="fixed left-4 top-4 z-50 hidden h-10 w-10 items-center justify-center rounded-lg bg-card shadow-md lg:flex"
        onClick={() => setIsDesktopOpen(!isDesktopOpen)}
        aria-label="Toggle sidebar"
        title={isDesktopOpen ? "Close sidebar" : "Open sidebar"}
      >
        {isDesktopOpen ? (
          <X className="h-5 w-5 text-foreground" />
        ) : (
          <Menu className="h-5 w-5 text-foreground" />
        )}
      </button>
    </>
  )
}
