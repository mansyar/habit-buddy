# Specification: Testing & QA (Sub-Phase 8D)

## Overview

This track focuses on the implementation of unit, component, and integration tests, as well as manual QA and performance profiling for the HabitBuddy app. This is the final validation stage (Phase 8D) to ensure the app is stable, accessible, and performant before release.

## Functional Requirements

- **Unit Testing:**
  - Priority services: `SyncService`, `AudioService`, `HabitLogService`.
  - Stores: `BuddyState` (Zustand state machine).
  - Models and repositories CRUD logic.
- **Component Testing:**
  - Key screens: `Home`, `Mission`, `Reward Shop`.
  - Focus areas:
    - Accessibility labels and roles (Screen Reader compatibility).
    - State-driven UI rendering (correct components shown for different store states).
    - Navigation triggers (buttons navigating correctly).
    - Snapshot testing for visual consistency.
- **Integration Testing:**
  - Tools: `react-native-testing-library` (RNTL).
  - Scope: Full mission flow (Start -> Done -> Bolt awarded -> Home updated).
- **Manual QA:**
  - Verify on real Android devices.
  - Focus on tap target sizes (>= 48x48dp).
  - Screen reader (TalkBack) validation on parent-facing screens.

## Non-Functional Requirements

- **Performance:**
  - Cold start time < 3 seconds.
  - Animation performance (Reanimated) >= 60 FPS on mid-range devices.
  - Profiling tool: Manual recording via Flipper / React DevTools.
- **Accessibility:**
  - WCAG AA contrast (4.5:1) for all primary UI elements.
  - Proactive alerts (`announceForAccessibility`) for mission/bolt updates.

## Acceptance Criteria

- [ ] All unit tests pass (`pnpm test`).
- [ ] Component tests for Home, Mission, and Reward Shop pass.
- [ ] Integration test for full mission flow passes.
- [ ] Manual QA report confirms 60 FPS during animations.
- [ ] Cold start time verified < 3 seconds.
- [ ] Accessibility audit (Sub-Phase 8C) verified via automated and manual checks.

## Out of Scope

- Implementation of `Detox` (E2E) testing.
- Automated CI/CD performance benchmarking.
- iOS-specific performance profiling (focused on Android MVP).
