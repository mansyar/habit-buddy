# Implementation Plan - Phase 1: Auth & Onboarding

## Phase 1: Foundation & Supabase Configuration [checkpoint: 9ca0355]

- [x] Task: Configure Supabase Auth & Client a291f20
  - [x] Write Tests: Create `src/lib/__tests__/supabase.test.ts` to verify client initialization.
  - [x] Implement: Update `src/lib/supabase.ts` with `.env` variables and initialize.
- [x] Task: Create Profile Type and Service 72e22e5
  - [x] Write Tests: Create `src/lib/__tests__/profile_service.test.ts` for profile CRUD.
  - [x] Implement: Create `src/types/profile.ts` and `src/lib/profile_service.ts`.
- [x] Task: Conductor - User Manual Verification 'Foundation & Supabase Configuration' (Protocol in workflow.md) 9ca0355

## Phase 2: Sign-In Flow [checkpoint: sign_in_implementation]

- [x] Task: Build Sign-In Screen c7bb498
  - [x] Write Tests: Create `app/(auth)/__tests__/sign-in.test.tsx` for the UI and button triggers.
  - [x] Implement: Create `app/(auth)/sign-in.tsx` with Google and Guest buttons.
- [x] Task: Implement Auth State Listener 0bf9791
  - [x] Write Tests: Create `src/store/__tests__/auth_store.test.ts` to verify the state listener.
  - [x] Implement: Update `app/_layout.tsx` and create `src/store/auth_store.ts`.
- [x] Task: Conductor - User Manual Verification 'Sign-In Flow' (Protocol in workflow.md) 0bf9791

## Phase 3: Onboarding Flow [checkpoint: onboarding_implementation]

- [x] Task: Build Onboarding Screen 44864c6
  - [x] Write Tests: Create `app/(auth)/__tests__/onboarding.test.tsx` for input and avatar selection.
  - [x] Implement: Create `app/(auth)/onboarding.tsx` with name input and avatar selection.
- [x] Task: Implement Navigation Logic 7826dd5
  - [x] Write Tests: Create `app/__tests__/navigation.test.tsx` to verify redirects.
  - [x] Implement: Configure Expo Router redirects based on auth and profile state.
- [x] Task: Conductor - User Manual Verification 'Onboarding Flow' (Protocol in workflow.md) 7826dd5

## Phase 4: Data Migration & Final Integration [checkpoint: migration_and_final_integration]

- [x] Task: Implement Guest-to-Google Migration 5c272bc
  - [x] Write Tests: Create `src/lib/__tests__/migration.test.ts` to verify guest-to-Google data sync.
  - [x] Implement: Update `profile_service.ts` to handle migration on sign-in.
- [x] Task: Implement Sign-Out 60dc6f6
  - [x] Write Tests: Create `app/(tabs)/__tests__/sign-out.test.tsx` for the sign-out action.
  - [x] Implement: Add sign-out button in `app/(tabs)/two.tsx` and verify redirect.
- [x] Task: Update `docs/roadmap.md` 6888492
  - [x] Mark Phase 1 as completed in the roadmap file.
- [ ] Task: Conductor - User Manual Verification 'Data Migration & Final Integration' (Protocol in workflow.md)
