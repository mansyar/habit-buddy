# Implementation Plan: Phase 7: Offline & Sync

## Phase 1: Connectivity Detection & UI [checkpoint: ]

- [x] Task: Implement `NetworkService` wrapper (using `@react-native-community/netinfo`) 8194d91
  - [x] [Red Phase] Write unit tests for `isOnline()` and `subscribeToConnectionChange()`
  - [x] [Green Phase] Implement the service in `src/lib/network.ts`
- [x] Task: Create `OfflineBanner` component 019ca5b
  - [x] [Red Phase] Write component tests for visibility based on network state
  - [x] [Green Phase] Implement the banner in `src/components/OfflineBanner.tsx` and integrate into `app/_layout.tsx`
- [ ] Task: Conductor - User Manual Verification 'Connectivity Detection & UI' (Protocol in workflow.md)

## Phase 2: Local Persistence & Queueing [checkpoint: ]

- [ ] Task: Extend `SQLite` schema for sync tracking
  - [ ] [Red Phase] Write migration test to ensure `sync_status` (pending/synced) and `last_modified` columns exist in `profiles`, `habits_log`, and `coupons`
  - [ ] [Green Phase] Update `src/lib/sqlite.ts` with the new schema
- [ ] Task: Update `BaseService` logic for offline writes
  - [ ] [Red Phase] Write unit tests ensuring `save()` marks records as `pending` when offline
  - [ ] [Green Phase] Refactor `ProfileService`, `HabitLogService`, and `CouponService` to handle local-first writes with sync markers
- [ ] Task: Conductor - User Manual Verification 'Local Persistence & Queueing' (Protocol in workflow.md)

## Phase 3: Background Synchronization [checkpoint: ]

- [ ] Task: Implement `SyncService` core logic
  - [ ] [Red Phase] Write unit tests for `syncPendingChanges()` with mocked Supabase client
  - [ ] [Green Phase] Implement the sync logic in `src/lib/sync_service.ts` using Last-Write-Wins (LWW)
- [ ] Task: Automate sync on reconnection
  - [ ] [Red Phase] Write integration test: Trigger connection change -> Verify `syncPendingChanges()` is called
  - [ ] [Green Phase] Connect `NetworkService` listener to `SyncService.syncPendingChanges()`
- [ ] Task: Conductor - User Manual Verification 'Background Synchronization' (Protocol in workflow.md)

## Phase 4: Real-time Multi-device Sync & Completion [checkpoint: ]

- [ ] Task: Enable Supabase Realtime subscriptions
  - [ ] [Red Phase] Write integration test: Remote change in Supabase -> Verify local state updates
  - [ ] [Green Phase] Implement `subscribeToAllChanges()` in `SyncService` to listen for remote updates to `profiles`, `habits_log`, and `coupons`
- [ ] Task: Final Integration & Error Handling
  - [ ] [Red Phase] Write tests for sync retry logic (3 attempts) and error reporting
  - [ ] [Green Phase] Refine `SyncService` with exponential backoff and error boundaries
- [ ] Task: Update project documentation
  - [ ] [ ] Update `docs/roadmap.md` to mark Phase 7 as complete
- [ ] Task: Conductor - User Manual Verification 'Real-time Multi-device Sync & Completion' (Protocol in workflow.md)
