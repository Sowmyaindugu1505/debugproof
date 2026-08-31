import type React from "react"
import { useState } from "react"
import { useNavigate } from "react-router-dom"
import {
  AlertTriangle,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  CircleDot,
  Code2,
  Loader2,
  Search,
  ShieldCheck,
  Sparkles,
  Target,
  Wrench,
} from "lucide-react"

import { PageHeader } from "@/components/shared/PageHeader"
import { Card } from "@/components/ui/Card"
import { Button } from "@/components/ui/Button"
import { Textarea, Select, Label } from "@/components/ui/Field"
import { Badge } from "@/components/ui/Badge"

import { analyzeError } from "@/services/errorAnalyzer"
import { useCreateCase } from "@/hooks/queries"

import type {
  ErrorAnalysisRequest,
  ErrorAnalysisResult,
} from "@/types/errorAnalysis"

import type { Difficulty } from "@/types"

export function AnalyzeErrorPage() {
  const navigate = useNavigate()
  const createCase = useCreateCase()

  const [error, setError] = useState("")
  const [code, setCode] = useState("")
  const [language, setLanguage] = useState("TypeScript")
  const [context, setContext] = useState("")

  const [result, setResult] = useState<ErrorAnalysisResult | null>(null)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [showCode, setShowCode] = useState(false)

  const canAnalyze = error.trim().length > 0

  async function handleAnalyze() {
    if (!canAnalyze) return

    setIsAnalyzing(true)
    setResult(null)
    setShowCode(false)

    try {
      const request: ErrorAnalysisRequest = {
        error: error.trim(),
        code: code.trim(),
        language,
        context: context.trim(),
      }

      const analysis = await analyzeError(request)

      setResult(analysis)
    } catch (err) {
      console.error("Error analysis failed:", err)
    } finally {
      setIsAnalyzing(false)
    }
  }

  async function handleSaveAsCase() {
    if (!result) return

    const difficulty: Difficulty =
      result.severity === "Critical" || result.severity === "High"
        ? "hard"
        : result.severity === "Medium"
          ? "medium"
          : "easy"

    try {
      const created = await createCase.mutateAsync({
        title: `${result.errorType}: ${error.trim().split("\n")[0]}`,
        projectId: "",
        difficulty,
        tech: [language],
        symptom: result.symptom,
        hypotheses: [result.likelyCause],
        steps: result.investigation.map(
          (step) => `${step.title}: ${step.description}`,
        ),
        rootCause: result.rootCause,
        fix: result.recommendedFix,
        lesson:
          "Review the investigation and verify the proposed fix against the original failure.",
      })

      navigate(`/debug-cases/${created.id}`)
    } catch (err) {
      console.error("Failed to save debug case:", err)
    }
  }

  return (
    <div className="mx-auto w-full max-w-6xl">
      <PageHeader
        title="Analyze an error"
        description="Turn a raw error into an evidence-based debugging investigation."
      />

      <div className="grid gap-6 lg:grid-cols-[1fr_380px]">
        {/* LEFT — INPUT */}
        <div className="flex flex-col gap-6">
          <Card className="p-6">
            <div className="mb-6 flex items-start gap-3">
              <div className="rounded-lg bg-primary/10 p-2">
                <Sparkles className="h-5 w-5 text-primary" />
              </div>

              <div>
                <h2 className="font-semibold text-foreground">
                  Describe the failure
                </h2>

                <p className="mt-1 text-sm text-muted-foreground">
                  Give DebugProof the error and enough context to investigate
                  the problem.
                </p>
              </div>
            </div>

            <div className="flex flex-col gap-5">
              <div>
                <Label htmlFor="error">
                  Error message <span className="text-danger">*</span>
                </Label>

                <Textarea
                  id="error"
                  className="min-h-32 font-mono text-sm"
                  placeholder={`Example:

TypeError: Cannot read properties of undefined (reading 'map')
    at UserList.tsx:42:18`}
                  value={error}
                  onChange={(event) => setError(event.target.value)}
                />
              </div>

              <div>
                <Label htmlFor="language">
                  Programming language
                </Label>

                <Select
                  id="language"
                  value={language}
                  onChange={(event) => setLanguage(event.target.value)}
                >
                  <option>TypeScript</option>
                  <option>JavaScript</option>
                  <option>Python</option>
                  <option>Java</option>
                  <option>C#</option>
                  <option>Go</option>
                  <option>Rust</option>
                  <option>Other</option>
                </Select>
              </div>

              <div>
                <Label htmlFor="code">
                  Relevant source code
                </Label>

                <Textarea
                  id="code"
                  className="min-h-52 font-mono text-sm"
                  placeholder={`Paste the relevant code here...

const users = data.users
return users.map(user => (
  <UserCard user={user} />
))`}
                  value={code}
                  onChange={(event) => setCode(event.target.value)}
                />
              </div>

              <div>
                <Label htmlFor="context">
                  Context & reproduction steps
                </Label>

                <Textarea
                  id="context"
                  className="min-h-28"
                  placeholder="What were you doing when the error occurred? What did you expect to happen?"
                  value={context}
                  onChange={(event) => setContext(event.target.value)}
                />
              </div>

              {/* ACTION BUTTONS */}
              <div className="flex flex-col gap-3 sm:flex-row">
                <Button
                  onClick={handleAnalyze}
                  disabled={!canAnalyze || isAnalyzing}
                  className="flex-1"
                >
                  {isAnalyzing ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Investigating...
                    </>
                  ) : (
                    <>
                      <Search className="h-4 w-4" />
                      Analyze error
                    </>
                  )}
                </Button>

                {result && (
                  <Button
                    variant="secondary"
                    onClick={handleSaveAsCase}
                    disabled={createCase.isPending}
                    className="flex-1"
                  >
                    {createCase.isPending ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Saving...
                      </>
                    ) : (
                      <>
                        <ShieldCheck className="h-4 w-4" />
                        Save as Debug Case
                      </>
                    )}
                  </Button>
                )}
              </div>
            </div>
          </Card>

          {isAnalyzing && <InvestigationLoading />}
        </div>

        {/* RIGHT — RESULT */}
        <div>
          {!result && !isAnalyzing && <EmptyAnalysisState />}

          {result && !isAnalyzing && (
            <AnalysisResult
              result={result}
              showCode={showCode}
              setShowCode={setShowCode}
            />
          )}
        </div>
      </div>
    </div>
  )
}

/* -------------------------------------------------------------------------- */
/* Loading state                                                               */
/* -------------------------------------------------------------------------- */

function InvestigationLoading() {
  return (
    <Card className="p-6">
      <div className="flex items-center gap-3">
        <Loader2 className="h-5 w-5 animate-spin text-primary" />

        <div>
          <p className="text-sm font-medium text-foreground">
            Investigating the error...
          </p>

          <p className="text-xs text-muted-foreground">
            Classifying the failure and building an investigation trail.
          </p>
        </div>
      </div>

      <div className="mt-6 flex flex-col gap-3">
        <LoadingRow text="Reading error message" />
        <LoadingRow text="Classifying error type" />
        <LoadingRow text="Identifying likely cause" />
        <LoadingRow text="Building investigation trail" />
      </div>
    </Card>
  )
}

function LoadingRow({ text }: { text: string }) {
  return (
    <div className="flex items-center gap-3 rounded-lg border border-border p-3">
      <CircleDot className="h-4 w-4 text-muted-foreground" />

      <span className="text-sm text-muted-foreground">
        {text}
      </span>
    </div>
  )
}

/* -------------------------------------------------------------------------- */
/* Empty state                                                                 */
/* -------------------------------------------------------------------------- */

function EmptyAnalysisState() {
  return (
    <Card className="flex min-h-[420px] flex-col items-center justify-center p-8 text-center">
      <div className="rounded-full bg-muted p-4">
        <Search className="h-7 w-7 text-muted-foreground" />
      </div>

      <h2 className="mt-4 font-semibold text-foreground">
        Your investigation will appear here
      </h2>

      <p className="mt-2 max-w-sm text-sm leading-relaxed text-muted-foreground">
        Paste an error message on the left and DebugProof will build a
        structured investigation from it.
      </p>
    </Card>
  )
}

/* -------------------------------------------------------------------------- */
/* Analysis result                                                             */
/* -------------------------------------------------------------------------- */

function AnalysisResult({
  result,
  showCode,
  setShowCode,
}: {
  result: ErrorAnalysisResult
  showCode: boolean
  setShowCode: (value: boolean) => void
}) {
  return (
    <div className="flex flex-col gap-5">
      {/* Summary */}
      <Card className="p-5">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="rounded-lg bg-danger/10 p-2">
              <AlertTriangle className="h-5 w-5 text-danger" />
            </div>

            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                Error detected
              </p>

              <h2 className="mt-1 font-semibold text-foreground">
                {result.errorType}
              </h2>
            </div>
          </div>

          <SeverityBadge severity={result.severity} />
        </div>

        <div className="mt-5 grid grid-cols-2 gap-3">
          <InfoBox
            label="Confidence"
            value={`${result.confidence}%`}
          />

          <InfoBox
            label="Verification"
            value={
              result.verification.status === "verified"
                ? "Verified"
                : "Needs review"
            }
          />
        </div>
      </Card>

      {/* Symptom */}
      <ResultSection
        icon={AlertTriangle}
        title="Symptom"
      >
        <p>{result.symptom}</p>
      </ResultSection>

      {/* Likely cause */}
      <ResultSection
        icon={Target}
        title="Likely cause"
      >
        <p>{result.likelyCause}</p>
      </ResultSection>

      {/* Investigation */}
      <Card className="p-5">
        <div className="flex items-center gap-2">
          <Search className="h-4 w-4 text-primary" />

          <h3 className="text-sm font-semibold text-foreground">
            Investigation trail
          </h3>
        </div>

        <div className="mt-5 flex flex-col">
          {result.investigation.map((step, index) => (
            <div
              key={step.id}
              className="relative flex gap-4 pb-6 last:pb-0"
            >
              {index < result.investigation.length - 1 && (
                <div className="absolute left-[11px] top-6 h-full w-px bg-border" />
              )}

              <div className="relative z-10 flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-border bg-background">
                {step.status === "completed" ? (
                  <CheckCircle2 className="h-4 w-4 text-success" />
                ) : step.status === "current" ? (
                  <CircleDot className="h-4 w-4 text-primary" />
                ) : (
                  <CircleDot className="h-4 w-4 text-muted-foreground" />
                )}
              </div>

              <div>
                <p className="text-sm font-medium text-foreground">
                  {step.title}
                </p>

                <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                  {step.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Root cause */}
      <ResultSection
        icon={Target}
        title="Root cause"
        tone="primary"
      >
        <p>{result.rootCause}</p>
      </ResultSection>

      {/* Fix */}
      <Card className="p-5">
        <div className="flex items-center gap-2">
          <Wrench className="h-4 w-4 text-success" />

          <h3 className="text-sm font-semibold text-foreground">
            Recommended fix
          </h3>
        </div>

        <p className="mt-4 text-sm leading-relaxed text-foreground/90">
          {result.recommendedFix}
        </p>

        {result.fixedCode && (
          <div className="mt-4 overflow-hidden rounded-lg border border-border">
            <button
              type="button"
              onClick={() => setShowCode(!showCode)}
              className="flex w-full items-center justify-between bg-muted/50 px-4 py-3 text-left"
            >
              <span className="flex items-center gap-2 text-sm font-medium">
                <Code2 className="h-4 w-4" />
                Suggested code
              </span>

              {showCode ? (
                <ChevronUp className="h-4 w-4" />
              ) : (
                <ChevronDown className="h-4 w-4" />
              )}
            </button>

            {showCode && (
              <pre className="overflow-x-auto p-4 text-xs leading-relaxed">
                <code>{result.fixedCode}</code>
              </pre>
            )}
          </div>
        )}
      </Card>

      {/* Verification */}
      <Card className="p-5">
        <div className="flex items-center gap-2">
          <ShieldCheck
            className={
              result.verification.status === "verified"
                ? "h-4 w-4 text-success"
                : "h-4 w-4 text-warning"
            }
          />

          <h3 className="text-sm font-semibold text-foreground">
            Verification
          </h3>
        </div>

        <div className="mt-4 flex items-start gap-3">
          {result.verification.status === "verified" ? (
            <CheckCircle2 className="mt-0.5 h-5 w-5 text-success" />
          ) : (
            <AlertTriangle className="mt-0.5 h-5 w-5 text-warning" />
          )}

          <p className="text-sm leading-relaxed text-muted-foreground">
            {result.verification.explanation}
          </p>
        </div>
      </Card>

      {/* Warnings */}
      {result.warnings.length > 0 && (
        <Card className="border-warning/30 bg-warning/5 p-5">
          <h3 className="text-sm font-semibold text-foreground">
            Important
          </h3>

          <ul className="mt-3 flex flex-col gap-2">
            {result.warnings.map((warning, index) => (
              <li
                key={index}
                className="text-xs leading-relaxed text-muted-foreground"
              >
                • {warning}
              </li>
            ))}
          </ul>
        </Card>
      )}
    </div>
  )
}

/* -------------------------------------------------------------------------- */
/* Small UI components                                                         */
/* -------------------------------------------------------------------------- */

function ResultSection({
  icon: Icon,
  title,
  tone = "default",
  children,
}: {
  icon: React.ComponentType<{ className?: string }>
  title: string
  tone?: "default" | "primary"
  children: React.ReactNode
}) {
  return (
    <Card className="p-5">
      <div className="flex items-center gap-2">
        <Icon
          className={
            tone === "primary"
              ? "h-4 w-4 text-primary"
              : "h-4 w-4 text-muted-foreground"
          }
        />

        <h3 className="text-sm font-semibold text-foreground">
          {title}
        </h3>
      </div>

      <div className="mt-4 text-sm leading-relaxed text-foreground/90">
        {children}
      </div>
    </Card>
  )
}

function InfoBox({
  label,
  value,
}: {
  label: string
  value: string
}) {
  return (
    <div className="rounded-lg border border-border bg-muted/30 p-3">
      <p className="text-xs text-muted-foreground">
        {label}
      </p>

      <p className="mt-1 text-sm font-semibold text-foreground">
        {value}
      </p>
    </div>
  )
}

function SeverityBadge({
  severity,
}: {
  severity: ErrorAnalysisResult["severity"]
}) {
  const variant =
    severity === "Critical" || severity === "High"
      ? "danger"
      : severity === "Medium"
        ? "neutral"
        : "success"

  return (
    <Badge variant={variant}>
      {severity}
    </Badge>
  )
}