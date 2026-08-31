import type React from "react"
import { Link, useParams } from "react-router-dom"
import { Logo } from "../components/shared/Logo"
import { Button } from "../components/ui/Button"
import { Card } from "../components/ui/Card"
import { Badge } from "../components/ui/Badge"
import { ProofScore } from "../components/shared/ProofScore"
import { CaseListItem } from "../features/debug-cases/CaseListItem"
import { SkillBar } from "../features/skills/SkillBar"
import { usePublicUser, useDebugCases, useSkills } from "../hooks/queries"
import { ShieldCheck, Bug, Github } from "lucide-react"

export function PublicProfilePage() {
const { username } = useParams<{ username: string }>()

const { data: profile, isLoading: profileLoading } = usePublicUser(username ?? "")
const { data: cases } = useDebugCases()
const { data: skills } = useSkills()

if (profileLoading) {
return ( <div className="min-h-screen bg-background"> <header className="border-b border-border"> <div className="mx-auto flex h-16 max-w-5xl items-center justify-between px-4"> <Logo /> </div> </header>

    <main className="mx-auto max-w-4xl px-4 py-10">
      <Card className="p-8 text-center">
        <p className="text-sm text-muted-foreground">
          Loading profile...
        </p>
      </Card>
    </main>
  </div>
)

}

if (!profile) {
return ( <div className="min-h-screen bg-background"> <header className="border-b border-border"> <div className="mx-auto flex h-16 max-w-5xl items-center justify-between px-4"> <Logo /> <Link to="/login"> <Button variant="secondary" size="sm">
Build your proof </Button> </Link> </div> </header>

```
    <main className="mx-auto max-w-4xl px-4 py-10">
      <Card className="p-8 text-center">
        <h1 className="text-lg font-semibold text-foreground">
          Profile not found
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          The requested developer profile does not exist.
        </p>
        <Link to="/login" className="mt-5 inline-block">
          <Button>Build your proof</Button>
        </Link>
      </Card>
    </main>
  </div>
)

}

const allCases = cases ?? []

const verified = allCases.filter(
(c) => c.status === "Verified",
)

const topSkills = (skills ?? [])
.slice()
.sort((a, b) => {
const aScore = a.verifiedCount * 2 + a.caseCount
const bScore = b.verifiedCount * 2 + b.caseCount
return bScore - aScore
})
.slice(0, 6)

const maxSkillCases = Math.max(
  1,
  ...topSkills.map((skill) => skill.caseCount),
)

const proofScore =
verified.length > 0
? Math.min(100, 40 + verified.length * 10)
: 0

return( 
<div className="min-h-screen bg-background"> 
<header className="border-b border-border"> 
<div className="mx-auto flex h-16 max-w-5xl items-center justify-between px-4"> 
<Logo />
    <Link to="/login">
        <Button variant="secondary" size="sm">
          Build your proof
        </Button>
      </Link>
    </div>
  </header>

  <main className="mx-auto max-w-4xl px-4 py-10">
    <Card className="flex flex-col items-center gap-4 p-8 text-center">
      <img
        src={profile.avatarUrl || "/placeholder.svg"}
        alt={profile.name}
        className="h-24 w-24 rounded-full border border-border object-cover"
      />

      <div>
        <h1 className="text-2xl font-semibold text-foreground">
          {profile.name}
        </h1>

        <p className="text-sm text-muted-foreground">
          {profile.title}
        </p>

        <p className="mt-1 font-mono text-xs text-muted-foreground">
          @{username ?? profile.username}
        </p>

        {profile.location && (
          <p className="mt-1 text-xs text-muted-foreground">
            {profile.location}
          </p>
        )}
      </div>

      <ProofScore score={proofScore} size="lg" />

      <div className="flex flex-wrap justify-center gap-2">
        <Badge variant="primary">
          {profile.title}
        </Badge>

        <Badge variant="success">
          <ShieldCheck className="h-3 w-3" />
          {verified.length} verified
        </Badge>

        {profile.githubConnected && (
          <Badge variant="neutral">
            <Github className="h-3 w-3" />
            GitHub connected
          </Badge>
        )}
      </div>

      {profile.bio && (
        <p className="max-w-2xl text-sm leading-relaxed text-muted-foreground">
          {profile.bio}
        </p>
      )}
    </Card>

    <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3">
      <StatBox
        icon={Bug}
        value={allCases.length}
        label="Cases documented"
      />

      <StatBox
        icon={ShieldCheck}
        value={verified.length}
        label="Peer verified"
      />

      <StatBox
        icon={Github}
        value={topSkills.length}
        label="Skills demonstrated"
      />
    </div>

    <div className="mt-8 grid gap-6 lg:grid-cols-[1fr_300px]">
      <div>
        <h2 className="mb-3 text-sm font-semibold text-foreground">
          Verified debug cases
        </h2>

        {verified.length > 0 ? (
          <div className="flex flex-col gap-3">
            {verified.map((c) => (
              <CaseListItem
                key={c.id}
                item={c}
              />
            ))}
          </div>
        ) : (
          <Card className="p-6">
            <p className="text-sm text-muted-foreground">
              No verified debug cases yet.
            </p>
          </Card>
        )}
      </div>

      <Card className="h-fit p-5">
        <h2 className="mb-4 text-sm font-semibold text-foreground">
          Proven skills
        </h2>

        {topSkills.length > 0 ? (
          <div className="flex flex-col gap-4">
            {topSkills.map((skill) => (
              <SkillBar
                key={skill.id}
                skill={skill}
                max={maxSkillCases}
              />
            ))}
          </div>
        ) : (
          <p className="text-sm text-muted-foreground">
            Skills will appear as debug cases are documented.
          </p>
        )}
      </Card>
    </div>

    <Card className="mt-10 flex flex-col items-center gap-3 p-8 text-center">
      <h2 className="text-lg font-semibold text-foreground">
        Prove your debugging skill, not just your résumé
      </h2>

      <p className="max-w-md text-sm text-muted-foreground">
        DebugProof turns the bugs you solve into verifiable evidence
        of how you think under pressure.
      </p>

      <Link to="/login">
        <Button>
          Create your proof profile
        </Button>
      </Link>
    </Card>
  </main>
</div>

)
}

function StatBox({
icon: Icon,
value,
label,
}: {
icon: React.ComponentType<{ className?: string }>
value: number
label: string
}) {
return ( <Card className="flex flex-col items-center gap-2 p-5 text-center"> <Icon className="h-5 w-5 text-primary" />

  <p className="text-2xl font-semibold text-foreground">
    {value}
  </p>

  <p className="text-xs text-muted-foreground">
    {label}
  </p>
</Card>

)
}
