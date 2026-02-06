# Prompt: Code Scaffolding

## Inputs

- One imported Jira `story.md` file from `.backlog/` or a ticket ID referring to and existing story.md file in `.backlog`

## Files to Read

- The story file
- `.github/skills/*`

## Task

Scaffold the minimal code structure required to implement this story.

## Rules

- Follow Nuxt architecture and scripting skills
- Do not fully implement business logic
- Insert TODOs where logic will be added
- Respect performance and SSR rules

## Allowed Changes

- Create new files
- Modify application code

## Forbidden

- Completing the full implementation
- Modifying story files
- Changing acceptance criteria

## After Scaffolding

- Update `scaffolding.md` status to "Complete"
- List created files and their purpose in `scaffolding.md`
- Do not write tests or implement logic beyond TODOs
- Do not change story scope or requirements
- Do not modify Jira-owned sections
- Do not suggest changes to requirements or scope

## Stop Condition

Stop after scaffolding is complete.
