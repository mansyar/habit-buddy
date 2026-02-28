# Track Spec: Error Handling & Edge Cases (Sub-Phase 8B)

## Overview

Implement robust error handling, input validation, and edge case management to ensure the application remains stable and user-friendly under all conditions. This includes implementing a global error boundary, network failure fallbacks, and rigorous input constraints.

## Functional Requirements

- **Global Error Boundary**: Implement `react-native-error-boundary` to catch and log unhandled exceptions, showing a user-friendly fallback screen instead of crashing.
- **Input Validation**:
  - **Child Name**: 2–20 characters.
  - **Coupon Title**: 2–20 characters.
  - **Bolt Cost**: Range 0–200.
- **Network Connectivity**:
  - Implement a header icon indicator to show offline status.
  - Ensure graceful fallback to local SQLite when Supabase is unreachable.
- **Asset Fallbacks**:
  - Show static fallback styling if buddy or prop images fail to load.
  - Continue mission without audio if audio playback fails.
- **Mission Flow Integrity**:
  - **Background/Foreground**: Pause timer on background, resume on foreground.
  - **Double-tap Prevention**: Disable "Done!" button immediately after the first tap.
- **Sign-In Migration**: Implement retry logic (up to 3 times) for data migration from anonymous to authenticated accounts.

## Non-Functional Requirements

- **Stability**: Crash-free sessions ≥ 99.5%.
- **UX**: Clear feedback for validation errors and network status.

## Acceptance Criteria

- [ ] Unhandled JS errors trigger the Error Boundary fallback screen.
- [ ] Child Name and Coupon Title inputs prevent submission of invalid data.
- [ ] Bolt Cost input enforces the 0–200 range.
- [ ] Offline icon appears in the header when disconnected from the network.
- [ ] Timer correctly handles app lifecycle events (background/foreground).
- [ ] "Done!" button is disabled after one tap.
- [ ] Supabase request failures do not interrupt core app functionality.

## Out of Scope

- Detailed error logging to external services (Sentry/Bugsnag) — only local logging/boundary.
- Complex conflict resolution beyond "Last-Write-Wins" or "Additive Merge".
