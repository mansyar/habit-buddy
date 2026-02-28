# Technology Stack

## 1. Core Framework

- **React Native (Expo)**: The primary framework for building the cross-platform (iOS and Android) mobile application.
- **Language**: TypeScript/JavaScript.

## 2. Backend & Data

- **Supabase**: Backend-as-a-Service providing PostgreSQL database, user authentication (OAuth for Google/Apple), and real-time data synchronization.
  - **Authentication Libraries**: `expo-auth-session` and `expo-web-browser` for managing OAuth flows on native mobile platforms.
- **Database Schema**: Centralized tables for `profiles`, `habits_log` (habit completions), and `coupons` (reward system).
- **Local Storage**: `expo-sqlite` for managing offline data and the anonymous/local-only first-run mode.
- **Synchronization**: Custom `SyncService` using both `sync_queue` and table-level `sync_status` markers for robust background synchronization. Uses Supabase Realtime for instant multi-device updates.
- **Connectivity Detection**: `@react-native-community/netinfo` for reliable network status monitoring.
- **UUID Generation**: `expo-crypto` for native-compatible unique identifiers across platforms.

## 3. Testing & Quality

- **Vitest & React Testing Library**: Unit and component testing framework for React Native.
- **Husky & lint-staged**: Git hooks for automated linting, formatting, type checking, and unit testing (pre-push).

## 4. Stability & Error Handling

- **react-native-error-boundary**: Global catch-all for unhandled exceptions with a user-friendly fallback UI.
- **Exponential Backoff**: Integrated into `SyncService` for resilient background synchronization during network instability (30s, 60s, 120s delays).
- **Input Validation Helpers**: Centralized validation logic (`src/utils/validation.ts`) for child profiles and reward coupons.

## 5. UI & Animation

- **React Native Reanimated**: Code-driven, programmatic animations used for the buddy state machine and micro-interactions. No pre-rendered video formats.
- **Expo Google Fonts**: Integration for brand typography (Fredoka One, Nunito).
- **Lucide React Native**: Modern, friendly, stroke-based icon library used for consistent iconography throughout the application.

## 6. Assets & Media

- **Audio/Voice Over**: Pre-generated audio files using ElevenLabs and freesound.org, managed via `expo-audio`.
- **Visuals**: Static PNG props and characters from Kenney.nl.
