export type Difficulty = "trivial" | "easy" | "medium" | "hard" | "nightmare"

export type CaseStatus = "Draft" | "Verified"

export type TrustLevel = "AI Generated" | "Developer Reviewed" | "Verified Evidence"

export type EvidenceType =
  | "GitHub Commit"
  | "Code Diff"
  | "Error Log"
  | "Screenshot"
  | "Test Result"

export interface User {
  id: string
  name: string
  username: string
  email: string
  avatarUrl: string
  title: string
  location: string
  githubConnected: boolean
  bio: string
}

export interface Skill {
  id: string
  name: string
  caseCount: number
  verifiedCount: number
  category: "Language" | "Framework" | "Database" | "Tooling" | "Concept"
}

export interface Project {
  id: string
  name: string
  description: string
  technologies: string[]
  caseCount: number
  verifiedCount: number
  githubUrl: string
  stars: number
  lastActive: string
}

export interface Commit {
  id: string
  sha: string
  message: string
  author: string
  date: string
  filesChanged: number
  additions: number
  deletions: number
  repo: string
}

export interface Repository {
  id: string
  name: string
  description: string
  language: string
  private: boolean
  updatedAt: string
  commits: Commit[]
}

export interface Evidence {
  id: string
  type: EvidenceType
  title: string
  trust: TrustLevel
  language?: string
  content?: string
  meta?: string
}

export interface CaseSection {
  key: string
  index: string
  title: string
  body: string
  trust: TrustLevel
  code?: { language: string; content: string }
}

export interface DebugCase {
  id: string
  title: string
  problemSummary: string
  projectId: string
  projectName: string
  skills: string[]
  difficulty: Difficulty
  proofScore: number
  status: CaseStatus
  createdAt: string
  updatedAt: string
  trust: TrustLevel
  sections: CaseSection[]
  evidence: Evidence[]
}

export interface DashboardStats {
  totalCases: number
  verifiedCases: number
  skillsDemonstrated: number
  projects: number
  proofStrength: number
}
