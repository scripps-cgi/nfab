# Skill: Coding Standards

## Purpose

Ensure consistent, readable, maintainable code.

## Scope

Applies to all production code.

## Mandatory Rules

- Use explicit types (no `any`)
- Prefer pure functions
- Use async/await over promises
- Avoid deep nesting (>3 levels)
- Use terser syntax where possible (e.g., optional chaining)
- Use template literals over string concatenation
- Use destructuring for objects and arrays
- Use array methods (map, filter, reduce) over loops
- Use ESLint and Prettier for code formatting
- Use consistent naming conventions (camelCase for variables/functions, PascalCase for classes/types)
- Write JSDoc comments for all public functions and classes
- Ensure code is modular and reusable
- Colocate related functions and types in the same file/module
- Prefer interfaces over type aliases for object shapes
- Prefer string unions over enums
- Arrow functions for callbacks and small functions
- Do not use a body block in arrow functions with a single expression
- Use `<script setup>` exclusively for Vue components
- Use nullish coalescing (??) over logical OR (||) when dealing with potentially falsy values
- Use optional chaining (?.) to safely access nested object properties
- Use default parameters instead of checking for undefined inside functions
- Use spread/rest operators for array and object manipulation
- Use template literals for multi-line strings
- Use array destructuring for swapping variables
- Use object property shorthand when the property name matches the variable name
- Use concise methods in object literals
- Use computed property names in object literals when needed
- Use terse naming for small scopes (e.g. short names in lambdas or private methods)
- Use longer, descriptive names for public APIs
- Prefer typescript over json for configuration files
- Use ESLint disable comments sparingly and justify their use
- Do not use `var`; use `let` or `const` instead
- Avoid using `==` and `!=`; use `===` and `!==` instead
- Prefer clarity over cleverness in code
- Write unit tests for all new features and bug fixes
- Follow TDD principles where feasible
- Ensure tests cover edge cases and error handling
- Use descriptive names for test cases
- Keep tests isolated and independent
- Mock external dependencies in unit tests
- Use integration tests for critical paths
- Ensure tests run quickly and reliably
- Use scoped CSS in Vue components
- Debug console output should be removed before committing code

## Preferred Patterns

- Computed over watchers
- Shallow refs when possible
- Small functions (<40 lines)
- Early returns
- Named constants over magic values
- Prefer arrow functions
- Console output should be avoided in favor of proper logging mechanisms

## Prohibited Patterns

- Silent error handling
- Inline configuration
- Commented-out code
- Options API in Vue components
- Unscoped styles in Vue components
- Using `$refs` for DOM manipulation
- Direct DOM manipulation without Vue refs
- Using `any` type

## Examples

### ✅ Good

```vue
<script setup lang="ts">
defineProps<{ userId: string }>();
</script>
```

## Validation

- [ ] CSS is scoped
- [ ] `<script setup>` is used in vue components
- [ ] No Options API in vue components
- [ ] No direct DOM manipulation without refs
- [ ] No untyped variables or functions
- [ ] No use of `var`
- [ ] No use of `any` type
- [ ] ESLint and Prettier configured and used
- [ ] JSDoc comments present for public APIs
- [ ] Code is modular and reusable
- [ ] Naming conventions followed
- [ ] Tests written for new features and bug fixes
- [ ] Tests cover edge cases and error handling
- [ ] Tests are isolated and independent
- [ ] External dependencies are mocked in unit tests
- [ ] Integration tests exist for critical paths
- [ ] Tests run quickly and reliably
