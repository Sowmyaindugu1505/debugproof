import { describe, expect, it } from "vitest"
import { calculateProofScore, type CreateCaseInput } from "./api"

function makeInput(overrides: Partial<CreateCaseInput> = {}): CreateCaseInput {
  return {
    title: "",
    projectId: "",
    difficulty: "medium",
    tech: [],
    symptom: "",
    hypotheses: [],
    steps: [],
    rootCause: "",
    fix: "",
    lesson: "",
    ...overrides,
  }
}

describe("calculateProofScore", () => {
  it("returns the baseline score for an empty case", () => {
    const score = calculateProofScore(makeInput())

    expect(score).toBe(20)
  })

  it("rewards a well-documented debug case", () => {
    const score = calculateProofScore(
      makeInput({
        title: "Fix profile rendering after API response change",
        projectId: "project-1",
        tech: ["React", "TypeScript"],
        symptom:
          "The profile page stopped rendering after the API response structure changed.",
        hypotheses: [
          "The API response shape changed.",
          "The UI is reading the wrong nested property.",
        ],
        steps: [
          "Inspect the failing response.",
          "Compare the response with the frontend type.",
          "Update the data mapping and rerun the page.",
        ],
        rootCause:
          "The frontend expected a flat user object while the API now returned the user inside a data property.",
        fix:
          "Updated the profile data mapping to read the nested response and adjusted the related type.",
        lesson:
          "Validate external response contracts at service boundaries.",
      }),
    )

    expect(score).toBe(100)
  })

  it("never returns a score above 100", () => {
    const score = calculateProofScore(
      makeInput({
        title: "A sufficiently detailed debugging case title",
        projectId: "project-1",
        tech: ["React", "TypeScript", "Vite"],
        symptom:
          "A detailed symptom description that is clearly longer than thirty characters.",
        hypotheses: ["First hypothesis", "Second hypothesis", "Third hypothesis"],
        steps: ["Step one", "Step two", "Step three", "Step four"],
        rootCause:
          "A detailed root cause explanation that is clearly longer than thirty characters.",
        fix:
          "A detailed fix explanation that is clearly longer than thirty characters.",
        lesson: "A meaningful lesson from the debugging investigation.",
      }),
    )

    expect(score).toBeLessThanOrEqual(100)
  })
})
