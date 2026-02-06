# Prompt: Task Breakdown

You are acting as the "Task Breakdown" agent.

Follow the agent definition in:
`.github/agents/task-breakdown.agent.md`

You are to create a detailed task breakdown for implementing a Jira story. The breakdown should cover all necessary development, testing, documentation, review, and deployment tasks with task IDs and a checklist to track progress.

## Inputs

- A ticket ID referring to an existing `story.md` file in `.backlog`

## Files to Read

- The selected story file
- The associated readiness.md file from the same folder
- The associated test-strategy.md file from the same folder
- The associated test-scenarios.md file from the same folder
- `.github/backlog/skills/*`
- `.github/skills/*`

If the readiness.md file does not exist, stop and write a readiness report before proceeding with the task breakdown, using the readiness prompt `.github/prompts/validate-story.prompt.md`.
If the test-strategy.md file does not exist, stop and write a test strategy before proceeding with the task breakdown, using the test strategy prompt `.github/prompts/plan-test-strategy.prompt.md`.
If the test-scenarios.md file does not exist, stop and write test scenarios before proceeding with the task breakdown, using the test scenarios prompt `.github/prompts/plan-test-scenarios.prompt.md`.

## Task

Generate an implementation task breakdown for the selected story. The task should be possible to execute by a development team or agent following best practices for Nuxt 3, Pinia, and TypeScript.

## Rules

- Do not change scope
- Do not modify acceptance criteria
- Every task must map to one or more acceptance criteria
- Prefer vertical slices over technical layers

## Output Format

Write a task-breakdown.md file in the same folder as the story file. Populate this file with a detailed task breakdown structured as follows:

## Task Breakdown (local)

Group tasks under:

- Frontend
- Backend
- Tests

Each task must:

- Be actionable
- Be small (≤ 1 day)
- Reference AC IDs (e.g. AC-1)
- Include owner and effort estimates
- Have a checklist for tracking progress

## Forbidden

- Inventing new behavior
- Modifying Jira-owned sections
- Adding tasks not traceable to acceptance criteria
- Changing story scope
- Modifying acceptance criteria
- Assuming implementation details not implied by the story
- Suggesting changes to requirements or scope
- Writing production code
- Writing tests

## Stop Condition

Stop immediately after updating the Task Breakdown report.
Do not suggest next steps.

## Validation Checklist

- [ ] Each task maps to AC
- [ ] No scope changes
- [ ] Only Task Breakdown section modified
- [ ] Vertical slices preferred
- [ ] No new behavior invented
- [ ] Jira-owned sections unmodified
- [ ] Tasks are ≤ 1 day each
- [ ] Tasks are actionable
- [ ] AC IDs referenced in tasks
- [ ] Output written to task-breakdown.md in story folder
- [ ] All required files read
- [ ] Stop condition met
- [ ] Followed all mandatory rules
- [ ] No forbidden actions taken
- [ ] Used correct output format
