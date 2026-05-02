"use client"

import { useState } from "react"
import { Sidebar } from "@/components/dashboard/sidebar"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Gift, Lock, CheckCircle, ShoppingBag, Coffee, Leaf, Bike, TreePine } from "lucide-react"

// Initial empty user state - will come from auth/database
const initialUser = {
  name: "",
  email: "",
  points: 0,
  co2Saved: 0,
}

// Available rewards - static data for reward types
const availableRewards = [
  {
    id: "1",
    title: "20% off at EcoFarm",
    description: "Get 20% discount on organic produce",
    icon: Leaf,
    pointsRequired: 100,
    category: "Food",
  },
  {
    id: "2",
    title: "Free Reusable Bag",
    description: "Claim a premium eco-friendly shopping bag",
    icon: ShoppingBag,
    pointsRequired: 150,
    category: "Shopping",
  },
  {
    id: "3",
    title: "Free Coffee at GreenCafe",
    description: "One free sustainable coffee",
    icon: Coffee,
    pointsRequired: 200,
    category: "Food",
  },
  {
    id: "4",
    title: "Bike Rental Credit",
    description: "30 min free bike rental",
    icon: Bike,
    pointsRequired: 300,
    category: "Transport",
  },
  {
    id: "5",
    title: "Plant a Tree in Your Name",
    description: "We plant a tree and send you the certificate",
    icon: TreePine,
    pointsRequired: 500,
    category: "Environment",
  },
]

interface ClaimedReward {
  id: string
  title: string
  description: string
  claimedDate: string
}

export default function RewardsPage() {
  const [user] = useState(initialUser)
  const [claimedRewards] = useState<ClaimedReward[]>([])
  
  const userPoints = user.points

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar user={user} />

      <main className="flex-1 overflow-y-auto p-6">
        <div className="mx-auto max-w-4xl space-y-6">
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-2xl font-bold text-foreground md:text-3xl">
                Rewards
              </h1>
              <p className="mt-1 text-muted-foreground">
                Redeem your eco-points for real-world benefits
              </p>
            </div>
            <Card className="border-0 bg-primary px-6 py-4 shadow-sm">
              <p className="text-sm text-primary-foreground/80">Your Points</p>
              <p className="text-3xl font-bold text-primary-foreground">{userPoints}</p>
            </Card>
          </div>

          {/* Available Rewards */}
          <div>
            <h2 className="mb-4 text-lg font-semibold text-foreground">Available Rewards</h2>
            <div className="grid gap-4 sm:grid-cols-2">
              {availableRewards.map((reward) => {
                const progress = Math.min((userPoints / reward.pointsRequired) * 100, 100)
                const canClaim = userPoints >= reward.pointsRequired

                return (
                  <Card key={reward.id} className="border-0 shadow-sm">
                    <CardContent className="p-5">
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-3">
                          <div className={`rounded-lg p-2 ${canClaim ? 'bg-primary/10 text-primary' : 'bg-muted text-muted-foreground'}`}>
                            <reward.icon className="h-6 w-6" />
                          </div>
                          <div>
                            <h3 className="font-semibold text-foreground">{reward.title}</h3>
                            <p className="text-sm text-muted-foreground">{reward.description}</p>
                          </div>
                        </div>
                        {canClaim ? (
                          <CheckCircle className="h-5 w-5 text-primary" />
                        ) : (
                          <Lock className="h-5 w-5 text-muted-foreground" />
                        )}
                      </div>
                      
                      <div className="mt-4 space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">{userPoints} / {reward.pointsRequired} points</span>
                          <Badge variant="secondary">{reward.category}</Badge>
                        </div>
                        <Progress value={progress} className="h-2" />
                      </div>

                      <Button 
                        className="mt-4 w-full" 
                        disabled={!canClaim}
                        variant={canClaim ? "default" : "secondary"}
                      >
                        {canClaim ? "Claim Reward" : `Need ${reward.pointsRequired - userPoints} more points`}
                      </Button>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          </div>

          {/* Claimed Rewards */}
          <div>
            <h2 className="mb-4 text-lg font-semibold text-foreground">Claimed Rewards</h2>
            {claimedRewards.length === 0 ? (
              <Card className="border-0 shadow-sm">
                <CardContent className="py-12 text-center">
                  <Gift className="mx-auto h-12 w-12 text-muted-foreground/50" />
                  <p className="mt-4 text-sm text-muted-foreground">
                    No rewards claimed yet
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Start logging eco-actions to earn points and claim rewards!
                  </p>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-3">
                {claimedRewards.map((reward) => (
                  <Card key={reward.id} className="border-0 bg-primary/5 shadow-sm">
                    <CardContent className="flex items-center justify-between p-4">
                      <div className="flex items-center gap-3">
                        <div className="rounded-lg bg-primary/10 p-2 text-primary">
                          <Gift className="h-5 w-5" />
                        </div>
                        <div>
                          <h3 className="font-medium text-foreground">{reward.title}</h3>
                          <p className="text-sm text-muted-foreground">{reward.description}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <Badge variant="outline" className="border-primary text-primary">
                          Claimed
                        </Badge>
                        <p className="mt-1 text-xs text-muted-foreground">{reward.claimedDate}</p>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}
