"use client"

import { useState, useEffect, useRef } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Sidebar } from "@/components/dashboard/sidebar"
import { getState, logAction, type AppState } from "@/lib/store"
import { 
  ArrowLeft, 
  Chrome, 
  Download, 
  CheckCircle, 
  Utensils,
  Car,
  ShoppingBag,
  Plane,
  Tv,
  Leaf,
  AlertTriangle,
  Plus,
  Play,
  Pause,
  Clock,
  FolderDown
} from "lucide-react"

// Simulated website data
const DEMO_SITES = [
  {
    id: "swiggy",
    name: "Swiggy",
    category: "Food Delivery",
    icon: Utensils,
    color: "bg-orange-100 text-orange-600 border-orange-200",
    co2: 2.5,
    points: 50,
    description: "Order food from local restaurants",
    ecoTip: "Choose nearby restaurants to reduce delivery distance",
    isStreaming: false,
  },
  {
    id: "zomato",
    name: "Zomato",
    category: "Food Delivery",
    icon: Utensils,
    color: "bg-red-100 text-red-600 border-red-200",
    co2: 2.5,
    points: 50,
    description: "Food delivery and dining out",
    ecoTip: "Opt out of plastic cutlery to reduce waste",
    isStreaming: false,
  },
  {
    id: "uber",
    name: "Uber",
    category: "Transport",
    icon: Car,
    color: "bg-gray-100 text-gray-700 border-gray-200",
    co2: 2.1,
    points: 45,
    description: "Book a ride to your destination",
    ecoTip: "Choose Uber Pool to share your ride and reduce emissions",
    isStreaming: false,
  },
  {
    id: "ola",
    name: "Ola",
    category: "Transport",
    icon: Car,
    color: "bg-green-100 text-green-600 border-green-200",
    co2: 2.1,
    points: 45,
    description: "Ride-sharing service",
    ecoTip: "Select CNG/Electric vehicles when available",
    isStreaming: false,
  },
  {
    id: "amazon",
    name: "Amazon",
    category: "Shopping",
    icon: ShoppingBag,
    color: "bg-yellow-100 text-yellow-700 border-yellow-200",
    co2: 3.5,
    points: 60,
    description: "Online shopping marketplace",
    ecoTip: "Choose Amazon Day delivery to consolidate shipments",
    isStreaming: false,
  },
  {
    id: "flipkart",
    name: "Flipkart",
    category: "Shopping",
    icon: ShoppingBag,
    color: "bg-blue-100 text-blue-600 border-blue-200",
    co2: 3.5,
    points: 60,
    description: "E-commerce platform",
    ecoTip: "Buy refurbished electronics to reduce manufacturing impact",
    isStreaming: false,
  },
  {
    id: "makemytrip",
    name: "MakeMyTrip",
    category: "Flights",
    icon: Plane,
    color: "bg-red-100 text-red-500 border-red-200",
    co2: 76.5,
    points: 150,
    description: "Book flights and hotels",
    ecoTip: "Consider trains for domestic travel - 90% less emissions!",
    highImpact: true,
    isStreaming: false,
  },
  {
    id: "youtube",
    name: "YouTube",
    category: "Streaming",
    icon: Tv,
    color: "bg-red-100 text-red-600 border-red-200",
    co2PerHour: 0.036,
    points: 10,
    description: "Watch videos and live streams",
    ecoTip: "Watch in lower resolution when on mobile data",
    isStreaming: true,
  },
  {
    id: "netflix",
    name: "Netflix",
    category: "Streaming",
    icon: Tv,
    color: "bg-red-100 text-red-800 border-red-300",
    co2PerHour: 0.055,
    points: 12,
    description: "Stream movies and TV shows",
    ecoTip: "Download content on WiFi to watch offline",
    isStreaming: true,
  },
]

export default function ExtensionPage() {
  const [appState, setAppState] = useState<AppState | null>(null)
  const [activeDemo, setActiveDemo] = useState<string | null>(null)
  const [showNotification, setShowNotification] = useState(false)
  const [notificationData, setNotificationData] = useState<{
    site: string
    co2: number
    ecoTip: string
    isStreaming: boolean
    streamingMinutes?: number
  } | null>(null)
  
  // Streaming state
  const [streamingActive, setStreamingActive] = useState<string | null>(null)
  const [streamingSeconds, setStreamingSeconds] = useState(0)
  const streamingIntervalRef = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    setAppState(getState())
  }, [])

  // Streaming timer effect
  useEffect(() => {
    if (streamingActive) {
      streamingIntervalRef.current = setInterval(() => {
        setStreamingSeconds(prev => prev + 1)
      }, 1000)
    } else {
      if (streamingIntervalRef.current) {
        clearInterval(streamingIntervalRef.current)
        streamingIntervalRef.current = null
      }
    }
    
    return () => {
      if (streamingIntervalRef.current) {
        clearInterval(streamingIntervalRef.current)
      }
    }
  }, [streamingActive])

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  const calculateStreamingCO2 = (seconds: number, co2PerHour: number) => {
    const hours = seconds / 3600
    return (hours * co2PerHour).toFixed(4)
  }

  const simulateVisit = (site: typeof DEMO_SITES[0]) => {
    if (site.isStreaming) {
      // Handle streaming sites differently
      if (streamingActive === site.id) {
        // Stop streaming
        const co2Generated = parseFloat(calculateStreamingCO2(streamingSeconds, site.co2PerHour || 0.036))
        setNotificationData({
          site: site.name,
          co2: co2Generated,
          ecoTip: site.ecoTip,
          isStreaming: true,
          streamingMinutes: Math.floor(streamingSeconds / 60),
        })
        setShowNotification(true)
        setStreamingActive(null)
        setActiveDemo(null)
      } else {
        // Start streaming
        setStreamingActive(site.id)
        setStreamingSeconds(0)
        setActiveDemo(site.id)
      }
    } else {
      // Regular sites - show notification immediately
      setActiveDemo(site.id)
      setNotificationData({
        site: site.name,
        co2: site.co2 || 0,
        ecoTip: site.ecoTip,
        isStreaming: false,
      })
      setShowNotification(true)

      setTimeout(() => {
        if (!notificationData?.isStreaming) {
          setShowNotification(false)
        }
      }, 8000)
    }
  }

  const logEcoAction = () => {
    if (!notificationData) return
    
    const site = DEMO_SITES.find(s => s.name === notificationData.site)
    if (!site) return
    
    // Log an offset action for choosing eco-friendly option
    logAction({
      id: site.isStreaming ? "streaming-eco" : `eco-offset-${site.id}`,
      title: site.isStreaming 
        ? `Reduced Streaming Quality on ${site.name}` 
        : `Chose Eco Option on ${site.name}`,
      category: "energy",
      co2Saved: notificationData.co2 * 0.3, // 30% reduction for eco choice
      points: Math.round((site.points || 10) * 0.5),
    })
    
    setShowNotification(false)
    setActiveDemo(null)
    setStreamingSeconds(0)
    setAppState(getState())
  }

  const downloadExtension = () => {
    // Create a simple alert with instructions since we can't directly download a folder
    alert(
      "To download the CarbonWise Chrome Extension:\n\n" +
      "1. Click the three-dot menu in the top right of this page\n" +
      "2. Select 'Download ZIP'\n" +
      "3. Extract the ZIP file\n" +
      "4. The 'chrome-extension' folder contains the extension\n\n" +
      "Then follow the installation steps below to load it in Chrome."
    )
  }

  if (!appState) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="animate-pulse text-muted-foreground">Loading...</div>
      </div>
    )
  }

  const activeSite = streamingActive ? DEMO_SITES.find(s => s.id === streamingActive) : null

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar user={appState.user} />

      <main className="flex-1 overflow-auto p-4 md:p-6 lg:p-8">
        {/* Header */}
        <div className="mb-8">
          <Link 
            href="/"
            className="mb-4 inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Dashboard
          </Link>
          
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <h1 className="flex items-center gap-3 text-2xl font-bold text-foreground md:text-3xl">
                <Chrome className="h-8 w-8 text-primary" />
                CarbonWise Chrome Extension
              </h1>
              <p className="mt-2 text-muted-foreground">
                Track your carbon footprint in real-time across popular websites
              </p>
            </div>
            <Button className="gap-2" onClick={downloadExtension}>
              <FolderDown className="h-4 w-4" />
              Download Extension
            </Button>
          </div>
        </div>

        {/* Active Streaming Banner */}
        {streamingActive && activeSite && (
          <Card className="mb-6 border-2 border-amber-500 bg-amber-50">
            <CardContent className="flex items-center justify-between p-4">
              <div className="flex items-center gap-4">
                <div className="relative">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-amber-100">
                    <Tv className="h-6 w-6 text-amber-600" />
                  </div>
                  <div className="absolute -right-1 -top-1 h-4 w-4 animate-pulse rounded-full bg-red-500" />
                </div>
                <div>
                  <p className="font-semibold text-amber-900">
                    Streaming on {activeSite.name}
                  </p>
                  <div className="flex items-center gap-4 text-sm text-amber-700">
                    <span className="flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      {formatTime(streamingSeconds)}
                    </span>
                    <span>
                      CO2: {calculateStreamingCO2(streamingSeconds, activeSite.co2PerHour || 0.036)} kg
                    </span>
                  </div>
                </div>
              </div>
              <Button 
                variant="destructive" 
                size="sm" 
                className="gap-2"
                onClick={() => simulateVisit(activeSite)}
              >
                <Pause className="h-4 w-4" />
                Stop & Calculate
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Installation Steps */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Installation Guide</CardTitle>
            <CardDescription>Follow these steps to install the CarbonWise Chrome Extension</CardDescription>
          </CardHeader>
          <CardContent>
            <ol className="space-y-4">
              <li className="flex items-start gap-3">
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary text-xs font-medium text-primary-foreground">1</span>
                <div>
                  <p className="font-medium">Download the project</p>
                  <p className="text-sm text-muted-foreground">Click the three-dot menu in the top right corner of this page, select &quot;Download ZIP&quot;, and extract it</p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary text-xs font-medium text-primary-foreground">2</span>
                <div>
                  <p className="font-medium">Open Chrome Extensions</p>
                  <p className="text-sm text-muted-foreground">Go to <code className="rounded bg-muted px-1 py-0.5 text-xs">chrome://extensions/</code> in your browser</p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary text-xs font-medium text-primary-foreground">3</span>
                <div>
                  <p className="font-medium">Enable Developer Mode</p>
                  <p className="text-sm text-muted-foreground">Toggle the Developer mode switch in the top right corner</p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary text-xs font-medium text-primary-foreground">4</span>
                <div>
                  <p className="font-medium">Load unpacked extension</p>
                  <p className="text-sm text-muted-foreground">Click &quot;Load unpacked&quot; and select the <code className="rounded bg-muted px-1 py-0.5 text-xs">chrome-extension</code> folder from the extracted files</p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary text-xs font-medium text-primary-foreground">5</span>
                <div>
                  <p className="font-medium">Pin the extension</p>
                  <p className="text-sm text-muted-foreground">Click the puzzle icon in Chrome toolbar and pin CarbonWise for easy access</p>
                </div>
              </li>
            </ol>
          </CardContent>
        </Card>

        {/* Demo Section */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              Try the Demo
              <Badge variant="secondary">Simulator</Badge>
            </CardTitle>
            <CardDescription>
              Click on any website to simulate carbon tracking. For streaming sites (YouTube, Netflix), click to start/stop a timer that calculates real-time CO2 emissions.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {DEMO_SITES.map((site) => {
                const Icon = site.icon
                const isCurrentlyStreaming = streamingActive === site.id
                return (
                  <button
                    key={site.id}
                    onClick={() => simulateVisit(site)}
                    className={`relative rounded-xl border-2 p-4 text-left transition-all hover:scale-[1.02] hover:shadow-md ${
                      activeDemo === site.id || isCurrentlyStreaming
                        ? "border-primary ring-2 ring-primary/20" 
                        : "border-border hover:border-primary/50"
                    } ${isCurrentlyStreaming ? "bg-amber-50" : ""}`}
                  >
                    {site.highImpact && (
                      <div className="absolute -right-2 -top-2">
                        <Badge variant="destructive" className="gap-1 text-xs">
                          <AlertTriangle className="h-3 w-3" />
                          High Impact
                        </Badge>
                      </div>
                    )}
                    {site.isStreaming && (
                      <div className="absolute -left-2 -top-2">
                        <Badge variant="secondary" className="gap-1 text-xs">
                          <Clock className="h-3 w-3" />
                          Real-time
                        </Badge>
                      </div>
                    )}
                    <div className="flex items-start justify-between">
                      <div className={`mb-3 inline-flex rounded-lg border p-2 ${site.color}`}>
                        <Icon className="h-5 w-5" />
                      </div>
                      {isCurrentlyStreaming && (
                        <div className="flex items-center gap-1 text-amber-600">
                          <div className="h-2 w-2 animate-pulse rounded-full bg-red-500" />
                          <span className="text-xs font-medium">{formatTime(streamingSeconds)}</span>
                        </div>
                      )}
                    </div>
                    <h3 className="font-semibold text-foreground">{site.name}</h3>
                    <p className="text-xs text-muted-foreground">{site.category}</p>
                    <div className="mt-2 flex items-center gap-2 text-xs">
                      {site.isStreaming ? (
                        <span className="flex items-center gap-1 text-muted-foreground">
                          {isCurrentlyStreaming ? (
                            <>
                              <Pause className="h-3 w-3" />
                              Click to stop
                            </>
                          ) : (
                            <>
                              <Play className="h-3 w-3" />
                              Click to start timer
                            </>
                          )}
                        </span>
                      ) : (
                        <span className="text-muted-foreground">~{site.co2} kg CO2</span>
                      )}
                    </div>
                    {site.isStreaming && (
                      <p className="mt-1 text-xs text-muted-foreground">
                        ~{(site.co2PerHour || 0.036) * 1000}g CO2/hour
                      </p>
                    )}
                  </button>
                )
              })}
            </div>
          </CardContent>
        </Card>

        {/* Supported Websites */}
        <Card>
          <CardHeader>
            <CardTitle>Supported Websites</CardTitle>
            <CardDescription>The extension tracks carbon impact on these platforms</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              <div>
                <h4 className="mb-3 flex items-center gap-2 font-medium">
                  <Utensils className="h-4 w-4 text-orange-500" />
                  Food Delivery
                </h4>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-primary" />
                    Swiggy
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-primary" />
                    Zomato
                  </li>
                </ul>
              </div>
              <div>
                <h4 className="mb-3 flex items-center gap-2 font-medium">
                  <Car className="h-4 w-4 text-blue-500" />
                  Transport
                </h4>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-primary" />
                    Uber
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-primary" />
                    Ola
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-primary" />
                    RedBus
                  </li>
                </ul>
              </div>
              <div>
                <h4 className="mb-3 flex items-center gap-2 font-medium">
                  <ShoppingBag className="h-4 w-4 text-yellow-500" />
                  Shopping
                </h4>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-primary" />
                    Amazon
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-primary" />
                    Flipkart
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-primary" />
                    Myntra
                  </li>
                </ul>
              </div>
              <div>
                <h4 className="mb-3 flex items-center gap-2 font-medium">
                  <Plane className="h-4 w-4 text-red-500" />
                  Flights
                </h4>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-primary" />
                    MakeMyTrip
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-primary" />
                    Goibibo
                  </li>
                </ul>
              </div>
              <div>
                <h4 className="mb-3 flex items-center gap-2 font-medium">
                  <Tv className="h-4 w-4 text-purple-500" />
                  Streaming (Real-time)
                </h4>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-primary" />
                    YouTube (~36g CO2/hr)
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-primary" />
                    Netflix (~55g CO2/hr)
                  </li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </main>

      {/* Carbon Notification Popup (Demo) */}
      {showNotification && notificationData && (
        <div className="fixed right-4 top-4 z-50 w-80 animate-in slide-in-from-right-full duration-300">
          <Card className="border-2 border-primary/20 shadow-xl">
            <CardHeader className="pb-2">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2">
                  <div className="rounded-full bg-amber-100 p-1.5">
                    <AlertTriangle className="h-4 w-4 text-amber-600" />
                  </div>
                  <CardTitle className="text-base">
                    {notificationData.isStreaming ? "Streaming Session Complete" : "Carbon Impact Detected"}
                  </CardTitle>
                </div>
                <button 
                  onClick={() => setShowNotification(false)}
                  className="text-muted-foreground hover:text-foreground"
                >
                  &times;
                </button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-sm text-muted-foreground">
                  {notificationData.isStreaming ? (
                    <>
                      You streamed on <span className="font-medium text-foreground">{notificationData.site}</span> for{" "}
                      <span className="font-medium text-foreground">{notificationData.streamingMinutes} minutes</span>
                    </>
                  ) : (
                    <>
                      Your activity on <span className="font-medium text-foreground">{notificationData.site}</span> generates approximately:
                    </>
                  )}
                </p>
                <p className="mt-1 text-2xl font-bold text-amber-600">
                  ~{notificationData.co2} kg CO2
                </p>
              </div>
              
              <div className="rounded-lg bg-primary/5 p-3">
                <div className="flex items-start gap-2">
                  <Leaf className="mt-0.5 h-4 w-4 text-primary" />
                  <div>
                    <p className="text-xs font-medium text-primary">Eco Tip</p>
                    <p className="text-sm text-muted-foreground">{notificationData.ecoTip}</p>
                  </div>
                </div>
              </div>

              <div className="flex gap-2">
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="flex-1"
                  onClick={() => setShowNotification(false)}
                >
                  Dismiss
                </Button>
                <Button 
                  size="sm" 
                  className="flex-1 gap-1"
                  onClick={logEcoAction}
                >
                  <Plus className="h-3 w-3" />
                  Log Eco Action
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}
