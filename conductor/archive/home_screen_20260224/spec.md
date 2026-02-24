# Specification: Phase 3 - Home Screen

## Overview

Implement the main Home Screen for HabitBuddy. This screen serves as the central hub where children can see their daily habits, track their progress, and navigate to missions or rewards.

## Functional Requirements

### 1. Custom App Bar

- **Display Name**: Show the child's name prominently (fetched from `useAuthStore` profile).
- **Bolt Counter**:
  - Displays current Gold Bolt balance.
  - **Animation**: Quick bounce effect when the balance changes.
- **Navigation Icons**:
  - **Settings**: Gear icon (Lucide `Settings`) navigates to `/settings`.
  - **Reward Shop**: Gift icon (Lucide `Gift`) navigates to `/reward-shop`.

### 2. Daily Progress Indicator

- **Style**: "Caution-tape" style with diagonal black and yellow stripes.
- **Animation**: Stripes scroll horizontally when a habit is completed.
- **Placement**: Top of the screen, immediately below the App Bar.
- **Logic**: Fills proportionally based on completed habits for the day (0/3, 1/3, 2/3, 3/3).

### 3. Habit Cards

- **Habit Definitions**:
  1. **Tooth Brushing**: Icon (Lucide `Sparkles`), Theme: Blue, Default: 2 min.
  2. **Meal Time**: Icon (Lucide `Utensils`), Theme: Green, Default: 15 min.
  3. **Toy Cleanup**: Icon (Lucide `Box`), Theme: Yellow, Default: 5 min.
- **Card UI**:
  - Displays habit icon, name, and default duration.
  - Shows completion status (e.g., Checkmark vs "Not Done").
  - **Vibrant Colors**: Distinct theme colors for each habit.
- **Action**: Tapping a card navigates to `/mission/[habitId]`.

### 4. State Management

- **Store**: Create `src/store/habit_store.ts` using Zustand.
- **Logic**:
  - Loads today's logs from `HabitLogService`.
  - Tracks completion status for the 3 core habits.
  - Provides selectors for the Home Screen and Progress Indicator.

## Non-Functional Requirements

- **Theme**: Use Fredoka One for headings and Nunito for body text.
- **Accessibility**: Large tap targets (≥ 48x48) for habit cards and header icons.
- **Performance**: Ensure smooth scrolling for the caution-tape animation using Reanimated.

## Acceptance Criteria

- [ ] Home screen displays 3 habit cards with correct themes and icons.
- [ ] App bar shows child's name and animated bolt counter.
- [ ] Caution-tape progress bar scrolls and reflects daily completion.
- [ ] Navigation to placeholders (Settings, Shop) and Mission screens works.
- [ ] UI is vibrant, toddler-friendly, and uses Lucide icons.
