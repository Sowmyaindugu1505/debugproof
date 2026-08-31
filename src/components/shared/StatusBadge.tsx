import { CheckCircle2, CircleDashed } from "lucide-react"
import { Badge } from "@/components/ui/Badge"
import type { CaseStatus } from "@/types"

export function StatusBadge({ status }: { status: CaseStatus }) {
  if (status === "Verified") {
    return (
      <Badge tone="accent">
        <CheckCircle2 className="h-3 w-3" strokeWidth={2.2} />
        Verified
      </Badge>
    )
  }
  return (
    <Badge tone="neutral">
      <CircleDashed className="h-3 w-3" strokeWidth={2.2} />
      Draft
    </Badge>
  )
}
