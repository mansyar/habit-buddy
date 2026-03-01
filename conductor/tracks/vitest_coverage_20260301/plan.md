# Implementation Plan: Achieve 85%-90% Vitest Coverage

## Phase 1: Baseline & Configuration [checkpoint: 6a7c176]

- [x] Task: Fix and Verify Coverage Reporting 6afcb40
  - [x] Ensure `vitest.config.ts` correctly generates reports in `coverage/`
  - [x] Verify that `v8` provider is working in the current environment
  - [x] Successfully generate a baseline coverage report
- [x] Task: Identify Coverage Gaps 6afcb40
  - [x] Analyze the baseline report to list all files below their respective targets (80% for app, 90% for lib)
- [x] Task: Conductor - User Manual Verification 'Phase 1' (Protocol in workflow.md) 6a7c176

## Phase 2: Data Services Coverage (src/lib/)

- [ ] Task: Increase Coverage for `src/lib/accessibility_helper.ts` (40% -> 90%)
  - [ ] Write tests for focus trapping logic
  - [ ] Write tests for screen reader announcement queue
- [ ] Task: Increase Coverage for `src/lib/coupon_service.ts` (47% -> 90%)
  - [ ] Write tests for validation errors
  - [ ] Write tests for redemption history filtering
- [ ] Task: Increase Coverage for `src/lib/network.ts` (57% -> 90%)
  - [ ] Write tests for fetch fallbacks
  - [ ] Write tests for connection state transitions
- [ ] Task: Increase Coverage for `src/lib/haptic_feedback.ts` (62% -> 90%)
  - [ ] Write tests for intensity levels
- [ ] Task: Increase Coverage for `src/lib/sqlite.ts` (71% -> 90%)
  - [ ] Write tests for database initialization errors
  - [ ] Write tests for migration failure recovery
- [ ] Task: Increase Coverage for `src/lib/profile_service.ts` (81% -> 90%)
  - [ ] Write tests for SQLite fallback failures
  - [ ] Write tests for anonymous onboarding edge cases
- [ ] Task: Increase Coverage for `src/lib/sync_service.ts` (87% -> 90%)
  - [ ] Write tests for conflict resolution (if any)
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

## Phase 4: UI Screens & Components Coverage (app/ & src/components/)

- [ ] Task: Increase Coverage for `app/(tabs)/two.tsx` (77% -> 80%)
  - [ ] Write tests for basic screen elements
- [ ] Task: Increase Coverage for `src/components/BoltCounter.tsx` (54% -> 80%)
  - [ ] Write tests for animation triggers on balance change
- [ ] Task: Increase Coverage for `src/components/ScaleButton.tsx` (66% -> 80%)
  - [ ] Write tests for scale transform logic
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
