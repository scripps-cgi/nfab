# Prompt: Attach Story Documents to Jira

## Purpose

Attach story planning documents to a Jira ticket by invoking a local script.

This prompt delegates all Jira interaction to an approved local script found in `./scripts/attach-story-documents.ts.

---

## Inputs

- One imported Jira `story.md` file from `.backlog/` or a ticket ID referring to and existing story.md file in `.backlog`

---

## Files to Read

- The selected story file
- The associated test-plan.md file from the same folder
- The associated task-breakdown.md file from the same folder
- The associated readiness.md file from the same folder (if it exists)
- `.github/agent-instructions.md`

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

The following script MUST be used for attaching documents to Jira:
`./scripts/attach-story-documents.ts <STORY_DIRECTORY_PATH>`

---

## Allowed Actions

- Execute the local script
- Read local files
- Report command output and exit status
