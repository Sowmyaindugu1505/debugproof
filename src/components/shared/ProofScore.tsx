import { cn, scoreTone } from "@/lib/utils"

const toneText: Record<string, string> = {
  accent: "text-accent",
  warning: "text-warning",
  danger: "text-danger",
}
const toneStroke: Record<string, string> = {
  accent: "stroke-accent",
  warning: "stroke-warning",
  danger: "stroke-danger",
}

export function ProofScore({
  score,
  size = "md",
  showLabel = true,
}: {
  score: number
  size?: "sm" | "md" | "lg"
  showLabel?: boolean
}) {
  const tone = scoreTone(score)
  const dims = size === "lg" ? 96 : size === "md" ? 64 : 44
  const stroke = size === "lg" ? 7 : size === "md" ? 5 : 4
  const r = (dims - stroke) / 2
  const c = 2 * Math.PI * r
  const offset = c - (score / 100) * c
  const fontSize = size === "lg" ? "text-2xl" : size === "md" ? "text-base" : "text-xs"

  return (
    <div className="inline-flex flex-col items-center gap-1">
      <div className="relative" style={{ width: dims, height: dims }}>
        <svg width={dims} height={dims} className="-rotate-90">
          <circle
            cx={dims / 2}
            cy={dims / 2}
            r={r}
            strokeWidth={stroke}
            className="stroke-border fill-none"
          />
          <circle
            cx={dims / 2}
            cy={dims / 2}
            r={r}
            strokeWidth={stroke}
            strokeDasharray={c}
            strokeDashoffset={offset}
            strokeLinecap="round"
            className={cn("fill-none transition-all duration-700", toneStroke[tone])}
          />
        </svg>
        <div
          className={cn(
            "absolute inset-0 flex items-center justify-center font-semibold tabular-nums",
            fontSize,
            toneText[tone],
          )}
        >
          {score}
        </div>
      </div>
      {showLabel && (
        <span className="text-[11px] font-medium tracking-wide text-muted-2">Proof Score</span>
      )}
    </div>
  )
}
