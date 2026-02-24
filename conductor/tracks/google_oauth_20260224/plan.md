# Implementation Plan: Google OAuth Authentication

## Phase 1: Setup & Dependencies

- [x] Task: Install required Expo authentication libraries 9de4727
  - [ ] Run `npx expo install expo-auth-session expo-web-browser expo-linking`
- [x] Task: Verify Supabase configuration for Google OAuth f00d3ab
  - [ ] Check `supabase/config.toml` (Already verified in investigation report)
  - [ ] Confirm `.env` contains necessary secrets
- [ ] Task: Conductor - User Manual Verification 'Phase 1: Setup' (Protocol in workflow.md)

## Phase 2: Auth Store Enhancement (TDD)

- [ ] Task: Write tests for `signInWithGoogle` and `signOut` in `src/store/__tests__/auth_store.test.ts`
- [ ] Task: Implement `signInWithGoogle` and `signOut` in `src/store/auth_store.ts`
  - [ ] Add session state management
  - [ ] Integrate Supabase `signInWithOAuth` logic
- [ ] Task: Conductor - User Manual Verification 'Phase 2: Auth Store' (Protocol in workflow.md)

## Phase 3: Sign-In UI Integration

- [ ] Task: Update `app/(auth)/sign-in.tsx` to use `auth_store` actions
  - [ ] Connect Google Sign-In button to `signInWithGoogle`
  - [ ] Implement error handling with `Alert` for failures
- [ ] Task: Verify UI interactions and basic flow triggers
- [ ] Task: Conductor - User Manual Verification 'Phase 3: UI Integration' (Protocol in workflow.md)

## Phase 4: Redirect & Session Logic

- [ ] Task: Implement Smart Redirect logic in root layout or auth layout
  - [ ] Check if user is authenticated
  - [ ] If authenticated and no profile exists, redirect to onboarding
  - [ ] If authenticated and profile exists, redirect to tabs
- [ ] Task: Ensure session persistence on app restart
  - [ ] Verify Supabase `onAuthStateChange` listener in root layout
- [ ] Task: Conductor - User Manual Verification 'Phase 4: Redirect Logic' (Protocol in workflow.md)

## Phase 5: End-to-End Verification

- [ ] Task: Perform manual E2E tests on iOS/Android emulators
- [ ] Task: Verify Supabase dashboard for new user profiles
- [ ] Task: Conductor - User Manual Verification 'Phase 5: E2E Verification' (Protocol in workflow.md)
