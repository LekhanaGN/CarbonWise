"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Trophy, Leaf, Users } from "lucide-react"
import { cn } from "@/lib/utils"

export interface LeaderboardEntry {
  id: string
  rank: number
  name: string
  points: number
  co2Saved: number
  avatarInitial: string
}

interface LiveLeaderboardProps {
  entries?: LeaderboardEntry[]
  currentUserId?: string
}

export function LiveLeaderboard({ entries = [], currentUserId }: LiveLeaderboardProps) {
  const [isLive, setIsLive] = useState(true)

  // Simulate live indicator blinking
  useEffect(() => {
    const interval = setInterval(() => {
      setIsLive((prev) => !prev)
    }, 1000)
    return () => clearInterval(interval)
  }, [])

  const getRankStyle = (rank: number) => {
    switch (rank) {
      case 1:
        return "bg-amber-400 text-white"
      case 2:
        return "bg-gray-300 text-gray-700"
      case 3:
        return "bg-amber-600 text-white"
      default:
        return "bg-muted text-muted-foreground"
    }
  }

  const getRankIcon = (rank: number) => {
    if (rank === 1) return <Trophy className="h-3 w-3" />
    return rank
  }

  return (
    <Card className="border-0 shadow-sm">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-lg font-semibold">
            <Users className="h-5 w-5 text-primary" />
            Live Leaderboard
          </CardTitle>
          <Badge variant="outline" className="gap-1 text-xs">
            <span className={cn(
              "h-2 w-2 rounded-full transition-opacity duration-300",
              isLive ? "bg-emerald-500 opacity-100" : "bg-emerald-500 opacity-30"
            )} />
            Live
          </Badge>
        </div>
        <p className="text-xs text-muted-foreground">{"This month's top contributors"}</p>
      </CardHeader>
      <CardContent className="space-y-2">
        {entries.length === 0 ? (
          <div className="py-8 text-center">
            <Users className="mx-auto h-10 w-10 text-muted-foreground/50" />
            <p className="mt-2 text-sm text-muted-foreground">
              No leaderboard data yet
            </p>
            <p className="text-xs text-muted-foreground">
              Be the first to log an action!
            </p>
          </div>
        ) : (
          entries.map((entry) => (
            <div 
              key={entry.id} 
              className={cn(
                "flex items-center gap-3 rounded-lg p-3 transition-colors",
                currentUserId === entry.id 
                  ? "bg-primary/10 ring-1 ring-primary/20" 
                  : "bg-secondary/50"
              )}
            >
              {/* Rank Badge */}
              <div 
                className={cn(
                  "flex h-8 w-8 items-center justify-center rounded-full text-sm font-bold",
                  getRankStyle(entry.rank)
                )}
              >
                {getRankIcon(entry.rank)}
              </div>

              {/* Avatar */}
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10 text-sm font-medium text-primary">
                {entry.avatarInitial}
              </div>

              {/* User Info */}
              <div className="flex-1">
                <p className="text-sm font-medium text-foreground">
                  {entry.name}
                  {currentUserId === entry.id && (
                    <span className="ml-1 text-xs text-muted-foreground">(You)</span>
                  )}
                </p>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-medium text-primary">
                    {entry.points.toLocaleString()} pts
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {entry.co2Saved} kg CO2
                  </span>
                </div>
              </div>

              {/* Leaf Icon */}
              <Leaf className="h-4 w-4 text-primary" />
            </div>
          ))
        )}
      </CardContent>
    </Card>
  )
}
