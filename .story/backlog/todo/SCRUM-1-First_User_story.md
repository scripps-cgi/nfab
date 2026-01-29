# SCRUM-1 - First User story

---
Jira: [SCRUM-1](https://smecksavers.atlassian.net/browse/SCRUM-1)
Title: First User story
Type: Task
Status (Jira): To Do
Epic: N/A
Priority: N/A
Labels: 
Created: 2026-01-28T11:09:26.988+0000
Imported: 2026-01-29T08:19:42Z
---

## User Story

**As a** time‑poor small‑business owner
**I want** a simple way to track and prioritise my tasks in one place
**So that** I can stay on top of what matters without learning a complex tool
### Background
Today, small‑business owners juggle tasks across email, notebooks, messaging apps, and memory. This makes it hard to see what’s due soon, what’s at risk, and what can be delegated.
We want a lightweight “single source of truth” for work that:
- Feels fast and simple on day one
- Works on both desktop and mobile
- Makes it obvious what to do _today_ vs _later_

### Problem / Opportunity
- Tasks are scattered across multiple tools and channels.
- There is no clear daily focus view (“what do I do first?”).
- Important items (invoices, client commitments, renewals) easily slip.
- Existing tools feel too heavy or “enterprisey” for solo or very small teams.

### Goals & Outcomes
**Success looks like:**
- Users can add a task in under **5 seconds** from any device.
- Users can see a **clear, ordered list** of tasks due in the next 7 days.
- At least **80%** of first‑time users are able to:
  - Create a task
  - Set a due date
  - Mark it as done
within their first session, without any help text.

### Scope (for this story)
This story covers the **basic end‑to‑end flow**:
1. Create a task with:
  - Title (required)
  - Optional description
  - Optional due date
2. See the task in a **“To Do”** list, ordered by:
  - Due date (soonest first), then
  - Created date (oldest first)
3. Mark a task as **Done**
4. Automatically remove completed tasks from the default “To Do” view

### User Experience
**Create task**
- Entry point: prominent “Add task” action at the top of the list.
- Minimal input:
  - Single‑line text box for the title.
  - Optional “More details” affordance to reveal description + due date.
- Keyboard‑friendly:
  - `Enter` to save
  - `Esc` to cancel

**View tasks**
- Default view: **To Do** list for the next 7 days + any overdue items.
- Each task shows:
  - Title
  - Due date (if set), with visual treatment:
    - Overdue = red
    - Due today = bold or highlighted
- Tasks are draggable for manual re‑ordering within the same day.

**Complete task**
- Checkbox or “Done” action on each row.
- On complete:
  - Task fades out and is removed from the **To Do** list.
  - It remains accessible in a **Completed** filter/view.

### Acceptance Criteria
1. **Create task**
  - Given I am on the main task view
When I click “Add task” and enter a title
Then a new task is created in **To Do** with that title.
  - Given I enter a title, description, and due date
When I click “Save”
Then all three fields are stored and visible on the task.
2. **List ordering**
  - Given I have tasks with different due dates
When I open the **To Do** view
Then tasks are ordered by due date (earliest first), and tasks without due dates appear after all dated tasks.
  - Given multiple tasks share the same due date
When I open the **To Do** view
Then they are ordered by created time (oldest first).
3. **Mark as done**
  - Given I see a task in **To Do**
When I click its “Done”/checkbox control
Then it disappears from **To Do** and appears in a **Completed** view.
  - Given a task is marked Done
When I refresh the page
Then it does not reappear in the **To Do** list.
4. **Basic validation**
  - Given I open the “Add task” dialog
When I try to save with an empty title
Then I see an inline validation message and the task is not created.
5. **Performance**
  - Given I have up to 200 tasks
When I open the **To Do** view
Then the list renders in under **1 second** on a typical broadband connection.
