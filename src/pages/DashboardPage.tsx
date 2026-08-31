import { Link } from "react-router-dom"
import { ArrowRight, CheckCircle2, FolderGit2, Sparkles, Wrench } from "lucide-react"
import { Card } from "@/components/ui/Card"
import { Button } from "@/components/ui/Button"
import { StatCard } from "@/features/dashboard/StatCard"
import { ProofStrengthCard } from "@/features/dashboard/ProofStrengthCard"
import { CaseListItem } from "@/features/debug-cases/CaseListItem"
import { SkillBar } from "@/features/skills/SkillBar"
import { useCurrentUser, useDashboardStats, useDebugCases, useSkills } from "@/hooks/queries"

export function DashboardPage() {
  const { data: user } = useCurrentUser()
  const { data: stats } = useDashboardStats()
  const { data: cases } = useDebugCases()
  const { data: skills } = useSkills()

  const recent = (cases ?? []).slice(0, 3)
  const topSkills = (skills ?? []).slice(0, 5)
  const maxSkill = Math.max(1, ...(skills ?? []).map((s) => s.caseCount))

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">
            Welcome back, {user?.name.split(" ")[0] ?? "Alex"}
          </h1>
          <p className="mt-1 text-sm text-muted">
            Here&apos;s the evidence you&apos;ve built so far.
          </p>
        </div>
        <Link to="/debug-cases/new">
          <Button>
            <Wrench className="h-4 w-4" />
            New Debug Case
          </Button>
        </Link>
      </div>

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard icon={Wrench} value={stats?.totalCases ?? 0} label="Debug Cases" />
        <StatCard icon={CheckCircle2} value={stats?.verifiedCases ?? 0} label="Verified Cases" />
        <StatCard icon={Sparkles} value={stats?.skillsDemonstrated ?? 0} label="Skills Demonstrated" />
        <StatCard icon={FolderGit2} value={stats?.projects ?? 0} label="Projects" />
      </div>

      <ProofStrengthCard score={stats?.proofStrength ?? 0} />

      <div className="grid gap-6 lg:grid-cols-[1.6fr_1fr]">
        <section>
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-sm font-medium">Recent Debug Cases</h2>
            <Link
              to="/debug-cases"
              className="inline-flex items-center gap-1 text-[13px] text-muted transition-colors hover:text-foreground"
            >
              View all
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
          <Card className="divide-y divide-border overflow-hidden">
            {recent.map((c) => (
              <CaseListItem key={c.id} item={c} />
            ))}
          </Card>
        </section>

        <section>
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-sm font-medium">Skills Backed by Evidence</h2>
            <Link
              to="/skills"
              className="inline-flex items-center gap-1 text-[13px] text-muted transition-colors hover:text-foreground"
            >
              All skills
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
          <Card className="space-y-4 p-5">
            {topSkills.map((s) => (
              <SkillBar key={s.id} skill={s} max={maxSkill} />
            ))}
            <div className="flex items-center gap-3 border-t border-border pt-3 text-[11px] text-muted-2">
              <span className="inline-flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-accent" /> Verified
              </span>
              <span className="inline-flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-primary/40" /> Total cases
              </span>
            </div>
          </Card>
        </section>
      </div>
    </div>
  )
}
