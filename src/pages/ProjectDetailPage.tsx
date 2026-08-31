import { Link, useParams } from "react-router-dom"
import { ArrowLeft, CheckCircle2, ExternalLink, Star, Wrench } from "lucide-react"
import { Button } from "@/components/ui/Button"
import { Card } from "@/components/ui/Card"
import { TechTag } from "@/components/shared/TechTag"
import { EmptyState } from "@/components/shared/EmptyState"
import { CaseListItem } from "@/features/debug-cases/CaseListItem"
import { useCasesByProject, useProject } from "@/hooks/queries"

export function ProjectDetailPage() {
  const { id = "" } = useParams()
  const { data: project, isLoading } = useProject(id)
  const { data: cases } = useCasesByProject(id)

  if (isLoading) {
    return <div className="h-64 animate-pulse rounded-xl border border-border bg-surface" />
  }

  if (!project) {
    return (
      <EmptyState
        icon={Wrench}
        title="Project not found"
        description="This project may have been removed or the link is incorrect."
        action={
          <Link to="/projects">
            <Button variant="outline">Back to projects</Button>
          </Link>
        }
      />
    )
  }

  return (
    <div className="space-y-6">
      <Link
        to="/projects"
        className="inline-flex items-center gap-1.5 text-sm text-muted transition-colors hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" />
        Projects
      </Link>

      <div className="flex flex-col gap-4 border-b border-border pb-6 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">{project.name}</h1>
          <p className="mt-1.5 max-w-xl text-sm text-muted">{project.description}</p>
          <div className="mt-3 flex flex-wrap items-center gap-3">
            <div className="flex flex-wrap gap-1.5">
              {project.technologies.map((t) => (
                <TechTag key={t} label={t} />
              ))}
            </div>
            <span className="inline-flex items-center gap-1.5 text-[13px] text-muted-2">
              <Star className="h-3.5 w-3.5" />
              {project.stars}
            </span>
          </div>
        </div>
        <a href={project.githubUrl} target="_blank" rel="noreferrer">
          <Button variant="outline" size="sm">
            <ExternalLink className="h-4 w-4" />
            View on GitHub
          </Button>
        </a>
      </div>

      <div className="grid grid-cols-2 gap-4 sm:max-w-md">
        <Card className="p-4">
          <div className="flex items-center gap-2 text-muted">
            <Wrench className="h-4 w-4" />
            <span className="text-[13px]">Debug Cases</span>
          </div>
          <p className="mt-2 text-2xl font-semibold tabular-nums">{project.caseCount}</p>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-2 text-muted">
            <CheckCircle2 className="h-4 w-4 text-accent" />
            <span className="text-[13px]">Verified Fixes</span>
          </div>
          <p className="mt-2 text-2xl font-semibold tabular-nums">{project.verifiedCount}</p>
        </Card>
      </div>

      <section>
        <h2 className="mb-3 text-sm font-medium">Debug Cases in this project</h2>
        {cases && cases.length > 0 ? (
          <Card className="divide-y divide-border overflow-hidden">
            {cases.map((c) => (
              <CaseListItem key={c.id} item={c} />
            ))}
          </Card>
        ) : (
          <EmptyState
            icon={Wrench}
            title="No cases yet"
            description="Create a debugging case from a commit in this repository."
            action={
              <Link to="/debug-cases/new">
                <Button>Create Debug Case</Button>
              </Link>
            }
          />
        )}
      </section>
    </div>
  )
}
