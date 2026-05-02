import useSWR from 'swr'

const fetcher = (url: string) => fetch(url).then(res => res.json())

export interface UserProfile {
  id: string
  name: string
  email: string
  carbon_score: number
  created_at: string
}

export interface UserData {
  user: UserProfile
  logs: any[]
  actionCount: number
  totalCO2: number
}

export function useUserData() {
  const { data, error, isLoading, mutate } = useSWR<UserData>('/api/user/stats', fetcher, {
    revalidateOnFocus: true,
    revalidateOnReconnect: true,
    dedupingInterval: 0,
  })

  return {
    user: data?.user,
    stats: {
      actionCount: data?.actionCount || 0,
      totalCO2: data?.totalCO2 || 0,
      points: (data?.user?.carbon_score || 0) * 10,
    },
    isLoading,
    error,
    mutate,
  }
}

export function useLeaderboard() {
  const { data, error, isLoading, mutate } = useSWR('/api/leaderboard', fetcher, {
    revalidateOnFocus: true,
    revalidateOnReconnect: true,
    dedupingInterval: 0,
  })

  return {
    leaderboard: data || [],
    isLoading,
    error,
    mutate,
  }
}

export async function updateUserProfile(name: string, email: string) {
  const response = await fetch('/api/user/profile', {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, email }),
  })

  if (!response.ok) {
    throw new Error('Failed to update profile')
  }

  return response.json()
}
