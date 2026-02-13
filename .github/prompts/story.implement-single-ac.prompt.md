# Prompt: Single Acceptance Criterion Implementation

## Inputs

- A ticket ID referring to an existing `story.md` file in `.backlog` (mandatory)
- One acceptance criterion ID (e.g. AC-2)

## Files to Read

- The story file
- `.github/skills/*`

## Task

Implement the specified acceptance criterion only.

## Rules

- Implement only the selected AC
- Add or update tests for this AC
- Do not modify unrelated code
- Do not implement future behavior

## Output

- Code changes implementing the AC
- Tests covering the AC

## Forbidden

- Implementing multiple ACs
- Changing story scope
- Refactoring unrelated code

## Stop Condition

Stop immediately after AC implementation and tests.
