"use client"

import { useState } from "react"
import { Sidebar } from "@/components/dashboard/sidebar"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { 
  Trash2, 
  Recycle, 
  Bike, 
  TreePine, 
  Zap, 
  Bus,
  ArrowLeft,
  Plus
} from "lucide-react"
import Link from "next/link"

// Available eco actions - static data for action types
const ecoActions = [
  { 
    id: "cleanup",
    title: "Beach/Park Cleanup",
    description: "Participate in a community cleanup event and collect trash",
    icon: Trash2,
    points: 100,
    co2Saved: 4.0,
    category: "Cleanup",
    badgeColor: "bg-rose-500",
  },
  { 
    id: "compost",
    title: "Compost Organic Waste",
    description: "Start composting your food scraps and organic waste",
    icon: Recycle,
    points: 70,
    co2Saved: 3.2,
    category: "Recycling",
    badgeColor: "bg-emerald-600",
  },
  { 
    id: "bike",
    title: "Bike to Work",
    description: "Cycle to work or school instead of using motorized transport",
    icon: Bike,
    points: 85,
    co2Saved: 6.8,
    category: "Transportation",
    badgeColor: "bg-sky-500",
  },
  { 
    id: "tree",
    title: "Plant a Tree",
    description: "Plant a tree in your community or local park",
    icon: TreePine,
    points: 150,
    co2Saved: 21.0,
    category: "Planting",
    badgeColor: "bg-emerald-600",
  },
  { 
    id: "energy",
    title: "Save Energy - Turn Off Lights",
    description: "Switch off lights and electronics when not in use for a full day",
    icon: Zap,
    points: 40,
    co2Saved: 1.8,
    category: "Energy",
    badgeColor: "bg-amber-500",
  },
  { 
    id: "publictransport",
    title: "Use Public Transport",
    description: "Take public transportation instead of driving your car",
    icon: Bus,
    points: 75,
    co2Saved: 5.2,
    category: "Transportation",
    badgeColor: "bg-sky-500",
  },
]

// User state - will come from auth/database
const initialUser = {
  name: "",
  email: "",
  points: 0,
  co2Saved: 0,
}

export default function LogActionPage() {
  const [user] = useState(initialUser)

  const handleLogAction = (actionId: string) => {
    // This will be connected to database
    console.log("Logging action:", actionId)
  }

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar user={user} />

      <main className="flex-1 overflow-y-auto p-6">
        <div className="mx-auto max-w-5xl space-y-6">
          {/* Header */}
          <div className="flex items-center gap-4">
            <Link href="/">
              <Button variant="outline" size="icon" className="h-10 w-10 rounded-full">
                <ArrowLeft className="h-4 w-4" />
              </Button>
            </Link>
            <div>
              <h1 className="text-2xl font-bold text-foreground md:text-3xl">
                Log Eco Action
              </h1>
              <p className="mt-1 text-muted-foreground">
                Select an action to verify and earn points!
              </p>
            </div>
          </div>

          {/* Available Actions */}
          <div>
            <h2 className="mb-4 text-lg font-semibold text-foreground">Available Actions</h2>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {ecoActions.map((action) => (
                <Card key={action.id} className="relative overflow-hidden border-0 shadow-sm">
                  {/* Points Badge */}
                  <div className="absolute right-0 top-0">
                    <div className={`relative h-20 w-20 ${action.badgeColor} rounded-bl-full`}>
                      <span className="absolute right-2 top-2 text-xs font-bold text-white">
                        +{action.points} pts
                      </span>
                    </div>
                  </div>

                  <CardContent className="p-5">
                    {/* Icon */}
                    <div className="mb-4">
                      <action.icon className="h-6 w-6 text-foreground" />
                    </div>

                    {/* Title */}
                    <h3 className="font-semibold text-foreground">{action.title}</h3>
                    
                    {/* Description */}
                    <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                      {action.description}
                    </p>

                    {/* CO2 and Category */}
                    <div className="mt-4 flex items-center justify-between">
                      <div>
                        <p className="text-xs text-muted-foreground">CO2 Saved</p>
                        <p className="font-semibold text-foreground">{action.co2Saved} kg</p>
                      </div>
                      <Badge variant="outline" className="text-xs">
                        {action.category}
                      </Badge>
                    </div>

                    {/* Log Button */}
                    <Button 
                      className="mt-4 w-full gap-2"
                      onClick={() => handleLogAction(action.id)}
                    >
                      <Plus className="h-4 w-4" />
                      Log This Action
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
