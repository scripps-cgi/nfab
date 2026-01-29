# Prompt: Post Story Comment to Jira

## Purpose

Post the contents of a local story Markdown file as a comment
to its associated Jira ticket by invoking a local script.

This prompt delegates all Jira interaction to an approved local script found in `./scripts/post-story-comment.ts.

---

## Inputs

- One local story file (Markdown) from `.story/backlog/todo` or `.story/backlog/in-progress/`

---

## Files to Read

- The selected story file
- `.story/agent-instructions.md`

---

## Required Environment Variables

Before executing the script, verify that the following environment
variables are present in the user’s .env file:

- `JIRA_EMAIL`
- `JIRA_TOKEN`
- `JIRA_BASE_URL`

If any are missing:

- Do NOT attempt to run the script
- Report which variables are missing
- Stop immediately

---

## Task

1. Read the provided story file.
2. Confirm it contains a Jira issue key.
3. Confirm that the story file contains a Test Strategy, Test Cases and Task Breakdown sections.
4. Validate that all required environment variables are set.
5. Load environment variables from `.env` file.
6. Invoke the local script using the exact command specified.
7. Report the execution result (success or failure).

If Test Strategy, Test Cases and Task Breakdown sections are missing:

- Require confirmation before proceeding.
- If confirmed, proceed to post the comment anyway.

---

## Mandatory Rules

- Do NOT post directly to Jira using APIs or tools other than the local script
- Do NOT modify any files
- Do NOT modify Jira fields other than adding a comment
- Do NOT invent, summarize, or rewrite story content
- Do NOT echo sensitive environment variable values

---

## Required Local Script

The following script MUST be used for posting to Jira:
`./scripts/post-story-comment.ts <STORY_FILE_PATH>`

---

## Allowed Actions

- Execute the local script
- Read local files
- Report command output and exit status
