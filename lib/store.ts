"use client"

// Types for the application state
export interface User {
  id: string
  name: string
  email: string
  points: number
  co2Saved: number
}

export interface LoggedAction {
  id: string
  actionId: string
  title: string
  description: string
  category: string
  points: number
  co2Saved: number
  timestamp: Date
}

export interface LeaderboardEntry {
  id: string
  rank: number
  name: string
  points: number
  co2Saved: number
  avatarInitial: string
}

export interface AppState {
  user: User
  actions: LoggedAction[]
  leaderboard: LeaderboardEntry[]
  weeklyData: { day: string; impact: number }[]
}

// Default state
const defaultUser: User = {
  id: "user-1",
  name: "Guest",
  email: "",
  points: 0,
  co2Saved: 0,
}

// Sample leaderboard entries to show community activity
const sampleLeaderboard: LeaderboardEntry[] = [
  { id: "user-sarah", rank: 1, name: "Sarah Green", points: 1250, co2Saved: 45.2, avatarInitial: "S" },
  { id: "user-mike", rank: 2, name: "Mike Rivers", points: 980, co2Saved: 38.5, avatarInitial: "M" },
  { id: "user-emma", rank: 3, name: "Emma Woods", points: 875, co2Saved: 32.1, avatarInitial: "E" },
  { id: "user-alex", rank: 4, name: "Alex Chen", points: 720, co2Saved: 28.4, avatarInitial: "A" },
  { id: "user-priya", rank: 5, name: "Priya Sharma", points: 650, co2Saved: 24.8, avatarInitial: "P" },
]

const defaultState: AppState = {
  user: defaultUser,
  actions: [],
  leaderboard: sampleLeaderboard,
  weeklyData: [
    { day: "Sun", impact: 0 },
    { day: "Mon", impact: 0 },
    { day: "Tue", impact: 0 },
    { day: "Wed", impact: 0 },
    { day: "Thu", impact: 0 },
    { day: "Fri", impact: 0 },
    { day: "Sat", impact: 0 },
  ],
}

// Storage key
const STORAGE_KEY = "carbonwise_state"

// Get state from localStorage
export function getState(): AppState {
  if (typeof window === "undefined") return defaultState
  
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored) {
      const parsed = JSON.parse(stored)
      // Parse dates back to Date objects
      if (parsed.actions) {
        parsed.actions = parsed.actions.map((a: LoggedAction) => ({
          ...a,
          timestamp: new Date(a.timestamp)
        }))
      }
      // Ensure leaderboard has sample data if empty or missing
      if (!parsed.leaderboard || parsed.leaderboard.length === 0) {
        parsed.leaderboard = sampleLeaderboard
      }
      return { ...defaultState, ...parsed }
    }
  } catch (e) {
    console.error("Error reading state:", e)
  }
  return defaultState
}

// Save state to localStorage
export function saveState(state: AppState): void {
  if (typeof window === "undefined") return
  
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
    // Dispatch custom event for cross-component updates
    window.dispatchEvent(new CustomEvent("carbonwise-state-changed", { detail: state }))
  } catch (e) {
    console.error("Error saving state:", e)
  }
}

// Log a new action (accepts either object or individual params)
export function logAction(
  actionOrId: string | { id: string; title: string; description?: string; category: string; points: number; co2Saved: number },
  title?: string,
  description?: string,
  category?: string,
  points?: number,
  co2Saved?: number
): AppState {
  // Handle object form
  let actionId: string
  let actionTitle: string
  let actionDescription: string
  let actionCategory: string
  let actionPoints: number
  let actionCo2Saved: number

  if (typeof actionOrId === "object") {
    actionId = actionOrId.id
    actionTitle = actionOrId.title
    actionDescription = actionOrId.description || ""
    actionCategory = actionOrId.category
    actionPoints = actionOrId.points
    actionCo2Saved = actionOrId.co2Saved
  } else {
    actionId = actionOrId
    actionTitle = title || ""
    actionDescription = description || ""
    actionCategory = category || ""
    actionPoints = points || 0
    actionCo2Saved = co2Saved || 0
  }
  const state = getState()
  
  const newAction: LoggedAction = {
    id: `action-${Date.now()}`,
    actionId: actionId,
    title: actionTitle,
    description: actionDescription,
    category: actionCategory,
    points: actionPoints,
    co2Saved: actionCo2Saved,
    timestamp: new Date(),
  }
  
  // Update user stats
  const updatedUser = {
    ...state.user,
    points: state.user.points + actionPoints,
    co2Saved: state.user.co2Saved + actionCo2Saved,
  }
  
  // Update weekly data (add to today)
  const today = new Date().getDay() // 0 = Sunday
  const updatedWeeklyData = state.weeklyData.map((d, idx) => 
    idx === today ? { ...d, impact: d.impact + actionCo2Saved } : d
  )
  
  // Update leaderboard (put current user at top for now)
  const existingUserEntry = state.leaderboard.find(e => e.id === state.user.id)
  let updatedLeaderboard: LeaderboardEntry[]
  
  if (existingUserEntry) {
    updatedLeaderboard = state.leaderboard.map(e => 
      e.id === state.user.id 
        ? { ...e, points: updatedUser.points, co2Saved: updatedUser.co2Saved }
        : e
    )
  } else {
    updatedLeaderboard = [
      {
        id: state.user.id,
        rank: 1,
        name: state.user.name || "You",
        points: updatedUser.points,
        co2Saved: updatedUser.co2Saved,
        avatarInitial: (state.user.name || "Y").charAt(0).toUpperCase(),
      },
      ...state.leaderboard,
    ]
  }
  
  // Re-rank leaderboard
  updatedLeaderboard = updatedLeaderboard
    .sort((a, b) => b.points - a.points)
    .map((e, idx) => ({ ...e, rank: idx + 1 }))
  
  const newState: AppState = {
    ...state,
    user: updatedUser,
    actions: [newAction, ...state.actions],
    leaderboard: updatedLeaderboard,
    weeklyData: updatedWeeklyData,
  }
  
  saveState(newState)
  return newState
}

// Update user profile
export function updateUser(name: string, email: string): AppState {
  const state = getState()
  
  const updatedUser = {
    ...state.user,
    name,
    email,
  }
  
  // Update leaderboard entry if exists
  const updatedLeaderboard = state.leaderboard.map(e => 
    e.id === state.user.id 
      ? { ...e, name, avatarInitial: name.charAt(0).toUpperCase() }
      : e
  )
  
  const newState: AppState = {
    ...state,
    user: updatedUser,
    leaderboard: updatedLeaderboard,
  }
  
  saveState(newState)
  return newState
}

// Clear all data
export function clearState(): void {
  if (typeof window === "undefined") return
  localStorage.removeItem(STORAGE_KEY)
  window.dispatchEvent(new CustomEvent("carbonwise-state-changed", { detail: defaultState }))
}

// Hook helper for subscribing to state changes
export function subscribeToStateChanges(callback: (state: AppState) => void): () => void {
  const handler = (e: Event) => {
    const customEvent = e as CustomEvent<AppState>
    callback(customEvent.detail)
  }
  
  window.addEventListener("carbonwise-state-changed", handler)
  return () => window.removeEventListener("carbonwise-state-changed", handler)
}
