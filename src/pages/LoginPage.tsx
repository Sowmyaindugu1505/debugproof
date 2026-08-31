import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { ArrowLeft, Github, Mail } from "lucide-react"
import { Logo } from "@/components/shared/Logo"
import { Button } from "@/components/ui/Button"

export function LoginPage() {
  const navigate = useNavigate()
  const [showEmail, setShowEmail] = useState(false)
  const [email, setEmail] = useState("")

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <div className="flex items-center justify-between px-6 py-5">
        <Link to="/" aria-label="DebugProof home">
          <Logo />
        </Link>
        <Link
          to="/"
          className="inline-flex items-center gap-1.5 text-sm text-muted transition-colors hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" />
          Back
        </Link>
      </div>

      <div className="flex flex-1 items-center justify-center px-4 pb-24">
        <div className="w-full max-w-sm">
          <div className="text-center">
            <h1 className="text-2xl font-semibold tracking-tight">Sign in to DebugProof</h1>
            <p className="mt-2 text-sm text-muted">
              Connect your account to start building evidence-backed cases.
            </p>
          </div>

          <div className="mt-8 space-y-3">
            <Button className="w-full" size="lg" onClick={() => navigate("/dashboard")}>
              <Github className="h-4.5 w-4.5" />
              Continue with GitHub
            </Button>

            {!showEmail ? (
              <Button
                className="w-full"
                size="lg"
                variant="outline"
                onClick={() => setShowEmail(true)}
              >
                <Mail className="h-4.5 w-4.5" />
                Continue with Email
              </Button>
            ) : (
              <form
                className="space-y-3"
                onSubmit={(e) => {
                  e.preventDefault()
                  navigate("/dashboard")
                }}
              >
                <input
                  type="email"
                  required
                  autoFocus
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="h-11 w-full rounded-lg border border-border-strong bg-surface px-3.5 text-sm outline-none transition-colors placeholder:text-muted-2 focus:border-primary"
                />
                <Button type="submit" className="w-full" size="lg">
                  Continue
                </Button>
              </form>
            )}
          </div>

          <p className="mt-8 text-center text-[12px] leading-relaxed text-muted-2">
            By continuing you agree to the Terms of Service and acknowledge the Privacy Policy.
          </p>
        </div>
      </div>
    </div>
  )
}
