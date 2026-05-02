"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { Bar, BarChart, XAxis, YAxis, CartesianGrid } from "recharts"
import { BarChart3 } from "lucide-react"

interface WeeklyChartProps {
  data?: { day: string; impact: number }[]
}

const emptyChartData = [
  { day: "Sun", impact: 0 },
  { day: "Mon", impact: 0 },
  { day: "Tue", impact: 0 },
  { day: "Wed", impact: 0 },
  { day: "Thu", impact: 0 },
  { day: "Fri", impact: 0 },
  { day: "Sat", impact: 0 },
]

const chartConfig = {
  impact: {
    label: "CO2 Saved (kg)",
    color: "var(--primary)",
  },
}

export function WeeklyChart({ data }: WeeklyChartProps) {
  const chartData = data || emptyChartData
  const hasData = chartData.some(d => d.impact > 0)

  return (
    <Card className="border-0 shadow-sm">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-semibold">Weekly Impact</CardTitle>
      </CardHeader>
      <CardContent>
        {!hasData ? (
          <div className="flex h-[250px] flex-col items-center justify-center">
            <BarChart3 className="h-12 w-12 text-muted-foreground/50" />
            <p className="mt-4 text-sm text-muted-foreground">No activity this week</p>
            <p className="text-xs text-muted-foreground">
              Log an eco-action to see your impact here
            </p>
          </div>
        ) : (
          <ChartContainer config={chartConfig} className="h-[250px] w-full">
            <BarChart data={chartData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border)" />
              <XAxis 
                dataKey="day" 
                tickLine={false} 
                axisLine={false}
                tick={{ fontSize: 12, fill: "var(--muted-foreground)" }}
              />
              <YAxis 
                tickLine={false} 
                axisLine={false}
                tick={{ fontSize: 12, fill: "var(--muted-foreground)" }}
              />
              <ChartTooltip 
                content={<ChartTooltipContent />}
                cursor={{ fill: "var(--muted)", opacity: 0.3 }}
              />
              <Bar 
                dataKey="impact" 
                fill="var(--primary)" 
                radius={[4, 4, 0, 0]}
                maxBarSize={40}
              />
            </BarChart>
          </ChartContainer>
        )}
      </CardContent>
    </Card>
  )
}
