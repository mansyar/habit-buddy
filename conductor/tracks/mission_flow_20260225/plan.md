# Implementation Plan: Phase 4 — Mission Flow ⭐

## Phase 4A: Onboarding Update & Mission Layout

- [ ] Task: Update Onboarding Screen for Buddy Selection
  - [ ] Add `selected_buddy` field to `profiles` state and `ProfileService`.
  - [ ] Build `BuddySelector` component in `app/(auth)/onboarding.tsx` (Dino vs. Bear).
- [ ] Task: Scaffold Mission Screen Layout
  - [ ] Create `app/mission/[id].tsx` with basic container and components.
  - [ ] Implement `BuddyArea` and `ControlsArea` layout (60/40 split).
- [ ] Task: Conductor - User Manual Verification 'Phase 4A: Onboarding Update & Mission Layout' (Protocol in workflow.md)

## Phase 4B: Mission Timer & Controls

- [ ] Task: Implement Mission Timer Logic (TDD)
  - [ ] Write unit tests for `useMissionTimer` hook (start, stop, pause, adjust).
  - [ ] Implement `useMissionTimer` with per-habit defaults and ±30s adjustment.
- [ ] Task: Connect UI to Timer
  - [ ] Build `TimerDisplay` component with ring/bar visualization.
  - [ ] Implement "Start Mission" and "Done!" buttons with appropriate controls.
  - [ ] Implement double-tap prevention on "Done!" button.
- [ ] Task: App Lifecycle Handling
  - [ ] Implement `useAppState` listener to pause/resume timer.
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
