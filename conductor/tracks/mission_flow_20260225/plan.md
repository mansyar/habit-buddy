# Implementation Plan: Phase 4 — Mission Flow ⭐

## Phase 4A: Onboarding Update & Mission Layout [checkpoint: ae11a71]

- [x] Task: Update Onboarding Screen for Buddy Selection (7fb85f8)
  - [x] Add `selected_buddy` field to `profiles` state and `ProfileService`.
  - [x] Build `BuddySelector` component in `app/(auth)/onboarding.tsx` (Dino vs. Bear).
- [x] Task: Scaffold Mission Screen Layout (29f5e54)
  - [x] Create `app/mission/[id].tsx` with basic container and components.
  - [x] Implement `BuddyArea` and `ControlsArea` layout (60/40 split).
- [x] Task: Conductor - User Manual Verification 'Phase 4A: Onboarding Update & Mission Layout' (ae11a71)

## Phase 4B: Mission Timer & Controls [checkpoint: 373ca28]

- [x] Task: Implement Mission Timer Logic (TDD) (4f43616)
  - [x] Write unit tests for `useMissionTimer` hook (start, stop, pause, adjust).
  - [x] Implement `useMissionTimer` with per-habit defaults and ±30s adjustment.
- [x] Task: Connect UI to Timer (429bebd)
  - [x] Build `TimerDisplay` component with ring/bar visualization.
  - [x] Implement "Start Mission" and "Done!" buttons with appropriate controls.
  - [x] Implement double-tap prevention on "Done!" button.
- [x] Task: App Lifecycle Handling (abe94e6)
  - [x] Implement `useAppState` listener to pause/resume timer.
- [x] Task: Conductor - User Manual Verification 'Phase 4B: Mission Timer & Controls' (373ca28)

## Phase 4C: Buddy State Machine & Animations [checkpoint: 373ca28]

- [x] Task: Define Buddy State Store (TDD) (5a251df)
  - [x] Write unit tests for `useBuddyStore` (state transitions: idle, active, paused, success, sleepy).
  - [x] Implement `useBuddyStore` using Zustand.
- [x] Task: Implement `BuddyAnimation` Component (d500a40)
  - [x] Setup static Dino and Bear assets.
  - [x] Build `BuddyAnimation` using Reanimated (float, bounce, jump, sway).
  - [x] Implement `FloatingProp` component for each habit.
- [x] Task: Add Particle Effects (d500a40)
  - [x] Implement confetti/star particles for `success` state.
- [x] Task: Conductor - User Manual Verification 'Phase 4C: Buddy State Machine & Animations' (373ca28)

## Phase 4D: Audio System [checkpoint: 78e4355]

- [x] Task: Build `AudioService` (TDD) (373ca28)
  - [x] Write unit tests for `AudioService` (layered playback, mute, volume).
  - [x] Implement `AudioService` using `expo-av`.
- [x] Task: Integrate Audio with Mission Flow (373ca28)
  - [x] Implement background music loops (Work Time/Moonlight).
  - [x] Implement VO trigger points (start, 50%, 25%, success, sleepy).
  - [x] Implement SFX for UI interactions and bolts.
- [x] Task: Global Mute and Silent Mode Support (373ca28)
  - [x] Connect mute toggle to `AudioService`.
  - [x] Ensure compliance with device silent mode.
- [x] Task: Conductor - User Manual Verification 'Phase 4D: Audio System' (78e4355)

## Phase 4E: Mission Result & Logging [checkpoint: 78e4355]

- [x] Task: Build Mission Result Screen (373ca28)
  - [x] Implement UI for Success (bolt earned animation) and Sleepy (encouragement) states.
- [x] Task: Implement Logging & Balance Logic (TDD) (373ca28)
  - [x] Write unit tests for `logMissionResult` in `HabitLogService`.
  - [x] Implement `logMissionResult` (writes to `habits_log`, updates `bolt_balance`).
- [x] Task: Final Navigation & Flow (373ca28)
  - [x] Implement 4-second delay auto-return to Home.
  - [x] Verify offline support for logging and balance.
- [x] Task: Update Project Roadmap (be9f29d)
  - [x] Mark Phase 4 as complete in `docs/roadmap.md`.
- [x] Task: Conductor - User Manual Verification 'Phase 4E: Mission Result & Logging' (78e4355)
