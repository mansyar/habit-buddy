# Implementation Plan: Parent Dashboard (Phase 6)

## Phase 1: Data Layer & Statistics [checkpoint: d229c64]

- [x] Task: Create `DashboardService` for optimized statistics queries (80ba746)
  - [x] [Red Phase] Write failing unit tests for `getBoltStats()`, `getDailyAverageHabits()`, and `getWeeklyStreakData()`
  - [x] [Green Phase] Implement `DashboardService` with actual data queries and return expected `DashboardStats` interface
- [x] Task: Implement `resetTodayProgress()` in `HabitLogService` (80ba746)
  - [x] [Red Phase] Write failing unit test for clearing today's logs for the current profile
  - [x] [Green Phase] Add method to delete logs for the current profile and current date
- [ ] Task: Conductor - User Manual Verification 'Data Layer & Statistics' (Protocol in workflow.md)

## Phase 2: Dashboard UI & Components

- [x] Task: Implement `ParentalGate` trigger on Home Screen (78536b0)
  - [x] [Red Phase] Write component test for 3-second long-press interaction expectation
  - [x] [Green Phase] Add 3-second long-press handler to the settings gear or child profile area
- [ ] Task: Build `DashboardScreen` layout (Professional Theme)
  - [ ] [Red Phase] Write component test ensuring `DashboardScreen` and its sub-sections (Summary, Streak, Stats) render correctly with mock data
  - [ ] [Green Phase] Implement `DashboardScreen` and its child components with professional theme styling
- [ ] Task: Add administrative action buttons
  - [ ] [Red Phase] Write component test for 'Reset Today' and 'Manage Rewards' button interactions
  - [ ] [Green Phase] Implement "Reset Today's Progress" button with confirmation dialog and "Manage Rewards" link navigating to `reward-shop.tsx`
- [ ] Task: Conductor - User Manual Verification 'Dashboard UI & Components' (Protocol in workflow.md)

## Phase 3: Integration & Completion

- [ ] Task: Connect `DashboardScreen` to `DashboardService`
  - [ ] [Red Phase] Write integration test for end-to-end data fetching and display
  - [ ] [Green Phase] Integrate `DashboardScreen` with `DashboardService` and ensure optimized loading < 1s
- [ ] Task: Final visual polish for "Professional" theme variant
  - [ ] [Red Phase] Verify contrast and font choices against `design-guide.md` or `product-guidelines.md`
  - [ ] [Green Phase] Refine UI for professional look
- [ ] Task: Update project documentation
  - [ ] Update `docs/roadmap.md` to mark Phase 6 as complete
  - [ ] Update `GEMINI.md` with new feature details
- [ ] Task: Conductor - User Manual Verification 'Integration & Completion' (Protocol in workflow.md)
