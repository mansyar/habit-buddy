# Specification: Achieve 85%-90% Vitest Coverage

## Overview

This track aims to significantly increase the test coverage of the HabitBuddy codebase. The goal is to reach a high level of confidence in the application's stability by ensuring that UI screens, data services, and state management are thoroughly tested.

## Functional Requirements

- **Coverage Targets:**
  - Global project coverage (src and app) must be >= 85%.
  - All UI screens in `app/` must have >= 80% coverage.
  - All business logic in `src/lib/` must have >= 90% coverage.
- **Testing Scope:**
  - UI interactions (button clicks, form inputs, navigation).
  - Data layer resilience (offline fallbacks, Supabase sync, SQLite operations).
  - State management (Zustand store updates, state transitions).
  - Edge cases (network timeouts, malformed data, authentication failures).

## Non-Functional Requirements

- **Performance:** Tests should run efficiently and not significantly bloat CI/CD pipeline time.
- **Maintainability:** Tests should be written following established patterns (Vitest + React Testing Library) and avoid brittle selectors.
- **Mocking:** Maintain clear boundaries between units using proper Vitest mocks for external dependencies (Supabase, Expo APIs).

## Acceptance Criteria

- [ ] `pnpm test --coverage` reports overall statement/branch coverage of at least 85%.
- [ ] Every file in `app/` (excluding layouts) shows at least 80% statement coverage.
- [ ] Every file in `src/lib/` shows at least 90% statement coverage.
- [ ] All new tests pass in the local environment and CI.
- [ ] No regressions introduced in existing features.

## Out of Scope

- Integration tests involving real native hardware features that cannot be mocked in JSDOM.
- Coverage for non-testable files (constants, types, auto-generated files).
- Refactoring production code unless necessary to make it testable (e.g., dependency injection).
