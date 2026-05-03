"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Sidebar } from "@/components/dashboard/sidebar"
import { StatCards } from "@/components/dashboard/stat-cards"
import { WeeklyChart } from "@/components/dashboard/weekly-chart"
import { RecentActions } from "@/components/dashboard/recent-actions"
import { LiveLeaderboard } from "@/components/dashboard/live-leaderboard"
import { EcoSuggestions } from "@/components/dashboard/eco-suggestions"
import { BrowserActivitySection } from "@/components/dashboard/browser-activity"
import { createClient } from "@/lib/supabaseClient"
import { getState, type AppState } from "@/lib/store"

export default function Dashboard() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [state, setState] = useState<AppState>(getState())
  const [loading, setLoading] = useState(true)
  const [leaderboardData, setLeaderboardData] = useState<any[]>([])
  const [carbonLogs, setCarbonLogs] = useState<any[]>([])
  const [weeklyData, setWeeklyData] = useState<any[]>([])

  // Auth check and initial setup
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const supabaseClient = createClient()
        const { data: { user: authUser }, error } = await supabaseClient.auth.getUser()
        
        if (error || !authUser) {
          router.push("/login")
          return
        }

        setUser(authUser)
        
        // Expose user ID to window for extension to capture
        if (typeof window !== 'undefined') {
          (window as any).__CARBONWISE_USER_ID__ = authUser.id
          localStorage.setItem('carbonwise_user_id', authUser.id)
          console.log('[v0] User ID exposed to extension:', authUser.id)
        }
        
        // Get state from localStorage for now (will be replaced with Supabase DB queries)
        const appState = getState()
        
        // Update user info from auth
        const updatedState: AppState = {
          ...appState,
          user: {
            ...appState.user,
            id: authUser.id,
            email: authUser.email || "",
            name: authUser.user_metadata?.full_name || authUser.email?.split("@")[0] || "User",
          }
        }
        
        setState(updatedState)

        // Fetch leaderboard data from Supabase
        const { data: users, error: leaderboardError } = await supabaseClient
          .from('users')
          .select('id, name, carbon_score')
          .order('carbon_score', { ascending: false })
          .limit(10)

        if (!leaderboardError && users) {
          const leaderboard = users.map((user, index) => ({
            id: user.id,
            rank: index + 1,
            name: user.name,
            points: user.carbon_score * 10,
            co2Saved: user.carbon_score,
            avatarInitial: user.name?.charAt(0).toUpperCase() || 'U'
          }))
          setLeaderboardData(leaderboard)
        }

        setLoading(false)
      } catch (error) {
        console.error("Auth error:", error)
        router.push("/login")
      }
    }

    checkAuth()
  }, [router])

  // Fetch and calculate carbon logs and stats with real-time subscription
  useEffect(() => {
    const fetchData = async () => {
      if (!state.user.id) return

      try {
        // Fetch leaderboard data
        const leaderboardResponse = await fetch(`/api/leaderboard`)
        if (leaderboardResponse.ok) {
          const leaderboardList = await leaderboardResponse.json()
          setLeaderboardData(leaderboardList)
        }

        // Set carbon logs data
        const logsResponse = await fetch(`/api/carbon-logs?user_id=${state.user.id}`)
        if (logsResponse.ok) {
          const { data: logs } = await logsResponse.json()
          setCarbonLogs(logs)

          // Calculate weekly data
          const today = new Date()
          const weekDays = Array.from({ length: 7 }, (_, i) => {
            const date = new Date(today)
            date.setDate(date.getDate() - (6 - i))
            return date.toLocaleDateString("en-IN")
          })

          const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]
          const weeklyImpact = weekDays.map((day, i) => {
            const dayLogs = logs.filter((log: any) => {
              const logDate = new Date(log.created_at).toLocaleDateString("en-IN")
              return logDate === day
            })
            const impact = dayLogs.reduce((sum: number, log: any) => sum + (log.carbon_value || 0), 0)
            return { 
              day: dayNames[(i + today.getDay() - 6) % 7], 
              impact: parseFloat(impact.toFixed(2)) 
            }
          })

          setWeeklyData(weeklyImpact)
        }
      } catch (err) {
        console.log("[v0] Error fetching data:", err)
      }

      setLoading(false)
    }

    fetchData()

    // Set up real-time subscriptions
    const supabaseClient = createClient()
    
    // Subscribe to carbon_logs changes
    const carbonLogsSubscription = supabaseClient
      .channel('carbon_logs_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'carbon_logs',
          filter: `user_id=eq.${state.user.id}`
        },
        () => {
          console.log('[v0] Carbon log changed, refetching...')
          fetchData()
        }
      )
      .subscribe()

    // Subscribe to users table changes for real-time leaderboard updates
    const usersSubscription = supabaseClient
      .channel('users_changes')
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'users'
        },
        () => {
          console.log('[v0] User data changed, refetching leaderboard...')
          // Refetch leaderboard when any user updates their score
          fetch(`/api/leaderboard`)
            .then(res => res.ok && res.json())
            .then(data => setLeaderboardData(data))
            .catch(err => console.log('[v0] Leaderboard refetch error:', err))
        }
      )
      .subscribe()

    // Cleanup: unsubscribe and refresh every 30 seconds as fallback
    const interval = setInterval(fetchData, 30000)
    
    return () => {
      clearInterval(interval)
      supabaseClient.removeChannel(carbonLogsSubscription)
      supabaseClient.removeChannel(usersSubscription)
    }
  }, [state.user.id])

  // Show loading state
  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="text-muted-foreground">Loading...</div>
      </div>
    )
  }

  // Calculate stats from carbon logs
  const totalCO2 = carbonLogs.reduce((sum: number, log: any) => sum + (log.carbon_value || 0), 0)
  const totalPoints = Math.round(totalCO2 * 100)

  const stats = {
    totalPoints,
    co2Saved: parseFloat(totalCO2.toFixed(2)),
    actionsCompleted: carbonLogs.length,
    rewardsRedeemed: 0,
  }

  const recentActions = state.actions.slice(0, 5)

  return (
    <div className="flex min-h-screen bg-background">
      {/* Sidebar */}
      <Sidebar user={state.user} />

      {/* Main content */}
      <main className="flex-1 overflow-auto">
        {/* Dashboard content */}
        <div className="container mx-auto space-y-6 p-6">
          {/* Welcome section */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Welcome back, {state.user.name}! 🌱</h1>
              <p className="text-muted-foreground">Track your environmental impact and earn rewards</p>
            </div>
            <Link href="/log-action">
              <Button className="gap-2">
                <Plus className="h-4 w-4" />
                Log Action
              </Button>
            </Link>
          </div>

          {/* Stat cards */}
          <StatCards stats={stats} />

          {/* Main grid with chart and leaderboard side by side */}
          <div className="grid gap-6 lg:grid-cols-3">
            <div className="lg:col-span-2">
              <WeeklyChart data={weeklyData.length > 0 ? weeklyData : undefined} />
            </div>
            <div className="lg:col-span-1">
              <LiveLeaderboard entries={leaderboardData} currentUserId={user?.id} />
            </div>
          </div>

          {/* Recent Actions and Eco Suggestions */}
          <div className="grid gap-6 lg:grid-cols-3">
            <div className="lg:col-span-2">
              <RecentActions actions={recentActions} />
            </div>
            <div className="lg:col-span-1">
              <EcoSuggestions />
            </div>
          </div>

          {/* Browser Activity Section */}
          <BrowserActivitySection userId={state.user.id} />
        </div>
      </main>
    </div>
  )
}
