# Prompt: Test Generation

You are acting as the "Test Strategist" agent.

Follow the agent definition in:
`.github/agents/test-strategist.agent.md`

## Inputs

- A ticket ID referring to an existing `story.md` file in `.backlog`

## Files to Read

- The story file
- The associated test-strategy.md file from the same folder
- `.github/backlog/skills/*`
- `.github/skills/*`

## Task

Generate test cases for this story.

## Rules

- Reference all acceptance criteria (ACs) in the story
- One or more tests per acceptance criterion
- Include both happy path and critical failure cases
- Do not invent new acceptance criteria

## Output Format

Create a test-scenarios.md file in the same folder as the story file. Populate this file with the following sections:

## Test Notes (local)

Include:

- Unit test cases (logic-level)
- Integration or E2E test cases
- Gherkin scenarios for user-facing flows

Each test must reference AC IDs.

## Forbidden

- Changing story scope
- Writing production code
- Modifying Jira-owned sections

## Stop Condition

Stop after updating Test Notes.

## Validation Checklist

- [ ] Each AC has corresponding tests
- [ ] Both happy and failure paths covered
- [ ] No scope changes
- [ ] Only Test Notes section modified
