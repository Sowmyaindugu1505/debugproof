import { Card } from "@/components/ui/Card"
import { ProofScore } from "@/components/shared/ProofScore"

const factors = [
  { label: "Verified evidence", value: 82 },
  { label: "Code & commits attached", value: 91 },
  { label: "Investigation depth", value: 76 },
  { label: "Skill coverage", value: 88 },
]

export function ProofStrengthCard({ score }: { score: number }) {
  return (
    <Card className="p-6">
      <div className="flex flex-col gap-6 sm:flex-row sm:items-center">
        <div className="flex items-center gap-5">
          <ProofScore score={score} size="lg" showLabel={false} />
          <div>
            <h2 className="text-sm font-medium">Proof Strength</h2>
            <p className="mt-1 max-w-xs text-[13px] leading-relaxed text-muted">
              A weighted signal of how well your cases are backed by real, verifiable evidence.
            </p>
          </div>
        </div>

        <div className="flex-1 space-y-3 sm:border-l sm:border-border sm:pl-6">
          {factors.map((f) => (
            <div key={f.label}>
              <div className="mb-1 flex items-center justify-between text-[12px]">
                <span className="text-muted">{f.label}</span>
                <span className="tabular-nums text-foreground/80">{f.value}</span>
              </div>
              <div className="h-1.5 overflow-hidden rounded-full bg-surface-2">
                <div
                  className="h-full rounded-full bg-primary transition-all duration-700"
                  style={{ width: `${f.value}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </Card>
  )
}
