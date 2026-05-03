<<<<<<< HEAD
import { createClient } from '@/lib/supabaseClient'
=======
import { createClient } from '@/lib/supabase/server'
>>>>>>> 778ecd85492936ad34a5a3b1ed51bea1f9da59e8
import { NextResponse } from 'next/server'

export async function GET() {
  try {
<<<<<<< HEAD
    const supabase = createClient()
=======
    const supabase = await createClient()
>>>>>>> 778ecd85492936ad34a5a3b1ed51bea1f9da59e8

    const { data: users, error } = await supabase
      .from('users')
      .select('id, name, carbon_score, email')
      .order('carbon_score', { ascending: false })
      .limit(50)

    if (error) {
<<<<<<< HEAD
      console.log('[v0] Leaderboard error:', error)
=======
>>>>>>> 778ecd85492936ad34a5a3b1ed51bea1f9da59e8
      return NextResponse.json({ error: error.message }, { status: 400 })
    }

    const leaderboard = (users || []).map((user, index) => ({
      id: user.id,
      rank: index + 1,
<<<<<<< HEAD
      name: user.name || user.email?.split('@')[0] || 'Anonymous',
      points: user.carbon_score || 0,
      co2Saved: user.carbon_score ? (user.carbon_score / 100).toFixed(2) : '0',
      avatarInitial: (user.name || user.email || 'U')[0].toUpperCase(),
      email: user.email,
    }))

    console.log('[v0] Leaderboard fetched:', leaderboard.length)
=======
      name: user.name || user.email,
      points: (user.carbon_score || 0) * 10,
      co2Saved: user.carbon_score || 0,
      avatarInitial: (user.name || user.email).charAt(0).toUpperCase(),
    }))

>>>>>>> 778ecd85492936ad34a5a3b1ed51bea1f9da59e8
    return NextResponse.json(leaderboard)
  } catch (error) {
    console.error('[v0] API error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
<<<<<<< HEAD

=======
>>>>>>> 778ecd85492936ad34a5a3b1ed51bea1f9da59e8
