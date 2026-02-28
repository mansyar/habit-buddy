# Accessibility Audit Findings

## General Infrastructure

- [ ] `ScaleButton.tsx`: Pass accessibility props down to `AnimatedPressable`.
- [ ] `StyledText.tsx` / `Themed.tsx`: Ensure dynamic font scaling doesn't break layouts.

## Components

- [ ] `HabitCard.tsx`:
  - Add `accessibilityLabel`: "Habit: [name], [duration] minutes, [status: completed/incomplete]".
  - Add `accessibilityRole="button"`.
- [ ] `BoltCounter.tsx`:
  - Add `accessibilityLabel`: "Gold Bolt Balance: [balance]".
  - Ensure hit box is 44x44 if ever interactive (currently info only).
- [ ] `TimerDisplay.tsx`:
  - Add `accessibilityLabel`: "Time remaining: [time]".
- [ ] `ParentalGate.tsx`:
  - Add `accessibilityLabel`: "Long press for parents".
- [ ] `CautionTapeProgress.tsx`:
  - Add `accessibilityLabel`: "[percentage]% missions completed".
- [ ] `NetworkStatusIcon.tsx`:
  - Add `accessibilityLabel`: "[Status: Online/Offline]".

## Screens

- [ ] `app/(tabs)/index.tsx` (HomeScreen):
  - Settings Button: `accessibilityLabel`: "Settings. Long press for parent dashboard.", `accessibilityRole="button"`.
  - Reward Button: `accessibilityLabel`: "Reward Shop", `accessibilityRole="button"`.
- [ ] `app/parent-dashboard.tsx`:
  - Header Back Button: `accessibilityLabel="Go back"`.
  - Header Settings Button: `accessibilityLabel="Settings"`.
  - Stats Cards: `accessibilityLabel` e.g., "Total Earned: [value] Gold Bolts".
  - Streak Circles: `accessibilityLabel` e.g., "[Date]: [completed]/[total] habits completed".
  - Reset Button: `accessibilityLabel="Reset Today's Progress"`.
  - Manage Rewards Button: `accessibilityLabel="Manage Rewards"`.
- [ ] `app/reward-shop.tsx`:
  - Header Parent/Exit Button: `accessibilityLabel="Parent Mode" / "Exit Parent Mode"`.
  - Add/History Buttons: `accessibilityLabel="Add New Reward"`, `accessibilityLabel="View History"`.
  - Coupon Item Actions: `accessibilityLabel="Edit Reward"`, `accessibilityLabel="Delete Reward"`.
  - Shop Card: `accessibilityLabel` e.g., "Reward: [title], Cost: [cost] Bolts, Category: [category]".
  - Modals: Ensure all inputs and buttons have clear labels.
- [ ] `app/mission/[id].tsx`:
  - Mute Toggle: `accessibilityLabel` e.g., "Mute sounds".
  - Adjust Time Buttons: `accessibilityLabel` e.g., "Decrease time by 30 seconds".
  - Start Button: `accessibilityLabel="Start Mission"`.
  - Done Button: `accessibilityLabel="Finish Mission"`.
  - Cancel Button: `accessibilityLabel="Cancel Mission and go back"`.
  - Buddy Animation: `accessibilityLabel` e.g., "[Buddy Name] is [State]".
