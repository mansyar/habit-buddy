# Technology Stack

## 1. Core Framework

- **React Native (Expo)**: The primary framework for building the cross-platform (iOS and Android) mobile application.
- **Language**: TypeScript/JavaScript.

## 2. Backend & Data

- **Supabase**: Backend-as-a-Service providing PostgreSQL database, user authentication (OAuth for Google/Apple), and real-time data synchronization.
- **Local Storage**: `expo-sqlite` for managing offline data and the anonymous/local-only first-run mode.

## 3. UI & Animation

- **React Native Reanimated**: Code-driven, programmatic animations used for the buddy state machine and micro-interactions. No pre-rendered video formats.

## 4. Assets & Media

- **Audio/Voice Over**: Pre-generated audio files using ElevenLabs and freesound.org.
- **Visuals**: Static PNG props and characters from Kenney.nl.
