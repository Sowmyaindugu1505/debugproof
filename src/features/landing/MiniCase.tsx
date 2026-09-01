import { CheckCircle2 } from "lucide-react"
import { Badge } from "@/components/ui/Badge"
import { CodeBlock } from "@/components/shared/CodeBlock"
import { TrustBadge } from "@/components/shared/TrustBadge"
import { ProofScore } from "@/components/shared/ProofScore"

/**
 * A realistic miniature debugging case used in the hero. It is intentionally
 * compact but shows the real narrative: problem → evidence → code → verification.
 */
export function MiniCase() {
  return (
    <div className="overflow-hidden rounded-xl border border-border bg-surface shadow-2xl shadow-black/40">
      <div className="flex items-center justify-between border-b border-border bg-surface-2 px-4 py-3">
        <div className="min-w-0">
          <p className="truncate text-[13px] font-medium">API Response Mapping Bug</p>
          <p className="font-mono text-[11px] text-muted-2">Patient Dashboard · React</p>
        </div>
        <ProofScore score={92} size="sm" showLabel={false} />
      </div>

      <div className="space-y-3.5 p-4">
        <div className="flex items-start gap-3">
          <span className="mt-0.5 font-mono text-[11px] text-primary">01</span>
          <div className="min-w-0">
            <p className="text-[11px] font-medium uppercase tracking-wider text-muted-2">Problem</p>
            <p className="text-[13px] leading-relaxed text-foreground/85">
              Profile page stayed empty even though the request returned 200 OK.
            </p>
          </div>
        </div>

        <div className="flex items-start gap-3">
          <span className="mt-0.5 font-mono text-[11px] text-primary">02</span>
          <div className="min-w-0 flex-1">
            <div className="mb-1.5 flex items-center gap-2">
              <p className="text-[11px] font-medium uppercase tracking-wider text-muted-2">
                Evidence
              </p>
              <TrustBadge level="Verified Evidence" />
            </div>
            <CodeBlock
              language="json"
              code={'GET /api/profile → 200 OK\n{\n  "data": { "user": { "name": "Alex" } }\n}'}
            />
          </div>
        </div>

        <div className="flex items-start gap-3">
          <span className="mt-0.5 font-mono text-[11px] text-primary">05</span>
          <div className="min-w-0 flex-1">
            <p className="mb-1.5 text-[11px] font-medium uppercase tracking-wider text-muted-2">
              Fix
            </p>
            <CodeBlock
              language="ts"
              code={"- const user = response.user\n+ const user = response.data?.user"}
            />
          </div>
        </div>

        <div className="flex items-center gap-2 rounded-lg border border-border bg-accent-soft/40 px-3 py-2">
          <CheckCircle2 className="h-4 w-4 text-accent" />
          <span className="text-[12px] text-accent">Demo evidence · example CI verification</span>
          <Badge tone="neutral" className="ml-auto">
            Medium
          </Badge>
        </div>
      </div>
    </div>
  )
}
