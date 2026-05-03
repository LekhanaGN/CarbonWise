"use client"

import { useEffect, useState } from "react"
import { Activity, TrendingUp, AlertCircle } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface StreamingLog {
  id?: string | number
  type: "streaming_session" | "ecommerce_purchase"
  platform: string
  durationSeconds?: number
  carbonKg: number
  timestamp: string
  date: string
}

interface Stats {
  totalMinutesToday: number
  totalCO2Today: number
  platformBreakdown: Record<string, { minutes: number; co2: number; sessions: number }>
}

export function BrowserActivitySection({ userId }: { userId: string }) {
  const [logs, setLogs] = useState<StreamingLog[]>([])
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState<Stats>({
    totalMinutesToday: 0,
    totalCO2Today: 0,
    platformBreakdown: {}
  })

  useEffect(() => {
    const loadExtensionLogs = async () => {
      try {
        // Try to load from chrome extension storage if available
        let extensionLogs: StreamingLog[] = []
        
        if (typeof chrome !== "undefined" && chrome.storage) {
          extensionLogs = await new Promise((resolve) => {
            chrome.storage.local.get(["carbonLogs"], (result) => {
              resolve(result.carbonLogs || [])
            })
          })

          // Sync unsynced logs to Supabase
          if (extensionLogs.length > 0 && userId) {
            await syncLogsToSupabase(extensionLogs, userId)
          }
        }

        // Also fetch from Supabase if user is authenticated
        if (userId) {
          try {
            const response = await fetch(`/api/carbon-logs?user_id=${userId}`)
            if (response.ok) {
              const { data: supabaseLogs } = await response.json()
              extensionLogs = [...extensionLogs, ...(supabaseLogs || [])]
            }
          } catch (err) {
            console.log("[v0] Supabase logs fetch error:", err)
          }
        }

        setLogs(extensionLogs)
        calculateStats(extensionLogs)
        setLoading(false)
      } catch (err) {
        console.error("[v0] Error loading extension logs:", err)
        setLoading(false)
      }
    }

    loadExtensionLogs()

    // Poll for updates every 10 seconds
    const interval = setInterval(loadExtensionLogs, 10000)
    return () => clearInterval(interval)
  }, [userId])

  async function syncLogsToSupabase(logsToSync: StreamingLog[], userIdParam: string) {
    try {
      // Filter logs that haven't been synced yet
      const unsyncedLogs = logsToSync.filter(log => {
        if (!log.id) return false
        const idStr = log.id.toString()
        return !idStr.startsWith("synced_")
      })

      if (unsyncedLogs.length === 0) return

      // Sync to Supabase
      const response = await fetch("/api/carbon-logs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: userIdParam, logs: unsyncedLogs })
      })

      if (response.ok) {
        console.log("[v0] Synced extension logs to Supabase")

        // Mark as synced in extension storage
        if (typeof chrome !== "undefined" && chrome.storage) {
          const syncedIds = unsyncedLogs.map(l => l.id?.toString() || "")
          chrome.storage.local.get(["syncedIds"], (result) => {
            const existing = result.syncedIds || []
            chrome.storage.local.set({
              syncedIds: [...existing, ...syncedIds]
            })
          })
        }
      }
    } catch (err) {
      console.log("[v0] Sync error:", err)
    }
  }

  function calculateStats(logsToCalc: StreamingLog[]) {
    const today = new Date().toLocaleDateString("en-IN")
    const todayLogs = logsToCalc.filter(log => log.date === today)

    let totalMinutes = 0
    let totalCO2 = 0
    const breakdown: Record<string, { minutes: number; co2: number; sessions: number }> = {}

    todayLogs.forEach(log => {
      if (log.type === "streaming_session") {
        const minutes = Math.floor((log.durationSeconds || 0) / 60)
        totalMinutes += minutes
        totalCO2 += log.carbonKg

        if (!breakdown[log.platform]) {
          breakdown[log.platform] = { minutes: 0, co2: 0, sessions: 0 }
        }
        breakdown[log.platform].minutes += minutes
        breakdown[log.platform].co2 += log.carbonKg
        breakdown[log.platform].sessions += 1
      }
    })

    setStats({
      totalMinutesToday: totalMinutes,
      totalCO2Today: totalCO2,
      platformBreakdown: breakdown
    })
  }

  function getPlatformIcon(platform: string) {
    const icons: Record<string, string> = {
      "YouTube": "▶️",
      "Netflix": "🎬",
      "Prime Video": "🎥",
      "Hotstar": "📺",
      "Streaming": "📡"
    }
    return icons[platform] || "📡"
  }

  function getCarbonColor(co2: number) {
    if (co2 < 0.05) return "text-emerald-600"
    if (co2 < 0.15) return "text-amber-600"
    return "text-red-600"
  }

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5" />
            Browser Activity
          </CardTitle>
        </CardHeader>
        <CardContent className="text-center text-muted-foreground">
          Loading...
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-4">
      {/* Summary Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5" />
            Browser Activity
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2">
            {/* Streaming Summary */}
            <div className="rounded-lg bg-gradient-to-br from-emerald-50 to-teal-50 p-4 border border-emerald-200">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <p className="text-xs font-medium text-emerald-600 mb-1">Streaming Today</p>
                  <p className="text-2xl font-bold text-emerald-900">{stats.totalMinutesToday}m</p>
                </div>
                <span className="text-2xl">📺</span>
              </div>
              <p className="text-xs text-emerald-700">
                {stats.totalCO2Today.toFixed(3)} kg CO₂ generated
              </p>
            </div>

            {/* Carbon Tip */}
            <div className="rounded-lg bg-gradient-to-br from-blue-50 to-cyan-50 p-4 border border-blue-200">
              <div className="flex items-start gap-2 mb-2">
                <AlertCircle className="h-4 w-4 text-blue-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-xs font-medium text-blue-600 mb-1">Energy Saving Tip</p>
                  <p className="text-xs text-blue-700">
                    Watch in 720p instead of 1080p to reduce energy by 50%
                  </p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Platform Breakdown */}
      {Object.keys(stats.platformBreakdown).length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <TrendingUp className="h-4 w-4" />
              Platform Breakdown
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {Object.entries(stats.platformBreakdown).map(([platform, data]) => (
                <div key={platform} className="flex items-center justify-between p-3 rounded-lg bg-stone-50 hover:bg-stone-100 transition-colors">
                  <div className="flex items-center gap-3 flex-1">
                    <span className="text-xl">{getPlatformIcon(platform)}</span>
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-stone-900">{platform}</p>
                      <p className="text-xs text-stone-500">
                        {data.sessions} session{data.sessions > 1 ? "s" : ""} • {data.minutes}m
                      </p>
                    </div>
                  </div>
                  <div className="text-right ml-4 flex-shrink-0">
                    <p className={`text-sm font-semibold ${getCarbonColor(data.co2)}`}>
                      {data.co2.toFixed(3)} kg
                    </p>
                    <p className="text-xs text-stone-500">CO₂</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* No Activity State */}
      {Object.keys(stats.platformBreakdown).length === 0 && (
        <Card>
          <CardContent className="py-8 text-center text-muted-foreground">
            <Activity className="h-8 w-8 mx-auto mb-2 opacity-50" />
            <p>No streaming activity tracked yet. Install and use the CarbonWise browser extension to start tracking.</p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
