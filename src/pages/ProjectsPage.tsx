import { Link } from "react-router-dom"
import { Github } from "lucide-react"
import { PageHeader } from "@/components/shared/PageHeader"
import { Button } from "@/components/ui/Button"
import { ProjectCard } from "@/features/projects/ProjectCard"
import { useProjects } from "@/hooks/queries"

export function ProjectsPage() {
  const { data: projects, isLoading } = useProjects()

  return (
    <div className="space-y-6">
      <PageHeader
        title="Projects"
        description="Connected GitHub repositories and the debugging cases built from them."
        actions={
          <Link to="/github">
            <Button variant="outline" size="sm">
              <Github className="h-4 w-4" />
              Manage GitHub
            </Button>
          </Link>
        }
      />

      {isLoading ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {[0, 1, 2, 3].map((i) => (
            <div key={i} className="h-44 animate-pulse rounded-xl border border-border bg-surface" />
          ))}
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {projects?.map((p) => (
            <ProjectCard key={p.id} project={p} />
          ))}
        </div>
      )}
    </div>
  )
}
