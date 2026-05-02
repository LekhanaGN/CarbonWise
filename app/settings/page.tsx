"use client"

import { useState, useEffect } from "react"
import { Sidebar } from "@/components/dashboard/sidebar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { getState, updateUser, clearState, subscribeToStateChanges, type AppState } from "@/lib/store"
import { 
  Settings, 
  User,
  Bell,
  Shield,
  Trash2,
  Save,
  AlertTriangle
} from "lucide-react"
import { useRouter } from "next/navigation"

export default function SettingsPage() {
  const router = useRouter()
  const [appState, setAppState] = useState<AppState | null>(null)
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [saved, setSaved] = useState(false)
  const [notifications, setNotifications] = useState(true)
  const [weeklyReport, setWeeklyReport] = useState(true)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)

  useEffect(() => {
    const state = getState()
    setAppState(state)
    setName(state.user.name)
    setEmail(state.user.email)
    
    const unsubscribe = subscribeToStateChanges((newState) => {
      setAppState(newState)
    })
    return unsubscribe
  }, [])

  const handleSaveProfile = () => {
    updateUser(name, email)
    setSaved(true)
    setTimeout(() => setSaved(false), 3000)
  }

  const handleDeleteData = () => {
    clearState()
    router.push("/login")
  }

  if (!appState) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="animate-pulse text-muted-foreground">Loading...</div>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar user={appState.user} />

      <main className="flex-1 overflow-auto p-4 pt-16 md:p-6 lg:p-8 lg:pt-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="flex items-center gap-3 text-2xl font-bold text-foreground md:text-3xl">
            <Settings className="h-8 w-8 text-primary" />
            Settings
          </h1>
          <p className="mt-2 text-muted-foreground">
            Manage your account and preferences
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          {/* Profile Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Profile
              </CardTitle>
              <CardDescription>Update your personal information</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter your name"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                />
              </div>
              <Button onClick={handleSaveProfile} className="gap-2">
                <Save className="h-4 w-4" />
                {saved ? "Saved!" : "Save Changes"}
              </Button>
            </CardContent>
          </Card>

          {/* Notification Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="h-5 w-5" />
                Notifications
              </CardTitle>
              <CardDescription>Configure how you receive updates</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-foreground">Push Notifications</p>
                  <p className="text-sm text-muted-foreground">
                    Get notified about eco tips and achievements
                  </p>
                </div>
                <Switch
                  checked={notifications}
                  onCheckedChange={setNotifications}
                />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-foreground">Weekly Report</p>
                  <p className="text-sm text-muted-foreground">
                    Receive a summary of your weekly impact
                  </p>
                </div>
                <Switch
                  checked={weeklyReport}
                  onCheckedChange={setWeeklyReport}
                />
              </div>
            </CardContent>
          </Card>

          {/* Privacy Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Privacy
              </CardTitle>
              <CardDescription>Control your data and privacy</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-foreground">Show on Leaderboard</p>
                  <p className="text-sm text-muted-foreground">
                    Display your name publicly on the leaderboard
                  </p>
                </div>
                <Switch defaultChecked />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-foreground">Share Statistics</p>
                  <p className="text-sm text-muted-foreground">
                    Allow others to see your impact statistics
                  </p>
                </div>
                <Switch defaultChecked />
              </div>
            </CardContent>
          </Card>

          {/* Danger Zone */}
          <Card className="border-destructive/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-destructive">
                <Trash2 className="h-5 w-5" />
                Danger Zone
              </CardTitle>
              <CardDescription>Irreversible actions</CardDescription>
            </CardHeader>
            <CardContent>
              {!showDeleteConfirm ? (
                <div>
                  <p className="mb-4 text-sm text-muted-foreground">
                    This will permanently delete all your data including points, actions, and badges.
                  </p>
                  <Button
                    variant="destructive"
                    className="gap-2"
                    onClick={() => setShowDeleteConfirm(true)}
                  >
                    <Trash2 className="h-4 w-4" />
                    Delete All Data
                  </Button>
                </div>
              ) : (
                <div className="rounded-lg border border-destructive bg-destructive/10 p-4">
                  <div className="flex items-start gap-3">
                    <AlertTriangle className="h-5 w-5 text-destructive" />
                    <div>
                      <p className="font-medium text-destructive">Are you sure?</p>
                      <p className="mt-1 text-sm text-muted-foreground">
                        This action cannot be undone. All your progress will be lost.
                      </p>
                      <div className="mt-4 flex gap-2">
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={handleDeleteData}
                        >
                          Yes, Delete Everything
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setShowDeleteConfirm(false)}
                        >
                          Cancel
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* App Info */}
        <Card className="mt-6">
          <CardContent className="py-6">
            <div className="flex flex-wrap items-center justify-between gap-4 text-sm text-muted-foreground">
              <div>
                <p className="font-medium text-foreground">CarbonWise</p>
                <p>Version 1.0.0</p>
              </div>
              <div className="flex gap-4">
                <a href="#" className="hover:text-foreground">Privacy Policy</a>
                <a href="#" className="hover:text-foreground">Terms of Service</a>
                <a href="#" className="hover:text-foreground">Help Center</a>
              </div>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
