import { redirect } from 'next/navigation'

<<<<<<< HEAD
export default function Home() {
  redirect('/landing')
=======
import { useState, useEffect } from "react"
import { Sidebar } from "@/components/dashboard/sidebar"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { StatCards } from "@/components/dashboard/stat-cards"
import { WeeklyChart } from "@/components/dashboard/weekly-chart"
import { RecentActions } from "@/components/dashboard/recent-actions"
import { RightSidebar } from "@/components/dashboard/right-sidebar"
import { LiveLeaderboard } from "@/components/dashboard/live-leaderboard"
import { EcoSuggestions } from "@/components/dashboard/eco-suggestions"
import { getState, subscribeToStateChanges, type AppState } from "@/lib/store"

export default function Dashboard() {
  const [state, setState] = useState<AppState | null>(null)

  useEffect(() => {
    setState(getState())
    const unsubscribe = subscribeToStateChanges((newState) => {
      setState(newState)
    })
    return unsubscribe
  }, [])

  if (!state) {
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

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto p-4 md:p-6">
        <div className="mx-auto max-w-6xl space-y-6">
          <DashboardHeader userName={state.user.name} />
          <StatCards stats={stats} />
          
          {/* Main grid with chart and leaderboard side by side */}
          <div className="grid gap-6 lg:grid-cols-3">
            <div className="lg:col-span-2">
              <WeeklyChart data={state.weeklyData} />
            </div>
            <div className="lg:col-span-1">
              <LiveLeaderboard entries={state.leaderboard} currentUserId={state.user.id} />
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

      {/* Right Sidebar - Quick Actions only on XL screens */}
      <div className="hidden w-72 flex-shrink-0 border-l border-border bg-card p-4 xl:block">
        <RightSidebar />
      </div>
    </div>
  )
>>>>>>> b40f630abe6a884a2cdcc4c0e7b4051eca44b50b
}
