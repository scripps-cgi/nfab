# AI Coding Agent Instructions

You are an AI coding agent working in a **Nuxt 3 + Pinia + Nitro** full-stack application with multi-tenant support and strong testing/observability requirements.

## Mandatory Rules

1. **Read `.github/skills/*` FIRST** before any code changes — these are the authoritative reference
   - `architecture.md` — SSR patterns, layer structure, file conventions, multi-tenant design
   - `coding-standards.md` — TypeScript, explicit types, component structure, naming conventions
   - `testing.md` — vitest, playwright, test organization, coverage expectations
   - `server.md` — Nitro API routes, secrets management, runtime config
   - `state.md` — Pinia store patterns, action/computed/state organization
   - `git-workflow.md` — branching, commit conventions, review process
   - `composables.md` — reusable logic patterns, SSR-safe data fetching
   - `performance-*.md` — client/server performance budgets and optimization
   - `security.md` — secrets management, input validation, security patterns
2. **Confirm which skills apply** to your task before proceeding (e.g., if adding a page, check `architecture.md` + `testing.md`)
3. **Prioritize SSR safety** — never access `window`, `document`, or browser APIs outside `<template>` or guarded blocks
4. **Use Nuxt auto-imports** and file-based conventions; no manual imports for framework utilities

## Scope Rules

- `.github/skills/` → **Application code ONLY** (architecture, testing, performance, security, workflows)
- `.github/backlog/skills/` → **Narrative and process ONLY** (acceptance criteria, personas, refinement workflows) — do NOT apply to code
- `.github/prompts/` → Development task context (feature implementation, bug fixes, refactoring)
- **Never mix skill sets** — confirm the correct source before implementing

## Jira as Single Source of Truth

- **Jira is the authoritative source** for all story requirements, acceptance criteria, and status
- Use `.backlog/<story>/*` to load story details into agent context before coding
- Always verify story status and acceptance criteria in Jira before starting work
- Reference the Jira issue key in commit messages and pull requests
- Update Jira issue status as progress is made (in progress → done)

## Git Workflow

- **Branch naming**: Use conventional commit style pattern `[type]:[Jira ID]-[safe_summary]`
  - Type: `feat` (feature), `test` (tests), `chore` (maintenance), `fix` (bug fix) — derive from task description
  - Jira ID: e.g., `NFAB-123`
  - Safe summary: kebab-case, descriptive (3-5 words)
  - Example: `feat:NFAB-42-user-authentication-flow`
- Include Jira issue key in commit messages and pull request titles
- Squash commits before merging to keep history clean

## Critical Patterns at a Glance

### Pages & Routing

- Pages in `app/pages/` contain **routing only**, no business logic
- Extract logic to composables (`app/composables/`) or server routes (`server/api/`)
- Use `<script setup>` with explicit types; never use Options API

### State Management

- Use Pinia stores in `app/stores/` for global state
- Small, focused stores (one per domain)
- Use action functions for async logic, computed for derived state

### Server & API

- Nitro handlers in `server/api/` using `defineEventHandler`
- Validate all inputs; never expose secrets to client
- Use runtime config for environment variables (accessed via `useRuntimeConfig`)

### Data Fetching

- Use `useFetch()` or `useAsyncData()` for SSR-safe client hydration
- Fetch server-side data from composables/middleware, not in components
- Mock external APIs in unit tests (no network calls)

### Testing

- Place tests alongside source (`*.spec.ts` or `*.test.ts`)
- Unit: vitest with mocked dependencies
- Components: `@vue/test-utils` (requires scoped CSS)
- E2E: playwright for critical flows
- Commands: `pnpm test`, `pnpm test:watch`, `pnpm test:coverage`

### Build & Development

- Lint: `pnpm lint` (ESLint + Prettier configured)
- TypeCheck: `pnpm typecheck`
- Dev: `pnpm dev` (http://localhost:3000)
- Build: `pnpm build` (prerender `/` by default)

## When Uncertain

- Prefer safety, clarity, and existing patterns
- Ask before proceeding if rules conflict
- Reference examples in existing codebase for patterns
