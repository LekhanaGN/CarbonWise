"use client"

import { useState } from "react"
import { Sidebar } from "@/components/dashboard/sidebar"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { StatCards } from "@/components/dashboard/stat-cards"
import { WeeklyChart } from "@/components/dashboard/weekly-chart"
import { RecentActions, type Action } from "@/components/dashboard/recent-actions"
import { RightSidebar } from "@/components/dashboard/right-sidebar"
import { LiveLeaderboard, type LeaderboardEntry } from "@/components/dashboard/live-leaderboard"
import { EcoSuggestions } from "@/components/dashboard/eco-suggestions"

// Initial empty user state - will come from auth/database
const initialUser = {
  name: "",
  email: "",
  points: 0,
  co2Saved: 0,
}

// Initial empty stats - will come from database
const initialStats = {
  totalPoints: 0,
  co2Saved: 0,
  actionsCompleted: 0,
  rewardsRedeemed: 0,
}

// Empty actions array - will come from database
const initialActions: Action[] = []

// Empty leaderboard - will come from database
const initialLeaderboard: LeaderboardEntry[] = []

export default function Dashboard() {
  const [user] = useState(initialUser)
  const [stats] = useState(initialStats)
  const [actions] = useState(initialActions)
  const [leaderboard] = useState(initialLeaderboard)

  return (
    <div className="flex min-h-screen bg-background">
      {/* Left Sidebar */}
      <Sidebar user={user} />

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto p-6">
        <div className="mx-auto max-w-5xl space-y-6">
          <DashboardHeader userName={user.name} />
          <StatCards stats={stats} />
          
          <div className="grid gap-6 lg:grid-cols-1">
            <WeeklyChart />
            <RecentActions actions={actions} />
          </div>

          {/* Eco Suggestions - visible on smaller screens */}
          <div className="xl:hidden">
            <EcoSuggestions />
          </div>
        </div>
      </main>

      {/* Right Sidebar */}
      <div className="hidden w-80 flex-shrink-0 space-y-4 border-l border-border bg-card p-4 xl:block">
        <RightSidebar />
        <LiveLeaderboard entries={leaderboard} />
        <EcoSuggestions />
      </div>
    </div>
  )
}
