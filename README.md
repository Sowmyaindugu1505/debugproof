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

### Current Prototype

```text
React + TypeScript Frontend
        ↓
Local services / mock data
        ↓
Deterministic error analyzer
```

### Planned Architecture

```text
React Frontend
      ↓
FastAPI Backend
      ↓
Analysis / LLM Service
      ↓
Structured Debug Result
      ↓
Evidence + Verification Layer
      ↓
DebugProof UI
```

## Debug Case Concept

A Debug Case is intended to capture more than the final fix.

It can include:

- Problem summary
- Error context
- Investigation process
- Root cause
- Fix
- Verification
- Skills demonstrated
- Difficulty
- Proof score
- Supporting evidence

Future evidence may include:

- GitHub commits
- Code diffs
- Test results
- Screenshots
- Logs
- Deployment evidence

## Run Locally

Clone the repository:

```bash
git clone https://github.com/Sowmyaindugu1505/debugproof.git
cd debugproof
```

Install dependencies:

```bash
pnpm install
```

Start the development server:

```bash
pnpm dev
```

Create a production build:

```bash
pnpm build
```

Preview the production build:

```bash
pnpm preview
```

## Current Status

DebugProof is currently a frontend prototype.

The current version demonstrates:

- Product design
- Frontend architecture
- Type-safe React development
- Multi-page application structure
- Debugging workflows
- Evidence-oriented UX
- Production deployment

The analyzer is currently rule-based rather than LLM-powered. Backend persistence, real GitHub verification, and automated evidence validation are still under development.

## Roadmap

- FastAPI backend
- Database persistence
- Real AI-assisted error analysis
- GitHub OAuth integration
- Commit and diff evidence
- Test result verification
- Screenshot and log evidence
- Recruiter-facing case sharing
- Stronger proof scoring
- Evidence verification pipeline

## Repository

https://github.com/Sowmyaindugu1505/debugproof

## Deployment

https://debugproof.vercel.app
