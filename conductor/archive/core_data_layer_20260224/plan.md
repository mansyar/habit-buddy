# Implementation Plan - Core Data Layer (`core_data_layer_20260224`)

This plan covers the implementation of the complete data layer, including Supabase migrations, local SQLite setup, and the service layer with offline synchronization.

## Phase 1: Supabase Schema & Security [checkpoint: 6efbe1f]

Goal: Provision the remote database and enforce data isolation.

- [x] Task: Create Supabase migration for `profiles`, `habits_log`, and `coupons` tables. (d8ae8b2)
- [x] Task: Implement Row-Level Security (RLS) policies for all tables. (02a294d)
- [x] Task: Verify RLS policies with manual SQL tests in Supabase dashboard. (9e0a1b2)
- [x] Task: Conductor - User Manual Verification 'Phase 1: Supabase Schema & Security' (Protocol in workflow.md) (6efbe1f)

## Phase 2: Local SQLite Foundation [checkpoint: 79cd1b8]

Goal: Set up the local database using `expo-sqlite/next` to mirror the Supabase schema.

- [x] Task: Define SQLite schema and initialization logic in `src/lib/sqlite.ts`. (2fcd708)
- [x] Task: Create a `sync_queue` table in SQLite for offline write tracking. (2fcd708)
- [x] Task: Write tests for SQLite initialization and basic CRUD operations. (40e5c34)
- [x] Task: Implement SQLite initialization on app startup. (cc5c003)
- [x] Task: Conductor - User Manual Verification 'Phase 2: Local SQLite Foundation' (Protocol in workflow.md) (79cd1b8)

## Phase 3: Service Layer (Repositories) [checkpoint: b3df80e]

Goal: Build the abstract services that toggle between Supabase and SQLite.

- [x] Task: Refactor `ProfileService` to support both Supabase and SQLite. (4a270f0)
  - [x] Task: Write failing tests for `ProfileService` (online/offline modes). (4a270f0)
  - [x] Task: Implement `getProfile`, `createProfile`, and `updateProfile`. (4a270f0)
- [x] Task: Implement `HabitLogService`. (e4045b0)
  - [x] Task: Write failing tests for `HabitLogService`. (e4045b0)
  - [x] Task: Implement `logCompletion`, `getTodaysLogs`, and `getStreakData`. (e4045b0)
- [x] Task: Implement `CouponService`. (adaa8a4)
  - [x] Task: Write failing tests for `CouponService`. (adaa8a4)
  - [x] Task: Implement `getCoupons`, `createCoupon`, and `redeemCoupon`. (adaa8a4)
- [x] Task: Conductor - User Manual Verification 'Phase 3: Service Layer (Repositories)' (Protocol in workflow.md) (b3df80e)

## Phase 4: Network & Synchronization [checkpoint: 6a2e14b]

Goal: Implement real-time connectivity monitoring and background sync logic.

- [x] Task: Integrate `@react-native-community/netinfo` for connectivity tracking. (3748048)
- [x] Task: Implement `SyncService` to process the `sync_queue`. (4b44ae8)
  - [x] Task: Write failing tests for `SyncService` (replaying queued items). (4b44ae8)
  - [x] Task: Implement `processQueue` logic with retry mechanism. (4b44ae8)
- [x] Task: Hook `SyncService` to network change events. (b8806f1)
- [x] Task: Conductor - User Manual Verification 'Phase 4: Network & Synchronization' (Protocol in workflow.md) (6a2e14b)

## Phase 5: Final Validation & Integration [checkpoint: 45daedd]

Goal: Ensure all services work together and meet the acceptance criteria.

- [x] Task: Run full integration test suite (Mocked Offline -> Online transition). (3413303)
- [x] Task: Verify data consistency between local and remote after sync. (3413303)
- [x] Task: Update roadmap.md to mark Phase 2 as complete. (63d0cee)
- [x] Task: Conductor - User Manual Verification 'Phase 5: Final Validation & Integration' (Protocol in workflow.md) (45daedd)

## Phase: Review Fixes

- [x] Task: Apply review suggestions (442aaff)
