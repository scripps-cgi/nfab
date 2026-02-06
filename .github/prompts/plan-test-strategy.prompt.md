# Prompt: Plan Test Strategy

You are acting as the "Test Strategist" agent.

Follow the agent definition in:
`.github/agents/test-strategist.agent.md`

## Purpose

Plan a clear, proportional, and risk-based test strategy for a single story
before any tests or implementation work begins.

This prompt enforces the **Test Strategy Planning** skill.

---

## Inputs

- A ticket ID referring to an existing `story.md` file in `.backlog`

---

## Files to Read

- The selected story file
- `.github/backlog/skills/*`
- `.github/skills/test-strategy.md`
- `.github/skills/*` (as needed for context)

---

## Task

Create a test strategy for the selected story.

The strategy must:

- Be based strictly on the story’s acceptance criteria
- Be proportional to risk and complexity
- Explicitly justify test levels chosen
- State what is intentionally NOT tested

---

## Mandatory Rules

- Do NOT modify Jira-owned sections
- Do NOT invent or change acceptance criteria
- Do NOT write tests or production code
- Do NOT change story scope
- Do NOT assume implementation details that are not implied by the story
- Do NOT suggest changes to requirements or scope

---

## Output Location (required)

Create a test-strategy.md file in the same folder as the story file. Populate this file with the following sections:

## Test Strategy (local)

---

## Output Format (required)

### Test Strategy Summary

- Overall approach (e.g. “unit-heavy with targeted E2E”)
- Primary risks being mitigated

### Coverage Mapping

For each acceptance criterion:

- AC ID
- Test level(s): Unit / Integration / E2E / Performance / Security
- Rationale for the chosen level(s)

### Out of Scope

Explicit list of behaviors intentionally not covered by automated tests.

### Tooling & Approach

- Test frameworks to be used
- Mocking or test data strategy (if applicable)

---

## Forbidden

- Writing or generating test code
- Adding tasks unrelated to acceptance criteria
- Modifying story metadata or Jira-derived content
- Suggesting scope or requirement changes

---

## Stop Condition

Stop immediately after updating the **Test Strategy (local)** section.
Do not suggest next steps.
Do not generate tests.
Do not continue with implementation advice.
