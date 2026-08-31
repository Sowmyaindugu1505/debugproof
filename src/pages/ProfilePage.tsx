import { Link } from "react-router-dom"
import { ExternalLink, Copy, Check } from "lucide-react"
import { useState } from "react"
import { PageHeader } from "../components/shared/PageHeader"
import { Card } from "../components/ui/Card"
import { Button } from "../components/ui/Button"
import { Badge } from "../components/ui/Badge"
import { ProofScore } from "../components/shared/ProofScore"
import { CaseListItem } from "../features/debug-cases/CaseListItem"
import { SkillBar } from "../features/skills/SkillBar"
import {
  useCurrentUser,
  useDebugCases,
  useSkills,
} from "../hooks/queries"

export function ProfilePage() {
  const { data: profile } = useCurrentUser()
  const { data: cases } = useDebugCases()
  const { data: skills } = useSkills()
  const [copied, setCopied] = useState(false)

  if (!profile) return null

  const publicUrl = `debugproof.dev/u/${profile.username}`

  const topSkills = (skills ?? [])
    .slice()
    .sort((a, b) => b.verifiedCount - a.verifiedCount)
    .slice(0, 5)

  const verifiedCases = (cases ?? [])
    .filter((debugCase) => debugCase.status === "Verified")
    .slice(0, 4)

  const overallProof =
    (cases ?? []).length > 0
      ? Math.round(
          (cases ?? []).reduce(
            (total, debugCase) => total + debugCase.proofScore,
            0,
          ) / (cases ?? []).length,
        )
      : 0

  const maxVerifiedCount = Math.max(
    1,
    ...topSkills.map((skill) => skill.verifiedCount),
  )

  const copy = () => {
    navigator.clipboard?.writeText(`https://${publicUrl}`)
    setCopied(true)
    setTimeout(() => setCopied(false), 1600)
  }

  return (
    <div>
      <PageHeader
        title="Your proof profile"
        description="This is what hiring managers and collaborators see."
        actions={
          <Link to={`/u/${profile.username}`}>
            <Button variant="secondary" size="sm">
              <ExternalLink className="h-4 w-4" />
              View public page
            </Button>
          </Link>
        }
      />

      <Card className="mb-6 flex flex-col gap-5 p-6 sm:flex-row sm:items-center">
        <img
          src={profile.avatarUrl || "/placeholder.svg"}
          alt={profile.name}
          className="h-20 w-20 rounded-full border border-border object-cover"
        />

        <div className="flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <h2 className="text-xl font-semibold text-foreground">
              {profile.name}
            </h2>

            {profile.githubConnected && (
              <Badge variant="primary">GitHub connected</Badge>
            )}
          </div>

          <p className="text-sm text-muted-foreground">
            {profile.title}
          </p>

          <button
            onClick={copy}
            className="mt-2 inline-flex items-center gap-1.5 rounded-md border border-border bg-surface px-2.5 py-1 font-mono text-xs text-muted-foreground transition-colors hover:text-foreground"
          >
            {copied ? (
              <Check className="h-3.5 w-3.5 text-success" />
            ) : (
              <Copy className="h-3.5 w-3.5" />
            )}

            {publicUrl}
          </button>
        </div>

        <div className="flex flex-col items-center gap-1">
          <ProofScore score={overallProof} size="lg" />
          <span className="text-xs text-muted-foreground">
            Overall proof
          </span>
        </div>
      </Card>

      <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
        <div>
          <h3 className="mb-3 text-sm font-semibold text-foreground">
            Featured verified cases
          </h3>

          <div className="flex flex-col gap-3">
            {verifiedCases.length > 0 ? (
              verifiedCases.map((debugCase) => (
                <CaseListItem
                  key={debugCase.id}
                  item={debugCase}
                />
              ))
            ) : (
              <Card className="p-5">
                <p className="text-sm text-muted-foreground">
                  No verified cases yet. Verify a debugging case to
                  feature it on your profile.
                </p>
              </Card>
            )}
          </div>
        </div>

        <Card className="h-fit p-5">
          <h3 className="mb-4 text-sm font-semibold text-foreground">
            Top verified skills
          </h3>

          <div className="flex flex-col gap-4">
            {topSkills.map((skill) => (
              <SkillBar
                key={skill.id}
                skill={skill}
                max={maxVerifiedCount}
              />
            ))}
          </div>
        </Card>
      </div>
    </div>
  )
}