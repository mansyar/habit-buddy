# Implementation Plan - Phase 1: Auth & Onboarding

## Phase 1: Foundation & Supabase Configuration [checkpoint: auth_supabase_setup]

- [x] Task: Configure Supabase Auth & Client a291f20
  - [x] Write Tests: Create `src/lib/__tests__/supabase.test.ts` to verify client initialization.
  - [x] Implement: Update `src/lib/supabase.ts` with `.env` variables and initialize.
- [~] Task: Create Profile Type and Service
  - [ ] Write Tests: Create `src/lib/__tests__/profile_service.test.ts` for profile CRUD.
  - [ ] Implement: Create `src/types/profile.ts` and `src/lib/profile_service.ts`.
- [ ] Task: Conductor - User Manual Verification 'Foundation & Supabase Configuration' (Protocol in workflow.md)

## Phase 2: Sign-In Flow [checkpoint: sign_in_implementation]

- [ ] Task: Build Sign-In Screen
  - [ ] Write Tests: Create `app/(auth)/__tests__/sign-in.test.tsx` for the UI and button triggers.
  - [ ] Implement: Create `app/(auth)/sign-in.tsx` with Google and Guest buttons.
- [ ] Task: Implement Auth State Listener
  - [ ] Write Tests: Create `src/store/__tests__/auth_store.test.ts` to verify the state listener.
  - [ ] Implement: Update `app/_layout.tsx` and create `src/store/auth_store.ts`.
- [ ] Task: Conductor - User Manual Verification 'Sign-In Flow' (Protocol in workflow.md)

## Phase 3: Onboarding Flow [checkpoint: onboarding_implementation]

- [ ] Task: Build Onboarding Screen
  - [ ] Write Tests: Create `app/(auth)/__tests__/onboarding.test.tsx` for input and avatar selection.
  - [ ] Implement: Create `app/(auth)/onboarding.tsx` with name input and avatar selection.
- [ ] Task: Implement Navigation Logic
  - [ ] Write Tests: Create `app/__tests__/navigation.test.tsx` to verify redirects.
  - [ ] Implement: Configure Expo Router redirects based on auth and profile state.
- [ ] Task: Conductor - User Manual Verification 'Onboarding Flow' (Protocol in workflow.md)

## Phase 4: Data Migration & Final Integration [checkpoint: migration_and_final_integration]

- [ ] Task: Implement Guest-to-Google Migration
  - [ ] Write Tests: Create `src/lib/__tests__/migration.test.ts` to verify guest-to-Google data sync.
  - [ ] Implement: Update `profile_service.ts` to handle migration on sign-in.
- [ ] Task: Implement Sign-Out
  - [ ] Write Tests: Create `app/(tabs)/__tests__/sign-out.test.tsx` for the sign-out action.
  - [ ] Implement: Add sign-out button in `app/(tabs)/two.tsx` and verify redirect.
- [ ] Task: Update `docs/roadmap.md`
  - [ ] Mark Phase 1 as completed in the roadmap file.
- [ ] Task: Conductor - User Manual Verification 'Data Migration & Final Integration' (Protocol in workflow.md)
