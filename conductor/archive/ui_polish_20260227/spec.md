# Specification: UI Polish (Sub-Phase 8A)

## 1. Overview

This track focuses on the final visual and experiential polish of the HabitBuddy application. The goal is to make the app feel "alive," professional, and delightful for the 3-5 age group while maintaining a high-quality parent-facing experience.

## 2. Functional Requirements

### 2.1 Branding & First Impression

- **Animated Splash Screen**: Implement a custom splash screen using `react-native-reanimated`. The animal logo should have a subtle bounce or entrance animation (2-second minimum).
- **Native App Icons**: Generate and configure high-resolution native app icons for Android (and iOS if applicable) using the master asset.

### 2.2 Micro-animations (Delighters)

- **Button Feedback**: All child-facing buttons must provide visual feedback (e.g., subtle scale-down on press, scale-up on release) to confirm interaction.
- **Bolt Counter Roll**: When the Gold Bolt balance changes, the number should "roll" or animate into the new value rather than jumping instantly.
- **Completion Pop**: When a mission is completed or a habit is marked done, trigger a celebration effect (e.g., confetti or a "pop-in" checkmark).

### 2.3 States & Layout Refinement

- **Loading States**: Implement skeleton screens or a playful "bouncing buddy" loading indicator for data-fetching transitions.
- **Empty States**: Design and implement friendly illustrations and text for empty views (e.g., empty Reward Shop, no history logs).
- **Responsive Layout**: Audit and refine all screens to ensure they scale gracefully for tablet devices and different aspect ratios.

## 3. Non-Functional Requirements

- **Performance**: Maintain 60 FPS for all Reanimated animations on mid-range devices.
- **Consistency**: Adhere strictly to the toddler-friendly vibrant color palette and Fredoka One/Nunito typography.
- **Accessibility**: Ensure all interactive targets are at least 48x48dp.

## 4. Acceptance Criteria

- [ ] Splash screen animates for at least 2 seconds before transitioning to the app.
- [ ] App icons are correctly displayed on the device home screen.
- [ ] Bolt counter smoothly rolls to new values.
- [ ] All buttons provide interactive feedback.
- [ ] Layout is responsive and looks professional on both small phones and large tablets.
- [ ] Empty states show appropriate illustrations instead of blank screens.

## 5. Out of Scope

- Adding new core features or habit types.
- Backend schema changes.
- Multi-language localization (staying English-only for now).
