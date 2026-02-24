# Track Specification: Phase 0 - Project Scaffolding (Revised)

## Overview

This track focuses on the foundational setup of the HabitBuddy Expo project, aligning with Phase 0 of the roadmap. It includes configuring the folder structure, installing core dependencies, setting up local development tools (Supabase CLI), enforcing code quality standards with pre-commit hooks, and initializing Vitest for testing.

## Functional Requirements

- **Folder Structure**: Implement the structure defined in `@docs/roadmap.md` (`src/`, `assets/audio/`, etc.).
- **Dependency Management**: Install and verify all core dependencies (Zustand, Supabase, Expo SQLite, AV, Fonts).
- **Local Development Environment**: Initialize Supabase CLI for local database/auth development.
- **Environment Configuration**: Set up `.env` support for development and production credentials.
- **Code Quality**: Configure ESLint, Prettier, and TypeScript path aliases (`@/*`).
- **Pre-commit Hooks**: Set up Husky and lint-staged to run linting/formatting before commits.
- **Testing**: Initialize Vitest and React Testing Library for component and unit testing.

## Technical Requirements

- **Expo Router**: Ensure basic tab navigation is functional.
- **Path Aliases**: Configure `tsconfig.json` to support `@/` mapping to `src/`.
- **Supabase Hybrid**: Setup local migrations/schema while allowing for a cloud fallback.
- **Audio/UI**: Verify `expo-av` and `@expo-google-fonts` are correctly linked.
- **Vitest**: Configure `vitest` for React Native environments.

## Acceptance Criteria

- [ ] `pnpm expo start` succeeds without errors.
- [ ] Folder structure matches the PRD/Roadmap.
- [ ] ESLint and Prettier are functional (testable via CLI).
- [ ] Husky pre-commit hooks block non-compliant code.
- [ ] Vitest "Hello World" test passes.
- [ ] Supabase local project is initialized (`npx supabase init`).
- [ ] `.env` file exists and is ignored by Git.
- [ ] Path aliases (e.g., `@/components/...`) work in TypeScript.

## Out of Scope

- Building functional UI screens beyond the template.
- Implementing actual Auth flow logic (Phase 1).
- Designing the production database schema (Phase 2).
