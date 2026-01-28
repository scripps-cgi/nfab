# Skill: State Management

## Mandatory Rules

- Use Pinia for global state
- Keep stores small and focused
- Use Pinia's composable API

## Preferred Patterns

- One store per domain
- Action functions for async logic
- Computeds for derived state

## Prohibited Patterns

- Large monolithic stores
- Direct mutation outside actions
- Pinia's options API

## Validation

- [ ] Store scope justified
- [ ] No cross-store coupling
