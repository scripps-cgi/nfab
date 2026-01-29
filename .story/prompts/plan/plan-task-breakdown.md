# Prompt: Task Breakdown

## Inputs

- One imported Jira story file from `.story/backlog/todo/`

## Files to Read

- The selected story file
- `.story/agent-instructions.md`
- `.story/jira-mapping.md`
- `.github/skills/*`

## Task

Generate an implementation task breakdown for the selected story.

## Rules

- Do not change scope
- Do not modify acceptance criteria
- Every task must map to one or more acceptance criteria
- Prefer vertical slices over technical layers

## Output Format

Update the story file by populating the section:

## Task Breakdown (local)

Group tasks under:

- Frontend
- Backend
- Tests

Each task must:

- Be actionable
- Be small (≤ 1 day)
- Reference AC IDs (e.g. AC-1)

## Forbidden

- Inventing new behavior
- Modifying Jira-owned sections
- Adding tasks not traceable to acceptance criteria

## Stop Condition

Stop immediately after updating the Task Breakdown section.
Do not suggest next steps.

## Validation Checklist

- [ ] Each task maps to AC
- [ ] No scope changes
- [ ] Only Task Breakdown section modified
- [ ] Vertical slices preferred
- [ ] No new behavior invented
- [ ] Jira-owned sections unmodified
