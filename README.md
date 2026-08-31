# DebugProof

DebugProof is a developer evidence platform that turns debugging work into structured, verifiable proof of engineering skill.

Instead of only showing finished projects, DebugProof focuses on how developers investigate problems, identify root causes, apply fixes, and verify outcomes.

## Live Demo

https://debugproof.vercel.app

## Why DebugProof

Traditional portfolios show what was built, but they rarely show how a developer thinks when something breaks.

DebugProof captures the debugging process as a structured Debug Case:

**Error / Bug → Investigation → Root Cause → Fix → Verification → Evidence**

The goal is to make debugging skill visible and recruiter-friendly.

## Current Features

- Developer dashboard
- Project management
- Debug Case creation
- Debug Case detail views
- Error analysis workflow
- Save analyzed errors as Debug Cases
- Public developer profiles
- Public Debug Case views
- Skill evidence tracking
- Proof scoring
- Difficulty and verification indicators
- Responsive navigation
- Light and dark themes
- Mock GitHub integration UI

## Analyze Error

The Analyze Error feature accepts:

- Error message
- Programming language
- Relevant code
- Additional context

It then produces structured debugging guidance such as:

- Likely problem category
- Root-cause explanation
- Suggested investigation
- Possible fix direction

The current analyzer is deterministic and rule-based.

It supports common cases such as:

- Undefined/null runtime errors
- Syntax errors
- Import/module errors
- Network and API failures
- Python exceptions
- Generic fallback analysis

AI/LLM-backed analysis is planned as a future backend capability.

## Trust Model

DebugProof is designed around multiple levels of confidence in debugging evidence:

- **AI Generated**
- **Developer Reviewed**
- **Verified Evidence**

The long-term goal is to ensure that AI suggestions are clearly separated from developer-reviewed and independently verified evidence.

## Tech Stack

### Frontend

- React
- TypeScript
- Vite
- React Router
- TanStack React Query
- Tailwind CSS
- Lucide React

### Planned Backend

- FastAPI
- Persistent database
- LLM analysis service
- GitHub integration
- Evidence validation

## Architecture

Current prototype:

```text
React + TypeScript Frontend
        ↓
Local services / mock data
        ↓
Deterministic error analyzer
```
