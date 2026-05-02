"use client"

import { useState, useEffect } from "react"
import { Sidebar } from "@/components/dashboard/sidebar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { 
  Award, 
  Leaf,
  Sprout,
  TreePine,
  Bike,
  Recycle,
  Zap,
  Droplets,
  Sun,
  Lock,
  CheckCircle,
  Star,
  Loader2
} from "lucide-react"
import { useUserData } from "@/hooks/useUserData"

// Badge definitions
const BADGES = [
  {
    id: "first-step",
    name: "First Step",
    description: "Log your first eco action",
    icon: Sprout,
    requirement: 1,
    type: "actions",
    color: "bg-green-100 text-green-600 border-green-200",
  },
  {
    id: "eco-starter",
    name: "Eco Starter",
    description: "Log 5 eco actions",
    icon: Leaf,
    requirement: 5,
    type: "actions",
    color: "bg-emerald-100 text-emerald-600 border-emerald-200",
  },
  {
    id: "green-warrior",
    name: "Green Warrior",
    description: "Log 25 eco actions",
    icon: TreePine,
    requirement: 25,
    type: "actions",
    color: "bg-teal-100 text-teal-600 border-teal-200",
  },
  {
    id: "carbon-saver",
    name: "Carbon Saver",
    description: "Save 10 kg of CO2",
    icon: Zap,
    requirement: 10,
    type: "co2",
    color: "bg-yellow-100 text-yellow-600 border-yellow-200",
  },
  {
    id: "planet-protector",
    name: "Planet Protector",
    description: "Save 50 kg of CO2",
    icon: Sun,
    requirement: 50,
    type: "co2",
    color: "bg-orange-100 text-orange-600 border-orange-200",
  },
  {
    id: "point-collector",
    name: "Point Collector",
    description: "Earn 100 points",
    icon: Star,
    requirement: 100,
    type: "points",
    color: "bg-purple-100 text-purple-600 border-purple-200",
  },
  {
    id: "eco-champion",
    name: "Eco Champion",
    description: "Earn 500 points",
    icon: Award,
    requirement: 500,
    type: "points",
    color: "bg-indigo-100 text-indigo-600 border-indigo-200",
  },
  {
    id: "cycling-hero",
    name: "Cycling Hero",
    description: "Log 5 cycling/walking actions",
    icon: Bike,
    requirement: 5,
    type: "category",
    category: "transportation",
    color: "bg-blue-100 text-blue-600 border-blue-200",
  },
  {
    id: "recycling-master",
    name: "Recycling Master",
    description: "Log 5 recycling actions",
    icon: Recycle,
    requirement: 5,
    type: "category",
    category: "recycling",
    color: "bg-cyan-100 text-cyan-600 border-cyan-200",
  },
  {
    id: "water-saver",
    name: "Water Saver",
    description: "Log 5 water-saving actions",
    icon: Droplets,
    requirement: 5,
    type: "category",
    category: "water",
    color: "bg-sky-100 text-sky-600 border-sky-200",
  },
]

export default function BadgesPage() {
  const { user, stats, isLoading } = useUserData()

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="flex items-center gap-2 text-muted-foreground">
          <Loader2 className="h-4 w-4 animate-spin" />
          Loading badges...
        </div>
      </div>
    )
  }

  // Calculate badge progress
  const getBadgeProgress = (badge: typeof BADGES[0]) => {
    let current = 0
    
    switch (badge.type) {
      case "actions":
        current = stats.actionCount
        break
      case "co2":
        current = stats.totalCO2
        break
      case "points":
        current = stats.points
        break
      case "category":
        // For now, assume 0 for category since we don't have categorized actions from API
        current = 0
        break
    }
    
    return {
      current,
      progress: Math.min((current / badge.requirement) * 100, 100),
      unlocked: current >= badge.requirement,
    }
  }

  const unlockedBadges = BADGES.filter(b => getBadgeProgress(b).unlocked)
  const lockedBadges = BADGES.filter(b => !getBadgeProgress(b).unlocked)

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar user={user ? { id: user.id, name: user.name, email: user.email, points: stats.points, co2Saved: stats.totalCO2 } : undefined} />

      <main className="flex-1 overflow-auto p-4 pt-16 md:p-6 lg:p-8 lg:pt-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="flex items-center gap-3 text-2xl font-bold text-foreground md:text-3xl">
            <Award className="h-8 w-8 text-primary" />
            Badges
          </h1>
          <p className="mt-2 text-muted-foreground">
            Unlock achievements by taking eco-friendly actions
          </p>
        </div>

        {/* Stats */}
        <div className="mb-8 grid gap-4 sm:grid-cols-3">
          <Card>
            <CardContent className="flex items-center gap-4 p-6">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                <CheckCircle className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{unlockedBadges.length}</p>
                <p className="text-sm text-muted-foreground">Badges Unlocked</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="flex items-center gap-4 p-6">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-muted">
                <Lock className="h-6 w-6 text-muted-foreground" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{lockedBadges.length}</p>
                <p className="text-sm text-muted-foreground">Badges Remaining</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="flex items-center gap-4 p-6">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-yellow-100">
                <Star className="h-6 w-6 text-yellow-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">
                  {Math.round((unlockedBadges.length / BADGES.length) * 100)}%
                </p>
                <p className="text-sm text-muted-foreground">Completion</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Unlocked Badges */}
        {unlockedBadges.length > 0 && (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-primary" />
                Unlocked Badges
              </CardTitle>
              <CardDescription>Achievements you have earned</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {unlockedBadges.map((badge) => {
                  const Icon = badge.icon
                  return (
                    <div
                      key={badge.id}
                      className={`relative rounded-xl border-2 p-4 ${badge.color}`}
                    >
                      <Badge className="absolute -right-2 -top-2 bg-primary">Unlocked</Badge>
                      <div className="flex items-start gap-3">
                        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white/50">
                          <Icon className="h-6 w-6" />
                        </div>
                        <div>
                          <h3 className="font-semibold">{badge.name}</h3>
                          <p className="text-sm opacity-80">{badge.description}</p>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Locked Badges */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Lock className="h-5 w-5 text-muted-foreground" />
              {unlockedBadges.length > 0 ? "In Progress" : "Available Badges"}
            </CardTitle>
            <CardDescription>Keep going to unlock these achievements</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {lockedBadges.map((badge) => {
                const Icon = badge.icon
                const { current, progress } = getBadgeProgress(badge)
                return (
                  <div
                    key={badge.id}
                    className="rounded-xl border-2 border-dashed border-border bg-muted/30 p-4"
                  >
                    <div className="flex items-start gap-3">
                      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-muted">
                        <Icon className="h-6 w-6 text-muted-foreground" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-foreground">{badge.name}</h3>
                        <p className="text-sm text-muted-foreground">{badge.description}</p>
                        <div className="mt-2">
                          <Progress value={progress} className="h-2" />
                          <p className="mt-1 text-xs text-muted-foreground">
                            {current} / {badge.requirement}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
