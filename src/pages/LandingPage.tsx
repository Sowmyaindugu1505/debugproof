import { Link } from "react-router-dom"
import {
  ArrowRight,
  FileSearch,
  Github,
  ListChecks,
  ShieldCheck,
  Target,
} from "lucide-react"
import { Logo } from "@/components/shared/Logo"
import { Button } from "@/components/ui/Button"
import { Card } from "@/components/ui/Card"
import { MiniCase } from "@/features/landing/MiniCase"

const workflow = ["Problem", "Evidence", "Investigation", "Root Cause", "Fix", "Verification"]

const reasons = [
  {
    icon: Target,
    title: "Prove Problem-Solving",
    body: "Show the reasoning behind a fix — reproduction, hypotheses, and the decision that resolved it.",
  },
  {
    icon: FileSearch,
    title: "Show Real Engineering Evidence",
    body: "Attach commits, diffs, logs, and test output so every claim is backed by something verifiable.",
  },
  {
    icon: ShieldCheck,
    title: "Build a Stronger Portfolio",
    body: "Turn everyday debugging into structured case studies recruiters can actually evaluate.",
  },
]

function MarketingNav() {
  return (
    <header className="sticky top-0 z-30 border-b border-border bg-background/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
        <Logo />
        <nav className="hidden items-center gap-7 text-sm text-muted md:flex">
          <a href="#why" className="transition-colors hover:text-foreground">
            Why DebugProof
          </a>
          <a href="#recruiters" className="transition-colors hover:text-foreground">
            For Recruiters
          </a>
          <Link to="/u/alexrivera" className="transition-colors hover:text-foreground">
            Example Profile
          </Link>
        </nav>
        <div className="flex items-center gap-2">
          <Link to="/login">
            <Button variant="ghost" size="sm">
              Sign in
            </Button>
          </Link>
          <Link to="/dashboard">
            <Button size="sm">
              <Github className="h-4 w-4" />
              Connect GitHub
            </Button>
          </Link>
        </div>
      </div>
    </header>
  )
}

function Hero() {
  return (
    <section className="relative overflow-hidden border-b border-border">
      <div className="dp-grid pointer-events-none absolute inset-0" aria-hidden />
      <div className="relative mx-auto grid max-w-6xl items-center gap-12 px-4 py-16 sm:px-6 lg:grid-cols-[1.05fr_1fr] lg:py-24">
        <div>
          <span className="inline-flex items-center gap-2 rounded-full border border-border bg-surface px-3 py-1 text-[12px] text-muted">
            <span className="h-1.5 w-1.5 rounded-full bg-accent" />
            Evidence-backed engineering portfolios
          </span>
          <h1 className="mt-5 text-4xl font-semibold leading-[1.08] tracking-tight text-balance sm:text-5xl">
            Don&apos;t Just Show What You Built.{" "}
            <span className="text-primary">Show How You Solved It.</span>
          </h1>
          <p className="mt-5 max-w-xl text-[15px] leading-relaxed text-muted">
            DebugProof turns real debugging experiences into evidence-backed engineering case
            studies — so you can demonstrate how you think, investigate, and verify, not just the
            tools you&apos;ve touched.
          </p>

          <div className="mt-7 flex flex-wrap items-center gap-3">
            <Link to="/dashboard">
              <Button size="lg">
                <Github className="h-4.5 w-4.5" />
                Connect GitHub
              </Button>
            </Link>
            <Link to="/u/alexrivera">
              <Button size="lg" variant="outline">
                Explore Demo
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>

          <div className="mt-9 flex flex-wrap items-center gap-x-1.5 gap-y-2">
            {workflow.map((step, i) => (
              <div key={step} className="flex items-center gap-1.5">
                <span className="rounded-md border border-border bg-surface px-2.5 py-1 font-mono text-[12px] text-foreground/80">
                  {step}
                </span>
                {i < workflow.length - 1 && (
                  <ArrowRight className="h-3.5 w-3.5 text-muted-2" />
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="lg:pl-4">
          <MiniCase />
        </div>
      </div>
    </section>
  )
}

function WhySection() {
  return (
    <section id="why" className="border-b border-border">
      <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
        <div className="max-w-2xl">
          <h2 className="text-3xl font-semibold tracking-tight text-balance">Why DebugProof?</h2>
          <p className="mt-3 text-[15px] text-muted">
            Anyone can list technologies. DebugProof helps you prove judgment — the part of
            engineering that actually separates candidates.
          </p>
        </div>
        <div className="mt-10 grid gap-4 md:grid-cols-3">
          {reasons.map(({ icon: Icon, title, body }, i) => (
            <Card key={title} className="p-6">
              <div className="flex items-center gap-2.5">
                <span className="flex h-9 w-9 items-center justify-center rounded-lg border border-border bg-surface-2 text-primary">
                  <Icon className="h-4.5 w-4.5" />
                </span>
                <span className="font-mono text-[12px] text-muted-2">0{i + 1}</span>
              </div>
              <h3 className="mt-4 text-[15px] font-medium">{title}</h3>
              <p className="mt-1.5 text-sm leading-relaxed text-muted">{body}</p>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}

function RecruiterSection() {
  return (
    <section id="recruiters" className="border-b border-border bg-surface/40">
      <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
        <div className="grid gap-10 lg:grid-cols-2 lg:items-center">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full border border-border bg-surface px-3 py-1 text-[12px] text-muted">
              <ListChecks className="h-3.5 w-3.5 text-accent" />
              For recruiters &amp; hiring engineers
            </span>
            <h2 className="mt-5 text-3xl font-semibold tracking-tight text-balance">
              See how candidates actually solve problems.
            </h2>
            <p className="mt-4 text-[15px] leading-relaxed text-muted">
              Instead of guessing from a tech list, review the real investigation: what broke,
              what they checked, why it happened, and how they verified the fix — each step backed
              by evidence.
            </p>
            <Link to="/u/alexrivera" className="mt-6 inline-block">
              <Button variant="outline">
                View a recruiter profile
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <Card className="p-5">
              <p className="text-[11px] font-medium uppercase tracking-wider text-muted-2">
                Traditional portfolio
              </p>
              <p className="mt-3 text-sm text-muted">Projects + technologies</p>
              <ul className="mt-4 space-y-2 text-[13px] text-muted-2">
                <li>React, Node, PostgreSQL</li>
                <li>3 side projects</li>
                <li>“Familiar with debugging”</li>
              </ul>
            </Card>
            <Card className="border-primary/40 bg-primary-soft/30 p-5">
              <p className="text-[11px] font-medium uppercase tracking-wider text-primary">
                DebugProof
              </p>
              <p className="mt-3 text-sm text-foreground">
                Projects + real problems + evidence + reasoning + verified outcomes
              </p>
              <ul className="mt-4 space-y-2 text-[13px] text-foreground/80">
                <li>12 structured debugging cases</li>
                <li>8 verified with tests &amp; commits</li>
                <li>Skills backed by real evidence</li>
              </ul>
            </Card>
          </div>
        </div>
      </div>
    </section>
  )
}

function FinalCta() {
  return (
    <section className="relative overflow-hidden">
      <div className="dp-grid pointer-events-none absolute inset-0 opacity-60" aria-hidden />
      <div className="relative mx-auto max-w-3xl px-4 py-24 text-center sm:px-6">
        <h2 className="text-3xl font-semibold tracking-tight text-balance sm:text-4xl">
          Make your next interview about your thinking.
        </h2>
        <p className="mx-auto mt-4 max-w-xl text-[15px] text-muted">
          Connect GitHub, pick a real fix, and turn it into an engineering case study in minutes.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Link to="/dashboard">
            <Button size="lg">
              <Github className="h-4.5 w-4.5" />
              Connect GitHub
            </Button>
          </Link>
          <Link to="/u/alexrivera">
            <Button size="lg" variant="outline">
              Explore Demo
            </Button>
          </Link>
        </div>
      </div>
    </section>
  )
}

export function LandingPage() {
  return (
    <div className="min-h-screen bg-background">
      <MarketingNav />
      <Hero />
      <WhySection />
      <RecruiterSection />
      <FinalCta />
      <footer className="border-t border-border">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-3 px-4 py-8 text-sm text-muted-2 sm:flex-row sm:px-6">
          <Logo />
          <p>Built for engineers who can show their work.</p>
        </div>
      </footer>
    </div>
  )
}
