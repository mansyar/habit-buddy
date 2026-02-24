# Specification: Investigate if Google OAuth is implemented

## Overview

This track focuses on investigating the current state of Google OAuth implementation in the HabitBuddy project. The goal is to identify existing traces, configurations, or partial implementations in both the Supabase backend and the React Native frontend to determine the gaps remaining for full functionality.

## Goals

- Identify if Google OAuth is enabled or configured in Supabase.
- Locate any frontend code (buttons, hooks, configuration) related to Google Sign-In.
- Check for environment variables or client IDs required for Google OAuth.
- Produce a detailed investigation report summarizing the findings and outlining the steps for full implementation.

## Functional Requirements

- **Backend Audit**:
  - Verify Supabase Auth settings (via code or config if available).
  - Check for `auth.providers` configuration in `supabase/config.toml` or similar.
- **Frontend Audit**:
  - Search for `expo-auth-session`, `expo-google-app-auth`, or similar libraries in `package.json`.
  - Search for Google-specific login logic in `app/(auth)` and `src/store/auth_store.ts`.
- **Configuration Audit**:
  - Check `.env.example` and local `.env` (if accessible) for Google Client IDs.
  - Check `app.json` for Expo/Native Google configuration.

## Non-Functional Requirements

- **Consistency**: Findings must be documented clearly in an Investigation Report.
- **Security**: Do not expose any discovered secrets or keys in the final report.

## Acceptance Criteria

- [ ] A summary of the current Supabase Google OAuth configuration is provided.
- [ ] All frontend code related to Google OAuth is identified and listed.
- [ ] A list of missing components (gaps) is generated.
- [ ] A recommended roadmap for full implementation is proposed.

## Out of Scope

- Actual implementation or fixing of Google OAuth.
- Configuration of Google Cloud Console projects.
- Implementation of Apple OAuth (unless it shares common logic that is discovered).
