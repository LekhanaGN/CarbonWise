import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Trash2, Bike, Train, Recycle, TreePine, Zap, Bus, Activity } from "lucide-react"
import { cn } from "@/lib/utils"

const categoryIcons: Record<string, React.ReactNode> = {
  Cleanup: <Trash2 className="h-5 w-5" />,
  Recycling: <Recycle className="h-5 w-5" />,
  Transportation: <Bus className="h-5 w-5" />,
  Planting: <TreePine className="h-5 w-5" />,
  Energy: <Zap className="h-5 w-5" />,
}

const categoryColors: Record<string, string> = {
  Cleanup: "bg-rose-100 text-rose-600",
  Recycling: "bg-emerald-100 text-emerald-600",
  Transportation: "bg-sky-100 text-sky-600",
  Planting: "bg-lime-100 text-lime-600",
  Energy: "bg-amber-100 text-amber-600",
}

export interface Action {
  id: string
  title: string
  timestamp: Date
  points: number
  co2Saved: number
  category: string
}

interface RecentActionsProps {
  actions: Action[]
}

export function RecentActions({ actions }: RecentActionsProps) {
  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
    }).format(date)
  }

  return (
    <Card className="border-0 shadow-sm">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg font-semibold">Recent Actions</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {actions.length === 0 ? (
          <div className="py-8 text-center">
            <Activity className="mx-auto h-10 w-10 text-muted-foreground/50" />
            <p className="mt-2 text-sm text-muted-foreground">
              No actions logged yet
            </p>
            <p className="text-xs text-muted-foreground">
              Start tracking your eco-friendly activities!
            </p>
          </div>
        ) : (
          actions.map((action) => (
            <div
              key={action.id}
              className="flex items-center justify-between rounded-lg bg-secondary/50 p-4"
            >
              <div className="flex items-center gap-3">
                <div className={cn("rounded-lg p-2", categoryColors[action.category] || "bg-primary/10 text-primary")}>
                  {categoryIcons[action.category] || <Recycle className="h-5 w-5" />}
                </div>
                <div>
                  <p className="font-medium text-foreground">{action.title}</p>
                  <p className="text-sm text-muted-foreground">{formatDate(action.timestamp)}</p>
                </div>
              </div>
              <div className="text-right">
                <Badge className="bg-primary text-primary-foreground">
                  +{action.points} pts
                </Badge>
                <p className="mt-1 text-sm text-muted-foreground">
                  {action.co2Saved} kg CO2
                </p>
              </div>
            </div>
          ))
        )}
      </CardContent>
    </Card>
  )
}
