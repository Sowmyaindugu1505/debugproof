import type React from "react"
import { useState } from "react"
import { Link, useParams } from "react-router-dom"
import {
  ArrowLeft,
  Bug,
  CheckCircle2,
  Eye,
  ShieldCheck,
  Target,
  Wrench,
} from "lucide-react"

import { useDebugCase } from "../hooks/queries"
import { Card } from "../components/ui/Card"
import { Button } from "../components/ui/Button"
import { Badge } from "../components/ui/Badge"
import { ProofScore } from "../components/shared/ProofScore"
import { TrustBadge } from "../components/shared/TrustBadge"
import { TechTag } from "../components/shared/TechTag"
import { CodeBlock } from "../components/shared/CodeBlock"
import { EmptyState } from "../components/shared/EmptyState"

export function ChallengePage() {
  const { id } = useParams<{ id: string }>()
  const { data: c, isLoading } = useDebugCase(id!)

  const [revealed, setRevealed] = useState(false)

  if (isLoading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <p className="text-sm text-muted-foreground">
          Loading challenge...
        </p>
      </div>
    )
  }

  if (!c) {
    return (
      <EmptyState
        icon={Bug}
        title="Challenge not found"
        description="This debugging challenge does not exist."
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

  return (
    <div className="mx-auto flex w-full max-w-4xl flex-col gap-8 px-4 py-8 sm:px-6 lg:py-12">
      <Link
        to="/"
        className="inline-flex w-fit items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" />
        Back
      </Link>

      {/* Challenge header */}
      <header className="flex flex-col gap-4">
        <div className="flex items-center gap-2">
          <Badge variant="neutral">DEBUGGING CHALLENGE</Badge>
          <span className="font-mono text-xs text-muted-foreground">
            {c.difficulty}
          </span>
        </div>

        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">
            Can you identify the root cause?
          </h1>

          <p className="mt-3 text-sm leading-7 text-muted-foreground">
            Examine the problem first. The developer's investigation and
            solution are hidden until you choose to reveal them.
          </p>
        </div>
      </header>

      {/* Problem */}
      <Card className="border-danger/30 p-6">
        <div className="flex items-start gap-4">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-danger/30 bg-danger/10">
            <Bug className="h-5 w-5 text-danger" />
          </div>

          <div>
            <p className="text-xs font-medium uppercase tracking-wide text-danger">
              Problem
            </p>

            <h2 className="mt-1 text-xl font-semibold text-foreground">
              {c.title}
            </h2>

            <p className="mt-4 text-sm leading-7 text-foreground/90">
              {c.problemSummary}
            </p>
          </div>
        </div>
      </Card>

      {/* Skills */}
      <Card className="p-5">
        <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
          Technologies involved
        </p>

        <div className="mt-3 flex flex-wrap gap-1.5">
          {c.skills.map((skill) => (
            <TechTag key={skill}>{skill}</TechTag>
          ))}
        </div>
      </Card>

      {/* Reveal */}
      {!revealed ? (
        <Card className="flex flex-col items-center gap-5 p-8 text-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-full border border-border bg-surface">
            <Eye className="h-5 w-5 text-primary" />
          </div>

          <div>
            <h2 className="text-lg font-semibold text-foreground">
              The investigation is hidden
            </h2>

            <p className="mt-2 max-w-xl text-sm leading-6 text-muted-foreground">
              Try to reason about the problem yourself before revealing how
              the developer investigated and solved it.
            </p>
          </div>

          <Button onClick={() => setRevealed(true)}>
            Reveal developer's investigation
          </Button>
        </Card>
      ) : (
        <div className="flex flex-col gap-5">
          {/* Investigation */}
          {c.sections.map((section, index) => (
            <Card key={section.key} className="p-6">
              <div className="flex items-start gap-4">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-border bg-surface">
                  <SectionIcon title={section.title} />
                </div>

                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-mono text-xs text-muted-foreground">
                      {section.index || String(index + 2).padStart(2, "0")}
                    </span>

                    <h2 className="text-base font-semibold text-foreground">
                      {section.title}
                    </h2>

                    <TrustBadge level={section.trust} />
                  </div>

                  <p className="mt-4 whitespace-pre-line text-sm leading-7 text-foreground/90">
                    {section.body}
                  </p>

                  {section.code && (
                    <div className="mt-4">
                      <CodeBlock
                        code={section.code.content}
                        language={section.code.language}
                      />
                    </div>
                  )}
                </div>
              </div>
            </Card>
          ))}

          {/* Verification */}
          <Card className="border-success/30 p-6">
            <div className="flex items-start gap-4">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-success/30 bg-success/10">
                <ShieldCheck className="h-5 w-5 text-success" />
              </div>

              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-success">
                  Verification
                </p>

                <h2 className="mt-1 text-lg font-semibold text-foreground">
                  The result is supported by evidence
                </h2>

                <p className="mt-2 text-sm leading-6 text-muted-foreground">
                  This case has {c.evidence.length} supporting evidence
                  artifact{c.evidence.length === 1 ? "" : "s"} and a proof
                  score of {c.proofScore}/100.
                </p>
              </div>
            </div>
          </Card>

          {/* Final summary */}
          <Card className="p-6">
            <div className="flex flex-col gap-5">
              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-primary">
                  RESULT
                </p>

                <h2 className="mt-1 text-xl font-semibold text-foreground">
                  Debugging capability demonstrated
                </h2>
              </div>

              <div className="flex items-center gap-5">
                <ProofScore score={c.proofScore} size="lg" />

                <div>
                  <p className="text-sm font-medium text-foreground">
                    Proof strength
                  </p>

                  <p className="mt-1 text-xs leading-5 text-muted-foreground">
                    Based on investigation depth, evidence, reproducibility,
                    and verification.
                  </p>
                </div>
              </div>

              <div className="flex flex-wrap gap-1.5">
                {c.skills.map((skill) => (
                  <Badge key={skill} variant="neutral">
                    {skill}
                  </Badge>
                ))}
              </div>
            </div>
          </Card>
        </div>
      )}
    </div>
  )
}

function SectionIcon({ title }: { title: string }) {
  const value = title.toLowerCase()

  if (value.includes("root") || value.includes("cause")) {
    return <Target className="h-4 w-4 text-primary" />
  }

  if (value.includes("fix") || value.includes("solution")) {
    return <Wrench className="h-4 w-4 text-success" />
  }

  if (value.includes("verif") || value.includes("test")) {
    return <CheckCircle2 className="h-4 w-4 text-success" />
  }

  return <Bug className="h-4 w-4 text-muted-foreground" />
}