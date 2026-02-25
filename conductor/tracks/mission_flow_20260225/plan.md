# Implementation Plan: Phase 4 — Mission Flow ⭐

## Phase 4A: Onboarding Update & Mission Layout [checkpoint: ae11a71]

- [x] Task: Update Onboarding Screen for Buddy Selection (7fb85f8)
  - [x] Add `selected_buddy` field to `profiles` state and `ProfileService`.
  - [x] Build `BuddySelector` component in `app/(auth)/onboarding.tsx` (Dino vs. Bear).
- [x] Task: Scaffold Mission Screen Layout (29f5e54)
  - [x] Create `app/mission/[id].tsx` with basic container and components.
  - [x] Implement `BuddyArea` and `ControlsArea` layout (60/40 split).
- [x] Task: Conductor - User Manual Verification 'Phase 4A: Onboarding Update & Mission Layout' (ae11a71)

## Phase 4B: Mission Timer & Controls [checkpoint: 68bf49d]

- [x] Task: Implement Mission Timer Logic (TDD) (4f43616)
  - [x] Write unit tests for `useMissionTimer` hook (start, stop, pause, adjust).
  - [x] Implement `useMissionTimer` with per-habit defaults and ±30s adjustment.
- [x] Task: Connect UI to Timer (429bebd)
  - [x] Build `TimerDisplay` component with ring/bar visualization.
  - [x] Implement "Start Mission" and "Done!" buttons with appropriate controls.
  - [x] Implement double-tap prevention on "Done!" button.
- [x] Task: App Lifecycle Handling (abe94e6)
  - [x] Implement `useAppState` listener to pause/resume timer.
- [ ] Task: Conductor - User Manual Verification 'Phase 4B: Mission Timer & Controls' (Protocol in workflow.md)

## Phase 4C: Buddy State Machine & Animations

- [ ] Task: Define Buddy State Store (TDD)
  - [ ] Write unit tests for `useBuddyStore` (state transitions: idle, active, paused, success, sleepy).
  - [ ] Implement `useBuddyStore` using Zustand.
- [ ] Task: Implement `BuddyAnimation` Component
  - [ ] Setup static Dino and Bear assets.
  - [ ] Build `BuddyAnimation` using Reanimated (float, bounce, jump, sway).
  - [ ] Implement `FloatingProp` component for each habit.
- [ ] Task: Add Particle Effects
  - [ ] Implement confetti/star particles for `success` state.
- [ ] Task: Conductor - User Manual Verification 'Phase 4C: Buddy State Machine & Animations' (Protocol in workflow.md)

## Phase 4D: Audio System

- [ ] Task: Build `AudioService` (TDD)
  - [ ] Write unit tests for `AudioService` (layered playback, mute, volume).
  - [ ] Implement `AudioService` using `expo-av`.
- [ ] Task: Integrate Audio with Mission Flow
  - [ ] Implement background music loops (Work Time/Moonlight).
  - [ ] Implement VO trigger points (start, 50%, 25%, success, sleepy).
  - [ ] Implement SFX for UI interactions and bolts.
- [ ] Task: Global Mute and Silent Mode Support
  - [ ] Connect mute toggle to `AudioService`.
  - [ ] Ensure compliance with device silent mode.
- [ ] Task: Conductor - User Manual Verification 'Phase 4D: Audio System' (Protocol in workflow.md)

## Phase 4E: Mission Result & Logging

- [ ] Task: Build Mission Result Screen
  - [ ] Implement UI for Success (bolt earned animation) and Sleepy (encouragement) states.
- [ ] Task: Implement Logging & Balance Logic (TDD)
  - [ ] Write unit tests for `logMissionResult` in `HabitLogService`.
  - [ ] Implement `logMissionResult` (writes to `habits_log`, updates `bolt_balance`).
- [ ] Task: Final Navigation & Flow
  - [ ] Implement 4-second delay auto-return to Home.
  - [ ] Verify offline support for logging and balance.
- [ ] Task: Update Project Roadmap
  - [ ] Mark Phase 4 as complete in `docs/roadmap.md`.
- [ ] Task: Conductor - User Manual Verification 'Phase 4E: Mission Result & Logging' (Protocol in workflow.md)
