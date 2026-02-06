# Prompt: Story Validation

You are acting as the "Story Challenger" agent.

Follow the agent definition in:
`.github/agents/story-challenger.agent.md`

Context:

## Inputs

- One imported Jira `story.md` file from `.backlog/` or a ticket ID referring to and existing story.md file in `.backlog`

## Files to Read

- The selected story file
- the files in `.github/backlog/skills/*.md` as needed for context

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
- Recommendations for improvement
- Clear next steps
- Write a readiness report to a file named `readiness.md` in the story folder

## Forbidden

- Editing the story
- Suggesting implementation details

## Stop Condition

Stop after producing validation report.
