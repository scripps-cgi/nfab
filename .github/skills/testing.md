# Skill: Testing

## Purpose

Ensure confidence in changes without brittle tests.

## Scope

Applies to all production code.

## Mandatory Rules

- All new logic must have tests
- Follow TDD principles where feasible
- Tests must be deterministic
- No network calls in unit tests
- Write unit tests for all new features and bug fixes
- Ensure tests cover edge cases and error handling
- Use descriptive names for test cases
- Keep tests isolated and independent
- Mock external dependencies in unit tests
- Use integration tests for critical paths
- Ensure tests run quickly and reliably

## Preferred Patterns

- Small functions (<40 lines)
- Use setup and teardown hooks for test initialization and cleanup
- Group related tests using describe blocks
- Use data-driven tests to cover multiple scenarios with the same test logic
- Use snapshot testing for complex UI components
- Use code coverage tools to identify untested code paths
- Use linters to enforce test code quality
- Use consistent test file naming conventions (e.g., _.spec.ts or _.test.ts)
- Place test files alongside the code they test
- Use test doubles (mocks, stubs, spies) appropriately to isolate unit tests
- Use async/await in tests for asynchronous code
- Use beforeAll and afterAll hooks for expensive setup/teardown operations
- Use parameterized tests to reduce code duplication
- Use descriptive assertions to improve test readability
- Use continuous integration (CI) to run tests automatically on code changes
- Use test reporting tools to visualize test results and coverage
- Prefer behavior-driven development (BDD) style for test descriptions

## Prohibited Patterns

- Snapshot tests for logic
- Over-mocking
- Shared mutable test state

## Tooling

- vitest for unit tests
- testing-library for component tests
- playwright for end-to-end tests

## Validation

- [ ] Tests fail before fix
- [ ] Tests pass locally
