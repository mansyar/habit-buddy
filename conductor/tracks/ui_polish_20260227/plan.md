# Implementation Plan: UI Polish (Sub-Phase 8A)

## Phase 1: Branding & Micro-animations

### 1.1 Animated Splash Screen

- [x] Task: Create `src/components/AnimatedSplash.tsx` component with Reanimated entrance animation. f372c47
- [ ] Task: Integrate `AnimatedSplash` into `app/_layout.tsx` to ensure it shows for 2s on cold start.
- [ ] Task: Generate and configure native Android/iOS app icons from master asset (1024x1024).

### 1.2 Micro-animations (Delighters)

- [ ] Task: Create a reusable `ScaleButton` component to replace standard Pressables with scale-down feedback.
- [ ] Task: Refactor `src/components/BoltCounter.tsx` to implement a numeric "roll" or sliding animation on balance change.
- [ ] Task: Implement "Completion Pop" effect in `app/mission/success.tsx` (e.g., scale-up pop-in for the checkmark or bolt).

### 1.3 Conductor - User Manual Verification 'Phase 1: Branding & Micro-animations' (Protocol in workflow.md)

## Phase 2: UI States & Layout Refinement

### 2.1 Loading & Empty States

- [ ] Task: Create `src/components/SkeletonCard.tsx` for loading states in Home and Dashboard.
- [ ] Task: Implement `src/components/BouncingBuddyLoader.tsx` for full-screen loading transitions.
- [ ] Task: Add friendly illustrations (PNG props) to empty Reward Shop (`app/reward-shop.tsx`) and empty History.

### 2.2 Responsive Layout & Accessibility

- [ ] Task: Audit `app/(tabs)/index.tsx` (Home) for tablet scaling; adjust card widths and spacing using `Dimensions` or `useWindowDimensions`.
- [ ] Task: Audit `app/parent-dashboard.tsx` for tablet scaling; ensure charts and tables are readable.
- [ ] Task: Perform tap target audit: verify all buttons are at least 48x48dp across the app.

### 2.3 Conductor - User Manual Verification 'Phase 2: UI States & Layout Refinement' (Protocol in workflow.md)

## Phase 3: Final Testing & Documentation

### 3.1 Performance & Quality

- [ ] Task: Profile animation FPS on a mid-range Android device; optimize any frame drops in Reanimated loops.
- [ ] Task: Conduct a full manual QA pass on a tablet emulator to verify responsive layouts.
- [ ] Task: Final audit of COPPA compliance: ensure no hidden tracking SDKs or user-generated data.

### 3.2 Roadmap Update

- [ ] Task: Update `docs/roadmap.md` to mark Sub-Phase 8A (UI Polish) as complete.

### 3.3 Conductor - User Manual Verification 'Phase 3: Final Testing & Documentation' (Protocol in workflow.md)
