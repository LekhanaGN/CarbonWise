import { Card, CardContent } from "@/components/ui/card"
import { Trophy, Leaf, CheckCircle, Gift, TrendingUp } from "lucide-react"
import { cn } from "@/lib/utils"

interface StatCardProps {
  title: string
  value: string | number
  subtitle: string
  icon: React.ReactNode
  trend?: string
  bgColor: string
  iconBgColor: string
}

function StatCard({ title, value, subtitle, icon, trend, bgColor, iconBgColor }: StatCardProps) {
  return (
    <Card className={cn("relative overflow-hidden border-0 shadow-sm", bgColor)}>
      <CardContent className="flex items-start justify-between p-5">
        <div className="space-y-1">
          <p className="text-sm font-medium text-muted-foreground">{title}</p>
          <p className="text-3xl font-bold text-foreground">{value}</p>
          <p className="text-sm text-muted-foreground">{subtitle}</p>
          {trend && (
            <div className="flex items-center gap-1 text-sm font-medium text-primary">
              <TrendingUp className="h-3 w-3" />
              {trend}
            </div>
          )}
        </div>
        <div className={cn("rounded-full p-3", iconBgColor)}>
          {icon}
        </div>
      </CardContent>
    </Card>
  )
}

interface StatsData {
  totalPoints: number
  co2Saved: number
  actionsCompleted: number
  rewardsRedeemed: number
  weeklyTrend?: string
}

export function StatCards({ stats }: { stats: StatsData }) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <StatCard
        title="Total Points"
        value={stats.totalPoints}
        subtitle={`${stats.totalPoints} earned all-time`}
        icon={<Trophy className="h-6 w-6 text-amber-600" />}
        trend={stats.weeklyTrend}
        bgColor="bg-gradient-to-br from-amber-50 to-orange-50"
        iconBgColor="bg-amber-100"
      />
      <StatCard
        title="CO₂ Saved"
        value={`${stats.co2Saved} kg`}
        subtitle="Carbon offset"
        icon={<Leaf className="h-6 w-6 text-emerald-600" />}
        bgColor="bg-gradient-to-br from-emerald-50 to-teal-50"
        iconBgColor="bg-emerald-100"
      />
      <StatCard
        title="Actions Completed"
        value={stats.actionsCompleted}
        subtitle="Eco-friendly actions"
        icon={<CheckCircle className="h-6 w-6 text-sky-600" />}
        bgColor="bg-gradient-to-br from-sky-50 to-blue-50"
        iconBgColor="bg-sky-100"
      />
      <StatCard
        title="Rewards Redeemed"
        value={stats.rewardsRedeemed}
        subtitle="Benefits claimed"
        icon={<Gift className="h-6 w-6 text-rose-500" />}
        bgColor="bg-gradient-to-br from-rose-50 to-pink-50"
        iconBgColor="bg-rose-100"
      />
    </div>
  )
}
