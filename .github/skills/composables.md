# Skill: Composables

## Purpose

Ensure composables are reusable, testable, and SSR-safe.

## Mandatory Rules

- Prefix with `use`
- One responsibility per composable
- Return explicit API (no implicit side effects)

## Preferred Patterns

- Accept dependencies as parameters
- Return refs, not raw values
- Use Pinia for shared state
- Use undefined over null
- Use TypeScript generics for flexibility
- Use `Ref` for reactive parameters
- Use `async` functions for async logic
- Use `try/catch` for error handling
- Use `onMounted` and `onUnmounted` for lifecycle hooks
- Use `watch` and `watchEffect` for reactivity
- Use `watch` and `watchEffect` sparingly

## Prohibited Patterns

- DOM access inside composables
- Global mutable state
- Implicit runtime behavior

## Examples

### ✅ Good

```ts
export function useUser(userId: Ref<string>) {
  const user = ref<User>();
  return { user };
}
```
