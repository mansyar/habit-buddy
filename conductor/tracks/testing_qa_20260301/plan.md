# Implementation Plan: Testing & QA (Sub-Phase 8D)

## Phase 1: Unit Testing (TDD)

Goal: Ensure core logic and state management are fully tested and robust.

- [x] Task: Unit tests for `SyncService` 7548586
  - [x] Write failing tests for offline queueing and online synchronization logic
  - [x] Implement/Refine code to pass tests
  - [x] Verify >80% coverage
- [x] Task: Unit tests for `AudioService` f4237d1
  - [x] Write failing tests for layered audio playback (BGM + VO) and mute logic
  - [x] Implement/Refine code to pass tests
  - [x] Verify >80% coverage- [x] Task: Unit tests for `HabitLogService` 1d90cf7
  - [x] Write failing tests for CRUD operations and local-vs-remote abstraction
  - [x] Implement/Refine code to pass tests
  - [x] Verify >80% coverage
- [ ] Task: Unit tests for `BuddyState` (Zustand)
  - [ ] Write failing tests for state machine transitions (Idle -> Active -> Success/Sleepy)
  - [ ] Implement/Refine code to pass tests
  - [ ] Verify >80% coverage
- [ ] Task: Conductor - User Manual Verification 'Phase 1: Unit Testing' (Protocol in workflow.md)

## Phase 2: Component Testing (TDD)

Goal: Validate UI rendering, accessibility, and navigation on key screens.

- [ ] Task: Component tests for `Home` screen
  - [ ] Write failing tests for accessibility labels, state-driven rendering, and navigation triggers
  - [ ] Implement/Refine code to pass tests
- [ ] Task: Component tests for `Mission` screen
  - [ ] Write failing tests for accessibility labels, state-driven rendering, and timer display
  - [ ] Implement/Refine code to pass tests
- [ ] Task: Component tests for `Reward Shop` screen
  - [ ] Write failing tests for accessibility labels, redemption button state, and history rendering
  - [ ] Implement/Refine code to pass tests
- [ ] Task: Visual consistency with Snapshot Tests
  - [ ] Create snapshots for `Home`, `Mission`, and `Reward Shop` across different states
  - [ ] Verify snapshots pass
- [ ] Task: Conductor - User Manual Verification 'Phase 2: Component Testing' (Protocol in workflow.md)

## Phase 3: Integration Testing (TDD)

Goal: Verify the end-to-end user flow for the core mission feature.

- [ ] Task: Integration test for Full Mission Flow
  - [ ] Write failing integration test (RNTL) covering: Start -> Timer -> Done -> Success -> Home Update
  - [ ] Implement/Refine code to pass tests
- [ ] Task: Conductor - User Manual Verification 'Phase 3: Integration Testing' (Protocol in workflow.md)

## Phase 4: Manual QA & Performance Profiling

Goal: Final validation of performance, accessibility, and real-device behavior.

- [ ] Task: Performance Profiling
  - [ ] Measure cold start time using Flipper/React DevTools (Target: < 3s)
  - [ ] Measure animation FPS during mission (Target: >= 60 FPS)
- [ ] Task: Manual Accessibility & Device Audit
  - [ ] Verify tap target sizes (>= 48x48dp) on real Android device
  - [ ] Validate TalkBack experience on parent-facing screens (Dashboard, Settings)
- [ ] Task: Conductor - User Manual Verification 'Phase 4: Manual QA & Performance' (Protocol in workflow.md)

## Phase 5: Finalization & Documentation

Goal: Finalize the track and update project-wide documentation.

- [ ] Task: Update `docs/roadmap.md` with progress
  - [ ] Mark Sub-Phase 8D as complete in `docs/roadmap.md`
  - [ ] Update any related task statuses in the roadmap
- [ ] Task: Conductor - User Manual Verification 'Phase 5: Finalization' (Protocol in workflow.md)
