import { Bot, ShieldCheck, UserCheck } from "lucide-react"
import { Badge } from "@/components/ui/Badge"
import type { TrustLevel } from "@/types"

const config: Record<
  TrustLevel,
  { tone: "ai" | "primary" | "accent"; icon: typeof Bot; label: string }
> = {
  "AI Generated": { tone: "ai", icon: Bot, label: "AI Generated" },
  "Developer Reviewed": { tone: "primary", icon: UserCheck, label: "Developer Reviewed" },
  "Verified Evidence": { tone: "accent", icon: ShieldCheck, label: "Verified Evidence" },
}

export function TrustBadge({ level }: { level: TrustLevel }) {
  const { tone, icon: Icon, label } = config[level]
  return (
    <Badge tone={tone}>
      <Icon className="h-3 w-3" strokeWidth={2.2} />
      {label}
    </Badge>
  )
}
