"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Plus, Gift, Lightbulb } from "lucide-react"
import Link from "next/link"

// Eco tips that rotate
const ecoTips = [
  "Did you know? Recycling one aluminum can saves enough energy to power a TV for 3 hours!",
  "Switching to LED bulbs can reduce your lighting energy use by up to 75%.",
  "A single tree can absorb up to 48 pounds of CO2 per year.",
  "Taking a 5-minute shower instead of 10 minutes saves up to 12.5 gallons of water.",
  "Carpooling just twice a week can reduce your carbon emissions by 1,600 pounds per year.",
  "Composting food scraps can divert up to 30% of household waste from landfills.",
  "Using a reusable water bottle can save an average of 156 plastic bottles per year.",
  "Turning off your computer at night can save up to $100 in electricity annually.",
]

export function RightSidebar() {
  const [currentTip, setCurrentTip] = useState("")

  useEffect(() => {
    // Get a random tip on mount
    const randomTip = ecoTips[Math.floor(Math.random() * ecoTips.length)]
    setCurrentTip(randomTip)
  }, [])

  return (
    <div className="space-y-4">
      {/* Quick Start */}
      <Card className="border-0 bg-primary shadow-sm">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg font-semibold text-primary-foreground">
            Quick Start
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <Link href="/log-action">
            <Button 
              variant="secondary" 
              className="w-full justify-start gap-2 bg-white/95 text-foreground hover:bg-white"
            >
              <Plus className="h-4 w-4" />
              Log New Action
            </Button>
          </Link>
          <Link href="/rewards">
            <Button 
              variant="secondary" 
              className="w-full justify-start gap-2 bg-white/95 text-foreground hover:bg-white"
            >
              <Gift className="h-4 w-4" />
              Browse Rewards
            </Button>
          </Link>
        </CardContent>
      </Card>

      {/* Eco Tip of the Day */}
      <Card className="border-0 shadow-sm">
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center gap-2 text-base font-semibold">
            <Lightbulb className="h-5 w-5 text-amber-500" />
            Eco Tip of the Day
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm leading-relaxed text-muted-foreground">
            {currentTip}
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
