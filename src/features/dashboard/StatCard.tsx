import type { LucideIcon } from "lucide-react"
import { Card } from "@/components/ui/Card"

export function StatCard({
  icon: Icon,
  value,
  label,
}: {
  icon: LucideIcon
  value: number | string
  label: string
}) {
  return (
    <Card className="p-5">
      <div className="flex items-center justify-between">
        <span className="text-3xl font-semibold tracking-tight tabular-nums">{value}</span>
        <span className="flex h-8 w-8 items-center justify-center rounded-lg border border-border bg-surface-2 text-muted">
          <Icon className="h-4 w-4" />
        </span>
      </div>
      <p className="mt-1 text-[13px] text-muted">{label}</p>
    </Card>
  )
}
