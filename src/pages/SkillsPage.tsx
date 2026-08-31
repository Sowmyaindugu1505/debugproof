import { PageHeader } from "../components/shared/PageHeader"
import { Card } from "../components/ui/Card"
import { Badge } from "../components/ui/Badge"
import { SkillBar } from "../features/skills/SkillBar"
import { EmptyState } from "../components/shared/EmptyState"
import { useSkills } from "../hooks/queries"
import { Layers } from "lucide-react"

export function SkillsPage() {
  const { data: skills, isLoading } = useSkills()

  const categories = ["Languages", "Frameworks", "Infrastructure", "Data"]

  return (
    <div>
      <PageHeader
        title="Verified skills"
        description="Every skill here is backed by real debug cases — not self-reported claims."
      />

      {isLoading ? (
        <div className="grid gap-4 sm:grid-cols-2">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-40 animate-pulse rounded-xl bg-muted" />
          ))}
        </div>
      ) : !skills || skills.length === 0 ? (
        <EmptyState
          icon={Layers}
          title="No verified skills yet"
          description="Document debug cases to start building your verified skill graph."
        />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2">
          {categories.map((cat) => {
            const group = skills.filter((s) => s.category === cat)
            if (group.length === 0) return null
            const maxSkillCases = Math.max(
               1,
               ...group.map((skill) => skill.caseCount),
            )
            return (
              <Card key={cat} className="p-5">
                <div className="mb-4 flex items-center justify-between">
                  <h2 className="text-sm font-semibold text-foreground">{cat}</h2>
                  <Badge variant="neutral">{group.length}</Badge>
                </div>
                <div className="flex flex-col gap-4">
                  {group.map((s) => (
                    <SkillBar key={s.name} skill={s} max={maxSkillCases} />
                  ))}
                </div>
              </Card>
            )
          })}
        </div>
      )}
    </div>
  )
}
