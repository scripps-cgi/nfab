# Skill: Server & API (Nitro)

## Mandatory Rules

- Server logic lives in `server/`
- Validate all inputs
- Never expose secrets to client
- Use async/await for async operations

## Preferred Patterns

- `server/api/*.ts` for endpoints
- `server/utils/` for shared logic
- Runtime config for secrets
- Use caching headers where appropriate
- Use `defineEventHandler` for API handlers
- Use `getRouterParam` to access route params
- Use h3 utilities for request/response handling

## Prohibited Patterns

- Fetching external APIs from client when server is available
- Business logic in API handlers

## Examples

### ✅ Good

```ts
export default defineEventHandler((event) => {
  const id = getRouterParam(event, "id");
});
```

## Validation

- [ ] Input validation present
- [ ] Secrets server-only
