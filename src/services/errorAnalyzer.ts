import type {
  ErrorAnalysisRequest,
  ErrorAnalysisResult,
  InvestigationStep,
} from "@/types/errorAnalysis"

function wait(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

function createInvestigation(
  steps: Array<{
    title: string
    description: string
  }>,
): InvestigationStep[] {
  return steps.map((step, index) => ({
    id: `step-${index + 1}`,
    title: step.title,
    description: step.description,
    status:
      index < 2
        ? "completed"
        : index === 2
          ? "current"
          : "pending",
  }))
}

function containsAny(text: string, patterns: string[]) {
  return patterns.some((pattern) => text.includes(pattern))
}

function analyzeRuntimeError(
  request: ErrorAnalysisRequest,
): ErrorAnalysisResult {
  const code = request.code.trim()

  return {
    errorType: "Runtime Error",
    severity: "High",

    symptom:
      "The application attempted to access or use a value that was not available at runtime.",

    likelyCause:
      "A variable, object, response, or state value is undefined or null when the application expects it to contain data.",

    confidence: code ? 91 : 86,

    investigation: createInvestigation([
      {
        title: "Runtime failure identified",
        description:
          "The error message indicates that execution failed while evaluating application logic.",
      },
      {
        title: "Failing expression isolated",
        description:
          "Trace the stack trace to the expression where the undefined or null value is being accessed.",
      },
      {
        title: "Value origin checked",
        description:
          "Inspect where the value is created, returned from an API, passed through props, or initialized in application state.",
      },
      {
        title: "Fix verification",
        description:
          "Reproduce the original operation and confirm that the application no longer throws the runtime exception.",
      },
    ]),

    rootCause:
      "The code assumes that a value exists at the time it is accessed, but the value can be undefined or null during an actual execution path.",

    recommendedFix:
      "Validate the value before accessing it. Depending on the intended behavior, use a guard clause, optional chaining, a default value, or correct the upstream data flow.",

    fixedCode: code
      ? `${code}\n\n// Example defensive access:\n// const value = data?.property`
      : "// Example defensive access:\nconst value = data?.property",

    verification: {
      status: "needs-review",
      explanation:
        "The suggested approach is structurally reasonable, but the application must be executed and the original failure reproduced before the fix can be considered verified.",
    },

    warnings: [
      "The analyzer cannot prove the exact root cause without executing the application.",
      "Review the suggested fix against the actual data flow before applying it.",
    ],
  }
}

function analyzeSyntaxError(
  request: ErrorAnalysisRequest,
): ErrorAnalysisResult {
  return {
    errorType: "Syntax Error",
    severity: "High",

    symptom:
      "The language parser could not understand part of the supplied source code.",

    likelyCause:
      "The source may contain a missing bracket, parenthesis, quote, comma, operator, keyword, or another malformed expression.",

    confidence: 94,

    investigation: createInvestigation([
      {
        title: "Parser failure identified",
        description:
          "The error is classified as a syntax-level failure that prevents the source from being parsed.",
      },
      {
        title: "Reported location inspected",
        description:
          "Inspect the line and column reported by the compiler, parser, Vite, or browser console.",
      },
      {
        title: "Surrounding syntax checked",
        description:
          "Compare nearby brackets, parentheses, quotes, commas, imports, exports, and expressions.",
      },
      {
        title: "Build verification",
        description:
          "Run the development server or production build again and confirm that the parser error has disappeared.",
      },
    ]),

    rootCause:
      "The supplied source contains syntax that does not conform to the grammar expected by the selected language or parser.",

    recommendedFix:
      "Inspect the reported line and the surrounding statements for missing delimiters, malformed expressions, incorrect imports, or invalid syntax.",

    verification: {
      status: "needs-review",
      explanation:
        "The issue should only be considered resolved after the project successfully parses and builds again.",
    },

    warnings: [
      "The exact offending character cannot always be identified without a complete source file and parser location.",
    ],
  }
}

function analyzeImportError(
  request: ErrorAnalysisRequest,
): ErrorAnalysisResult {
  return {
    errorType: "Module / Import Error",
    severity: "High",

    symptom:
      "The application cannot resolve or load a requested module, package, file, or exported symbol.",

    likelyCause:
      "The import path may be incorrect, the dependency may not be installed, the file may not exist, or the requested symbol may not be exported by the target module.",

    confidence: 93,

    investigation: createInvestigation([
      {
        title: "Module resolution failure identified",
        description:
          "The runtime or bundler reported that an imported module or export could not be resolved.",
      },
      {
        title: "Import statement inspected",
        description:
          "Check the exact import path, filename, alias, capitalization, and requested export name.",
      },
      {
        title: "Target module checked",
        description:
          "Open the target module and verify that the requested file and named export actually exist.",
      },
      {
        title: "Dependency verification",
        description:
          "If the import is an external package, verify that it is installed locally and listed in package.json.",
      },
    ]),

    rootCause:
      "The application's import graph references a module or export that the bundler cannot resolve from the current project structure.",

    recommendedFix:
      "Verify the import path and exported symbol, correct the filename or export, and install the dependency if it is missing.",

    verification: {
      status: "needs-review",
      explanation:
        "Restart the development server or rebuild the application and confirm that the module resolution error no longer occurs.",
    },

    warnings: [
      "Do not install a package automatically if the intended module is actually a local file.",
      "Check whether the error is caused by a missing export rather than a missing dependency.",
    ],
  }
}

function analyzeNetworkError(
  request: ErrorAnalysisRequest,
): ErrorAnalysisResult {
  return {
    errorType: "Network / API Error",
    severity: "High",

    symptom:
      "The application failed to successfully communicate with a remote API or network resource.",

    likelyCause:
      "The backend may be unavailable, the endpoint may be incorrect, authentication may have failed, or the request may have been blocked by the browser or network.",

    confidence: 84,

    investigation: createInvestigation([
      {
        title: "Network failure identified",
        description:
          "The error indicates that a network request did not complete successfully.",
      },
      {
        title: "Request inspected",
        description:
          "Check the request URL, HTTP method, headers, request payload, and authentication information.",
      },
      {
        title: "Server response checked",
        description:
          "Inspect the HTTP status code and backend logs to determine whether the failure originated on the client or server.",
      },
      {
        title: "Request replayed",
        description:
          "Repeat the request after correcting the identified issue and confirm that the expected response is returned.",
      },
    ]),

    rootCause:
      "The client and server were unable to successfully complete the expected network request.",

    recommendedFix:
      "Verify the endpoint, server availability, authentication, request payload, CORS configuration, and HTTP response status.",

    verification: {
      status: "needs-review",
      explanation:
        "The network operation must succeed against the actual backend before the issue can be marked as verified.",
    },

    warnings: [
      "A frontend network error does not necessarily mean the frontend code is the root cause.",
      "Inspect the backend response and server logs before changing client-side code.",
    ],
  }
}

function analyzePythonError(
  request: ErrorAnalysisRequest,
): ErrorAnalysisResult {
  const error = request.error.toLowerCase()

  let errorType = "Python Exception"
  let likelyCause =
    "The Python application raised an exception while executing the supplied code."
  let recommendedFix =
    "Inspect the traceback from the bottom upward, identify the failing statement, and validate the values used by that statement."

  if (error.includes("keyerror")) {
    errorType = "Python KeyError"
    likelyCause =
      "The code attempted to access a dictionary key that does not exist."
    recommendedFix =
      "Verify that the key exists before accessing it, or use dict.get() when a missing key is an expected possibility."
  } else if (error.includes("indexerror")) {
    errorType = "Python IndexError"
    likelyCause =
      "The code attempted to access a list or sequence index outside its valid range."
    recommendedFix =
      "Check the sequence length and validate the index before accessing the element."
  } else if (error.includes("attributeerror")) {
    errorType = "Python AttributeError"
    likelyCause =
      "The code attempted to access an attribute that the current object does not provide."
    recommendedFix =
      "Inspect the object's actual type and ensure that the expected attribute exists before accessing it."
  } else if (error.includes("typeerror")) {
    errorType = "Python TypeError"
    likelyCause =
      "An operation was performed using incompatible Python types."
    recommendedFix =
      "Inspect the runtime types of the values involved and convert or validate them before performing the operation."
  } else if (error.includes("nameerror")) {
    errorType = "Python NameError"
    likelyCause =
      "The code references a variable, function, or name that is not defined in the current scope."
    recommendedFix =
      "Check spelling, imports, scope, and initialization of the referenced name."
  }

  return {
    errorType,
    severity: "High",

    symptom:
      "The Python runtime raised an exception while executing the application.",

    likelyCause,

    confidence: 88,

    investigation: createInvestigation([
      {
        title: "Python exception identified",
        description:
          "The traceback provides evidence that execution stopped because of a Python exception.",
      },
      {
        title: "Traceback inspected",
        description:
          "Start at the final traceback entry and locate the application statement that triggered the exception.",
      },
      {
        title: "Runtime values checked",
        description:
          "Inspect the types, values, keys, indexes, or attributes involved in the failing statement.",
      },
      {
        title: "Test verification",
        description:
          "Run the same operation again and confirm that the original exception no longer occurs.",
      },
    ]),

    rootCause: likelyCause,

    recommendedFix,

    verification: {
      status: "needs-review",
      explanation:
        "The proposed solution requires execution of the Python application and reproduction of the original failure.",
    },

    warnings: [
      "The traceback is stronger evidence than the exception name alone.",
      "Review the surrounding application logic before applying a generic fix.",
    ],
  }
}

function analyzeUnknownError(
  request: ErrorAnalysisRequest,
): ErrorAnalysisResult {
  const hasContext = Boolean(
    request.code.trim() || request.context.trim(),
  )

  return {
    errorType: "Unknown Error",
    severity: "Medium",

    symptom:
      "The supplied error could not be confidently classified using the available evidence.",

    likelyCause:
      hasContext
        ? "The available error message and context do not match a known pattern strongly enough to establish a reliable root cause."
        : "Additional application context, source code, stack trace information, or reproduction steps are required.",

    confidence: hasContext ? 55 : 42,

    investigation: createInvestigation([
      {
        title: "Error captured",
        description:
          "The supplied error has been recorded for investigation.",
      },
      {
        title: "Known patterns checked",
        description:
          "The error was compared against the analyzer's supported error patterns.",
      },
      {
        title: "Additional evidence required",
        description:
          "Inspect the stack trace, source code, logs, and reproduction steps for more precise evidence.",
      },
      {
        title: "Fix verification",
        description:
          "Any proposed fix must be tested against the original failure before it can be trusted.",
      },
    ]),

    rootCause:
      "The available evidence is insufficient to establish the actual root cause with high confidence.",

    recommendedFix:
      "Provide the complete error message, stack trace, relevant source code, language/framework, and exact reproduction steps.",

    verification: {
      status: "needs-review",
      explanation:
        "There is insufficient evidence to verify a fix at this stage.",
    },

    warnings: [
      "Do not treat this analysis as a confirmed root cause.",
      "Additional evidence is required before applying a fix.",
    ],
  }
}

export async function analyzeError(
  request: ErrorAnalysisRequest,
): Promise<ErrorAnalysisResult> {
  await wait(1200)

  const error = request.error.toLowerCase()
  const language = request.language.toLowerCase()

  if (
    containsAny(error, [
      "cannot read properties",
      "cannot read property",
      "undefined is not",
      "null is not",
      "is undefined",
      "is null",
    ])
  ) {
    return analyzeRuntimeError(request)
  }

  if (
    containsAny(error, [
      "syntaxerror",
      "syntax error",
      "unexpected token",
      "unexpected identifier",
      "unexpected end of input",
    ])
  ) {
    return analyzeSyntaxError(request)
  }

  if (
    containsAny(error, [
      "module not found",
      "cannot find module",
      "failed to resolve import",
      "does not provide an export named",
      "no matching export",
      "failed to load resource",
    ])
  ) {
    return analyzeImportError(request)
  }

  if (
    containsAny(error, [
      "failed to fetch",
      "network error",
      "cors",
      "fetch failed",
      "connection refused",
      "econnrefused",
      "timeout",
      "http 500",
      "http 404",
      "http 401",
      "http 403",
    ])
  ) {
    return analyzeNetworkError(request)
  }

  if (
    language.includes("python") ||
    containsAny(error, [
      "traceback",
      "keyerror",
      "indexerror",
      "attributeerror",
      "nameerror",
      "python",
    ])
  ) {
    return analyzePythonError(request)
  }

  return analyzeUnknownError(request)
}