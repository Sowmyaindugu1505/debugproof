import type React from "react"
import { useParams, Link } from "react-router-dom"
import {
  ArrowLeft,
  Bug,
  Share2,
  ShieldCheck,
  FileCode2,
  CheckCircle2,
} from "lucide-react"

import { PageHeader } from "../components/shared/PageHeader"
import { Card } from "../components/ui/Card"
import { Button } from "../components/ui/Button"
import { Badge } from "../components/ui/Badge"
import { DifficultyBadge } from "../components/shared/DifficultyBadge"
import { StatusBadge } from "../components/shared/StatusBadge"
import { TrustBadge } from "../components/shared/TrustBadge"
import { TechTag } from "../components/shared/TechTag"
import { ProofScore } from "../components/shared/ProofScore"
import { CodeBlock } from "../components/shared/CodeBlock"
import { EmptyState } from "../components/shared/EmptyState"

import { useDebugCase } from "../hooks/queries"
import { formatDate } from "../lib/utils"

export function CaseDetailPage() {
  const { id } = useParams<{ id: string }>()
  const { data: c, isLoading } = useDebugCase(id!)

  if (isLoading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <div className="text-sm text-muted-foreground">
          Loading debug case...
        </div>
      </div>
    )
  }

  if (!c) {
    return (
      <EmptyState
        icon={Bug}
        title="Case not found"
        description="This debug case may have been deleted or never existed."
        action={
          <Link to="/debug-cases">
            <Button variant="secondary">
              <ArrowLeft className="h-4 w-4" />
              Back to cases
            </Button>
          </Link>
        }
      />
    )
  }

  const handleShare = async () => {
    const url = window.location.href

    try {
      await navigator.clipboard.writeText(url)
    } catch {
      // Clipboard may be unavailable in some browsers.
    }
  }

  return (
    <div className="flex flex-col gap-6">
      <Link
        to="/debug-cases"
        className="inline-flex w-fit items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" />
        All cases
      </Link>

      <PageHeader
        title={c.title}
        actions={
          <Button
            variant="secondary"
            size="sm"
            onClick={handleShare}
          >
            <Share2 className="h-4 w-4" />
            Share proof
          </Button>
        }
      >
        <div className="flex flex-wrap items-center gap-2">
          <DifficultyBadge difficulty={c.difficulty} />
          <StatusBadge status={c.status} />
          <TrustBadge level={c.trust} />

          <span className="ml-1 text-sm text-muted-foreground">
            {formatDate(c.createdAt)}
          </span>
        </div>

        <div className="mt-3 flex flex-wrap gap-1.5">
          {c.skills.map((skill) => (
            <TechTag key={skill}>{skill}</TechTag>
          ))}
        </div>
      </PageHeader>

      <div className="grid gap-6 lg:grid-cols-[1fr_280px]">
        <main className="flex flex-col gap-6">
          {/* Problem */}
          <CaseSection
            number="01"
            title="Problem"
            icon={Bug}
            tone="danger"
          >
            <p className="text-sm leading-7 text-foreground/90">
              {c.problemSummary}
            </p>
          </CaseSection>

          {/* Investigation sections */}
          {c.sections.map((section, index) => (
            <CaseSection
              key={section.key}
              number={section.index || String(index + 2).padStart(2, "0")}
              title={section.title}
              icon={getSectionIcon(section.key, section.title)}
              trust={section.trust}
            >
              <div className="flex flex-col gap-4">
                <p className="whitespace-pre-line text-sm leading-7 text-foreground/90">
                  {section.body}
                </p>

                {section.code && (
                  <CodeBlock
                    code={section.code.content}
                    language={section.code.language}
                  />
                )}
              </div>
            </CaseSection>
          ))}

          {/* Evidence */}
          <section className="flex flex-col gap-4">
            <div className="flex items-center gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg border border-border bg-surface">
                <ShieldCheck className="h-4 w-4 text-primary" />
              </div>

              <div>
                <h2 className="text-base font-semibold text-foreground">
                  Evidence
                </h2>
                <p className="text-xs text-muted-foreground">
                  Evidence supporting this debugging case
                </p>
              </div>
            </div>

            {c.evidence.length === 0 ? (
              <Card className="p-5">
                <p className="text-sm text-muted-foreground">
                  No evidence has been attached to this case yet.
                </p>
              </Card>
            ) : (
              <div className="grid gap-3">
                {c.evidence.map((item) => (
                  <EvidenceCard key={item.id} evidence={item} />
                ))}
              </div>
            )}
          </section>
        </main>

        {/* Sidebar */}
        <aside className="flex flex-col gap-6 lg:sticky lg:top-6 lg:self-start">
          <Card className="flex flex-col items-center gap-3 p-6 text-center">
            <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
              Proof score
            </p>

            <ProofScore score={c.proofScore} size="lg" />

            <p className="text-xs leading-5 text-muted-foreground">
              Evidence-backed strength of this debugging case.
            </p>
          </Card>

          <Card className="p-5">
            <div className="mb-4 flex items-center gap-2">
              <ShieldCheck className="h-4 w-4 text-success" />

              <h3 className="text-sm font-semibold text-foreground">
                Trust level
              </h3>
            </div>

            <TrustBadge level={c.trust} />

            <p className="mt-3 text-xs leading-5 text-muted-foreground">
              The trust level describes how the information in this case was
              produced and supported by evidence.
            </p>
          </Card>

          <Card className="p-5">
            <h3 className="mb-3 text-sm font-semibold text-foreground">
              Case information
            </h3>

            <div className="flex flex-col gap-3">
              <InfoRow
                label="Project"
                value={c.projectName}
              />

              <InfoRow
                label="Difficulty"
                value={c.difficulty}
              />

              <InfoRow
                label="Status"
                value={c.status}
              />

              <InfoRow
                label="Created"
                value={formatDate(c.createdAt)}
              />
            </div>
          </Card>

          <Card className="p-5">
            <h3 className="mb-3 text-sm font-semibold text-foreground">
              Skills demonstrated
            </h3>

            <div className="flex flex-wrap gap-1.5">
              {c.skills.map((skill) => (
                <Badge key={skill} variant="neutral">
                  {skill}
                </Badge>
              ))}
            </div>
          </Card>
        </aside>
      </div>
    </div>
  )
}

function CaseSection({
  number,
  title,
  icon: Icon,
  tone = "default",
  trust,
  children,
}: {
  number: string
  title: string
  icon: React.ComponentType<{ className?: string }>
  tone?: "danger" | "primary" | "success" | "warning" | "default"
  trust?: "AI Generated" | "Developer Reviewed" | "Verified Evidence"
  children: React.ReactNode
}) {
  const toneClasses = {
    danger: "text-danger",
    primary: "text-primary",
    success: "text-success",
    warning: "text-warning",
    default: "text-muted-foreground",
  }

  return (
    <section className="relative">
      <div className="mb-3 flex items-center gap-3">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg border border-border bg-surface">
          <Icon className={`h-4 w-4 ${toneClasses[tone]}`} />
        </div>

        <div className="flex min-w-0 flex-1 items-center gap-2">
          <span className="font-mono text-xs text-muted-foreground">
            {number}
          </span>

          <h2 className="text-base font-semibold text-foreground">
            {title}
          </h2>

          {trust && (
            <div className="ml-auto">
              <TrustBadge level={trust} />
            </div>
          )}
        </div>
      </div>

      <Card className="p-5">
        {children}
      </Card>
    </section>
  )
}

function EvidenceCard({
  evidence,
}: {
  evidence: {
    id: string
    type:
      | "GitHub Commit"
      | "Code Diff"
      | "Error Log"
      | "Screenshot"
      | "Test Result"
    title: string
    trust: "AI Generated" | "Developer Reviewed" | "Verified Evidence"
    language?: string
    content?: string
    meta?: string
  }
}) {
  return (
    <Card className="p-5">
      <div className="flex items-start gap-3">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-border bg-surface">
          {evidence.type === "Code Diff" ? (
            <FileCode2 className="h-4 w-4 text-primary" />
          ) : (
            <CheckCircle2 className="h-4 w-4 text-success" />
          )}
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="text-sm font-semibold text-foreground">
              {evidence.title}
            </h3>

            <Badge variant="neutral">
              {evidence.type}
            </Badge>
          </div>

          {evidence.meta && (
            <p className="mt-1 text-xs text-muted-foreground">
              {evidence.meta}
            </p>
          )}

          {evidence.content && (
            <div className="mt-3">
              {evidence.language ? (
                <CodeBlock
                  code={evidence.content}
                  language={evidence.language}
                />
              ) : (
                <p className="whitespace-pre-line text-sm leading-6 text-foreground/90">
                  {evidence.content}
                </p>
              )}
            </div>
          )}

          <div className="mt-3">
            <TrustBadge level={evidence.trust} />
          </div>
        </div>
      </div>
    </Card>
  )
}

function InfoRow({
  label,
  value,
}: {
  label: string
  value: string
}) {
  return (
    <div className="flex items-center justify-between gap-4">
      <span className="text-xs text-muted-foreground">
        {label}
      </span>

      <span className="text-right text-xs font-medium text-foreground">
        {value}
      </span>
    </div>
  )
}

function getSectionIcon(key: string, title: string) {
  const value = `${key} ${title}`.toLowerCase()

  if (value.includes("problem") || value.includes("symptom")) {
    return Bug
  }

  if (value.includes("investigat") || value.includes("hypothes")) {
    return FileCode2
  }

  if (value.includes("root") || value.includes("cause")) {
    return TargetIcon
  }

  if (value.includes("fix") || value.includes("solution")) {
    return WrenchIcon
  }

  if (value.includes("verif") || value.includes("test")) {
    return CheckCircle2
  }

  return FileCode2
}

function TargetIcon({ className }: { className?: string }) {
  return <span className={className}>◎</span>
}

function WrenchIcon({ className }: { className?: string }) {
  return <span className={className}>⚒</span>
}

