import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabaseClient"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get("user_id")

    if (!userId) {
      return NextResponse.json(
        { error: "user_id is required" },
        { status: 400 }
      )
    }

    const supabase = createClient()

    // Get all logs for user
    const { data: logs, error } = await supabase
      .from("carbon_logs")
      .select("carbon_value, source, activity_type, created_at")
      .eq("user_id", userId)

    if (error) {
      console.error("[v0] Supabase error:", error)
      return NextResponse.json(
        { error: "Failed to fetch logs" },
        { status: 500 }
      )
    }

    // Aggregate by source
    const bySource = {
      manual: { total: 0, count: 0, activities: {} },
      extension: { total: 0, count: 0, activities: {} },
    }

    // Aggregate by activity type
    const byActivity = {}

    logs.forEach((log: any) => {
      const carbon = log.carbon_value || 0
      const source = log.source || 'manual'
      const activity = log.activity_type || 'unknown'

      // By source
      if (bySource[source as keyof typeof bySource]) {
        bySource[source as keyof typeof bySource].total += carbon
        bySource[source as keyof typeof bySource].count += 1
        
        if (!bySource[source as keyof typeof bySource].activities[activity]) {
          bySource[source as keyof typeof bySource].activities[activity] = { count: 0, carbon: 0 }
        }
        bySource[source as keyof typeof bySource].activities[activity].count += 1
        bySource[source as keyof typeof bySource].activities[activity].carbon += carbon
      }

      // By activity
      if (!byActivity[activity]) {
        byActivity[activity] = { total: 0, count: 0 }
      }
      byActivity[activity].total += carbon
      byActivity[activity].count += 1
    })

    // Calculate weekly trend
    const today = new Date()
    const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000)
    const weeklyLogs = logs.filter((log: any) => new Date(log.created_at) > weekAgo)
    const weeklyCO2 = weeklyLogs.reduce((sum: number, log: any) => sum + (log.carbon_value || 0), 0)

    return NextResponse.json({
      totalCarbon: bySource.manual.total + bySource.extension.total,
      bySource,
      byActivity,
      weeklyTrend: weeklyCO2,
      logCount: logs.length,
    })
  } catch (error) {
    console.error("[v0] API error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
