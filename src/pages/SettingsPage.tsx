import { useState } from "react"
import { PageHeader } from "../components/shared/PageHeader"
import { Card } from "../components/ui/Card"
import { Button } from "../components/ui/Button"
import { Label, Input, FieldHint } from "../components/ui/Field"
import { useTheme } from "../hooks/useTheme"
import { useCurrentUser } from "../hooks/queries"
import { Moon, Sun, Github, Check } from "lucide-react"

export function SettingsPage() {
  const { theme, toggleTheme } = useTheme()
  const { data: profile } = useCurrentUser()
  const [saved, setSaved] = useState(false)

  const save = (e: React.FormEvent) => {
    e.preventDefault()
    setSaved(true)
    setTimeout(() => setSaved(false), 1600)
  }

  return (
    <div className="mx-auto max-w-2xl">
      <PageHeader title="Settings" description="Manage your account, appearance, and integrations." />

      <div className="flex flex-col gap-6">
        <Card className="p-6">
          <h2 className="mb-4 text-sm font-semibold text-foreground">Profile</h2>
          <form className="flex flex-col gap-4" onSubmit={save}>
            <div>
              <Label htmlFor="name">Display name</Label>
              <Input id="name" defaultValue={profile?.name} />
            </div>
            <div>
              <Label htmlFor="handle">Public handle</Label>
              <Input id="handle" defaultValue={profile?.username} />
              <FieldHint>debugproof.dev/u/{profile?.username}</FieldHint>
            </div>
            <div>
              <Label htmlFor="title">Headline</Label>
              <Input id="title" defaultValue={profile?.title} />
            </div>
            <div className="flex justify-end">
              <Button type="submit">
                {saved ? (
                  <>
                    <Check className="h-4 w-4" />
                    Saved
                  </>
                ) : (
                  "Save changes"
                )}
              </Button>
            </div>
          </form>
        </Card>

        <Card className="p-6">
          <h2 className="mb-4 text-sm font-semibold text-foreground">Appearance</h2>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-foreground">Theme</p>
              <p className="text-sm text-muted-foreground">
                Currently using {theme === "dark" ? "dark" : "light"} mode.
              </p>
            </div>
            <Button variant="secondary" onClick={toggleTheme} type="button">
              {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
              Switch to {theme === "dark" ? "light" : "dark"}
            </Button>
          </div>
        </Card>

        <Card className="p-6">
          <h2 className="mb-4 text-sm font-semibold text-foreground">Integrations</h2>
          <div className="flex items-center justify-between rounded-lg border border-border bg-surface p-4">
            <div className="flex items-center gap-3">
              <Github className="h-5 w-5 text-foreground" />
              <div>
                <p className="text-sm font-medium text-foreground">GitHub</p>
                <p className="text-sm text-muted-foreground">Link commits to verify your cases.</p>
              </div>
            </div>
            <Button variant="secondary" size="sm" type="button">
              Connected
            </Button>
          </div>
        </Card>

        <Card className="border-danger/40 p-6">
          <h2 className="mb-1 text-sm font-semibold text-danger">Danger zone</h2>
          <p className="mb-4 text-sm text-muted-foreground">
            Permanently delete your account and all debug cases.
          </p>
          <Button variant="danger" size="sm" type="button">
            Delete account
          </Button>
        </Card>
      </div>
    </div>
  )
}
