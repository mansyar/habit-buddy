# Implementation Plan: Error Handling & Edge Cases (Sub-Phase 8B)

## Phase 1: Global Error Boundary & Crash Prevention [checkpoint: 07ab5bb]

- [x] Task: Install `react-native-error-boundary` (deb2d79)
- [x] Task: Implement `GlobalErrorBoundary` component with a child-friendly fallback UI (2c63f82)
- [x] Task: Wrap the root component in `app/_layout.tsx` with the Error Boundary (49f65f7)
- [x] Task: Write Tests: Verify that unhandled JS errors trigger the fallback UI (e2c3f66)
- [x] Task: Conductor - User Manual Verification 'Phase 1: Global Error Boundary' (Protocol in workflow.md) (07ab5bb)

## Phase 2: Input Validation & Constraints

- [x] Task: Implement validation logic for Child Name (2–20 chars) in `Onboarding` screen (df8f3a7)
- [x] Task: Implement validation logic for Coupon Title (2–20 chars) and Bolt Cost (0–200) in `CouponManagement` (d732e82)
- [x] Task: Update UI to show clear error messages/feedback for invalid inputs (0461183)
- [ ] Task: Write Tests: Unit tests for validation helpers and component-level validation state
- [ ] Task: Conductor - User Manual Verification 'Phase 2: Input Validation' (Protocol in workflow.md)

## Phase 3: Network Connectivity & Data Fallbacks

- [ ] Task: Create a `NetworkStatusIcon` component for the header
- [ ] Task: Integrate `NetworkStatusIcon` into the global header/app bar
- [ ] Task: Enhance `ProfileService`, `HabitLogService`, and `CouponService` to handle Supabase request timeouts/failures gracefully
- [ ] Task: Write Tests: Mock network failures and verify services fall back to local SQLite correctly
- [ ] Task: Conductor - User Manual Verification 'Phase 3: Network Connectivity' (Protocol in workflow.md)

## Phase 4: Mission Flow & Asset Edge Cases

- [ ] Task: Implement AppState listener in `useMissionTimer` to pause/resume on background/foreground
- [ ] Task: Add double-tap prevention (debounce/disable) to the "Done!" button in `MissionActive`
- [ ] Task: Implement fallback styling/images for `BuddyAnimation` and `FloatingProp` if assets fail to load
- [ ] Task: Add error handling for audio playback in `AudioService`
- [ ] Task: Write Tests: Integration tests for mission timer persistence and button debouncing
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
