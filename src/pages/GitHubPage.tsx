import { useState } from "react"
import { Link } from "react-router-dom"
import {
  ArrowRight,
  FileDiff,
  GitCommit,
  Github,
  Lock,
  Plus,
  ShieldCheck,
} from "lucide-react"
import { PageHeader } from "@/components/shared/PageHeader"
import { Button } from "@/components/ui/Button"
import { Card } from "@/components/ui/Card"
import { Badge } from "@/components/ui/Badge"
import { useRepositories } from "@/hooks/queries"
import { cn } from "@/lib/utils"
import type { Repository } from "@/types"

function DisconnectedState({ onConnect }: { onConnect: () => void }) {
  return (
    <Card className="mx-auto max-w-lg p-8 text-center">
      <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl border border-border bg-surface-2">
        <Github className="h-6 w-6" />
      </div>
      <h2 className="mt-5 text-lg font-medium">Connect GitHub</h2>
      <p className="mx-auto mt-2 max-w-sm text-sm leading-relaxed text-muted">
        DebugProof reads your repositories and commit history so you can turn a real fix into an
        evidence-backed case. We never push changes or store your code.
      </p>
      <ul className="mx-auto mt-5 max-w-xs space-y-2 text-left text-[13px] text-muted">
        <li className="flex items-center gap-2">
          <ShieldCheck className="h-4 w-4 text-accent" /> Read-only access to repos and commits
        </li>
        <li className="flex items-center gap-2">
          <ShieldCheck className="h-4 w-4 text-accent" /> You choose which fixes become cases
        </li>
      </ul>
      <Button className="mt-6 w-full" size="lg" onClick={onConnect}>
        <Github className="h-4.5 w-4.5" />
        Connect GitHub
      </Button>
      <p className="mt-3 text-[11px] text-muted-2">
        Demo connection — no real OAuth is performed in this preview.
      </p>
    </Card>
  )
}

function CommitList({ repo }: { repo: Repository }) {
  return (
    <div className="divide-y divide-border">
      {repo.commits.map((c) => (
        <div key={c.id} className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center">
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <GitCommit className="h-4 w-4 shrink-0 text-muted-2" />
              <p className="truncate text-[13px] font-medium">{c.message}</p>
            </div>
            <div className="mt-1.5 flex flex-wrap items-center gap-x-3 gap-y-1 pl-6 text-[11px] text-muted-2">
              <span className="font-mono">{c.sha}</span>
              <span>{c.author}</span>
              <span>{c.date}</span>
              <span className="inline-flex items-center gap-1">
                <FileDiff className="h-3 w-3" />
                {c.filesChanged} files
              </span>
              <span className="text-accent">+{c.additions}</span>
              <span className="text-danger">−{c.deletions}</span>
            </div>
          </div>
          <Link to="/debug-cases/new" className="pl-6 sm:pl-0">
            <Button size="sm" variant="secondary">
              <Plus className="h-3.5 w-3.5" />
              Create Debug Case
            </Button>
          </Link>
        </div>
      ))}
    </div>
  )
}

function ConnectedState() {
  const { data: repos } = useRepositories()
  const [activeId, setActiveId] = useState<string | null>(null)
  const active = repos?.find((r) => r.id === activeId) ?? null

  return (
    <div className="grid gap-6 lg:grid-cols-[300px_1fr]">
      <div>
        <p className="mb-3 text-[11px] font-medium uppercase tracking-wider text-muted-2">
          Repositories
        </p>
        <Card className="divide-y divide-border overflow-hidden">
          {repos?.map((r) => (
            <button
              key={r.id}
              onClick={() => setActiveId(r.id)}
              className={cn(
                "flex w-full items-center gap-3 px-4 py-3 text-left transition-colors hover:bg-surface-2",
                activeId === r.id && "bg-surface-2",
              )}
            >
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-1.5">
                  <span className="truncate text-[13px] font-medium">{r.name}</span>
                  {r.private && <Lock className="h-3 w-3 text-muted-2" />}
                </div>
                <p className="mt-0.5 truncate text-[11px] text-muted-2">
                  {r.language} · {r.updatedAt}
                </p>
              </div>
              <Badge tone="neutral">{r.commits.length}</Badge>
            </button>
          ))}
        </Card>
      </div>

      <div>
        {active ? (
          <Card className="overflow-hidden">
            <div className="flex items-center justify-between border-b border-border px-4 py-3">
              <div>
                <p className="text-[13px] font-medium">{active.name}</p>
                <p className="text-[11px] text-muted-2">Recent commits</p>
              </div>
              <Badge tone="primary">{active.language}</Badge>
            </div>
            <CommitList repo={active} />
          </Card>
        ) : (
          <Card className="flex h-full min-h-64 flex-col items-center justify-center p-8 text-center">
            <GitCommit className="h-6 w-6 text-muted-2" />
            <p className="mt-3 text-sm text-muted">Select a repository to browse recent commits</p>
            <p className="mt-1 text-[13px] text-muted-2">
              Then turn any fix into a debugging case.
            </p>
          </Card>
        )}
      </div>
    </div>
  )
}

export function GitHubPage() {
  const [connected, setConnected] = useState(true)

  return (
    <div className="space-y-6">
      <PageHeader
        title="GitHub"
        description="Browse repositories and commits, then convert real fixes into debugging cases."
        actions={
          connected ? (
            <Button variant="outline" size="sm" onClick={() => setConnected(false)}>
              Disconnect
            </Button>
          ) : (
            <span className="inline-flex items-center gap-1.5 text-[13px] text-muted-2">
              <ArrowRight className="h-3.5 w-3.5" />
              Not connected
            </span>
          )
        }
      />
      {connected ? <ConnectedState /> : <DisconnectedState onConnect={() => setConnected(true)} />}
    </div>
  )
}
