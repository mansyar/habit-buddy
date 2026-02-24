# Implementation Plan: Phase 3 - Home Screen

## Phase 1: Foundation & State Management [checkpoint: c017390]

- [x] Task: Define Core Habits and `Habit` type. [1fd7cdb]
  - [x] Create `src/types/habit.ts`.
  - [x] Create `src/constants/habits.ts` with the 3 core habits.
- [x] Task: Create `useHabitStore` with TDD. [cd5aad9]
  - [x] Write tests for `useHabitStore` in `src/store/__tests__/habit_store.test.ts`.
  - [x] Implement `src/store/habit_store.ts` using Zustand and `HabitLogService`.
- [ ] Task: Conductor - User Manual Verification 'Foundation' (Protocol in workflow.md)

## Phase 2: UI Components [checkpoint: 1844d38]

- [x] Task: Implement `HabitCard` component with TDD. [45e4b31]
  - [x] Write tests in `src/components/__tests__/HabitCard.test.tsx`.
  - [x] Implement `src/components/HabitCard.tsx` using Lucide icons.
- [x] Task: Implement `BoltCounter` component with TDD. [a7942f0]
  - [x] Write tests in `src/components/__tests__/BoltCounter.test.tsx`.
  - [x] Implement `src/components/BoltCounter.tsx` with Reanimated bounce effect.
- [x] Task: Implement `CautionTapeProgress` component with TDD. [980c73b]
  - [x] Write tests in `src/components/__tests__/CautionTapeProgress.test.tsx`.
  - [x] Implement `src/components/CautionTapeProgress.tsx` with Reanimated scrolling.
- [ ] Task: Conductor - User Manual Verification 'UI Components' (Protocol in workflow.md)

## Phase 3: Screen & Integration

- [x] Task: Implement `HomeScreen` layout. [2580600]
  - [x] Write tests for `HomeScreen` in `app/(tabs)/__tests__/index.test.tsx`.
  - [x] Implement `app/(tabs)/index.tsx`.
  - [x] Integrate `useAuthStore` for child name and `useHabitStore` for cards/progress.
- [x] Task: Add placeholder screens for Settings and Reward Shop. [d771e3a]
  - [x] Create `app/settings.tsx` and `app/reward-shop.tsx`.
- [ ] Task: Conductor - User Manual Verification 'Home Screen' (Protocol in workflow.md)

## Phase 4: Wrap Up

- [ ] Task: Update project roadmap.
  - [ ] Update `docs/roadmap.md` to reflect Phase 3 completion.
