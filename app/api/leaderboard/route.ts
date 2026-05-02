import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const supabase = await createClient()

    const { data: users, error } = await supabase
      .from('users')
      .select('id, name, carbon_score, email')
      .order('carbon_score', { ascending: false })
      .limit(50)

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 })
    }

    const leaderboard = (users || []).map((user, index) => ({
      id: user.id,
      rank: index + 1,
      name: user.name || user.email,
      points: (user.carbon_score || 0) * 10,
      co2Saved: user.carbon_score || 0,
      avatarInitial: (user.name || user.email).charAt(0).toUpperCase(),
    }))

    return NextResponse.json(leaderboard)
  } catch (error) {
    console.error('[v0] API error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
