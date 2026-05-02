"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Sidebar } from "@/components/dashboard/sidebar"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { StatCards } from "@/components/dashboard/stat-cards"
import { WeeklyChart } from "@/components/dashboard/weekly-chart"
import { RecentActions } from "@/components/dashboard/recent-actions"
import { LiveLeaderboard } from "@/components/dashboard/live-leaderboard"
import { EcoSuggestions } from "@/components/dashboard/eco-suggestions"
import { createClient } from "@/lib/supabaseClient"
import { getState, type AppState } from "@/lib/store"

export default function Dashboard() {
  const router = useRouter()
  const [state, setState] = useState<AppState | null>(null)
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [leaderboardData, setLeaderboardData] = useState<any[]>([])

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
        
        // Get state from localStorage for now (will be replaced with Supabase DB queries)
        const appState = getState()
        
        // Update user info from auth
        const updatedState: AppState = {
          ...appState,
          user: {
            ...appState.user,
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
  }, [])

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="text-muted-foreground">Loading...</div>
      </div>
    )
  }

  const stats = {
    totalPoints: state.user.points,
    co2Saved: state.user.co2Saved,
    actionsCompleted: state.actions.length,
    rewardsRedeemed: 0,
  }

  const recentActions = state.actions.slice(0, 5).map(action => ({
    id: action.id,
    title: action.title,
    timestamp: action.timestamp,
    points: action.points,
    co2Saved: action.co2Saved,
    category: action.category,
  }))

  return (
    <div className="flex min-h-screen bg-background">
      {/* Left Sidebar */}
      <Sidebar user={state.user} />

      {/* Main Content - with flex-1 to fill remaining space */}
      <main className="flex-1 overflow-y-auto p-4 md:p-6 transition-all duration-300 ease-in-out">
        <div className="mx-auto max-w-6xl space-y-6 pt-12 lg:pt-0">
          <DashboardHeader userName={state.user.name} />
          <StatCards stats={stats} />
          
          {/* Main grid with chart and leaderboard side by side */}
          <div className="grid gap-6 lg:grid-cols-3">
            <div className="lg:col-span-2">
              <WeeklyChart data={state.weeklyData} />
            </div>
            <div className="lg:col-span-1">
              <LiveLeaderboard entries={leaderboardData} currentUserId={state.user.id} />
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
        </div>
      </main>
    </div>
  )
}
