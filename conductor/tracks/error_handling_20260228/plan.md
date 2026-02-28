# Implementation Plan: Error Handling & Edge Cases (Sub-Phase 8B)

## Phase 1: Global Error Boundary & Crash Prevention [checkpoint: 07ab5bb]

- [x] Task: Install `react-native-error-boundary` (deb2d79)
- [x] Task: Implement `GlobalErrorBoundary` component with a child-friendly fallback UI (2c63f82)
- [x] Task: Wrap the root component in `app/_layout.tsx` with the Error Boundary (49f65f7)
- [x] Task: Write Tests: Verify that unhandled JS errors trigger the fallback UI (e2c3f66)
- [x] Task: Conductor - User Manual Verification 'Phase 1: Global Error Boundary' (Protocol in workflow.md) (07ab5bb)

## Phase 2: Input Validation & Constraints [checkpoint: ab69703]

- [x] Task: Implement validation logic for Child Name (2–20 chars) in `Onboarding` screen (df8f3a7)
- [x] Task: Implement validation logic for Coupon Title (2–20 chars) and Bolt Cost (0–200) in `CouponManagement` (d732e82)
- [x] Task: Update UI to show clear error messages/feedback for invalid inputs (0461183)
- [x] Task: Write Tests: Unit tests for validation helpers and component-level validation state (468f916)
- [x] Task: Conductor - User Manual Verification 'Phase 2: Input Validation' (Protocol in workflow.md) (ab69703)

## Phase 3: Network Connectivity & Data Fallbacks [checkpoint: 60e8121]

- [x] Task: Create a `NetworkStatusIcon` component for the header (086bf05)
- [x] Task: Integrate `NetworkStatusIcon` into the global header/app bar (f46c5a5)
- [x] Task: Enhance `ProfileService`, `HabitLogService`, and `CouponService` to handle Supabase request timeouts/failures gracefully (48b5c55)
- [x] Task: Write Tests: Mock network failures and verify services fall back to local SQLite correctly (19ddba9)
- [x] Task: Conductor - User Manual Verification 'Phase 3: Network Connectivity' (Protocol in workflow.md) (60e8121)

## Phase 4: Mission Flow & Asset Edge Cases

- [x] Task: Implement AppState listener in `useMissionTimer` to pause/resume on background/foreground (7a6a2d6)
- [x] Task: Add double-tap prevention (debounce/disable) to the "Done!" button in `MissionActive` (13bdd20)
- [x] Task: Implement fallback styling/images for `BuddyAnimation` and `FloatingProp` if assets fail to load (8696468)
- [x] Task: Add error handling for audio playback in `AudioService` (81636e6)
- [x] Task: Write Tests: Integration tests for mission timer persistence and button debouncing (104400d)
- [ ] Task: Conductor - User Manual Verification 'Phase 4: Mission Flow' (Protocol in workflow.md)

## Phase 5: Auth Migration Robustness

- [ ] Task: Implement retry logic (up to 3 times) with exponential backoff for anonymous-to-authenticated data migration in `SyncService`
- [ ] Task: Add "Sync Failed" user notification/banner if migration fails after retries
- [ ] Task: Write Tests: Simulate migration failures and verify retry attempts and final failure state
- [ ] Task: Conductor - User Manual Verification 'Phase 5: Auth Migration' (Protocol in workflow.md)

## Phase 6: Completion & Documentation

- [ ] Task: Update `docs/roadmap.md` to mark Sub-Phase 8B as complete
- [ ] Task: Update `conductor/tracks.md` to mark this track as complete
- [ ] Task: Conductor - User Manual Verification 'Phase 6: Completion' (Protocol in workflow.md)
