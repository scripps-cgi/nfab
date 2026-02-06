# NFAB AI Hackathon Starter

## Setup

Make sure to install the dependencies:

```bash
npm install
```

## Development Server

Start the development server on `http://localhost:3000`:

```bash
npm dev
```

## Production

Build the application for production:

```bash
npm build
```

Locally preview production build:

```bash
npm preview
```

Check out the [deployment documentation](https://nuxt.com/docs/getting-started/deployment) for more information.

## Agents

To find out more about how we use AI agents in this project for planning, see the instructions in [.docs/agents-in-refinement.md](.docs/agents-in-refinement.md).
This project uses AI agents to assist with development tasks.

Agents must follow all rules in `.github/agent-instructions.md` and `.github/prompts` when executing tasks.

To prepare tasks, select a prompt from the `.github/prompts` folder.
Each prompt includes mandatory rules and a scope definition.
Agents must confirm which skills apply before proceeding.

To begin development tasks, select a prompt from the `.github/prompts` folder.
Each prompt includes mandatory rules and a scope definition.
Agents must confirm which skills apply before proceeding.

example:

Validate a story:

```
/validate-story SCRUM-1
```

Plan a test strategy:

```
/plan-test-strategy  SCRUM-1

```

Plan a task breakdown:

```
/plan-task-breakdown SCRUM-1

```

Generate test cases:

```
/generate-test-cases SCRUM-1

```

Post the dev approach to a comment on the story in Jira

```
/maintain-jira-plan SCRUM-1

```

## Implementation Tasks

Generate code scaffold:

```
/generate-code-scaffold SCRUM-1

```

Implement a single acceptance criterion:

```
/implement-single-ac SCRUM-1 AC-1

```
