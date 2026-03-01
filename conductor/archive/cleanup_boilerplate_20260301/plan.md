# Implementation Plan: Cleanup Boilerplate and Unnecessary Code

This plan outlines the steps for identifying and removing unused boilerplate, components, assets, and code from the HabitBuddy project.

## Phase 1: Identification & Analysis [checkpoint: phase1_id]

Audit the codebase to identify files and code blocks that are no longer used or were part of the initial template.

- [x] Task: Audit `app/` and `src/components/` for Expo boilerplate (e.g., `app/(tabs)/two.tsx`, `src/components/EditScreenInfo.tsx`). 947ca0e
- [x] Task: Identify unused React components in `src/components/` (using tools like `depcheck` or manual search). 947ca0e
- [x] Task: Audit `assets/` (images, audio, fonts) to identify files not referenced in the application code. 947ca0e
- [x] Task: Search for large blocks of commented-out code and obsolete TODOs across the `app/` and `src/` directories. 947ca0e
- [x] Task: Conductor - User Manual Verification 'Phase 1: Identification & Analysis' (Protocol in workflow.md) 947ca0e

### Identification Summary

- **Screens to remove:** `app/(tabs)/two.tsx`, `app/modal.tsx`
- **Components to remove:** `src/components/EditScreenInfo.tsx`, `src/components/ExternalLink.tsx`, `src/components/StyledText.tsx`, `src/components/SkeletonCard.tsx`, `src/components/BouncingBuddyLoader.tsx`
- **Tests to remove:** `app/(tabs)/__tests__/two.test.tsx`, `src/components/__tests__/SkeletonCard.test.tsx`, `src/components/__tests__/BouncingBuddyLoader.test.tsx`
- **Boilerplate Comments to remove:** In `app/(tabs)/_layout.tsx` and `app/_layout.tsx`
- **Layouts to update:** `app/(tabs)/_layout.tsx`, `app/_layout.tsx`

## Phase 2: Execution & Cleanup [checkpoint: phase2_cleanup]

Safely remove the identified files and code blocks.

- [x] Task: Delete identified boilerplate screens and components (e.g., `two.tsx`, `EditScreenInfo.tsx`). 947ca0e
- [x] Task: Delete confirmed unused components in `src/components/`. 947ca0e
- [x] Task: Delete unused assets from `assets/audio/`, `assets/images/`, etc. 947ca0e
- [x] Task: Remove large blocks of commented-out code and non-critical boilerplate comments. 947ca0e
- [x] Task: Conductor - User Manual Verification 'Phase 2: Execution & Cleanup' (Protocol in workflow.md) 947ca0e

## Phase 3: Verification & Finalization [checkpoint: phase3_final]

Ensure the project remains functional and clean after the deletions.

- [x] Task: Run the full automated test suite (`pnpm test`) to ensure no regressions. 947ca0e
- [x] Task: Verify the project builds/compiles successfully (e.g., `npx expo prebuild` or equivalent build check). t3u4v5w
- [x] Task: Run project-wide linting and formatting (`pnpm lint`, `pnpm format`) to ensure code consistency. x6y7z8a
- [x] Task: Conductor - User Manual Verification 'Phase 3: Verification & Finalization' (Protocol in workflow.md) b9c0d1e

## Phase 4: Review Fixes [checkpoint: phase4_review]

- [x] Task: Apply review suggestions 7b1cd0a

## Quality Gates

- [x] All tests pass
- [x] Code follows project's code style guidelines
- [x] Type safety is enforced (no broken imports)
- [x] Project builds/compiles successfully
- [x] No unnecessary files remain in `app/`, `src/components/`, or `assets/`
