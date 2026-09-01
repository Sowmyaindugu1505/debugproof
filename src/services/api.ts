import {
  currentUser,
  dashboardStats,
  debugCases,
  projects,
  repositories,
  skills,
} from "@/data/mock"

import type {
  DashboardStats,
  DebugCase,
  Difficulty,
  Project,
  Repository,
  Skill,
  User,
} from "@/types"

/**
 * Service abstraction layer.
 *
 * Every UI feature talks to this module instead of importing mock data or
 * calling fetch directly. When the FastAPI backend is ready, only the bodies
 * of these functions change while the public signatures stay identical.
 */

const LATENCY = 220

const CREATED_CASES_STORAGE_KEY = "debugproof-created-cases"

function getPersistedCases(): DebugCase[] {
  if (typeof window === "undefined") return []

  try {
    const stored = window.localStorage.getItem(CREATED_CASES_STORAGE_KEY)

    if (!stored) return []

    const parsed = JSON.parse(stored)

    return Array.isArray(parsed) ? (parsed as DebugCase[]) : []
  } catch {
    return []
  }
}

function persistCase(debugCase: DebugCase): void {
  if (typeof window === "undefined") return

  const existing = getPersistedCases()
  const withoutDuplicate = existing.filter((item) => item.id !== debugCase.id)

  window.localStorage.setItem(
    CREATED_CASES_STORAGE_KEY,
    JSON.stringify([...withoutDuplicate, debugCase]),
  )
}

function getAllDebugCases(): DebugCase[] {
  const persisted = getPersistedCases()
  const persistedIds = new Set(persisted.map((debugCase) => debugCase.id))

  return [
    ...debugCases.filter((debugCase) => !persistedIds.has(debugCase.id)),
    ...persisted,
  ]
}

function delay<T>(value: T, ms = LATENCY): Promise<T> {
  return new Promise((resolve) => {
    setTimeout(() => resolve(value), ms)
  })
}

export interface CreateCaseInput {
  title: string
  projectId: string
  difficulty: Difficulty
  tech: string[]
  symptom: string
  hypotheses: string[]
  steps: string[]
  rootCause: string
  fix: string
  lesson: string
}

export function calculateProofScore(input: CreateCaseInput): number {
  let score = 20

  if (input.title.trim().length > 10) score += 5
  if (input.symptom.trim().length > 30) score += 10
  if (input.hypotheses.length >= 2) score += 10
  if (input.steps.length >= 3) score += 15
  if (input.rootCause.trim().length > 30) score += 15
  if (input.fix.trim().length > 30) score += 10
  if (input.lesson.trim().length > 10) score += 5
  if (input.tech.length >= 2) score += 5
  if (input.projectId) score += 5

  return Math.min(score, 100)
}

export const api = {
  // --- auth / user ---------------------------------------------------------

  getCurrentUser(): Promise<User> {
    return delay(currentUser)
  },

  getPublicUser(username: string): Promise<User | null> {
    const user = currentUser.username === username ? currentUser : null
    return delay(user)
  },

  // --- dashboard -----------------------------------------------------------

  getDashboardStats(): Promise<DashboardStats> {
    return delay(dashboardStats)
  },

  // --- projects ------------------------------------------------------------

  getProjects(): Promise<Project[]> {
    return delay(projects)
  },

  getProject(id: string): Promise<Project | null> {
    return delay(projects.find((p) => p.id === id) ?? null)
  },

  // --- github --------------------------------------------------------------

  getRepositories(): Promise<Repository[]> {
    return delay(repositories)
  },

  getRepository(id: string): Promise<Repository | null> {
    return delay(repositories.find((r) => r.id === id) ?? null)
  },

  // --- debug cases ---------------------------------------------------------

  getDebugCases(): Promise<DebugCase[]> {
    return delay(getAllDebugCases())
  },

  getDebugCase(id: string): Promise<DebugCase | null> {
    return delay(getAllDebugCases().find((c) => c.id === id) ?? null)
  },

  getCasesByProject(projectId: string): Promise<DebugCase[]> {
    return delay(getAllDebugCases().filter((c) => c.projectId === projectId))
  },

  // --- create debug case ---------------------------------------------------

  createCase(input: CreateCaseInput): Promise<DebugCase> {
    const project = projects.find((p) => p.id === input.projectId)

    const now = new Date().toISOString()

    const created: DebugCase = {
      id: `case-${Date.now()}`,
      title: input.title,
      problemSummary: input.symptom,
      projectId: input.projectId,
      projectName: project?.name ?? "Unassigned",
      skills: input.tech,
      difficulty: input.difficulty,
      proofScore: calculateProofScore(input),
      status: "Draft",
      createdAt: now,
      updatedAt: now,
      trust: "AI Generated",

      sections: [
        {
          key: "investigation",
          index: "02",
          title: "Investigation",
          body: input.steps.join("\n"),
          trust: "AI Generated",
        },
        {
          key: "root-cause",
          index: "03",
          title: "Root cause",
          body: input.rootCause,
          trust: "AI Generated",
        },
        {
          key: "fix",
          index: "04",
          title: "The fix",
          body: input.fix,
          trust: "AI Generated",
        },
        {
          key: "lesson",
          index: "05",
          title: "Lesson learned",
          body: input.lesson || "No lesson recorded.",
          trust: "AI Generated",
        },
      ],

      evidence: [],
    }

    persistCase(created)

    return delay(created)
  },

  // --- skills --------------------------------------------------------------

  getSkills(): Promise<Skill[]> {
    return delay(skills)
  },
}

export type Api = typeof api
