# Prompt: Attach Story Documents to Jira

## Purpose

Attach story planning documents to a Jira ticket by invoking a local script.

This prompt delegates all Jira interaction to an approved local script found in `.github/scripts/jira-attach.ts`.

---

## Inputs

- A ticket ID referring to an existing `story.md` file in `.backlog` (mandatory)

---

## Files to Read

- The selected story file
- The associated readiness.md file from the same folder
- The associated test-strategy.md file from the same folder
- The associated test-scenarios.md file from the same folder
- The associated task-breakdown.md file from the same folder
- `.github/copilot-instructions.md`

if any of the associated files are missing, report which ones are missing and stop immediately without attempting to run the script.

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

1. Validate that all required environment variables are set.
2. Load environment variables from `.env` file.
3. Invoke the local script using the exact command specified for each document `readiness.md`, `test-strategy.md`, `test-scenarios.md`, `task-breakdown.md` as follows:

`npx tsx .github/scripts/jira-attach.ts <JIRA_ISSUE_ID> <FILE_PATH>`

Where `<JIRA_ISSUE_ID>` is the issue key extracted from the story file and `<FILE_PATH>` is the path to each of the associated documents.

4. Report the execution result (success or failure).

---

## Mandatory Rules

- Do NOT post directly to Jira using APIs or tools other than the local script
- Do NOT modify any files
- Do NOT modify Jira fields other than adding a comment
- Do NOT invent, summarize, or rewrite story content
- Do NOT echo sensitive environment variable values
- Do NOT attempt to run the script if the ticket ID is missing or invalid
- Do NOT attempt to run the script if any required environment variables are missing
- Do NOT attempt to run the script if any of the associated documents are missing

---

## Required Local Script

The following script MUST be used for attaching documents to Jira:
`./.github/scripts/jira-attach.ts <JIRA_ISSUE_ID> <FILE_PATH>`

---

## Allowed Actions

- Execute the local script
- Read local files
- Report command output and exit status
