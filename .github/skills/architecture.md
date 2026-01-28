# Skill: Nuxt Architecture

## Purpose

Ensure consistent, idiomatic Nuxt 3 structure and SSR-safe behavior.

The application should leverage Nuxt conventions for routing, data fetching, and state management to maximize maintainability and performance.

The application will support multiple tenants with shared core functionality but isolated configurations and customizations.

## Mandatory Rules

- Use Nuxt auto-imports (`#imports`) where available
- Use Nuxt conventions for file structure
- Use directory routing for pages
- Pages contain minimal logic
- Business logic lives outside pages
- Follow Nuxt file-based conventions
- Prefer modules for colocating related functionality
- Use hooks for extendsibility points
- Use runtime config for environment-specific settings
- Use layers for multi-tenant separation
- Ensure SSR compatibility (no direct DOM access)
- Use Nitro server routes for backend logic
- Use composables for reusable logic
- Use plugins for third-party integrations
- Use middleware for route guards and preprocessing
- Use layouts for consistent page structure
- Use Pinia for state management

## Preferred Patterns

- `pages/` → routing only
- `components/` → UI only
- `composables/` → reusable logic
- `server/` → backend logic (Nitro)
- `utils/` → pure helpers
- `plugins/` → third-party integrations
- `middleware/` → route guards
- `layouts/` → page structure
- `stores/` → Pinia state
- Use async/await for data fetching
- Use `useFetch` and `useAsyncData` for SSR data
- Use `useRuntimeConfig` for config access
- Use `defineNuxtPlugin` for plugins
- Use `defineNuxtRouteMiddleware` for middleware
- Use `defineStore` for Pinia stores
- Use `useCookie` for cookie management
- Use `useSession` for session management
- Use `useRouter` and `useRoute` for navigation
- Use `useHead` for dynamic meta tags
- Use `nuxt.config.ts` for global configuration
- Use layers to separate tenant-specific code from shared code

## Prohibited Patterns

- Business logic in pages
- Direct API calls inside components
- Accessing browser-only APIs without guards

## Validation

- [ ] Pages are thin
- [ ] Logic extracted to composables or server routes
- [ ] SSR-safe code (no direct DOM access)
- [ ] Proper use of Nuxt conventions
- [ ] Multi-tenant separation via layers
- [ ] State managed with Pinia
- [ ] No hard-coded environment-specific settings
- [ ] Use of Nuxt auto-imports
- [ ] Data fetching uses `useFetch`/`useAsyncData`
- [ ] Plugins and middleware used appropriately
- [ ] No direct API calls in components
- [ ] Proper use of layouts for page structure
- [ ] Composables are reusable and generic
- [ ] Nitro server routes used for backend logic
- [ ] No duplicated code across tenants
- [ ] Config accessed via `useRuntimeConfig`
- [ ] No global state outside Pinia stores
- [ ] Proper error handling in server routes
- [ ] Use of hooks for extensibility
- [ ] No blocking operations in SSR context
- [ ] Consistent file structure following Nuxt conventions
- [ ] Use of async/await for asynchronous operations
- [ ] No sensitive information in client-side code
- [ ] Proper use of cookies and sessions
- [ ] No direct manipulation of the DOM
- [ ] Use of `useHead` for dynamic meta tags
- [ ] No side effects in composables
- [ ] Proper separation of concerns between layers
- [ ] Use of `nuxt.config.ts` for global settings
- [ ] No hard-coded tenant-specific logic in shared code
- [ ] Proper use of TypeScript types and interfaces
- [ ] Adherence to coding standards in all files
