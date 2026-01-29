# Prompt: Story Validation

## Inputs

- One imported Jira story file from `.story/backlog/todo/`

## Task

Validate whether this story is ready for development.

## Checks

- Acceptance criteria present and testable
- Non-functional requirements defined
- Scope small enough to implement
- No ambiguity blocking implementation

## Output

- A checklist of pass/fail items
- A short summary of risks or missing info

## Forbidden

- Editing the story
- Suggesting implementation details

## Stop Condition

Stop after producing validation report.
