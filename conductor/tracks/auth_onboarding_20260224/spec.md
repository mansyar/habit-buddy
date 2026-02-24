# Specification - Phase 1: Auth & Onboarding

## Overview

Implement the foundational authentication and onboarding flow for HabitBuddy. This includes setting up Supabase, building the sign-in and onboarding screens, and managing user profiles.

## Functional Requirements

- **Supabase Integration:**
  - Configure Supabase Auth with Google OAuth.
  - Initialize the Supabase client in `src/lib/supabase.ts`.
  - Implement an auth state listener to manage navigation.
- **Sign-In Flow:**
  - Build a Screen 9 (PRD) compliant Sign-In screen.
  - Support Google Sign-In and Anonymous "Guest" mode.
- **Onboarding Flow:**
  - Build Screen 2 (PRD) compliant Onboarding screen.
  - Collect **Child's Name** and **Avatar Selection**.
- **Data & Profile Management:**
  - Define the `Profile` TypeScript interface.
  - Implement a `ProfileService` to save profile data to Supabase (for authenticated users) or local SQLite (for guest users).
  - **Data Migration:** Ensure that when a guest user signs in with Google, their local profile data is synced/migrated to the new Supabase account.
- **Navigation Logic:**
  - Use Expo Router to redirect:
    - Unauthenticated -> Sign-In.
    - No Profile -> Onboarding.
    - Profile Found -> Home.

## Non-Functional Requirements

- **Performance:** Sign-in/Onboarding screens should load in < 1 second.
- **UI/UX:** Adhere to the "vibrant toddler-friendly" theme using `src/theme/Colors.ts`.
- **Reliability:** Handle network errors gracefully during auth and sync.

## Acceptance Criteria

- [ ] Google OAuth flow works (sign-in -> profile creation in Supabase).
- [ ] Anonymous mode works (local profile creation).
- [ ] Onboarding screen collects name and avatar.
- [ ] Expo Router redirects correctly based on auth and profile status.
- [ ] Guest data is migrated to Google account upon sign-in.
- [ ] Sign-out returns the user to the Sign-In screen.

## Out of Scope

- Password-based authentication.
- Advanced parent dashboard features (Phase 6).
- Habit creation/management (Phase 2/3).
