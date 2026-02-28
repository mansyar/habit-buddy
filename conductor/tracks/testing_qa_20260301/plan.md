# Implementation Plan: Testing & QA (Sub-Phase 8D)

## Phase 1: Unit Testing (TDD) [checkpoint: b0d8e27]

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
- [x] Task: Unit tests for `BuddyState` (Zustand) 0bf4692
  - [x] Write failing tests for state machine transitions (Idle -> Active -> Success/Sleepy)
  - [x] Implement/Refine code to pass tests
  - [x] Verify >80% coverage
- [x] Task: Conductor - User Manual Verification 'Phase 1: Unit Testing' (Protocol in workflow.md) b0d8e27

## Phase 2: Component Testing (TDD) [checkpoint: 4cb776d]

Goal: Validate UI rendering, accessibility, and navigation on key screens.

- [x] Task: Component tests for `Home` screen c3971b0
  - [x] Write failing tests for accessibility labels, state-driven rendering, and navigation triggers
  - [x] Implement/Refine code to pass tests
- [x] Task: Component tests for `Mission` screen e04246d
  - [x] Write failing tests for accessibility labels, state-driven rendering, and timer display
  - [x] Implement/Refine code to pass tests
- [x] Task: Component tests for `Reward Shop` screen cf5c662
  - [x] Write failing tests for accessibility labels, redemption button state, and history rendering
  - [x] Implement/Refine code to pass tests
- [x] Task: Visual consistency with Snapshot Tests 673f35f
  - [x] Create snapshots for `Home`, `Mission`, and `Reward Shop` across different states
  - [x] Verify snapshots pass
- [x] Task: Conductor - User Manual Verification 'Phase 2: Component Testing' (Protocol in workflow.md) 4cb776d

## Phase 3: Integration Testing (TDD) [checkpoint: 9cae63e]

Goal: Verify the end-to-end user flow for the core mission feature.

- [x] Task: Integration test for Full Mission Flow 6deafac
  - [x] Write failing integration test (RNTL) covering: Start -> Timer -> Done -> Success -> Home Update
  - [x] Implement/Refine code to pass tests
- [x] Task: Conductor - User Manual Verification 'Phase 3: Integration Testing' (Protocol in workflow.md) 9cae63e

## Phase 4: Manual QA & Performance Profiling

Goal: Final validation of performance, accessibility, and real-device behavior.

- [x] Task: Performance Profiling
  - [x] Measure cold start time using Flipper/React DevTools (Target: < 3s)
  - [x] Measure animation FPS during mission (Target: >= 60 FPS)
- [x] Task: Manual Accessibility & Device Audit
  - [x] Verify tap target sizes (>= 48x48dp) on real Android device
  - [x] Validate TalkBack experience on parent-facing screens (Dashboard, Settings)
- [x] Task: Conductor - User Manual Verification 'Phase 4: Manual QA & Performance' (Protocol in workflow.md)

## Phase 5: Finalization & Documentation

Goal: Finalize the track and update project-wide documentation.

- [ ] Task: Update `docs/roadmap.md` with progress
  - [ ] Mark Sub-Phase 8D as complete in `docs/roadmap.md`
  - [ ] Update any related task statuses in the roadmap
- [ ] Task: Conductor - User Manual Verification 'Phase 5: Finalization' (Protocol in workflow.md)
