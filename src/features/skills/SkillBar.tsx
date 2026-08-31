import type { Skill } from "@/types"

export function SkillBar({ skill, max }: { skill: Skill; max: number }) {
  const pct = Math.round((skill.caseCount / max) * 100)
  const verifiedPct = Math.round((skill.verifiedCount / max) * 100)
  return (
    <div>
      <div className="mb-1.5 flex items-center justify-between">
        <span className="text-[13px] font-medium">{skill.name}</span>
        <span className="font-mono text-[12px] text-muted-2">
          {skill.caseCount} {skill.caseCount === 1 ? "case" : "cases"}
        </span>
      </div>
      <div className="relative h-2 overflow-hidden rounded-full bg-surface-2">
        <div
          className="absolute inset-y-0 left-0 rounded-full bg-primary/40 transition-all duration-700"
          style={{ width: `${pct}%` }}
        />
        <div
          className="absolute inset-y-0 left-0 rounded-full bg-accent transition-all duration-700"
          style={{ width: `${verifiedPct}%` }}
        />
      </div>
    </div>
  )
}
