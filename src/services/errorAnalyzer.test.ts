import { afterEach, describe, expect, it, vi } from "vitest"
import { analyzeError } from "./errorAnalyzer"

afterEach(() => {
  vi.useRealTimers()
})

describe("analyzeError", () => {
  it("classifies undefined property errors as runtime errors", async () => {
    vi.useFakeTimers()

    const promise = analyzeError({
      error: "TypeError: Cannot read properties of undefined (reading 'name')",
      language: "TypeScript",
      code: "const name = user.name",
      context: "",
    })

    await vi.advanceTimersByTimeAsync(1200)

    const result = await promise

    expect(result.errorType).toBe("Runtime Error")
    expect(result.verification.status).toBe("needs-review")
  })

  it("classifies syntax errors", async () => {
    vi.useFakeTimers()

    const promise = analyzeError({
      error: "SyntaxError: Unexpected token '}'",
      language: "JavaScript",
      code: "",
      context: "",
    })

    await vi.advanceTimersByTimeAsync(1200)

    const result = await promise

    expect(result.errorType).toBe("Syntax Error")
  })

  it("classifies missing modules as import errors", async () => {
    vi.useFakeTimers()

    const promise = analyzeError({
      error: "Cannot find module 'react-test-package'",
      language: "TypeScript",
      code: "",
      context: "",
    })

    await vi.advanceTimersByTimeAsync(1200)

    const result = await promise

    expect(result.errorType).toBe("Module / Import Error")
  })

  it("classifies failed fetch requests as network errors", async () => {
    vi.useFakeTimers()

    const promise = analyzeError({
      error: "TypeError: Failed to fetch",
      language: "TypeScript",
      code: "",
      context: "",
    })

    await vi.advanceTimersByTimeAsync(1200)

    const result = await promise

    expect(result.errorType).toBe("Network / API Error")
  })

  it("classifies Python KeyError correctly", async () => {
    vi.useFakeTimers()

    const promise = analyzeError({
      error: "KeyError: 'username'",
      language: "Python",
      code: "print(user['username'])",
      context: "",
    })

    await vi.advanceTimersByTimeAsync(1200)

    const result = await promise

    expect(result.errorType).toBe("Python KeyError")
  })

  it("falls back to unknown error when no supported pattern matches", async () => {
    vi.useFakeTimers()

    const promise = analyzeError({
      error: "Something unusual happened",
      language: "TypeScript",
      code: "",
      context: "",
    })

    await vi.advanceTimersByTimeAsync(1200)

    const result = await promise

    expect(result.errorType).toBe("Unknown Error")
    expect(result.confidence).toBe("low")
  })
})