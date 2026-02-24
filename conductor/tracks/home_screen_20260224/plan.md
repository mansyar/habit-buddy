# Implementation Plan: Phase 3 - Home Screen

## Phase 1: Foundation & State Management

- [x] Task: Define Core Habits and `Habit` type. [1fd7cdb]
  - [x] Create `src/types/habit.ts`.
  - [x] Create `src/constants/habits.ts` with the 3 core habits.
- [x] Task: Create `useHabitStore` with TDD. [cd5aad9]
  - [x] Write tests for `useHabitStore` in `src/store/__tests__/habit_store.test.ts`.
  - [x] Implement `src/store/habit_store.ts` using Zustand and `HabitLogService`.
- [ ] Task: Conductor - User Manual Verification 'Foundation' (Protocol in workflow.md)

## Phase 2: UI Components

- [ ] Task: Implement `HabitCard` component with TDD.
  - [ ] Write tests in `src/components/__tests__/HabitCard.test.tsx`.
  - [ ] Implement `src/components/HabitCard.tsx` using Lucide icons.
- [ ] Task: Implement `BoltCounter` component with TDD.
  - [ ] Write tests in `src/components/__tests__/BoltCounter.test.tsx`.
  - [ ] Implement `src/components/BoltCounter.tsx` with Reanimated bounce effect.
- [ ] Task: Implement `CautionTapeProgress` component with TDD.
  - [ ] Write tests in `src/components/__tests__/CautionTapeProgress.test.tsx`.
  - [ ] Implement `src/components/CautionTapeProgress.tsx` with Reanimated scrolling.
- [ ] Task: Conductor - User Manual Verification 'UI Components' (Protocol in workflow.md)

## Phase 3: Screen & Integration

- [ ] Task: Implement `HomeScreen` layout.
  - [ ] Write tests for `HomeScreen` in `app/(tabs)/__tests__/index.test.tsx`.
  - [ ] Implement `app/(tabs)/index.tsx`.
  - [ ] Integrate `useAuthStore` for child name and `useHabitStore` for cards/progress.
- [ ] Task: Add placeholder screens for Settings and Reward Shop.
  - [ ] Create `app/settings.tsx` and `app/reward-shop.tsx`.
- [ ] Task: Conductor - User Manual Verification 'Home Screen' (Protocol in workflow.md)

## Phase 4: Wrap Up

- [ ] Task: Update project roadmap.
  - [ ] Update `docs/roadmap.md` to reflect Phase 3 completion.
