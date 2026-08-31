import { useState } from "react"
import { Link, NavLink, Outlet, useLocation } from "react-router-dom"
import {
  FolderGit2,
  Github,
  LayoutDashboard,
  Menu,
  Moon,
  Plus,
  Settings,
  Sparkles,
  Sun,
  User,
  Wrench,
  X,
  ScanSearch,
} from "lucide-react"
import { Logo } from "@/components/shared/Logo"
import { Button } from "@/components/ui/Button"
import { useTheme } from "@/hooks/useTheme"
import { useCurrentUser } from "@/hooks/queries"
import { cn } from "@/lib/utils"

const nav = [
  { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/projects", label: "Projects", icon: FolderGit2 },

  // Analyze errors and turn them into DebugProof cases
  { to: "/analyze", label: "Analyze Error", icon: ScanSearch },

  { to: "/debug-cases", label: "Debug Cases", icon: Wrench },
  { to: "/github", label: "GitHub", icon: Github },
  { to: "/skills", label: "Skills", icon: Sparkles },
  { to: "/profile", label: "Profile", icon: User },
  { to: "/settings", label: "Settings", icon: Settings },
]

function SidebarNav({ onNavigate }: { onNavigate?: () => void }) {
  return (
    <nav className="flex flex-1 flex-col gap-0.5 px-3 py-4">
      {nav.map(({ to, label, icon: Icon }) => (
        <NavLink
          key={to}
          to={to}
          onClick={onNavigate}
          className={({ isActive }) =>
            cn(
              "group flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
              isActive
                ? "bg-primary-soft text-primary"
                : "text-muted hover:bg-surface-2 hover:text-foreground",
            )
          }
        >
          {({ isActive }) => (
            <>
              <Icon
                className={cn(
                  "h-4.5 w-4.5",
                  isActive ? "text-primary" : "text-muted-2",
                )}
                strokeWidth={2}
              />
              {label}
            </>
          )}
        </NavLink>
      ))}
    </nav>
  )
}

function UserCard() {
  const { data: user } = useCurrentUser()

  if (!user) return null

  return (
    <div className="flex items-center gap-3 border-t border-border p-3">
      <img
        src={user.avatarUrl || "/placeholder.svg"}
        alt=""
        className="h-8 w-8 rounded-full border border-border object-cover"
      />

      <div className="min-w-0 flex-1">
        <p className="truncate text-[13px] font-medium">
          {user.name}
        </p>

        <p className="truncate text-[11px] text-muted-2">
          @{user.username}
        </p>
      </div>
    </div>
  )
}

export function AppShell() {
  const { theme, toggleTheme } = useTheme()
  const [mobileOpen, setMobileOpen] = useState(false)
  const location = useLocation()

  return (
    <div className="flex min-h-screen bg-background">

      {/* Desktop sidebar */}
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-60 flex-col border-r border-border bg-surface lg:flex">

        <div className="flex h-14 items-center border-b border-border px-4">
          <Link
            to="/dashboard"
            aria-label="DebugProof home"
          >
            <Logo />
          </Link>
        </div>

        <SidebarNav />

        <UserCard />
      </aside>

      {/* Mobile drawer */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">

          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setMobileOpen(false)}
          />

          <aside className="absolute inset-y-0 left-0 flex w-64 flex-col border-r border-border bg-surface">

            <div className="flex h-14 items-center justify-between border-b border-border px-4">
              <Logo />

              <button
                onClick={() => setMobileOpen(false)}
                className="text-muted hover:text-foreground"
                aria-label="Close navigation"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <SidebarNav
              onNavigate={() => setMobileOpen(false)}
            />

            <UserCard />

          </aside>
        </div>
      )}

      {/* Main column */}
      <div className="flex min-w-0 flex-1 flex-col lg:pl-60">

        <header className="sticky top-0 z-20 flex h-14 items-center justify-between gap-3 border-b border-border bg-background/80 px-4 backdrop-blur-md sm:px-6">

          <div className="flex items-center gap-2">

            <button
              onClick={() => setMobileOpen(true)}
              className="text-muted hover:text-foreground lg:hidden"
              aria-label="Open navigation"
            >
              <Menu className="h-5 w-5" />
            </button>

            <span className="lg:hidden">
              <Logo showWordmark={false} />
            </span>

          </div>

          <div className="flex items-center gap-2">

            <Link to="/debug-cases/new">
              <Button size="sm">
                <Plus className="h-4 w-4" />
                <span className="hidden sm:inline">
                  New Case
                </span>
              </Button>
            </Link>

            <button
              onClick={toggleTheme}
              className="flex h-8 w-8 items-center justify-center rounded-md border border-border text-muted transition-colors hover:text-foreground"
              aria-label="Toggle theme"
            >
              {theme === "dark" ? (
                <Sun className="h-4 w-4" />
              ) : (
                <Moon className="h-4 w-4" />
              )}
            </button>

          </div>
        </header>

        <main
          key={location.pathname}
          className="animate-fade-up mx-auto w-full max-w-6xl flex-1 px-4 py-8 sm:px-6 lg:px-8"
        >
          <Outlet />
        </main>

      </div>
    </div>
  )
}