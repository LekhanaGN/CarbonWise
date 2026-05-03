import { createClient } from '@/lib/supabaseClient'
import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const supabase = createClient()

    const { data: users, error } = await supabase
      .from('users')
      .select('id, name, carbon_score, email')
      .order('carbon_score', { ascending: false })
      .limit(50)

    if (error) {
      console.log('[v0] Leaderboard error:', error)
      return NextResponse.json({ error: error.message }, { status: 400 })
    }

    const leaderboard = (users || []).map((user, index) => ({
      id: user.id,
      rank: index + 1,
      name: user.name || user.email?.split('@')[0] || 'Anonymous',
      points: user.carbon_score || 0,
      co2Saved: user.carbon_score ? (user.carbon_score / 100).toFixed(2) : '0',
      avatarInitial: (user.name || user.email || 'U')[0].toUpperCase(),
      email: user.email,
    }))

    console.log('[v0] Leaderboard fetched:', leaderboard.length)
    return NextResponse.json(leaderboard)
  } catch (error) {
    console.error('[v0] API error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

