# Technology Stack

## 1. Core Framework

- **React Native (Expo)**: The primary framework for building the cross-platform (iOS and Android) mobile application.
- **Language**: TypeScript/JavaScript.

## 2. Backend & Data

- **Supabase**: Backend-as-a-Service providing PostgreSQL database, user authentication (OAuth for Google/Apple), and real-time data synchronization.
- **Database Schema**: Centralized tables for `profiles`, `habits_log` (habit completions), and `coupons` (reward system).
- **Local Storage**: `expo-sqlite` for managing offline data and the anonymous/local-only first-run mode.
- **Synchronization**: Custom `SyncService` using a `sync_queue` pattern to ensure eventual consistency between local and remote data.
- **UUID Generation**: `expo-crypto` for native-compatible unique identifiers across platforms.

## 3. Testing & Quality

- **Vitest & React Testing Library**: Unit and component testing framework for React Native.
- **Husky & lint-staged**: Pre-commit hooks for automated linting and formatting.

## 4. UI & Animation

- **React Native Reanimated**: Code-driven, programmatic animations used for the buddy state machine and micro-interactions. No pre-rendered video formats.

## 5. Assets & Media

- **Audio/Voice Over**: Pre-generated audio files using ElevenLabs and freesound.org.
- **Visuals**: Static PNG props and characters from Kenney.nl.
