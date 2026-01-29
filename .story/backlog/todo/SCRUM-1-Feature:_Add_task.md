# SCRUM-1 - Feature: Add task

```

Jira: [SCRUM-1](https://smecksavers.atlassian.net/browse/SCRUM-1)
Title: Feature: Add task
Type: Task
Status (Jira): To Do
Epic: N/A
Priority: N/A
Labels:
Created: 2026-01-28T11:09:26.988+0000
Imported: 2026-01-29T14:00:06Z

```

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

## Test Strategy (local)

### Test Strategy Summary

**Overall approach:** Unit-heavy with targeted E2E coverage

- Unit tests will cover all validation rules, sorting logic, and state management
- Integration tests will cover data persistence and retrieval
- E2E tests will focus on the three critical user journeys: create task, view ordered list, mark complete
- Performance testing will validate the 1-second render requirement

**Key risks being mitigated:**

- Incorrect sort order (by due date, then creation date) could break the core UX
- Data not persisting across page refreshes would defeat the "single source of truth" value
- Empty title submission could crash the form or create invalid tasks
- Performance regression at 200 tasks could make the app unusable

### Coverage Mapping

| AC ID                   | Test Level(s)            | Rationale                                                                                                                                                                                             |
| ----------------------- | ------------------------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| AC-1 (Create task)      | Unit + E2E               | Unit tests validate title capture and optional fields; E2E tests the full flow from "Add task" button through save and visibility in the list. Critical user journey.                                 |
| AC-2 (List ordering)    | Unit + Integration       | Unit tests validate the sort comparator logic (due date, then creation date). Integration tests verify correct data is retrieved from storage in the proper order.                                    |
| AC-3 (Mark as done)     | Unit + Integration + E2E | Unit tests the state transition logic. Integration tests verify persistence across refreshes. E2E test validates the complete flow: checkbox click → fade-out animation → reappear in Completed view. |
| AC-4 (Basic validation) | Unit + E2E               | Unit tests the validation rule for empty titles and error message generation. E2E tests the user sees the inline message and cannot submit.                                                           |
| AC-5 (Performance)      | Integration              | Load test with 200 tasks and measure render time. Focuses on data layer and list rendering efficiency.                                                                                                |

### Out of Scope

- UI animations and visual styling (fade-out effect, color treatments for overdue/today)
- Drag-to-reorder functionality (mentioned in UX but not in acceptance criteria)
- Analytics or logging
- Accessibility (a11y) compliance testing (not part of AC scope)
- Mobile responsiveness testing (mentioned in goals but not acceptance criteria)
- Error recovery for network failures (not in AC scope)
- Completed view filtering (mentioned as "accessible" but not formally required)

### Tooling & Approach

**Test Frameworks:**

- Unit tests: Vitest (already configured in workspace)
- Integration tests: Vitest with database fixtures
- E2E tests: Playwright (already configured in workspace)

**Mocking & Test Data Strategy:**

- Unit: Mock the data store; test pure sort and validation logic
- Integration: Use in-memory or test database with known fixtures (3–5 tasks with various due dates)
- E2E: Use test database seeding or UI-driven creation; test on actual application instance

**Data Fixtures:**

- Fixture 1: Task with title only (no due date)
- Fixture 2: Task with title + due date in future
- Fixture 3: Overdue task (due date in past)
- Fixture 4: Multiple tasks sharing the same due date (test secondary sort)

## Task Breakdown (local)

### Backend (Nitro Server Routes)

1. **Create task data model and repository** (AC-1, AC-2, AC-3)
   - Define `Task` interface with fields: `id`, `title`, `description`, `dueDate`, `completed`, `createdAt`
   - Implement in-memory or database repository for CRUD operations
   - Ensure tasks are persisted across page refreshes

2. **Implement POST /api/tasks endpoint** (AC-1)
   - Accept `title` (required), `description`, `dueDate` (optional)
   - Create task with generated `id` and `createdAt` timestamp
   - Return created task object

3. **Implement GET /api/tasks endpoint** (AC-2, AC-5)
   - Return all non-completed tasks sorted by due date, then created date
   - Include overdue items in the next 7-day window
   - Ensure response includes all necessary fields for rendering

4. **Implement PATCH /api/tasks/:id endpoint** (AC-3)
   - Accept `completed` flag update
   - Persist state across refreshes
   - Return updated task object

5. **Add server-side validation** (AC-4)
   - Validate title is non-empty string
   - Return 400 error with message on validation failure
   - Accept and validate optional description and dueDate formats

### Frontend Components & Pages

6. **Create Task Store (Pinia)** (AC-1, AC-2, AC-3)
   - Define `TaskStore` with state: `tasks` (array), `loading`, `error`
   - Implement actions: `fetchTasks()`, `createTask()`, `markDone()`, `deleteTasks()`
   - Implement getters: `pendingTasks()` (sorted by AC-2 rules), `completedTasks()`
   - Use sync with backend on each action

7. **Create Task Form Component** (AC-1, AC-4)
   - Render "Add task" input field with optional "More details" expandable section
   - Show title field (required), description, due date pickers
   - Implement validation: show inline error if title is empty on submit
   - Prevent submission until title is filled
   - Support `Enter` to save, `Esc` to cancel (keyboard navigation)

8. **Create Task List Component** (AC-2, AC-3)
   - Display all tasks from store's `pendingTasks()` getter
   - Each task row shows: title, due date (with visual cues: overdue=red, today=bold)
   - Implement checkbox/Done button on each task
   - On complete: fade animation and removal from To Do list
   - Integrate sort logic from store (AC-2 ordering by due date, then creation date)

9. **Create Completed View Filter** (AC-3)
   - Add toggle or tab to show/hide completed tasks
   - Display tasks from store's `completedTasks()` getter
   - Users can switch between To Do and Completed views

10. **Create Main Task Page** (AC-1, AC-2, AC-3)
    - Compose Task Form + Task List + Completed view
    - Initialize store on mount (`fetchTasks()`)
    - Implement layout: form at top, list below, completed view as secondary
    - Ensure responsive layout for desktop and mobile (mentioned in scope but not AC)

### Unit Tests

11. **Test Task sort comparator** (AC-2)
    - Verify tasks sorted by due date (earliest first)
    - Verify tasks without due dates appear after dated tasks
    - Verify secondary sort by created date (oldest first) when due dates match

12. **Test Task validation logic** (AC-4)
    - Verify empty title is rejected
    - Verify validation error message is returned correctly
    - Verify non-empty titles are accepted

13. **Test Task store mutations and getters** (AC-1, AC-2, AC-3)
    - Verify `pendingTasks()` returns only incomplete tasks
    - Verify `completedTasks()` returns only completed tasks
    - Verify `createTask()` action adds task to store state
    - Verify `markDone()` action updates task completed flag

### Integration Tests

14. **Test POST /api/tasks with database** (AC-1)
    - Create task via API with title only
    - Create task via API with all fields
    - Verify task persists in storage

15. **Test GET /api/tasks with sorting** (AC-2)
    - Seed database with 4+ tasks (various due dates, some without due dates)
    - Verify API returns tasks in correct sort order
    - Verify overdue items included

16. **Test PATCH /api/tasks/:id state persistence** (AC-3)
    - Mark task as completed via API
    - Fetch tasks via GET
    - Verify completed task does not appear in pending list

17. **Test validation at API boundary** (AC-4)
    - POST with empty title → expect 400 error with message
    - POST with invalid dueDate format → expect 400 error

18. **Test performance with 200 tasks** (AC-5)
    - Seed database with 200 tasks
    - Measure GET /api/tasks response time
    - Measure frontend render time for list (target: under 1 second total)

### E2E Tests

19. **Test end-to-end create task flow** (AC-1)
    - Click "Add task" → enter title → click Save
    - Verify task appears in To Do list
    - Verify task is visible on page refresh

20. **Test keyboard shortcuts** (AC-1)
    - Enter to save task
    - Esc to cancel and close form

21. **Test mark task complete flow** (AC-3)
    - Create task, click checkbox/Done
    - Verify task disappears from To Do list
    - Verify task reappears in Completed view
    - Refresh page → verify task does not return to To Do list

22. **Test validation error message in UI** (AC-4)
    - Try to save empty title
    - Verify inline error message appears
    - Verify Save button is disabled or no-op

23. **Test full user journey** (AC-1, AC-2, AC-3, AC-4)
    - Create multiple tasks with various due dates
    - Verify they appear in correct sort order
    - Complete some tasks
    - Verify completed tasks are hidden and removed from To Do list
    - Refresh page → verify all state persists correctly

## Test Notes (local)

### Unit Tests

#### AC-1: Create Task

**Test: Task title is captured and stored**

- Arrange: Empty task form
- Act: Enter title "Buy groceries", click Save
- Assert: Store contains task with `title: "Buy groceries"`

**Test: Optional description is captured**

- Arrange: Form with "More details" section expanded
- Act: Enter title, description "For tonight's dinner", click Save
- Assert: Task has `description: "For tonight's dinner"`

**Test: Optional due date is captured**

- Arrange: Form with date picker visible
- Act: Enter title, select due date "2026-02-05", click Save
- Assert: Task has `dueDate: "2026-02-05"` (as ISO string or parsed date)

**Test: Task ID is auto-generated**

- Arrange: Store ready
- Act: Create task with title
- Assert: Task has unique `id` (UUID or sequential number)

**Test: Created timestamp is set**

- Arrange: Store ready
- Act: Create task
- Assert: Task has `createdAt` timestamp within 1 second of test time

#### AC-2: List Ordering

**Test: Tasks ordered by due date (earliest first)**

- Arrange: Store with 3 tasks: due 2026-02-10, due 2026-02-01, due 2026-02-05
- Act: Call `pendingTasks()` getter
- Assert: Order is [2026-02-01, 2026-02-05, 2026-02-10]

**Test: Tasks without due dates appear last**

- Arrange: Store with 3 tasks: due 2026-02-05, no due date, due 2026-02-01
- Act: Call `pendingTasks()` getter
- Assert: Tasks without due date appear at end: [2026-02-01, 2026-02-05, null]

**Test: Secondary sort by created date (oldest first)**

- Arrange: Store with 2 tasks, both due 2026-02-05, created at T1 and T2 (T1 < T2)
- Act: Call `pendingTasks()` getter
- Assert: Task created at T1 appears before task created at T2

**Test: Mixed sort (due date takes priority)**

- Arrange: Store with 4 tasks:
  - Task A: due 2026-02-01, created T3
  - Task B: due 2026-02-01, created T1 (older)
  - Task C: due 2026-02-05, created T0 (oldest overall)
  - Task D: no due date, created T4
- Act: Call `pendingTasks()` getter
- Assert: Order is [B (2/1, T1), A (2/1, T3), C (2/5, T0), D (null, T4)]

#### AC-3: Mark as Done

**Test: Task state transitions to completed**

- Arrange: Store with task `{id: 1, completed: false}`
- Act: Call `store.markDone(1)`
- Assert: Task has `completed: true`

**Test: Completed task is removed from pendingTasks()**

- Arrange: Store with 2 pending tasks, 1 with id=1
- Act: Call `store.markDone(1)`
- Assert: `pendingTasks()` returns 1 task (id=1 removed)

**Test: Completed task appears in completedTasks() getter**

- Arrange: Store with completed task `{id: 1, completed: true}`
- Act: Call `completedTasks()`
- Assert: Returns array containing task with id=1

**Test: Task remains completed after store hydration**

- Arrange: Store with completed task persisted to backend
- Act: Clear store, call `fetchTasks()`
- Assert: Task still has `completed: true`

#### AC-4: Basic Validation

**Test: Empty title is rejected**

- Arrange: Validation function
- Act: Call `validateTitle("")`
- Assert: Returns error object `{valid: false, message: "Title is required"}`

**Test: Whitespace-only title is rejected**

- Arrange: Validation function
- Act: Call `validateTitle("   ")`
- Assert: Returns error object

**Test: Valid title passes validation**

- Arrange: Validation function
- Act: Call `validateTitle("Buy milk")`
- Assert: Returns `{valid: true}`

**Test: Form prevents submission on invalid title**

- Arrange: Form with empty title field
- Act: Click Save button
- Assert: Save button is disabled OR form does not submit

### Integration Tests

#### AC-1: Create Task Persistence

**Test: POST /api/tasks creates task in database**

```
POST /api/tasks
{
  "title": "Buy groceries",
  "description": "For tonight",
  "dueDate": "2026-02-05"
}
```

- Assert: HTTP 201 (or 200)
- Assert: Response contains `{id, title, description, dueDate, completed: false, createdAt}`
- Assert: Task persists in database

**Test: GET /api/tasks returns created task**

- Arrange: Task created via POST
- Act: GET /api/tasks
- Assert: Response includes the created task

#### AC-2: API Sorting

**Test: GET /api/tasks returns tasks in correct sort order**

- Arrange: Database seeded with:
  - Task 1: no due date, created at 2026-01-25
  - Task 2: due 2026-02-10, created at 2026-01-28
  - Task 3: due 2026-02-01, created at 2026-01-26
  - Task 4: due 2026-02-01, created at 2026-01-24 (older)
- Act: GET /api/tasks
- Assert: Response order is [Task 4 (2/1, 1/24), Task 3 (2/1, 1/26), Task 2 (2/10, 1/28), Task 1 (null, 1/25)]

#### AC-3: State Persistence Across Refresh

**Test: PATCH /api/tasks/:id updates completed flag**

```
PATCH /api/tasks/123
{ "completed": true }
```

- Assert: HTTP 200
- Assert: Response has `completed: true`

**Test: Completed task does not return in GET /api/tasks (pending list)**

- Arrange: Task with id=123 marked as completed
- Act: GET /api/tasks
- Assert: Response does not include task id=123

**Test: Completed task returns in GET /api/tasks?filter=completed**

- Arrange: Task with id=123 marked as completed
- Act: GET /api/tasks?filter=completed
- Assert: Response includes task id=123 with `completed: true`

#### AC-4: Validation at API Boundary

**Test: POST /api/tasks with empty title returns 400**

```
POST /api/tasks
{ "title": "" }
```

- Assert: HTTP 400
- Assert: Response body includes error message (e.g., `{error: "Title is required"}`)

**Test: POST /api/tasks with missing title returns 400**

```
POST /api/tasks
{ "description": "Test" }
```

- Assert: HTTP 400

**Test: POST /api/tasks with invalid dueDate returns 400**

```
POST /api/tasks
{ "title": "Test", "dueDate": "invalid-date" }
```

- Assert: HTTP 400

**Test: Valid POST with optional fields omitted succeeds**

```
POST /api/tasks
{ "title": "Test" }
```

- Assert: HTTP 201
- Assert: Task created with `description: null` (or empty string), `dueDate: null`

#### AC-5: Performance with 200 Tasks

**Test: GET /api/tasks completes in < 500ms with 200 tasks**

- Arrange: Database seeded with 200 tasks
- Act: GET /api/tasks, measure response time
- Assert: Response time < 500ms

**Test: Frontend renders list in < 1 second total**

- Arrange: Store with 200 pending tasks, component mounted
- Act: Measure time from `fetchTasks()` call to full render
- Assert: Total time (API + render) < 1000ms

### E2E / User Journey Tests (Gherkin Format)

#### AC-1: Create Task

**Scenario: Add a simple task with title only**

```gherkin
Given I am on the task management page
When I click the "Add task" button
And I enter "Buy groceries" in the title field
And I click the "Save" button
Then a new task appears in the "To Do" list with title "Buy groceries"
And the task has no due date displayed
```

**Scenario: Add a task with all fields**

```gherkin
Given I am on the task management page
When I click the "Add task" button
And I enter "Client meeting" in the title field
And I click "More details" to expand
And I enter "Discuss Q1 roadmap" in the description field
And I select "2026-02-05" as the due date
And I click the "Save" button
Then a new task appears in the "To Do" list with:
  | Field       | Value                    |
  | Title       | Client meeting           |
  | Description | Discuss Q1 roadmap       |
  | Due Date    | 2026-02-05 (or Feb 5)    |
```

**Scenario: Create task using Enter key**

```gherkin
Given I am on the task management page
And the "Add task" form is open
When I enter "Pay invoice" in the title field
And I press the "Enter" key
Then the task is saved and appears in the "To Do" list
And the form is cleared and ready for the next task
```

**Scenario: Cancel task creation with Esc key**

```gherkin
Given the "Add task" form is open
And I have entered "Incomplete task" in the title field
When I press the "Esc" key
Then the form closes
And no new task is created
And the input field is cleared
```

#### AC-2: List Ordering

**Scenario: Tasks are ordered by due date, earliest first**

```gherkin
Given I have created tasks with the following due dates:
  | Task        | Due Date   |
  | Task A      | 2026-02-10 |
  | Task B      | 2026-02-01 |
  | Task C      | 2026-02-05 |
When I view the "To Do" list
Then the tasks appear in this order:
  | Position | Task   |
  | 1        | Task B |
  | 2        | Task C |
  | 3        | Task A |
```

**Scenario: Tasks without due dates appear last**

```gherkin
Given I have created 3 tasks:
  - Task with due date "2026-02-05"
  - Task with no due date
  - Task with due date "2026-02-01"
When I view the "To Do" list
Then the tasks appear in order:
  | Due Date   | Position |
  | 2026-02-01 | 1        |
  | 2026-02-05 | 2        |
  | (none)     | 3        |
```

**Scenario: Tasks with same due date ordered by creation date**

```gherkin
Given I created two tasks at different times, both due "2026-02-05":
  - Task created at 10:00 AM
  - Task created at 10:05 AM
When I view the "To Do" list
Then the older task (created at 10:00 AM) appears before the newer task
```

#### AC-3: Mark as Done

**Scenario: Task disappears from To Do list when marked Done**

```gherkin
Given I have a pending task in the "To Do" list
When I click the checkbox/Done button on that task
Then the task fades out and disappears from the "To Do" list
And the task count decreases by 1
```

**Scenario: Completed task appears in Completed view**

```gherkin
Given I have marked a task as Done
When I click the "Completed" tab/filter
Then the completed task appears in the "Completed" list
```

**Scenario: Task remains completed after page refresh**

```gherkin
Given I have marked a task as Done
When I refresh the page
Then the task still does not appear in the "To Do" list
And the task still appears in the "Completed" list (if I navigate to it)
```

#### AC-4: Validation

**Scenario: Empty title shows validation error**

```gherkin
Given the "Add task" form is open
When I leave the title field empty
And I click the "Save" button
Then an inline error message appears: "Title is required"
And the task is not created
And the form remains open
```

**Scenario: Whitespace-only title is rejected**

```gherkin
Given the "Add task" form is open
When I enter only spaces "   " in the title field
And I click the "Save" button
Then an error message appears
And the task is not created
```

**Scenario: Valid title allows submission**

```gherkin
Given the "Add task" form is open
When I enter "Pay bills" in the title field
And I click the "Save" button
Then the form validates successfully
And the task is created
```

#### AC-5: Performance

**Scenario: Large list renders in under 1 second**

```gherkin
Given the database contains 200 tasks
When I load the task management page
Then the "To Do" list renders completely within 1 second
And the page is responsive (no visible lag or jank)
```

### Edge Cases & Critical Failures

**Test: Duplicate titles are allowed**

- Arrange: Store with task "Buy milk"
- Act: Create another task "Buy milk"
- Assert: Both tasks exist (duplicates are not prevented at app level)

**Test: Very long title is handled**

- Arrange: Form with 500-character title
- Act: Submit
- Assert: Task is created; title is truncated or wrapped appropriately in UI

**Test: Special characters in title (e.g., emoji, quotes, HTML)**

- Arrange: Title with `<script>alert('xss')</script>` and emoji 🎉
- Act: Create task
- Assert: Title is stored as-is; HTML is escaped when rendered (XSS prevented)

**Test: Description exceeds reasonable length**

- Arrange: 5000-character description
- Act: Submit
- Assert: Task is created; description is either truncated or full content is stored

**Test: Concurrent creates (if relevant)**

- Arrange: Two simultaneous POST requests for tasks
- Act: Both requests are sent at the same time
- Assert: Both tasks are created with unique IDs; no conflicts

**Test: Invalid date formats**

- Arrange: dueDate field receives "32-13-2026", "2026/02/05", "02 Feb 2026"
- Act: Submit form or API call
- Assert: Either rejected with error message or normalized to ISO format
