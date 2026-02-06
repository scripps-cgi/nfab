# Prompt: Import Jira Story

## Inputs

- Jira ticket ID (e.g., `SCRUM-1`, `NFAB-42`)

## Files to Read

- `.github/agent-instructions.md`
- `.github/backlog/skills/jira-mapping.md`

## Task

Fetch the specified Jira ticket and create a new story directory and file in `.backlog`.

## Procedure

Execute the import script with the provided ticket ID:

```bash
npx tsx .github/scripts/fetch-jira-story.ts <TICKET_ID>
```

If the ticket does not exist or cannot be fetched, report the error and stop.

## After successful fetch

Checkout a new branch using the format:
`<type>/<TICKET_ID>-<safe_summary>`

`<type>` is the issue type in lowercase which should be inferred from the story and must be one of:

- `feat` (for a new feature)
- `fix` (for a bug fix)
- `chore` (for maintenance tasks)
- `test` (for testing-related tasks)

`<safe_summary>` is a URL-safe version of the ticket summary.

## Expected Output

The script will:

1. Authenticate using `JIRA_EMAIL` and `JIRA_TOKEN` from `.env`
2. Fetch the full ticket from Jira API
3. Create a directory: `.backlog/[YYYY-MM-DD]-[KEY]-[safe_summary]/`
4. Write `story.md` containing:
   - Metadata header (Jira link, type, status, priority, etc.)
   - User Story (full description with formatting preserved)
   - References (linked issues)
   - Attachments (if any)
   - Empty sections for local editing:
     - Acceptance Criteria
     - Non-Functional Requirements
     - Task Breakdown
     - Engineering Notes
     - Test Notes
     - Implementation Notes

## Output Format

The imported story must follow the mapping in `.github/backlog/skills/jira-mapping.md`:

- All Jira fields mapped to metadata header
- Original description content preserved exactly
- Local-only sections clearly marked
- Proper markdown formatting maintained

## Rules

- Do not manually edit the imported description
- Do not modify Jira-owned metadata
- Only add content to local-only sections (marked with `_` prefix)
- Preserve all formatting from the source ticket
- Validate that all fields are present before marking complete

## Validation Checklist

- [ ] Script executed successfully
- [ ] Story file created in correct directory, prefixed with the current date and containing the ticket key and safe summary
- [ ] Metadata header correctly populated with Jira fields
- [ ] Description content complete and matches Jira ticket
- [ ] Local sections present and empty for future editing
- [ ] No unauthorized modifications to Jira content
- [ ] Metadata header populated
- [ ] Description content complete and formatted
- [ ] Local sections present and editable
- [ ] Story ready for task breakdown and planning

## Stop Condition

Story file successfully created and verified.
