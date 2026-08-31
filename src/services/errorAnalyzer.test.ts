import { describe, expect, it } from "vitest"
import { analyzeError } from "./errorAnalyzer"

describe("analyzeError", () => {
  it("classifies undefined property errors as runtime errors", async () => {
    const result = await analyzeError({
      error: "TypeError: Cannot read properties of undefined (reading 'name')",
      language: "TypeScript",
      code: "const name = user.name",
      context: "",
    })

    expect(result.errorType).toBe("Runtime Error")
    expect(result.verification.status).toBe("needs-review")
  })

  it("classifies syntax errors", async () => {
    const result = await analyzeError({
      error: "SyntaxError: Unexpected token '}'",
      language: "JavaScript",
      code: "",
      context: "",
    })

    expect(result.errorType).toBe("Syntax Error")
  })

  it("classifies missing modules as import errors", async () => {
    const result = await analyzeError({
      error: "Cannot find module 'react-test-package'",
      language: "TypeScript",
      code: "",
      context: "",
    })

    expect(result.errorType).toBe("Module / Import Error")
  })

  it("classifies failed fetch requests as network errors", async () => {
    const result = await analyzeError({
      error: "TypeError: Failed to fetch",
      language: "TypeScript",
      code: "",
      context: "",
    })

    expect(result.errorType).toBe("Network / API Error")
  })

  it("classifies Python KeyError correctly", async () => {
    const result = await analyzeError({
      error: "KeyError: 'username'",
      language: "Python",
      code: "print(user['username'])",
      context: "",
    })

    expect(result.errorType).toBe("Python KeyError")
  })

  it("falls back to unknown error when no supported pattern matches", async () => {
    const result = await analyzeError({
      error: "Something unusual happened",
      language: "TypeScript",
      code: "",
      context: "",
    })

    expect(result.errorType).toBe("Unknown Error")
    expect(result.confidence).toBeLessThan(60)
  })
})