# Skill: Client Performance

## Purpose

Ensure fast initial load, minimal JS payload, and responsive UI.

## Mandatory Rules

- Minimize client-side JavaScript
- Lazy-load non-critical components
- Avoid unnecessary reactivity
- Prefer server-rendered content over client hydration
- dependencies in client code must be minimal and essential
- Optimize images and assets
- Use browser caching effectively
- Minimize third-party scripts
- Use efficient data fetching strategies
- Avoid memory leaks in client code

## Preferred Patterns

- `defineAsyncComponent` for heavy components
- `v-memo` for stable subtrees
- `shallowRef` and `markRaw` for non-reactive data
- `useAsyncData` with `server: true`

## Prohibited Patterns

- Large client-only plugins
- Watching large reactive objects
- Unbounded computed properties
- Rendering hidden but mounted components

## Validation

- [ ] Non-critical components lazy-loaded
- [ ] No unnecessary watchers
- [ ] Minimal client-only code
- [ ] Optimized images and assets
- [ ] Efficient data fetching
- [ ] No memory leaks in client code
- [ ] Fast initial load and responsive UI
