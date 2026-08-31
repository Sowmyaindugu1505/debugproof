import { createBrowserRouter } from "react-router-dom"
import { AppShell } from "@/layouts/AppShell"
import { LandingPage } from "@/pages/LandingPage"
import { LoginPage } from "@/pages/LoginPage"
import { DashboardPage } from "@/pages/DashboardPage"
import { ProjectsPage } from "@/pages/ProjectsPage"
import { ProjectDetailPage } from "@/pages/ProjectDetailPage"
import { GitHubPage } from "@/pages/GitHubPage"
import { DebugCasesPage } from "@/pages/DebugCasesPage"
import { CreateCasePage } from "@/pages/CreateCasePage"
import { CaseDetailPage } from "@/pages/CaseDetailPage"
import { SkillsPage } from "@/pages/SkillsPage"
import { ProfilePage } from "@/pages/ProfilePage"
import { SettingsPage } from "@/pages/SettingsPage"
import { PublicProfilePage } from "@/pages/PublicProfilePage"
import { PublicCasePage } from "@/pages/PublicCasePage"
import { ChallengePage } from "@/pages/ChallengePage"
import { NotFoundPage } from "@/pages/NotFoundPage"
import { AnalyzeErrorPage } from "@/pages/AnalyzeErrorPage"

export const router = createBrowserRouter([
  { path: "/", element: <LandingPage /> },
  { path: "/login", element: <LoginPage /> },
  { path: "/u/:username", element: <PublicProfilePage /> },
  { path: "/u/:username/cases/:caseId", element: <PublicCasePage /> },
  { path: "/challenge", element: <ChallengePage /> },
  {
    element: <AppShell />,
    children: [
      { path: "/dashboard", element: <DashboardPage /> },
      { path: "/analyze", element: <AnalyzeErrorPage /> },
      { path: "/projects", element: <ProjectsPage /> },
      { path: "/projects/:id", element: <ProjectDetailPage /> },
      { path: "/github", element: <GitHubPage /> },
      { path: "/debug-cases", element: <DebugCasesPage /> },
      { path: "/debug-cases/new", element: <CreateCasePage /> },
      { path: "/debug-cases/:id", element: <CaseDetailPage /> },
      { path: "/skills", element: <SkillsPage /> },
      { path: "/profile", element: <ProfilePage /> },
      { path: "/settings", element: <SettingsPage /> },
    ],
  },
  { path: "*", element: <NotFoundPage /> },
])
