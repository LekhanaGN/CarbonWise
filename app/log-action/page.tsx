"use client"

import { useState, useEffect } from "react"
import { Sidebar } from "@/components/dashboard/sidebar"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import { getState, subscribeToStateChanges, type AppState } from "@/lib/store"
import { EcoActionLogger } from "@/components/eco-action-logger"

export default function LogActionPage() {
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

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar user={state.user} />

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
                Select an action, upload proof, and earn points!
              </p>
            </div>
          </div>

          {/* User Stats Summary */}
          <div className="flex flex-wrap gap-4 rounded-2xl bg-primary/10 p-4">
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">Your Points:</span>
              <span className="font-bold text-primary">{state.user.points}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">CO2 Saved:</span>
              <span className="font-bold text-primary">{state.user.co2Saved.toFixed(1)} kg</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">Actions Logged:</span>
              <span className="font-bold text-primary">{state.actions.length}</span>
            </div>
          </div>

          {/* Eco Action Logger Component */}
          <EcoActionLogger 
            onActionLogged={(newState) => {
              setState(newState)
            }} 
          />
        </div>
      </main>
    </div>
  )
}
