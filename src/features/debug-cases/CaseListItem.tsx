import { Link } from "react-router-dom"
import { ChevronRight } from "lucide-react"
import { DifficultyBadge } from "@/components/shared/DifficultyBadge"
import { StatusBadge } from "@/components/shared/StatusBadge"
import { TechTag } from "@/components/shared/TechTag"
import { cn, scoreTone } from "@/lib/utils"
import type { DebugCase } from "@/types"

const toneText: Record<string, string> = {
  accent: "text-accent",
  warning: "text-warning",
  danger: "text-danger",
}

export function CaseListItem({ item }: { item: DebugCase }) {
  return (
    <Link
      to={`/debug-cases/${item.id}`}
      className="group flex items-center gap-4 px-4 py-4 transition-colors hover:bg-surface-2"
    >
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-2">
          <h3 className="text-sm font-medium text-foreground group-hover:text-primary">
            {item.title}
          </h3>
          <StatusBadge status={item.status} />
        </div>
        <p className="mt-1 line-clamp-1 text-[13px] text-muted">{item.problemSummary}</p>
        <div className="mt-2.5 flex flex-wrap items-center gap-1.5">
          <span className="font-mono text-[11px] text-muted-2">{item.projectName}</span>
          <span className="text-muted-2">·</span>
          {item.skills.map((s) => (
            <TechTag key={s} label={s} />
          ))}
        </div>
      </div>

      <div className="flex items-center gap-5 pl-2">
        <DifficultyBadge difficulty={item.difficulty} />
        <div className="hidden text-right sm:block">
          <p
            className={cn(
              "text-lg font-semibold tabular-nums",
              toneText[scoreTone(item.proofScore)],
            )}
          >
            {item.proofScore}
          </p>
          <p className="text-[10px] uppercase tracking-wider text-muted-2">score</p>
        </div>
        <ChevronRight className="h-4 w-4 text-muted-2 transition-transform group-hover:translate-x-0.5 group-hover:text-foreground" />
      </div>
    </Link>
  )
}
