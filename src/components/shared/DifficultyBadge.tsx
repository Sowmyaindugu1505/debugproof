import { Badge } from "@/components/ui/Badge"
import type { Difficulty } from "@/types"

const toneMap: Record<
  Difficulty,
  "accent" | "warning" | "danger"
> = {
  trivial: "accent",
  easy: "accent",
  medium: "warning",
  hard: "danger",
  nightmare: "danger",
}

export function DifficultyBadge({
  difficulty,
}: {
  difficulty: Difficulty
}) {
  return <Badge tone={toneMap[difficulty]}>{difficulty}</Badge>
}