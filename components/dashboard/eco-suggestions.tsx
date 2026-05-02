"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Lightbulb, RefreshCw, Leaf, Droplets, Zap, ShoppingBag, Utensils, Car } from "lucide-react"
import { cn } from "@/lib/utils"

interface Suggestion {
  id: string
  title: string
  description: string
  impact: string
  category: "energy" | "water" | "transport" | "food" | "shopping" | "general"
  icon: React.ReactNode
}

const allSuggestions: Suggestion[] = [
  {
    id: "1",
    title: "Unplug Electronics When Not in Use",
    description: "Standby power can account for 10% of your electricity bill. Unplug chargers and devices when not in use.",
    impact: "Save up to 100 kg CO2/year",
    category: "energy",
    icon: <Zap className="h-5 w-5" />,
  },
  {
    id: "2",
    title: "Take Shorter Showers",
    description: "Reducing your shower time by 2 minutes can save up to 10 gallons of water per shower.",
    impact: "Save 3,650 gallons/year",
    category: "water",
    icon: <Droplets className="h-5 w-5" />,
  },
  {
    id: "3",
    title: "Choose Local Produce",
    description: "Buying locally grown food reduces transportation emissions and supports local farmers.",
    impact: "Reduce food miles by 1,500+",
    category: "food",
    icon: <Utensils className="h-5 w-5" />,
  },
  {
    id: "4",
    title: "Carpool or Use Public Transit",
    description: "Sharing rides or using public transportation significantly reduces your carbon footprint.",
    impact: "Save 2+ tons CO2/year",
    category: "transport",
    icon: <Car className="h-5 w-5" />,
  },
  {
    id: "5",
    title: "Bring Reusable Bags Shopping",
    description: "A single reusable bag can replace hundreds of plastic bags over its lifetime.",
    impact: "Prevent 500+ plastic bags/year",
    category: "shopping",
    icon: <ShoppingBag className="h-5 w-5" />,
  },
  {
    id: "6",
    title: "Plant Native Species",
    description: "Native plants require less water and provide habitat for local wildlife.",
    impact: "Support local ecosystem",
    category: "general",
    icon: <Leaf className="h-5 w-5" />,
  },
  {
    id: "7",
    title: "Air Dry Your Clothes",
    description: "Skip the dryer when possible. Air drying reduces energy consumption significantly.",
    impact: "Save 700 lbs CO2/year",
    category: "energy",
    icon: <Zap className="h-5 w-5" />,
  },
  {
    id: "8",
    title: "Eat More Plant-Based Meals",
    description: "Even one meatless day per week can make a significant environmental impact.",
    impact: "Save 100+ kg CO2/year",
    category: "food",
    icon: <Utensils className="h-5 w-5" />,
  },
]

const categoryColors: Record<string, string> = {
  energy: "bg-amber-100 text-amber-700",
  water: "bg-sky-100 text-sky-700",
  transport: "bg-violet-100 text-violet-700",
  food: "bg-lime-100 text-lime-700",
  shopping: "bg-rose-100 text-rose-700",
  general: "bg-emerald-100 text-emerald-700",
}

export function EcoSuggestions() {
  const [suggestions, setSuggestions] = useState<Suggestion[]>([])
  const [isRefreshing, setIsRefreshing] = useState(false)

  const getRandomSuggestions = () => {
    const shuffled = [...allSuggestions].sort(() => 0.5 - Math.random())
    return shuffled.slice(0, 3)
  }

  const refreshSuggestions = () => {
    setIsRefreshing(true)
    setTimeout(() => {
      setSuggestions(getRandomSuggestions())
      setIsRefreshing(false)
    }, 300)
  }

  useEffect(() => {
    setSuggestions(getRandomSuggestions())
  }, [])

  return (
    <Card className="border-0 shadow-sm">
      <CardHeader className="flex flex-row items-center justify-between pb-3">
        <CardTitle className="flex items-center gap-2 text-lg font-semibold">
          <Lightbulb className="h-5 w-5 text-amber-500" />
          Eco Suggestions
        </CardTitle>
        <Button 
          variant="ghost" 
          size="icon" 
          className="h-8 w-8"
          onClick={refreshSuggestions}
          disabled={isRefreshing}
        >
          <RefreshCw className={cn("h-4 w-4", isRefreshing && "animate-spin")} />
        </Button>
      </CardHeader>
      <CardContent className="space-y-3">
        {suggestions.map((suggestion) => (
          <div key={suggestion.id} className="rounded-lg bg-secondary/50 p-3">
            <div className="flex items-start gap-3">
              <div className={cn("rounded-lg p-2", categoryColors[suggestion.category])}>
                {suggestion.icon}
              </div>
              <div className="flex-1 space-y-1">
                <p className="text-sm font-medium text-foreground">{suggestion.title}</p>
                <p className="text-xs leading-relaxed text-muted-foreground">
                  {suggestion.description}
                </p>
                <p className="text-xs font-medium text-primary">{suggestion.impact}</p>
              </div>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}
