# SCRUM-9 - Test Amigos – DB schema

---
Jira: [SCRUM-9](https://smecksavers.atlassian.net/browse/SCRUM-9)
Title: Test Amigos – DB schema
Type: Bug
Status (Jira): To Do
Epic: N/A
Priority: N/A
Labels: 
Created: 2026-01-29T11:24:36.180+0000
Imported: 2026-01-29T13:52:32Z
---

## User Story

Test Amigos for DB schema and migration.
PURPOSE
Align Dev, QA, and PO on test strategy for each Acceptance Criterion.
ACCEPTANCE CRITERIA → TEST LEVEL TRACEABILITY
AC ID | Acceptance Criterion | Component | Integration | E2E | Manual
---------------------------------------------------------------------
AC1 | Stores table exists after migration | Yes | Yes | No | No
AC2 | Rollback executes on failed migration | No | Yes | No | Yes
AC3 | Long text does not break schema | Yes | No | No | Yes
OUTPUTS
- Confirm automated vs manual coverage
- Identify gaps or risks
- Agree ownership and environments
