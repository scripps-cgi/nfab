# Skill: Performance Budgets

## Mandatory Rules

- Page JS bundle < 200kb (gzipped)
- Initial render < 2s on mid-tier devices
- No blocking client-side API calls on first render

## Preferred Patterns

- Code-splitting by route
- Conditional imports
- Server-side aggregation

## Validation

- [ ] Budget respected
- [ ] No regressions introduced
