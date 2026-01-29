# Jira → Markdown Mapping

This document defines the canonical mapping between Jira fields
and local Markdown story files.

This mapping MUST be followed exactly when importing Jira stories.

---

## Metadata Header Mapping

| Jira Field       | Markdown Field   |
| ---------------- | ---------------- |
| Issue Key        | `Jira:`          |
| Summary          | `Title:`         |
| Issue Type       | `Type:`          |
| Status           | `Status (Jira):` |
| Epic Link        | `Epic:`          |
| Priority         | `Priority:`      |
| Labels           | `Labels:`        |
| Created          | `Created:`       |
| Import Timestamp | `Imported:`      |

---

## Body Mapping

| Jira Content                | Markdown Section                 |
| --------------------------- | -------------------------------- |
| Description                 | `## User Story`                  |
| Acceptance Criteria         | `## Acceptance Criteria`         |
| Non-Functional Requirements | `## Non-Functional Requirements` |
| Links / Attachments         | `## References`                  |

---

## Local-Only Sections (never sync to Jira)

- `## Engineering Notes`
- `## Task Breakdown`
- `## Test Notes`
- `## Implementation Notes`

These sections may be added or edited locally without affecting Jira.

---

## Mandatory Rules

- Do not reword Jira content
- Do not invent requirements
- Do not infer missing acceptance criteria
- Preserve ordering and intent
- Treat imported stories as read-only requirements
- Add local notes only in explicitly marked sections
- Always include all mapped fields in the header
- Use exact section titles as specified in the body mapping
- Maintain original formatting of Jira content (lists, code blocks, etc.)
- Ensure proper Markdown syntax for all sections
- Validate that all mandatory fields are present in Jira before import
- Do not include reporter or assignee information in the Markdown file

---

## Validation Checklist

Before completing an import:

- [ ] All Jira fields mapped
- [ ] Header fields populated
- [ ] Jira content unchanged
- [ ] Local sections clearly marked
