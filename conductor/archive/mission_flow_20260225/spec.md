# Specification: Phase 4 — Mission Flow ⭐

## Overview

This track implements the core "Mission" experience for HabitBuddy. It encompasses the mission screen, a state-driven buddy animation system (Animal-themed), an interactive timer, layered audio (music + VO + SFX), and the logging of mission results.

## Functional Requirements

- **FR-MISSION-01: Mission Screen Layout**: A dedicated screen with a buddy area (top 60%) and timer/controls area (bottom 40%).
- **FR-MISSION-02: Interactive Timer**:
  - Per-habit defaults (Brushing: 2:00, Meals: 15:00, Toys: 5:00).
  - Adjustment buttons (±30s) before start.
  - Countdown ring/bar visualization.
- **FR-MISSION-03: Buddy State Machine**:
  - Managed via Zustand store.
  - **Buddy**: Data-driven based on `profiles.selected_buddy` (e.g., `dino`, `bear`).
  - **States**: `idle`, `active`, `paused` (for app background), `success`, `sleepy`.
  - **Habit Props**:
    - `brush_teeth`: Toothbrush.
    - `eat_meal`: Plate / Fork / Apple.
    - `pick_up_toys`: Toy Box / Teddy Bear.
- **FR-MISSION-04: Animations (Reanimated)**:
  - `BuddyAnimation`: Transitions between states using Kenney Animal assets.
  - `FloatingProp`: Habit-specific prop active during `active` state.
  - Success effects: Confetti/particle effects on `success`.
- **FR-MISSION-05: Audio System**:
  - Layered playback: Background music (loops), Voice-Over (triggers at start/50%/25%/success/sleepy), and SFX (button taps, bolts).
  - Source: Freesound.org (CC0 placeholders).
  - Mute toggle and respect for device silent mode.
- **FR-MISSION-06: Result Logging**:
  - On success: Increment `bolt_balance`, log to `habits_log` (duration, bolts earned), and auto-return to home after 4 seconds.
  - On sleepy: Log to `habits_log` with failure status, show encouragement.

## Non-Functional Requirements

- **Performance**: Reanimated animations must maintain ≥ 60 FPS on mid-range devices.
- **Robustness**: Pause timer on background, resume on foreground. Disable "Done!" button after first tap.
- **Offline**: Support logging and local balance updates while offline.

## Acceptance Criteria

- [ ] User can start a mission, see the timer countdown, and the buddy animating in `active` state with the correct habit prop.
- [ ] The mission flow respects the buddy selected in the user's profile.
- [ ] "Done!" button triggers `success` state, awards bolts, and logs the completion.
- [ ] Timer reaching 0 triggers `sleepy` state and logs the result.
- [ ] Audio layers correctly and the mute toggle works globally.
- [ ] App lifecycle (background/foreground) is handled correctly by pausing the timer and state machine.

## Out of Scope

- Custom habit creation.
- Multiple child profiles.
