# Implementation Plan - Core Data Layer (`core_data_layer_20260224`)

This plan covers the implementation of the complete data layer, including Supabase migrations, local SQLite setup, and the service layer with offline synchronization.

## Phase 1: Supabase Schema & Security [checkpoint: 6efbe1f]

Goal: Provision the remote database and enforce data isolation.

- [x] Task: Create Supabase migration for `profiles`, `habits_log`, and `coupons` tables. (d8ae8b2)
- [x] Task: Implement Row-Level Security (RLS) policies for all tables. (02a294d)
- [x] Task: Verify RLS policies with manual SQL tests in Supabase dashboard. (9e0a1b2)
- [x] Task: Conductor - User Manual Verification 'Phase 1: Supabase Schema & Security' (Protocol in workflow.md) (6efbe1f)

## Phase 2: Local SQLite Foundation

Goal: Set up the local database using `expo-sqlite/next` to mirror the Supabase schema.

- [ ] Task: Define SQLite schema and initialization logic in `src/lib/sqlite.ts`.
- [ ] Task: Create a `sync_queue` table in SQLite for offline write tracking.
- [ ] Task: Write tests for SQLite initialization and basic CRUD operations.
- [ ] Task: Implement SQLite initialization on app startup.
- [ ] Task: Conductor - User Manual Verification 'Phase 2: Local SQLite Foundation' (Protocol in workflow.md)

## Phase 3: Service Layer (Repositories)

Goal: Build the abstract services that toggle between Supabase and SQLite.

- [ ] Task: Refactor `ProfileService` to support both Supabase and SQLite.
  - [ ] Task: Write failing tests for `ProfileService` (online/offline modes).
  - [ ] Task: Implement `getProfile`, `createProfile`, and `updateProfile`.
- [ ] Task: Implement `HabitLogService`.
  - [ ] Task: Write failing tests for `HabitLogService`.
  - [ ] Task: Implement `logCompletion`, `getTodaysLogs`, and `getStreakData`.
- [ ] Task: Implement `CouponService`.
  - [ ] Task: Write failing tests for `CouponService`.
  - [ ] Task: Implement `getCoupons`, `createCoupon`, and `redeemCoupon`.
- [ ] Task: Conductor - User Manual Verification 'Phase 3: Service Layer (Repositories)' (Protocol in workflow.md)

## Phase 4: Network & Synchronization

Goal: Implement real-time connectivity monitoring and background sync logic.

- [ ] Task: Integrate `@react-native-community/netinfo` for connectivity tracking.
- [ ] Task: Implement `SyncService` to process the `sync_queue`.
  - [ ] Task: Write failing tests for `SyncService` (replaying queued items).
  - [ ] Task: Implement `processQueue` logic with retry mechanism.
- [ ] Task: Hook `SyncService` to network change events.
- [ ] Task: Conductor - User Manual Verification 'Phase 4: Network & Synchronization' (Protocol in workflow.md)

## Phase 5: Final Validation & Integration

Goal: Ensure all services work together and meet the acceptance criteria.

- [ ] Task: Run full integration test suite (Mocked Offline -> Online transition).
- [ ] Task: Verify data consistency between local and remote after sync.
- [ ] Task: Update roadmap.md to mark Phase 2 as complete.
- [ ] Task: Conductor - User Manual Verification 'Phase 5: Final Validation & Integration' (Protocol in workflow.md)
