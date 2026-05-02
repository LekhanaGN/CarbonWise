"use client"

import { useState, useEffect } from "react"
import { Sidebar } from "@/components/dashboard/sidebar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { getState, subscribeToStateChanges, type AppState } from "@/lib/store"
import { 
  Trophy, 
  Medal,
  Leaf,
  TrendingUp,
  Users,
  Crown,
  Flame
} from "lucide-react"

export default function LeaderboardsPage() {
  const [appState, setAppState] = useState<AppState | null>(null)

  useEffect(() => {
    setAppState(getState())
    const unsubscribe = subscribeToStateChanges(setAppState)
    return unsubscribe
  }, [])

  if (!appState) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="animate-pulse text-muted-foreground">Loading...</div>
      </div>
    )
  }

  const { leaderboard, user } = appState

  // Get user rank
  const userRank = leaderboard.find(e => e.id === user.id)?.rank || null

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar user={user} />

      <main className="flex-1 overflow-auto p-4 pt-16 md:p-6 lg:p-8 lg:pt-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="flex items-center gap-3 text-2xl font-bold text-foreground md:text-3xl">
            <Trophy className="h-8 w-8 text-primary" />
            Leaderboards
          </h1>
          <p className="mt-2 text-muted-foreground">
            See how you rank against other eco-warriors
          </p>
        </div>

        {/* User Rank Card */}
        {userRank && (
          <Card className="mb-8 border-primary/50 bg-gradient-to-r from-primary/10 to-primary/5">
            <CardContent className="flex items-center justify-between p-6">
              <div className="flex items-center gap-4">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary text-2xl font-bold text-primary-foreground">
                  #{userRank}
                </div>
                <div>
                  <p className="text-lg font-semibold text-foreground">Your Rank</p>
                  <p className="text-muted-foreground">
                    {userRank === 1 ? "You're leading!" : `${userRank - 1} spots from the top`}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold text-primary">{user.points}</p>
                <p className="text-sm text-muted-foreground">Total Points</p>
              </div>
            </CardContent>
          </Card>
        )}

        <Tabs defaultValue="all-time" className="space-y-6">
          <TabsList>
            <TabsTrigger value="all-time">All Time</TabsTrigger>
            <TabsTrigger value="this-week">This Week</TabsTrigger>
            <TabsTrigger value="this-month">This Month</TabsTrigger>
          </TabsList>

          <TabsContent value="all-time">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  Global Rankings
                </CardTitle>
                <CardDescription>Top eco-warriors of all time</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {leaderboard.slice(0, 10).map((entry) => {
                    const isCurrentUser = entry.id === user.id
                    return (
                      <div
                        key={entry.id}
                        className={`flex items-center justify-between rounded-xl p-4 transition-colors ${
                          isCurrentUser 
                            ? "border-2 border-primary bg-primary/5" 
                            : "bg-muted/50 hover:bg-muted"
                        }`}
                      >
                        <div className="flex items-center gap-4">
                          {/* Rank */}
                          <div className="flex h-10 w-10 items-center justify-center">
                            {entry.rank === 1 ? (
                              <Crown className="h-8 w-8 text-yellow-500" />
                            ) : entry.rank === 2 ? (
                              <Medal className="h-7 w-7 text-gray-400" />
                            ) : entry.rank === 3 ? (
                              <Medal className="h-6 w-6 text-amber-600" />
                            ) : (
                              <span className="text-lg font-bold text-muted-foreground">
                                #{entry.rank}
                              </span>
                            )}
                          </div>

                          {/* Avatar */}
                          <div className={`flex h-12 w-12 items-center justify-center rounded-full text-lg font-semibold ${
                            entry.rank === 1 
                              ? "bg-yellow-100 text-yellow-700" 
                              : entry.rank === 2
                              ? "bg-gray-100 text-gray-700"
                              : entry.rank === 3
                              ? "bg-amber-100 text-amber-700"
                              : "bg-primary/10 text-primary"
                          }`}>
                            {entry.avatarInitial}
                          </div>

                          {/* Name */}
                          <div>
                            <p className="font-semibold text-foreground">
                              {entry.name}
                              {isCurrentUser && (
                                <Badge variant="secondary" className="ml-2">You</Badge>
                              )}
                            </p>
                            <p className="flex items-center gap-1 text-sm text-muted-foreground">
                              <Leaf className="h-3 w-3" />
                              {entry.co2Saved.toFixed(1)} kg CO2 saved
                            </p>
                          </div>
                        </div>

                        {/* Points */}
                        <div className="text-right">
                          <p className="text-lg font-bold text-primary">{entry.points}</p>
                          <p className="text-xs text-muted-foreground">points</p>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="this-week">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Flame className="h-5 w-5 text-orange-500" />
                  Weekly Leaders
                </CardTitle>
                <CardDescription>Top performers this week</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <TrendingUp className="mb-4 h-16 w-16 text-muted-foreground/30" />
                  <p className="text-lg font-medium text-muted-foreground">Weekly rankings coming soon</p>
                  <p className="text-sm text-muted-foreground">Start logging actions to compete!</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="this-month">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Trophy className="h-5 w-5 text-primary" />
                  Monthly Champions
                </CardTitle>
                <CardDescription>Top performers this month</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <Trophy className="mb-4 h-16 w-16 text-muted-foreground/30" />
                  <p className="text-lg font-medium text-muted-foreground">Monthly rankings coming soon</p>
                  <p className="text-sm text-muted-foreground">Keep tracking to see your progress!</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}
