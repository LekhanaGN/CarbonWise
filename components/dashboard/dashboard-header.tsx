import { Button } from "@/components/ui/button"
import { Plus, Sprout } from "lucide-react"
import Link from "next/link"

interface DashboardHeaderProps {
  userName: string
}

export function DashboardHeader({ userName }: DashboardHeaderProps) {
  const displayName = userName || "Guest"
  return (
    <div className="flex items-start justify-between">
      <div>
        <h1 className="flex items-center gap-2 text-2xl font-bold text-foreground md:text-3xl">
          Welcome{userName ? ` back, ${displayName}` : ""}!
          <Sprout className="h-7 w-7 text-primary" />
        </h1>
        <p className="mt-1 text-muted-foreground">
          Track your environmental impact and earn rewards
        </p>
      </div>
      <Link href="/log-action">
        <Button className="gap-2">
          <Plus className="h-4 w-4" />
          Log Action
        </Button>
      </Link>
    </div>
  )
}
