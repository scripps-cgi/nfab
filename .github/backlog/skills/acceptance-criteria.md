# Skill: Acceptance Criteria

## Purpose

Make acceptance criteria unambiguous and testable.

## Mandatory Rules

- Every acceptance criterion must be verifiable (automated or manual)
- Use Given/When/Then for user-facing flows
- Include negative/edge cases where relevant
- Include data and environment constraints (e.g., user must be logged in)

## Preferred Patterns

- 3–6 acceptance criteria per story
- Separate happy path and critical error paths

## Examples

AC: Given a logged-in user with saved address,
When they click "Reorder",
Then the cart is populated and they see a confirmation modal.
