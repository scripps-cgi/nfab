# Skill: Server & SSR Performance

## Purpose

Ensure fast SSR, efficient data fetching, and scalable server behavior.

## Mandatory Rules

- Avoid blocking SSR with unnecessary async work
- Cache where safe and appropriate
- Minimize per-request computation

## Preferred Patterns

- `useAsyncData` with caching keys
- Nitro storage (`useStorage`) for server caching
- Edge-compatible logic when possible
- Batch server-side API calls

## Prohibited Patterns

- Re-fetching identical data per request
- Heavy computation inside page setup
- Unbounded server-side loops
- Blocking I/O during SSR

## Examples

### ✅ Good

```ts
await useAsyncData("products", () => $fetch("/api/products"), { server: true });
```

### ❌ Bad

```ts
const data = await fetchExternalApi();
```

## Validation

- [ ] Data fetched once per request
- [ ] Caching strategy defined
- [ ] SSR work minimized
