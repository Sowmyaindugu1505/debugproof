import { Link } from "react-router-dom"
import { CheckCircle2, ExternalLink, Star, Wrench } from "lucide-react"
import { Card } from "@/components/ui/Card"
import { TechTag } from "@/components/shared/TechTag"
import type { Project } from "@/types"

export function ProjectCard({ project }: { project: Project }) {
  return (
    <Card className="flex flex-col p-5 transition-colors hover:border-border-strong">
      <div className="flex items-start justify-between gap-3">
        <Link to={`/projects/${project.id}`} className="min-w-0">
          <h3 className="truncate text-[15px] font-medium hover:text-primary">{project.name}</h3>
          <p className="mt-1 line-clamp-2 text-[13px] leading-relaxed text-muted">
            {project.description}
          </p>
        </Link>
        <a
          href={project.githubUrl}
          target="_blank"
          rel="noreferrer"
          className="shrink-0 text-muted-2 transition-colors hover:text-foreground"
          aria-label={`Open ${project.name} on GitHub`}
        >
          <ExternalLink className="h-4 w-4" />
        </a>
      </div>

      <div className="mt-4 flex flex-wrap gap-1.5">
        {project.technologies.map((t) => (
          <TechTag key={t} label={t} />
        ))}
      </div>

      <div className="mt-5 flex items-center gap-4 border-t border-border pt-4 text-[13px]">
        <span className="inline-flex items-center gap-1.5 text-muted">
          <Wrench className="h-3.5 w-3.5" />
          <span className="font-medium text-foreground">{project.caseCount}</span> cases
        </span>
        <span className="inline-flex items-center gap-1.5 text-muted">
          <CheckCircle2 className="h-3.5 w-3.5 text-accent" />
          <span className="font-medium text-foreground">{project.verifiedCount}</span> verified
        </span>
        <span className="ml-auto inline-flex items-center gap-1.5 text-muted-2">
          <Star className="h-3.5 w-3.5" />
          {project.stars}
        </span>
      </div>
    </Card>
  )
}
