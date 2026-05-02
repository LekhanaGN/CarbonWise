"use client"

import { useState, useEffect, useRef } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Sidebar } from "@/components/dashboard/sidebar"
import { getState, logAction, type AppState } from "@/lib/store"
<<<<<<< HEAD
import JSZip from "jszip"
=======
>>>>>>> b40f630abe6a884a2cdcc4c0e7b4051eca44b50b
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
<<<<<<< HEAD
    co2PerHour: 0.036, // 36g per hour
    co2PerSecond: 0.00001, // For visible demo - 0.01g per second (36g/hour)
=======
    co2PerHour: 0.036,
>>>>>>> b40f630abe6a884a2cdcc4c0e7b4051eca44b50b
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
<<<<<<< HEAD
    co2PerHour: 0.055, // 55g per hour
    co2PerSecond: 0.000015, // For visible demo
=======
    co2PerHour: 0.055,
>>>>>>> b40f630abe6a884a2cdcc4c0e7b4051eca44b50b
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
<<<<<<< HEAD
    console.log("[v0] Streaming effect triggered, streamingActive:", streamingActive)
    
    if (streamingActive) {
      console.log("[v0] Starting streaming timer")
      streamingIntervalRef.current = setInterval(() => {
        setStreamingSeconds(prev => {
          console.log("[v0] Timer tick, seconds:", prev + 1)
          return prev + 1
        })
      }, 1000)
    } else {
      if (streamingIntervalRef.current) {
        console.log("[v0] Clearing streaming timer")
=======
    if (streamingActive) {
      streamingIntervalRef.current = setInterval(() => {
        setStreamingSeconds(prev => prev + 1)
      }, 1000)
    } else {
      if (streamingIntervalRef.current) {
>>>>>>> b40f630abe6a884a2cdcc4c0e7b4051eca44b50b
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
<<<<<<< HEAD
    // co2PerHour is in kg, convert to grams for display then back to kg
    const co2InGrams = (seconds / 3600) * (co2PerHour * 1000)
    // Return in kg with 4 decimal places
    return (co2InGrams / 1000).toFixed(4)
  }

  const calculateStreamingCO2InGrams = (seconds: number, co2PerHour: number) => {
    // Display in grams for better visibility
    return ((seconds / 3600) * (co2PerHour * 1000)).toFixed(2)
=======
    const hours = seconds / 3600
    return (hours * co2PerHour).toFixed(4)
>>>>>>> b40f630abe6a884a2cdcc4c0e7b4051eca44b50b
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

<<<<<<< HEAD
  const downloadExtension = async () => {
    const zip = new JSZip()
    const chromeExtFolder = zip.folder("chrome-extension")

    // Create manifest
    const manifest = {
      manifest_version: 3,
      name: "CarbonWise - Track Your Carbon Footprint",
      version: "1.0",
      description: "Track your carbon impact in real-time across popular websites",
      permissions: ["activeTab", "scripting", "storage"],
      background: {
        service_worker: "background.js"
      },
      action: {
        default_title: "CarbonWise",
        default_popup: "popup.html",
        default_icon: "icons/icon-48.png"
      },
      icons: {
        "16": "icons/icon-16.png",
        "48": "icons/icon-48.png",
        "128": "icons/icon-128.png"
      },
      content_scripts: [
        {
          matches: [
            "https://www.amazon.com/*",
            "https://www.flipkart.com/*",
            "https://www.swiggy.in/*",
            "https://www.zomato.com/*",
            "https://www.uber.com/*",
            "https://www.olacabs.com/*",
            "https://www.makemytrip.com/*",
            "https://www.youtube.com/*",
            "https://www.netflix.com/*"
          ],
          js: ["content-scripts/tracker.js"]
        }
      ],
      host_permissions: [
        "https://www.amazon.com/*",
        "https://www.flipkart.com/*",
        "https://www.swiggy.in/*",
        "https://www.zomato.com/*",
        "https://www.uber.com/*",
        "https://www.olacabs.com/*",
        "https://www.makemytrip.com/*",
        "https://www.youtube.com/*",
        "https://www.netflix.com/*"
      ]
    }

    // Create popup HTML
    const popupHtml = `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <link rel="stylesheet" href="popup.css">
</head>
<body>
  <div class="container">
    <h2>CarbonWise</h2>
    <p>Track your carbon footprint</p>
    
    <div class="stats">
      <div class="stat">
        <span class="label">Today's Impact</span>
        <span class="value" id="todayImpact">0 g CO₂</span>
      </div>
      <div class="stat">
        <span class="label">Total Points</span>
        <span class="value" id="totalPoints">0</span>
      </div>
    </div>

    <div class="sites-header">Tracked Sites</div>
    <div class="site">📦 Amazon - E-commerce</div>
    <div class="site">🍔 Swiggy & Zomato - Food Delivery</div>
    <div class="site">🚗 Uber & Ola - Transport</div>
    <div class="site">✈️ MakeMyTrip - Flights</div>
    <div class="site">📺 YouTube & Netflix - Streaming</div>

    <button id="viewDashboard" class="btn-primary">View Dashboard</button>
  </div>
  <script src="popup.js"><\/script>
</body>
</html>`

    // Create popup CSS
    const popupCss = `* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  width: 400px;
  background: #f8f9fa;
  color: #1a1a1a;
}

.container {
  padding: 20px;
}

h2 {
  color: #1e7c34;
  margin-bottom: 8px;
  font-size: 20px;
}

p {
  color: #666;
  margin-bottom: 16px;
  font-size: 14px;
}

.stats {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
  margin-bottom: 20px;
}

.stat {
  background: white;
  padding: 12px;
  border-radius: 6px;
  border-left: 3px solid #1e7c34;
}

.stat .label {
  display: block;
  font-size: 12px;
  color: #999;
  margin-bottom: 4px;
}

.stat .value {
  display: block;
  font-size: 18px;
  font-weight: bold;
  color: #1e7c34;
}

.sites-header {
  font-weight: 600;
  color: #333;
  margin: 16px 0 8px 0;
  font-size: 13px;
}

.site {
  padding: 10px 12px;
  margin: 6px 0;
  background: white;
  border-left: 4px solid #1e7c34;
  border-radius: 4px;
  font-size: 13px;
  cursor: pointer;
  transition: all 0.2s;
}

.site:hover {
  background: #f0f0f0;
  transform: translateX(2px);
}

.btn-primary {
  width: 100%;
  padding: 10px;
  margin-top: 16px;
  background: #1e7c34;
  color: white;
  border: none;
  border-radius: 4px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-primary:hover {
  background: #1a6428;
}

.btn-primary:active {
  transform: scale(0.98);
}`

    // Create popup JS
    const popupJs = `document.addEventListener('DOMContentLoaded', () => {
  // Load stats from storage
  chrome.storage.local.get(['carbonData'], (result) => {
    const data = result.carbonData || {};
    const today = new Date().toISOString().split('T')[0];
    const todayData = data[today] || {};
    
    let totalImpact = 0;
    Object.values(todayData).forEach(count => {
      totalImpact += count * 0.5; // Estimate CO2 per action
    });
    
    document.getElementById('todayImpact').textContent = totalImpact.toFixed(1) + ' g CO₂';
    document.getElementById('totalPoints').textContent = Math.floor(totalImpact * 10);
  });

  // Navigate to dashboard
  document.getElementById('viewDashboard').addEventListener('click', () => {
    chrome.tabs.create({ url: 'https://carbonwise.app/dashboard' });
  });
});`

    // Create background service worker
    const backgroundJs = `chrome.runtime.onInstalled.addListener(() => {
  console.log('CarbonWise extension installed');
});

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.status === 'complete') {
    console.log('Tab loaded:', tab.url);
  }
});`

    // Create content script for tracking
    const trackerJs = `console.log('CarbonWise tracker loaded on:', window.location.hostname);

// Track page load
document.addEventListener('DOMContentLoaded', () => {
  const hostname = window.location.hostname;
  console.log('CarbonWise tracking carbon impact on:', hostname);
  
  // Store data in chrome storage
  chrome.storage.local.get(['carbonData'], (result) => {
    const data = result.carbonData || {};
    const today = new Date().toISOString().split('T')[0];
    
    if (!data[today]) data[today] = {};
    if (!data[today][hostname]) data[today][hostname] = 0;
    
    data[today][hostname]++;
    chrome.storage.local.set({ carbonData: data });
  });
});

// Send message to popup
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'getData') {
    chrome.storage.local.get(['carbonData'], (result) => {
      sendResponse({ data: result.carbonData || {} });
    });
    return true;
  }
});`

    // Create README
    const readme = `# CarbonWise Chrome Extension

Track your carbon footprint while browsing the web.

## Installation

1. Extract this ZIP file to get the \`chrome-extension\` folder
2. Open Chrome and go to \`chrome://extensions/\`
3. Enable "Developer mode" (toggle in the top-right corner)
4. Click "Load unpacked"
5. Select the \`chrome-extension\` folder and click "Select Folder"

## What's Inside

\`\`\`
chrome-extension/
├── content-scripts/
│   └── tracker.js          # Content script that tracks visits
├── icons/
│   ├── icon-16.png
│   ├── icon-48.png
│   └── icon-128.png
├── background.js           # Service worker for background tasks
├── manifest.json           # Extension configuration
├── popup.html             # Extension popup interface
├── popup.css              # Popup styling
├── popup.js               # Popup functionality
└── README.md              # This file
\`\`\`

## Features

- Real-time carbon tracking across popular websites
- Earn eco-points for sustainable choices
- View your impact over time
- Get personalized eco-tips
- Track visits to supported sites

## Supported Sites

- Amazon
- Flipkart
- Swiggy
- Zomato
- Uber
- Ola Cabs
- MakeMyTrip
- YouTube
- Netflix

## How It Works

The extension tracks your browsing activity on supported websites and calculates your carbon footprint. Each action is assigned eco-points based on its environmental impact.

Your data is stored locally in Chrome storage and synced with your CarbonWise dashboard.

## Troubleshooting

If the extension doesn't appear:
1. Make sure "Developer mode" is enabled
2. Try reloading the extension
3. Clear Chrome cache and reload

For more help, visit carbonwise.app/support`

    // Add all files to the zip
    chromeExtFolder?.file("manifest.json", JSON.stringify(manifest, null, 2))
    chromeExtFolder?.file("popup.html", popupHtml)
    chromeExtFolder?.file("popup.css", popupCss)
    chromeExtFolder?.file("popup.js", popupJs)
    chromeExtFolder?.file("background.js", backgroundJs)
    chromeExtFolder?.file("README.md", readme)

    // Create content-scripts folder and add tracker
    const contentScriptsFolder = chromeExtFolder?.folder("content-scripts")
    contentScriptsFolder?.file("tracker.js", trackerJs)

    // Create icons folder with placeholder SVG icons
    const iconsFolder = chromeExtFolder?.folder("icons")
    const iconSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 128 128">
  <circle cx="64" cy="64" r="60" fill="#1e7c34"/>
  <text x="64" y="75" font-size="60" font-weight="bold" fill="white" text-anchor="middle">C</text>
</svg>`
    
    iconsFolder?.file("icon-16.png", await generateIconPng(16))
    iconsFolder?.file("icon-48.png", await generateIconPng(48))
    iconsFolder?.file("icon-128.png", await generateIconPng(128))

    // Generate and download zip
    const blob = await zip.generateAsync({ type: "blob" })
    const url = window.URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.href = url
    link.download = "CarbonWise-Extension.zip"
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    window.URL.revokeObjectURL(url)
  }

  // Helper function to generate simple PNG icons
  const generateIconPng = async (size: number): Promise<Blob> => {
    const canvas = document.createElement('canvas')
    canvas.width = size
    canvas.height = size
    const ctx = canvas.getContext('2d')
    
    if (ctx) {
      ctx.fillStyle = '#1e7c34'
      ctx.fillRect(0, 0, size, size)
      ctx.fillStyle = 'white'
      ctx.font = `bold ${Math.floor(size * 0.6)}px Arial`
      ctx.textAlign = 'center'
      ctx.textBaseline = 'middle'
      ctx.fillText('C', size / 2, size / 2)
    }
    
    return new Promise(resolve => {
      canvas.toBlob(blob => {
        resolve(blob || new Blob())
      }, 'image/png')
    })
=======
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
>>>>>>> b40f630abe6a884a2cdcc4c0e7b4051eca44b50b
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
<<<<<<< HEAD
                      CO2: {calculateStreamingCO2InGrams(streamingSeconds, activeSite.co2PerHour || 0.036)}g
=======
                      CO2: {calculateStreamingCO2(streamingSeconds, activeSite.co2PerHour || 0.036)} kg
>>>>>>> b40f630abe6a884a2cdcc4c0e7b4051eca44b50b
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
<<<<<<< HEAD
                  ~{notificationData.isStreaming 
                    ? `${(notificationData.co2 * 1000).toFixed(2)}g` 
                    : `${notificationData.co2} kg`} CO2
=======
                  ~{notificationData.co2} kg CO2
>>>>>>> b40f630abe6a884a2cdcc4c0e7b4051eca44b50b
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
