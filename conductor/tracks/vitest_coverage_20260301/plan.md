# Implementation Plan: Achieve 85%-90% Vitest Coverage

## Phase 1: Baseline & Configuration

- [x] Task: Fix and Verify Coverage Reporting 6afcb40
  - [x] Ensure `vitest.config.ts` correctly generates reports in `coverage/`
  - [x] Verify that `v8` provider is working in the current environment
  - [x] Successfully generate a baseline coverage report
- [ ] Task: Identify Coverage Gaps
  - [ ] Analyze the baseline report to list all files below their respective targets (80% for app, 90% for lib)
- [ ] Task: Conductor - User Manual Verification 'Phase 1' (Protocol in workflow.md)

## Phase 2: Data Services Coverage (src/lib/)

- [ ] Task: Increase Coverage for `src/lib/sync_service.ts`
  - [ ] Write tests for network timeout handling
  - [ ] Write tests for exponential backoff logic
  - [ ] Write tests for conflict resolution (if any)
- [ ] Task: Increase Coverage for `src/lib/profile_service.ts`
  - [ ] Write tests for SQLite fallback failures
  - [ ] Write tests for anonymous onboarding edge cases
- [ ] Task: Increase Coverage for `src/lib/habit_log_service.ts`
  - [ ] Write tests for daily progress reset logic
  - [ ] Write tests for multi-device sync collisions
- [ ] Task: Increase Coverage for `src/lib/coupon_service.ts`
  - [ ] Write tests for validation errors
  - [ ] Write tests for redemption history filtering
- [ ] Task: Conductor - User Manual Verification 'Phase 2' (Protocol in workflow.md)

## Phase 3: State Management Coverage (src/store/)

- [ ] Task: Increase Coverage for `src/store/auth_store.ts`
  - [ ] Write tests for session persistence
  - [ ] Write tests for sign-out cleanup
- [ ] Task: Increase Coverage for `src/store/habit_store.ts`
  - [ ] Write tests for optimistic updates
  - [ ] Write tests for habit state transitions
- [ ] Task: Increase Coverage for `src/store/buddy_store.ts`
  - [ ] Write tests for animation state changes
- [ ] Task: Conductor - User Manual Verification 'Phase 3' (Protocol in workflow.md)

## Phase 4: UI Screens Coverage (app/)

- [ ] Task: Increase Coverage for Home Screen (`app/(tabs)/index.tsx`)
  - [ ] Write tests for habit card interactions
  - [ ] Write tests for haptic feedback triggers
- [ ] Task: Increase Coverage for Parent Dashboard (`app/parent-dashboard.tsx`)
  - [ ] Write tests for streak calculation display
  - [ ] Write tests for data reset confirmation
- [ ] Task: Increase Coverage for Reward Shop (`app/reward-shop.tsx`)
  - [ ] Write tests for parental gate interaction
  - [ ] Write tests for bolt balance updates after redemption
- [ ] Task: Increase Coverage for Mission Screen (`app/mission/[id].tsx`)
  - [ ] Write tests for timer completion flow
  - [ ] Write tests for "Read to me" audio cues
- [ ] Task: Conductor - User Manual Verification 'Phase 4' (Protocol in workflow.md)

## Phase 5: Final Validation & Checkpoint

- [ ] Task: Final Coverage Audit
  - [ ] Run `pnpm test --coverage`
  - [ ] Confirm Global > 85%, app/ > 80%, src/lib/ > 90%
- [ ] Task: Conductor - User Manual Verification 'Phase 5' (Protocol in workflow.md)
