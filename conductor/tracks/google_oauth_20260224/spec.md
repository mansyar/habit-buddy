# Specification: Google OAuth Authentication

## Overview

Implement a fully functional "Sign in with Google" flow for HabitBuddy, enabling parents and guardians to authenticate using their Google accounts. This will allow for data synchronization across devices and persistent user profiles via Supabase.

## Functional Requirements

- **Google Authentication**:
  - Users can click "Sign in with Google" on the `sign-in.tsx` screen.
  - The app should trigger an OAuth flow using `expo-auth-session` and `expo-web-browser`.
  - Handle the callback from Google and authenticate the session with Supabase.
- **Authentication Store**:
  - Enhance `src/store/auth_store.ts` to include `signInWithGoogle` and `signOut` actions.
  - The store should maintain the current session and user profile.
- **Post-Login Redirection (Smart Redirect)**:
  - If it's the user's first time logging in (new profile), redirect to the `onboarding.tsx` screen.
  - If the user has an existing profile, redirect to the `(tabs)/index.tsx` (Missions) screen.
- **Session Management**:
  - Authenticated sessions must persist across app restarts using Supabase's built-in session management.
- **Error Handling**:
  - Display user-friendly error messages (via Toast or Alert) if the login is cancelled by the user or if a network error occurs.

## Non-Functional Requirements

- **Security**: Use secure OAuth practices, ensuring all redirects and client secrets are handled safely within the Expo and Supabase environment.
- **Performance**: The authentication flow should be responsive and complete within a reasonable timeframe (dependent on network speed and Google's response).
- **Native Compatibility**: The implementation must work correctly on both iOS and Android native platforms.

## Acceptance Criteria

- [ ] Tapping the Google Sign-In button successfully opens the Google login browser.
- [ ] After a successful Google login, the user is correctly authenticated in Supabase.
- [ ] New users are redirected to the Onboarding screen.
- [ ] Returning users are redirected to the Missions tab.
- [ ] Users can sign out, which clears the session and redirects back to the Sign-In screen.
- [ ] Session persists after the app is closed and reopened.
- [ ] Proper error alerts are shown if the process is interrupted.

## Out of Scope

- Implementation of other OAuth providers (e.g., Apple, Facebook).
- Email/Password authentication.
- Detailed profile management (beyond basic creation during OAuth).
