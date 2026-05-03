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

    const { data, error } = await supabase
      .from("carbon_logs")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false })
      .limit(100)

    if (error) {
      console.error("[v0] Supabase error:", error)
      return NextResponse.json(
        { error: "Failed to fetch logs" },
        { status: 500 }
      )
    }

    console.log("[v0] Fetched carbon logs:", data?.length || 0)
    return NextResponse.json({ data })
  } catch (error) {
    console.error("[v0] API error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { userId, logs } = body

    if (!userId || !logs || !Array.isArray(logs)) {
      return NextResponse.json(
        { error: "userId and logs array are required" },
        { status: 400 }
      )
    }

    const supabase = createClient()

    // Transform logs to match actual database schema
    const logsToInsert = logs.map((log: any) => ({
      user_id: userId,
      carbon_value: log.carbon_value || log.carbonKg || 0,
      action: log.action || log.platform || log.activity_type || 'auto_tracked',
    }))

    console.log("[v0] Inserting logs:", logsToInsert)

    const { data, error } = await supabase
      .from("carbon_logs")
      .insert(logsToInsert)
      .select()

    if (error) {
      console.error("[v0] Supabase insert error:", error)
      return NextResponse.json(
        { error: "Failed to insert logs", details: error.message },
        { status: 500 }
      )
    }

    console.log("[v0] Logs inserted successfully")

    // Update user's carbon_score by summing all their carbon logs
    const { data: userLogs, error: fetchError } = await supabase
      .from("carbon_logs")
      .select("carbon_value")
      .eq("user_id", userId)

    if (fetchError) {
      console.error("[v0] Error fetching logs for sum:", fetchError)
      return NextResponse.json({ data, success: true })
    }

    const totalCarbonKg = (userLogs || []).reduce((sum: number, log: any) => sum + (log.carbon_value || 0), 0)
    console.log("[v0] Total carbon calculated:", totalCarbonKg)

    // Update the users table with new carbon_score
    const { data: updateData, error: updateError } = await supabase
      .from("users")
      .update({ carbon_score: Math.round(totalCarbonKg * 100) })
      .eq("id", userId)
      .select()

    if (updateError) {
      console.error("[v0] Error updating carbon_score:", updateError)
    } else {
      console.log("[v0] Carbon score updated:", Math.round(totalCarbonKg * 100))
    }

    return NextResponse.json({ data, success: true, totalCarbonScore: Math.round(totalCarbonKg * 100) })
  } catch (error) {
    console.error("[v0] API error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}


