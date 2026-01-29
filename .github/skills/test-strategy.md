# Skill: Test Strategy Planning

## Purpose

Ensure a clear, proportional, and risk-based test strategy is defined
before tests are written or implementation begins.

This skill exists to prevent:

- Over-testing trivial logic
- Under-testing critical flows
- Unclear responsibility between unit, integration, and E2E tests

---

## Scope

This skill applies when:

- A story is moving from "todo" to “in-progress”
- Acceptance criteria exist and are ready for implementation
- An agent is asked to generate tests or code

This skill does NOT apply when:

- Writing exploratory or spike code
- Debugging existing test failures
- Running tests or CI pipelines

---

## Mandatory Rules

- A test strategy MUST be planned before generating tests
- Every acceptance criterion must be covered by at least one test type
- Test types must be chosen based on risk, not convenience
- The strategy must explicitly state what will NOT be tested

---

## Required Test Levels

For each story, explicitly consider:

1. **Unit Tests**
   - Pure logic
   - Composables
   - Utility functions
   - Validation and edge cases

2. **Integration Tests**
   - Server APIs
   - Database or external service boundaries
   - Authorization and permissions

3. **End-to-End (E2E) Tests**
   - User-critical paths
   - Multi-step flows
   - Regression-prone scenarios

Not every story requires all three, but omissions must be justified.

---

## Preferred Patterns

- Fewer, high-value E2E tests over broad coverage
- Unit tests for business rules and edge cases
- Integration tests at trust boundaries
- One or more tests mapped to each acceptance criterion
- Explicit linkage between ACs and test types (e.g. AC-1 → unit + E2E)

---

## Prohibited Patterns

- Writing tests without a strategy
- Snapshot tests for business logic
- E2E tests for trivial logic
- Duplicating the same assertion across multiple test levels
- Testing framework internals instead of application behavior

---

## Output Format (required)

When planning a test strategy, output MUST include:

### Test Strategy Summary

- Overall approach (e.g. “unit-heavy with targeted E2E”)
- Key risks being mitigated

### Coverage Mapping

For each acceptance criterion:

- AC ID
- Test level(s): Unit / Integration / E2E
- Rationale

### Out of Scope

Explicit list of behaviors not covered by automated tests.

### Tooling

- Test frameworks to be used
- Mocking strategy (if any)

---

## Example

### Test Strategy Summary

Focus on unit tests for reorder logic and one E2E test for the happy path.
Authorization failures covered at integration level.

### Coverage Mapping

- AC-1: Unit (cart logic), E2E (happy path)
- AC-2: Integration (auth middleware)
- AC-3: Unit (validation), Integration (API error)

### Out of Scope

- UI styling
- Analytics events

---

## Validation Checklist

Before completing work, confirm:

- [ ] Strategy exists before tests are written
- [ ] Every AC is mapped to at least one test
- [ ] Test levels are justified
- [ ] Out-of-scope areas are documented
