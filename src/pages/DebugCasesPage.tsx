import { useMemo, useState } from "react"
import { Link } from "react-router-dom"
import { Plus, Search, Wrench } from "lucide-react"
import { PageHeader } from "@/components/shared/PageHeader"
import { Button } from "@/components/ui/Button"
import { Card } from "@/components/ui/Card"
import { EmptyState } from "@/components/shared/EmptyState"
import { CaseListItem } from "@/features/debug-cases/CaseListItem"
import { useDebugCases } from "@/hooks/queries"
import { cn } from "@/lib/utils"
import type { Difficulty } from "@/types"

const filters = ["All", "Verified", "Draft", "React", "Python", "Backend", "Database", "API"]
const backendSkills = ["FastAPI", "Python", "JWT"]
const databaseSkills = ["PostgreSQL"]
const apiSkills = ["REST API"]

type Sort = "recent" | "score" | "difficulty"
const difficultyRank = { trivial: 0, easy: 1, medium: 2, hard: 3, nightmare: 4, }

export function DebugCasesPage() {
  const { data: cases, isLoading } = useDebugCases()
  const [query, setQuery] = useState("")
  const [filter, setFilter] = useState("All")
  const [sort, setSort] = useState<Sort>("recent")

  const result = useMemo(() => {
    let list = cases ?? []

    if (query.trim()) {
      const q = query.toLowerCase()
      list = list.filter(
        (c) =>
          c.title.toLowerCase().includes(q) ||
          c.problemSummary.toLowerCase().includes(q) ||
          c.skills.some((s) => s.toLowerCase().includes(q)),
      )
    }

    if (filter === "Verified" || filter === "Draft") {
      list = list.filter((c) => c.status === filter)
    } else if (filter === "Backend") {
      list = list.filter((c) => c.skills.some((s) => backendSkills.includes(s)))
    } else if (filter === "Database") {
      list = list.filter((c) => c.skills.some((s) => databaseSkills.includes(s)))
    } else if (filter === "API") {
      list = list.filter((c) => c.skills.some((s) => apiSkills.includes(s)))
    } else if (filter !== "All") {
      list = list.filter((c) => c.skills.includes(filter))
    }

    const sorted = [...list]
    if (sort === "score") sorted.sort((a, b) => b.proofScore - a.proofScore)
    else if (sort === "difficulty")
      sorted.sort((a, b) => difficultyRank[b.difficulty] - difficultyRank[a.difficulty])
    else sorted.sort((a, b) => b.updatedAt.localeCompare(a.updatedAt))

    return sorted
  }, [cases, query, filter, sort])

  return (
    <div className="space-y-6">
      <PageHeader
        title="My Debugging Cases"
        description="Every case is a structured investigation backed by real evidence."
        actions={
          <Link to="/debug-cases/new">
            <Button size="sm">
              <Plus className="h-4 w-4" />
              New Case
            </Button>
          </Link>
        }
      />

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-2" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search cases, problems, or skills..."
            className="h-9.5 w-full rounded-lg border border-border bg-surface pl-9 pr-3 text-sm outline-none transition-colors placeholder:text-muted-2 focus:border-primary"
          />
        </div>
        <select
          value={sort}
          onChange={(e) => setSort(e.target.value as Sort)}
          className="h-9.5 rounded-lg border border-border bg-surface px-3 text-sm text-foreground outline-none focus:border-primary"
        >
          <option value="recent">Most recent</option>
          <option value="score">Highest proof score</option>
          <option value="difficulty">Hardest first</option>
        </select>
      </div>

      <div className="flex flex-wrap gap-2">
        {filters.map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={cn(
              "rounded-full border px-3 py-1 text-[13px] font-medium transition-colors",
              filter === f
                ? "border-primary bg-primary-soft text-primary"
                : "border-border text-muted hover:border-border-strong hover:text-foreground",
            )}
          >
            {f}
          </button>
        ))}
      </div>

      {isLoading ? (
        <div className="h-64 animate-pulse rounded-xl border border-border bg-surface" />
      ) : result.length > 0 ? (
        <Card className="divide-y divide-border overflow-hidden">
          {result.map((c) => (
            <CaseListItem key={c.id} item={c} />
          ))}
        </Card>
      ) : (
        <EmptyState
          icon={Wrench}
          title="No matching cases"
          description="Try a different search or filter, or create a new debugging case."
          action={
            <Link to="/debug-cases/new">
              <Button>Create Debug Case</Button>
            </Link>
          }
        />
      )}
    </div>
  )
}
