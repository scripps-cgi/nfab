# Skill: Scripting & Tooling (TypeScript + Node.js)

## Purpose

Ensure all automation, tooling, and scripts are written in a consistent,
maintainable, and type-safe way using TypeScript and Node.js where feasible.

## Scope

This skill applies to:

- CLI tools
- Automation scripts
- Build / repo tooling
- One-off utilities committed to the repository
- Developer-facing scripts used by CI or agents

This skill does NOT apply to:

- Application runtime code (covered by other skills)
- Configuration-only files (YAML, JSON, etc.)
- Third-party generated code

---

## Mandatory Rules

- Prefer **TypeScript** over JavaScript for all scripts
- Target **Node.js (LTS)** as the runtime
- Use ES modules (`type: "module"`) unless there is a strong reason not to
- Enable `strict` TypeScript settings
- Scripts must be runnable via `node` or `tsx`, not browser environments
- Scripts must be deterministic and side-effect-aware
- Use `import` statements instead of `require`
- Handle errors gracefully with clear messages and non-zero exit codes
- Avoid hardcoding configuration; use environment variables or config files
- Include type definitions for all functions and objects
- Use `async`/`await` for asynchronous operations
- Use built-in Node.js modules where possible (e.g., `fs/promises`, `path`, `child_process`)
- Use third-party libraries judiciously; prefer well-maintained and widely-used packages
- Write modular code; avoid large monolithic scripts
- Include comments and documentation for complex logic
- Include unit tests for non-trivial logic
- Use linters (ESLint) and formatters (Prettier) to maintain code quality
- Scripts should have a clear entry point and usage instructions
- Scripts should be documented in the repository README or relevant documentation
- Use version control (Git) for all scripts and tooling
- Ensure scripts are cross-platform where feasible (Windows, macOS, Linux)
- Follow security best practices, especially when handling sensitive data
- Avoid using deprecated Node.js APIs or packages
- Scripts should clean up any temporary files or resources they create
- Scripts should not interfere with application runtime code or configurations
- Scripts should be kept in `scripts` directory or appropriate tooling directories

---

## Preferred Patterns

- Use TypeScript for type safety and clarity
- Keep scripts small and single-purpose
- Fail fast with clear error messages and exit codes
- Use explicit imports instead of dynamic requires
- Read configuration from files or environment variables
- Structure non-trivial scripts as small libraries
