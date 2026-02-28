# Specification: Accessibility Enhancements (Sub-Phase 8C)

## Overview

Improve HabitBuddy's accessibility for its dual audience: children (ages 3-5, many of whom are non-readers) and parents (who may use assistive technologies). The goal is to reach WCAG 2.1 Level AA parity where applicable and ensure a "frictionless" experience for small hands and developing motor skills.

## Functional Requirements

### 1. Screen Reader Support (VoiceOver/TalkBack)

- **ARIA & Labels:** Every interactive element must have a clear `accessibilityLabel`, `accessibilityHint`, and `accessibilityRole`.
- **State Announcements:** Use `AccessibilityInfo.announceForAccessibility` to proactively inform users of buddy state transitions, mission completions, and Gold Bolt balance updates.

### 2. Visual Accessibility & Scaling

- **Dynamic Type:** All text components must support system font scaling and handle layout shifts without clipping.
- **Color Contrast:** All text/background combinations must meet a minimum 4.5:1 contrast ratio.
- **Secondary Visual Cues:** State indicators (like "Success" or "Offline") must use distinct icons or shapes in addition to color.

### 3. Interactive Design

- **Minimum Touch Targets:** All interactive elements must adhere to a minimum size of 44x44dp to accommodate small hands and motor skill levels.

### 4. Non-Visual Feedback

- **Haptic Feedback:** Integrate `expo-haptics` to provide tactile "Impact" on successful button presses and mission completions.
- **Audio Overlays:** Ensure primary mission instructions and reward descriptions are accompanied by audio cues or a "Read to me" button for non-reading children.

## Acceptance Criteria

- [ ] VoiceOver/TalkBack can successfully navigate and describe all app screens.
- [ ] The app remains usable and legible when system font size is set to maximum.
- [ ] No interactive element has a hit box smaller than 44x44dp.
- [ ] Every Gold Bolt earned triggers a haptic pulse and an audio confirmation.
- [ ] Contrast check passes for all primary UI components.

## Out of Scope

- Full screen reader support for complex buddy animation paths (focus on state changes instead).
- Braille display optimization.
