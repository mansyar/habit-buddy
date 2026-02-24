# Track: Core Data Layer (`core_data_layer_20260224`)

## Overview

Implement the complete data layer for HabitBuddy. This includes the database schema in Supabase, local SQLite mirroring for offline support, and the service layer (repositories) to abstract data access between Supabase (online/authenticated) and SQLite (offline/anonymous).

## Goals

- Provision Supabase tables: `profiles`, `habits_log`, and `coupons`.
- Implement Row-Level Security (RLS) policies for user data isolation.
- Mirror the Supabase schema in local SQLite using `expo-sqlite/next`.
- Build a robust service layer (Profile, HabitLog, Coupon) with offline/online switching.
- Implement a `SyncService` to handle offline write queuing and replay.

## Functional Requirements

### Database Schema (Supabase & SQLite)

- **Profiles:** `id`, `user_id` (UID), `child_name`, `avatar_id`, `bolt_balance`, `created_at`.
- **Habit Logs:** `id`, `profile_id`, `habit_id`, `status` (success/sleepy), `duration_seconds`, `bolts_earned`, `completed_at`.
- **Coupons:** `id`, `profile_id`, `title`, `bolt_cost`, `is_redeemed`, `created_at`.

### Row-Level Security (RLS)

- All tables must have RLS enabled.
- Policies: `auth.uid() = user_id` for profiles; habit logs and coupons linked via `profile_id` (checked against the profile owner).

### Service Layer

- **ProfileService:** CRUD for child profiles.
- **HabitLogService:** Record mission completions and fetch streaks.
- **CouponService:** CRUD for rewards and redemption.
- **SyncService:** Queue offline writes to a `sync_queue` table and replay when online.

### Network Monitoring

- Use `@react-native-community/netinfo` to detect connectivity changes and trigger `SyncService`.

## Non-Functional Requirements

- **Performance:** Queries should resolve in <1s.
- **Reliability:** Data must not be lost when switching between offline and online modes.
- **Security:** Rigorous RLS to prevent cross-user data access.

## Acceptance Criteria

- [ ] Supabase migrations applied and tables created.
- [ ] RLS policies verified (users cannot access other users' data).
- [ ] SQLite database initialized on first launch.
- [ ] ProfileService successfully switches between Supabase and SQLite based on auth state.
- [ ] `SyncService` correctly replays offline habit logs once connectivity is restored.
- [ ] Unit tests pass for all service methods.

## Out of Scope

- UI implementation for the Home screen or Reward Shop.
- Audio system integration.
- Final production asset (Kenneys) swapping.
