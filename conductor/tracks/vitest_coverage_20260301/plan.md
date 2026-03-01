# Implementation Plan: Achieve 85%-90% Vitest Coverage

## Phase 1: Baseline & Configuration [checkpoint: 6a7c176]

- [x] Task: Fix and Verify Coverage Reporting 6afcb40
  - [x] Ensure `vitest.config.ts` correctly generates reports in `coverage/`
  - [x] Verify that `v8` provider is working in the current environment
  - [x] Successfully generate a baseline coverage report
- [x] Task: Identify Coverage Gaps 6afcb40
  - [x] Analyze the baseline report to list all files below their respective targets (80% for app, 90% for lib)
- [x] Task: Conductor - User Manual Verification 'Phase 1' (Protocol in workflow.md) 6a7c176

## Phase 2: Data Services Coverage (src/lib/) [checkpoint: 595c6a6]

- [x] Task: Increase Coverage for `src/lib/accessibility_helper.ts` (40% -> 90%) a1530eb
  - [x] Write tests for focus trapping logic
  - [x] Write tests for screen reader announcement queue
- [x] Task: Increase Coverage for `src/lib/coupon_service.ts` (47% -> 90%) a2a71c0
  - [x] Write tests for validation errors
  - [x] Write tests for redemption history filtering
- [x] Task: Increase Coverage for `src/lib/network.ts` (57% -> 90%) 9490d0b
  - [x] Write tests for fetch fallbacks
  - [x] Write tests for connection state transitions
- [x] Task: Increase Coverage for `src/lib/haptic_feedback.ts` (62% -> 90%) 4d4099d
  - [x] Write tests for intensity levels
- [x] Task: Increase Coverage for `src/lib/sqlite.ts` (71% -> 90%) b4f9fb3
  - [x] Write tests for database initialization errors
  - [x] Write tests for migration failure recovery
- [x] Task: Increase Coverage for `src/lib/profile_service.ts` (81% -> 90%) 213c6df
  - [x] Write tests for SQLite fallback failures
  - [x] Write tests for anonymous onboarding edge cases
- [x] Task: Increase Coverage for `src/lib/sync_service.ts` (87% -> 90%) 09e5a6d
  - [x] Write tests for conflict resolution (if any)
- [x] Task: Conductor - User Manual Verification 'Phase 2' (Protocol in workflow.md) 595c6a6

## Phase 3: State Management Coverage (src/store/) [checkpoint: afa584d]

- [x] Task: Increase Coverage for `src/store/auth_store.ts` 28302de
  - [x] Write tests for session persistence
  - [x] Write tests for sign-out cleanup
- [x] Task: Increase Coverage for `src/store/habit_store.ts` 81e150a
  - [x] Write tests for optimistic updates
  - [x] Write tests for habit state transitions
- [x] Task: Increase Coverage for `src/store/buddy_store.ts`
  - [x] Write tests for animation state changes (Already 100%)
- [x] Task: Conductor - User Manual Verification 'Phase 3' (Protocol in workflow.md) afa584d

## Phase 4: UI Screens & Components Coverage (app/ & src/components/) [checkpoint: 8c65a77]

- [x] Task: Increase Coverage for `app/(tabs)/two.tsx` (77% -> 80%) 3ea261f
  - [x] Write tests for basic screen elements
- [x] Task: Increase Coverage for `src/components/BoltCounter.tsx` (54% -> 80%) 1ab6e5d
  - [x] Write tests for animation triggers on balance change
- [x] Task: Increase Coverage for `src/components/ScaleButton.tsx` (66% -> 80%) 31eba69
  - [x] Write tests for scale transform logic
- [x] Task: Increase Coverage for Home Screen (`app/(tabs)/index.tsx`) 637486a
  - [x] Write tests for habit card interactions
  - [x] Write tests for haptic feedback triggers
- [x] Task: Increase Coverage for Parent Dashboard (`app/parent-dashboard.tsx`) 114b098
  - [x] Write tests for streak calculation display
  - [x] Write tests for data reset confirmation
- [x] Task: Increase Coverage for Reward Shop (`app/reward-shop.tsx`) 454a5bd
  - [x] Write tests for parental gate interaction
  - [x] Write tests for bolt balance updates after redemption
- [x] Task: Increase Coverage for Mission Screen (`app/mission/[id].tsx`)
  - [x] Write tests for timer completion flow
  - [x] Write tests for "Read to me" audio cues
- [x] Task: Conductor - User Manual Verification 'Phase 4' (Protocol in workflow.md) 8c65a77

## Phase 5: Final Validation & Checkpoint

- [x] Task: Final Coverage Audit 8c65a77
  - [x] Run `pnpm test --coverage`
  - [x] Confirm Global > 85%, app/ > 80%, src/lib/ > 90%
- [ ] Task: Conductor - User Manual Verification 'Phase 5' (Protocol in workflow.md)

## Phase: Review Fixes

- [x] Task: Apply review suggestions a76137c
