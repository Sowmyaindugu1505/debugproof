import { Link } from "react-router-dom"
import { Button } from "../components/ui/Button"
import { Logo } from "../components/shared/Logo"

export function NotFoundPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-6 bg-background px-4 text-center">
      <Logo />
      <div className="font-mono text-sm text-muted-foreground">
        <span className="text-danger">Error 404:</span> route not found
      </div>
      <h1 className="text-4xl font-semibold text-foreground text-balance">
        This page threw an unhandled exception
      </h1>
      <p className="max-w-md text-muted-foreground text-pretty">
        The page you&apos;re looking for doesn&apos;t exist — but that&apos;s just another bug waiting to be
        documented.
      </p>
      <div className="flex gap-3">
        <Link to="/">
          <Button variant="secondary">Go home</Button>
        </Link>
        <Link to="/app">
          <Button>Open dashboard</Button>
        </Link>
      </div>
    </div>
  )
}
