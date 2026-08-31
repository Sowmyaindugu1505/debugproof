import type React from "react"
import { useState } from "react"
import { Link, useParams } from "react-router-dom"
import {
  ArrowLeft,
  Bug,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  FileCode2,
  ShieldCheck,
  Target,
  Wrench,
} from "lucide-react"

import { useDebugCase } from "../hooks/queries"
import { Card } from "../components/ui/Card"
import { Button } from "../components/ui/Button"
import { Badge } from "../components/ui/Badge"
import { DifficultyBadge } from "../components/shared/DifficultyBadge"
import { TrustBadge } from "../components/shared/TrustBadge"
import { ProofScore } from "../components/shared/ProofScore"
import { TechTag } from "../components/shared/TechTag"
import { CodeBlock } from "../components/shared/CodeBlock"
import { EmptyState } from "../components/shared/EmptyState"

export function PublicCasePage() {
  const { id } = useParams<{ id: string }>()
  const { data: c, isLoading } = useDebugCase(id!)

  const [revealed, setRevealed] = useState<Record<string, boolean>>({})

  if (isLoading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <p className="text-sm text-muted-foreground">
          Loading proof...
        </p>
      </div>
    )
  }

  if (!c) {
    return (
      <EmptyState
        icon={Bug}
        title="Case not found"
        description="This public debugging case does not exist or is no longer available."
        action={
          <Link to="/">
            <Button variant="secondary">
              <ArrowLeft className="h-4 w-4" />
              Back home
            </Button>
          </Link>
        }
      />
    )
  }

  const toggleSection = (key: string) => {
    setRevealed((current) => ({
      ...current,
      [key]: !current[key],
    }))
  }

  return (
    <div className="mx-auto flex w-full max-w-5xl flex-col gap-8 px-4 py-8 sm:px-6 lg:py-12">
      {/* Header */}
      <header className="flex flex-col gap-5">
        <Link
          to="/"
          className="inline-flex w-fit items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" />
          Back
        </Link>

        <div className="flex flex-col gap-4">
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="neutral">DebugProof Case</Badge>
            <DifficultyBadge difficulty={c.difficulty} />
            <TrustBadge level={c.trust} />
          </div>

          <div>
            <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
              {c.title}
            </h1>

            <p className="mt-3 max-w-3xl text-base leading-7 text-muted-foreground">
              An evidence-backed debugging investigation showing how the
              problem was identified, investigated, fixed, and verified.
            </p>
          </div>

          <div className="flex flex-wrap gap-1.5">
            {c.skills.map((skill) => (
              <TechTag key={skill}>{skill}</TechTag>
            ))}
          </div>
        </div>
      </header>

      {/* Proof overview */}
      <section className="grid gap-4 sm:grid-cols-3">
        <Card className="p-5">
          <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
            Proof score
          </p>

          <div className="mt-3">
            <ProofScore score={c.proofScore} size="lg" />
          </div>
        </Card>

        <Card className="p-5">
          <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
            Evidence
          </p>

          <p className="mt-3 text-2xl font-bold text-foreground">
            {c.evidence.length}
          </p>

          <p className="mt-1 text-xs text-muted-foreground">
            supporting artifacts
          </p>
        </Card>

        <Card className="p-5">
          <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
            Project
          </p>

          <p className="mt-3 text-lg font-semibold text-foreground">
            {c.projectName}
          </p>

          <p className="mt-1 text-xs text-muted-foreground">
            Debugging case
          </p>
        </Card>
      </section>

      {/* Investigation */}
      <section className="flex flex-col gap-4">
        <div>
          <p className="font-mono text-xs text-primary">
            INVESTIGATION
          </p>

          <h2 className="mt-1 text-xl font-semibold text-foreground">
            How the problem was solved
          </h2>

          <p className="mt-1 text-sm text-muted-foreground">
            Follow the evidence from the initial problem to the verified fix.
          </p>
        </div>

        {/* Problem */}
        <InvestigationCard
          number="01"
          title="Problem"
          icon={Bug}
          tone="danger"
          revealed
        >
          <p className="text-sm leading-7 text-foreground/90">
            {c.problemSummary}
          </p>
        </InvestigationCard>

        {/* Rich sections */}
        {c.sections.map((section, index) => {
          const isRevealed = revealed[section.key] ?? false

          return (
            <InvestigationCard
              key={section.key}
              number={section.index || String(index + 2).padStart(2, "0")}
              title={section.title}
              icon={getSectionIcon(section.key, section.title)}
              trust={section.trust}
              revealed={isRevealed}
              onToggle={() => toggleSection(section.key)}
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
            </InvestigationCard>
          )
        })}
      </section>

      {/* Evidence */}
      <section className="flex flex-col gap-4">
        <div>
          <p className="font-mono text-xs text-primary">
            PROOF
          </p>

          <h2 className="mt-1 text-xl font-semibold text-foreground">
            Evidence supporting the investigation
          </h2>
        </div>

        <div className="grid gap-3">
          {c.evidence.map((evidence) => (
            <Card key={evidence.id} className="p-5">
              <div className="flex items-start gap-3">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-border bg-surface">
                  <ShieldCheck className="h-4 w-4 text-success" />
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
          ))}
        </div>
      </section>

      {/* Skills */}
      <section>
        <Card className="p-6">
          <div className="flex flex-col gap-4">
            <div>
              <p className="font-mono text-xs text-primary">
                DEMONSTRATED SKILLS
              </p>

              <h2 className="mt-1 text-xl font-semibold text-foreground">
                What this case demonstrates
              </h2>
            </div>

            <div className="flex flex-wrap gap-2">
              {c.skills.map((skill) => (
                <Badge key={skill} variant="neutral">
                  {skill}
                </Badge>
              ))}
            </div>
          </div>
        </Card>
      </section>

      {/* Footer */}
      <footer className="border-t border-border pt-6 text-center">
        <p className="text-xs text-muted-foreground">
          This debugging case was documented with DebugProof.
        </p>
      </footer>
    </div>
  )
}

function InvestigationCard({
  number,
  title,
  icon: Icon,
  tone = "default",
  trust,
  revealed,
  onToggle,
  children,
}: {
  number: string
  title: string
  icon: React.ComponentType<{ className?: string }>
  tone?: "danger" | "primary" | "success" | "warning" | "default"
  trust?: "AI Generated" | "Developer Reviewed" | "Verified Evidence"
  revealed: boolean
  onToggle?: () => void
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
    <Card className="overflow-hidden">
      <button
        type="button"
        onClick={onToggle}
        disabled={!onToggle}
        className="flex w-full items-center gap-3 p-5 text-left disabled:cursor-default"
      >
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-border bg-surface">
          <Icon className={`h-4 w-4 ${toneClasses[tone]}`} />
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <span className="font-mono text-xs text-muted-foreground">
              {number}
            </span>

            <h3 className="text-sm font-semibold text-foreground">
              {title}
            </h3>
          </div>

          {trust && (
            <div className="mt-1">
              <TrustBadge level={trust} />
            </div>
          )}
        </div>

        {onToggle && (
          revealed ? (
            <ChevronUp className="h-4 w-4 shrink-0 text-muted-foreground" />
          ) : (
            <ChevronDown className="h-4 w-4 shrink-0 text-muted-foreground" />
          )
        )}
      </button>

      {revealed && (
        <div className="border-t border-border p-5">
          {children}
        </div>
      )}
    </Card>
  )
}

function getSectionIcon(key: string, title: string) {
  const value = `${key} ${title}`.toLowerCase()

  if (value.includes("root") || value.includes("cause")) {
    return Target
  }

  if (value.includes("fix") || value.includes("solution")) {
    return Wrench
  }

  if (value.includes("verif") || value.includes("test")) {
    return CheckCircle2
  }

  if (value.includes("investig") || value.includes("hypothes")) {
    return FileCode2
  }

  return FileCode2
}