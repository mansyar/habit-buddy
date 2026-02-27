# Specification: Phase 7: Offline & Sync

## Overview

This track implements the offline-first capability for HabitBuddy. It enables children to complete missions without an active internet connection, queues these updates locally, and automatically synchronizes them with Supabase when connectivity is restored.

## Functional Requirements

- **Offline Detection UI:** A subtle, non-intrusive banner or indicator showing the current connection status (Online/Offline).
- **Offline Mission Completion:** Allow missions to be started and completed while offline, storing the result in the local SQLite database.
- **Sync Queue:** Queue all local writes (habit logs, bolt balance updates, coupon redemptions) while offline.
- **Background Sync:** Automatically detect when connectivity returns and replay all queued writes to Supabase.
- **Full App Sync:** Support multi-device synchronization using Supabase Realtime subscriptions for all data types (habits, profiles, coupons).

## Non-Functional Requirements

- **Performance:** Sync operations should not block the main UI thread.
- **Reliability:** Failed sync operations should be retried automatically (up to 3 times) before notifying the user.
- **Data Integrity:** Ensure that the local state remains consistent until a successful sync confirmation is received.

## Conflict Resolution

- **Policy:** Last-Write-Wins (LWW). The update with the most recent timestamp (client-side) will be used to resolve conflicts between local and remote data.

## Acceptance Criteria

- [ ] User sees an "Offline" banner when the device loses connection.
- [ ] A mission can be completed while in Airplane Mode, and the Gold Bolt is added to the local balance.
- [ ] Upon reconnecting, the offline mission log and bolt update are automatically sent to Supabase.
- [ ] Changes made on Device A (e.g., redeeming a coupon) appear on Device B within 2 seconds when both are online.
- [ ] No data loss occurs during the transition between offline and online states.

## Out of Scope

- Manual conflict resolution UI for parents.
- Syncing large binary assets (audio/images) — these are assumed to be pre-bundled.
