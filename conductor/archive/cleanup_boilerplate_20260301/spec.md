# Specification: Cleanup Boilerplate and Unnecessary Code

## Overview

This track focuses on identifying and removing unused files, boilerplate from the Expo Router template, and other unnecessary code to maintain a clean and focused codebase for HabitBuddy.

## Functional Requirements

- Identify and remove unused React components in `src/components/`.
- Identify and remove boilerplate files from the initial Expo Router template (e.g., `app/(tabs)/two.tsx`, `src/components/EditScreenInfo.tsx`).
- Identify and remove unused assets (images, audio, fonts) in `assets/`.
- Scan and remove large blocks of commented-out code or outdated TODOs.

## Non-Functional Requirements

- **Git Safety:** Direct deletion is preferred since changes are tracked via Git.
- **Dependency Integrity:** Ensure no critical project dependencies are removed or broken.

## Acceptance Criteria

- [ ] No files from the original Expo template that are not used in HabitBuddy remain (e.g., `two.tsx`).
- [ ] All components in `src/components/` are used by at least one screen or another component.
- [ ] All assets in `assets/` are referenced by the application code.
- [ ] Commented-out code and obsolete boilerplate comments are removed.
- [ ] The project builds successfully (`npm run build` or equivalent).
- [ ] All existing tests pass (`npm test`).

## Out of Scope

- Refactoring existing functional code (this is purely a cleanup/removal task).
- Adding new features or modifying the UI/UX.
