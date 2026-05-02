import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Trash2, Bike, Train, Recycle, ShoppingBag, Utensils } from "lucide-react"
import { cn } from "@/lib/utils"

const actionIcons: Record<string, React.ReactNode> = {
  cleanup: <Trash2 className="h-5 w-5" />,
  cycling: <Bike className="h-5 w-5" />,
  publicTransport: <Train className="h-5 w-5" />,
  recycling: <Recycle className="h-5 w-5" />,
  sustainableShopping: <ShoppingBag className="h-5 w-5" />,
  vegMeal: <Utensils className="h-5 w-5" />,
}

const actionColors: Record<string, string> = {
  cleanup: "bg-emerald-100 text-emerald-600",
  cycling: "bg-sky-100 text-sky-600",
  publicTransport: "bg-violet-100 text-violet-600",
  recycling: "bg-amber-100 text-amber-600",
  sustainableShopping: "bg-rose-100 text-rose-600",
  vegMeal: "bg-lime-100 text-lime-600",
}

export interface Action {
  id: string
  type: string
  title: string
  date: string
  points: number
  co2Saved: number
}

interface RecentActionsProps {
  actions: Action[]
}

export function RecentActions({ actions }: RecentActionsProps) {
  return (
    <Card className="border-0 shadow-sm">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg font-semibold">Recent Actions</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {actions.length === 0 ? (
          <p className="py-8 text-center text-sm text-muted-foreground">
            No actions logged yet. Start tracking your eco-friendly activities!
          </p>
        ) : (
          actions.map((action) => (
            <div
              key={action.id}
              className="flex items-center justify-between rounded-lg bg-secondary/50 p-4"
            >
              <div className="flex items-center gap-3">
                <div className={cn("rounded-lg p-2", actionColors[action.type] || "bg-primary/10 text-primary")}>
                  {actionIcons[action.type] || <Recycle className="h-5 w-5" />}
                </div>
                <div>
                  <p className="font-medium text-foreground">{action.title}</p>
                  <p className="text-sm text-muted-foreground">{action.date}</p>
                </div>
              </div>
              <div className="text-right">
                <Badge className="bg-primary text-primary-foreground">
                  +{action.points} pts
                </Badge>
                <p className="mt-1 text-sm text-muted-foreground">
                  {action.co2Saved} kg CO₂
                </p>
              </div>
            </div>
          ))
        )}
      </CardContent>
    </Card>
  )
}
