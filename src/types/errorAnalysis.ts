export interface ErrorAnalysisRequest {
  error: string
  code: string
  language: string
  context: string
}

export interface InvestigationStep {
  id: string
  title: string
  description: string
  status: "completed" | "current" | "pending"
}

export interface ErrorAnalysisResult {
  errorType: string
  severity: "Low" | "Medium" | "High" | "Critical"

  symptom: string

  likelyCause: string

  confidence: number

  investigation: InvestigationStep[]

  rootCause: string

  recommendedFix: string

  fixedCode?: string

  verification: {
    status: "verified" | "needs-review"
    explanation: string
  }

  warnings: string[]
}