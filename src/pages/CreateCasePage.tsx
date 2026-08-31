import type React from "react"
import { useMemo, useState } from "react"
import { useNavigate, useSearchParams } from "react-router-dom"
import { ArrowLeft, ArrowRight, Sparkles, Loader2 } from "lucide-react"
import { PageHeader } from "../components/shared/PageHeader"
import { WizardSteps } from "../features/debug-cases/WizardSteps"
import { Button } from "../components/ui/Button"
import { Card } from "../components/ui/Card"
import { Label, Input, Textarea, Select, FieldHint } from "../components/ui/Field"
import { DifficultyBadge } from "../components/shared/DifficultyBadge"
import { TechTag } from "../components/shared/TechTag"
import { useProjects, useCreateCase } from "../hooks/queries"
import type { Difficulty } from "../types"

const STEPS = ["Context", "Investigation", "Root cause & fix", "Review"]

interface Draft {
  title: string
  projectId: string
  difficulty: Difficulty
  tech: string
  symptom: string
  hypotheses: string
  steps: string
  rootCause: string
  fix: string
  lesson: string
}

const EMPTY: Draft = {
  title: "",
  projectId: "",
  difficulty: "medium",
  tech: "",
  symptom: "",
  hypotheses: "",
  steps: "",
  rootCause: "",
  fix: "",
  lesson: "",
}

export function CreateCasePage() {
  const [params] = useSearchParams()
  const navigate = useNavigate()
  const { data: projects } = useProjects()
  const createCase = useCreateCase()

  const [step, setStep] = useState(0)
  const [draft, setDraft] = useState<Draft>({
    ...EMPTY,
    title: params.get("title") ?? "",
    projectId: params.get("projectId") ?? "",
  })

  const set = <K extends keyof Draft>(key: K, value: Draft[K]) => setDraft((d) => ({ ...d, [key]: value }))

  const techList = useMemo(
    () => draft.tech.split(",").map((t) => t.trim()).filter(Boolean),
    [draft.tech],
  )

  const canAdvance = useMemo(() => {
    if (step === 0) return draft.title.trim().length > 2 && draft.symptom.trim().length > 4
    if (step === 1) return draft.steps.trim().length > 4
    if (step === 2) return draft.rootCause.trim().length > 4 && draft.fix.trim().length > 4
    return true
  }, [step, draft])

  const submit = async () => {
    const created = await createCase.mutateAsync({
      title: draft.title.trim(),
      projectId: draft.projectId || projects?.[0]?.id || "",
      difficulty: draft.difficulty,
      tech: techList,
      symptom: draft.symptom.trim(),
      hypotheses: draft.hypotheses.split("\n").map((h) => h.trim()).filter(Boolean),
      steps: draft.steps.split("\n").map((s) => s.trim()).filter(Boolean),
      rootCause: draft.rootCause.trim(),
      fix: draft.fix.trim(),
      lesson: draft.lesson.trim(),
    })
    navigate(`/debug-cases/${created.id}`)
  }

  return (
    <div className="mx-auto max-w-3xl">
      <PageHeader
        title="Document a debug case"
        description="Turn a bug you solved into verifiable proof of your debugging skill."
      />

      <Card className="mb-6 p-5">
        <WizardSteps steps={STEPS} current={step} />
      </Card>

      <Card className="p-6">
        {step === 0 && (
          <div className="flex flex-col gap-5">
            <div>
              <Label htmlFor="title">What broke?</Label>
              <Input
                id="title"
                placeholder="e.g. Race condition duplicated Stripe webhook charges"
                value={draft.title}
                onChange={(e) => set("title", e.target.value)}
              />
              <FieldHint>Write it like a headline — specific and outcome-focused.</FieldHint>
            </div>
            <div className="grid gap-5 sm:grid-cols-2">
              <div>
                <Label htmlFor="project">Project</Label>
                <Select id="project" value={draft.projectId} onChange={(e) => set("projectId", e.target.value)}>
                  <option value="">Unassigned</option>
                  {projects?.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name}
                    </option>
                  ))}
                </Select>
              </div>
              <div>
                <Label htmlFor="difficulty">Difficulty</Label>
                <Select
                  id="difficulty"
                  value={draft.difficulty}
                  onChange={(e) => set("difficulty", e.target.value as Difficulty)}
                >
                  <option value="trivial">Trivial</option>
                  <option value="easy">Easy</option>
                  <option value="medium">Medium</option>
                  <option value="hard">Hard</option>
                  <option value="nightmare">Nightmare</option>
                </Select>
              </div>
            </div>
            <div>
              <Label htmlFor="tech">Tech involved</Label>
              <Input
                id="tech"
                placeholder="TypeScript, PostgreSQL, Stripe"
                value={draft.tech}
                onChange={(e) => set("tech", e.target.value)}
              />
              <FieldHint>Comma-separated. These feed your verified skill graph.</FieldHint>
              {techList.length > 0 && (
                <div className="mt-2 flex flex-wrap gap-1.5">
                  {techList.map((t) => (
                    <TechTag key={t}>{t}</TechTag>
                  ))}
                </div>
              )}
            </div>
            <div>
              <Label htmlFor="symptom">The symptom</Label>
              <Textarea
                id="symptom"
                placeholder="What did you observe? Error message, wrong behavior, flaky test..."
                value={draft.symptom}
                onChange={(e) => set("symptom", e.target.value)}
              />
            </div>
          </div>
        )}

        {step === 1 && (
          <div className="flex flex-col gap-5">
            <div>
              <Label htmlFor="hypotheses">Hypotheses you tested</Label>
              <Textarea
                id="hypotheses"
                placeholder={"One per line.\nSuspected stale cache\nThought it was a timezone bug"}
                value={draft.hypotheses}
                onChange={(e) => set("hypotheses", e.target.value)}
              />
              <FieldHint>Dead ends count — they show how you actually think.</FieldHint>
            </div>
            <div>
              <Label htmlFor="steps">Investigation timeline</Label>
              <Textarea
                id="steps"
                className="min-h-40"
                placeholder={"One step per line.\nAdded structured logging around the webhook handler\nReplayed the event and saw two inserts\nFound the missing idempotency key"}
                value={draft.steps}
                onChange={(e) => set("steps", e.target.value)}
              />
              <FieldHint>This ordered trail is the core of your proof.</FieldHint>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="flex flex-col gap-5">
            <div>
              <Label htmlFor="root">Root cause</Label>
              <Textarea
                id="root"
                placeholder="The actual underlying reason — not just the symptom."
                value={draft.rootCause}
                onChange={(e) => set("rootCause", e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="fix">The fix</Label>
              <Textarea
                id="fix"
                placeholder="What you changed. Paste the key diff or code."
                value={draft.fix}
                onChange={(e) => set("fix", e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="lesson">Lesson learned</Label>
              <Textarea
                id="lesson"
                placeholder="What would stop this class of bug next time?"
                value={draft.lesson}
                onChange={(e) => set("lesson", e.target.value)}
              />
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="flex flex-col gap-5">
            <div className="flex items-start gap-3 rounded-lg border border-primary/30 bg-primary/5 p-4">
              <Sparkles className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
              <div>
                <p className="text-sm font-medium text-foreground">Ready to submit for proof scoring</p>
                <p className="mt-0.5 text-sm text-muted-foreground">
                  DebugProof analyzes the depth, reproducibility, and clarity of your case to compute a proof score.
                </p>
              </div>
            </div>
            <ReviewRow label="Title" value={draft.title} />
            <ReviewRow
              label="Difficulty"
              value={<DifficultyBadge difficulty={draft.difficulty} />}
            />
            <ReviewRow
              label="Tech"
              value={
                techList.length ? (
                  <div className="flex flex-wrap gap-1.5">
                    {techList.map((t) => (
                      <TechTag key={t}>{t}</TechTag>
                    ))}
                  </div>
                ) : (
                  "—"
                )
              }
            />
            <ReviewRow label="Symptom" value={draft.symptom} />
            <ReviewRow label="Root cause" value={draft.rootCause} />
            <ReviewRow label="Fix" value={draft.fix} />
          </div>
        )}

        <div className="mt-8 flex items-center justify-between border-t border-border pt-5">
          <Button
            variant="ghost"
            onClick={() => (step === 0 ? navigate("/debug-cases") : setStep((s) => s - 1))}
          >
            <ArrowLeft className="h-4 w-4" />
            {step === 0 ? "Cancel" : "Back"}
          </Button>
          {step < STEPS.length - 1 ? (
            <Button disabled={!canAdvance} onClick={() => setStep((s) => s + 1)}>
              Continue
              <ArrowRight className="h-4 w-4" />
            </Button>
          ) : (
            <Button disabled={createCase.isPending} onClick={submit}>
              {createCase.isPending ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Scoring...
                </>
              ) : (
                <>
                  <Sparkles className="h-4 w-4" />
                  Submit for proof
                </>
              )}
            </Button>
          )}
        </div>
      </Card>
    </div>
  )
}

function ReviewRow({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="grid gap-1 sm:grid-cols-[140px_1fr] sm:gap-4">
      <dt className="text-sm font-medium text-muted-foreground">{label}</dt>
      <dd className="text-sm text-foreground whitespace-pre-wrap">{value}</dd>
    </div>
  )
}
