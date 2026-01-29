# Nuxt Starter Template

[![Nuxt UI](https://img.shields.io/badge/Made%20with-Nuxt%20UI-00DC82?logo=nuxt&labelColor=020420)](https://ui.nuxt.com)

Use this template to get started with [Nuxt UI](https://ui.nuxt.com) quickly.

- [Live demo](https://starter-template.nuxt.dev/)
- [Documentation](https://ui.nuxt.com/docs/getting-started/installation/nuxt)

<a href="https://starter-template.nuxt.dev/" target="_blank">
  <picture>
    <source media="(prefers-color-scheme: dark)" srcset="https://ui.nuxt.com/assets/templates/nuxt/starter-dark.png">
    <source media="(prefers-color-scheme: light)" srcset="https://ui.nuxt.com/assets/templates/nuxt/starter-light.png">
    <img alt="Nuxt Starter Template" src="https://ui.nuxt.com/assets/templates/nuxt/starter-light.png">
  </picture>
</a>

> The starter template for Vue is on https://github.com/nuxt-ui-templates/starter-vue.

## Quick Start

```bash [Terminal]
npm create nuxt@latest -- -t github:nuxt-ui-templates/starter
```

## Deploy your own

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-name=starter&repository-url=https%3A%2F%2Fgithub.com%2Fnuxt-ui-templates%2Fstarter&demo-image=https%3A%2F%2Fui.nuxt.com%2Fassets%2Ftemplates%2Fnuxt%2Fstarter-dark.png&demo-url=https%3A%2F%2Fstarter-template.nuxt.dev%2F&demo-title=Nuxt%20Starter%20Template&demo-description=A%20minimal%20template%20to%20get%20started%20with%20Nuxt%20UI.)

## Setup

Make sure to install the dependencies:

```bash
pnpm install
```

## Development Server

Start the development server on `http://localhost:3000`:

```bash
pnpm dev
```

## Production

Build the application for production:

```bash
pnpm build
```

Locally preview production build:

```bash
pnpm preview
```

Check out the [deployment documentation](https://nuxt.com/docs/getting-started/deployment) for more information.

## Prompts

This project uses AI agents to assist with development tasks.
Agents must follow all rules in `.story/agent-instructions.md` and `.story/prompts

To prepare tasks, select a prompt from the `.story/prompts` folder.
Each prompt includes mandatory rules and a scope definition.
Agents must confirm which skills apply before proceeding.

To begin development tasks, select a prompt from the `.github/prompts` folder.
Each prompt includes mandatory rules and a scope definition.
Agents must confirm which skills apply before proceeding.

example:

Validate a story:

```
.story/prompts/validate/validate-story.md

Target story:.story/backlog/todo/SCRUM-1-First_User_story.md
```

Plan a test strategy:

```
.story/prompts/plan/plan-test-strategy.md
Target story: .story/backlog/todo/SCRUM-1-First_User_story.md
```

Plan a task breakdown:

```
.story/prompts/plan/plan-task-breakdown.md
Target story: .story/backlog/todo/SCRUM-1-First_User_story.md
```

Generate test cases:

```
.story/prompts/generate/generate-test-cases.md
Target story: .story/backlog/todo/SCRUM-1-First_User_story.md
```

Post the dev approach to a comment on the story in Jira

```
.story/prompts/maintain/maintain-jira-plan.md
Target story: .story/backlog/todo/SCRUM-1-First_User_story.md
```

## Implementation Tasks

Generate code scaffold:

```
.github/prompts/generate/generate-code-scaffold.md
Target story: .story/backlog/todo/SCRUM-1-First_User_story.md
```

Implement a single acceptance criterion:

```
.github/prompts/implement/implement-single-ac.md
Target story: .story/backlog/in-progress/SCRUM-1-First_User_story.md
Acceptance Criterion ID: AC-1
```
