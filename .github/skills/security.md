# Skill: Security

## Mandatory Rules

- Guard browser-only APIs (`process.client`)
- Never trust client input
- Escape user-generated content

## Preferred Patterns

- `useFetch` over `fetch`
- Server-side validation
- Content Security Policy headers

## Prohibited Patterns

- Accessing `window` without guards
- Exposing runtime secrets
- Disabling SSR checks

## Validation

- [ ] SSR-safe
- [ ] Input validated
