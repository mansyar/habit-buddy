# Specification: Parent Dashboard (Phase 6)

## Overview

The Parent Dashboard provides a centralized view for parents to monitor their child's habit progress, view streak data, and manage rewards. It is designed to be data-driven and professional, distinct from the playful child-facing UI.

## Functional Requirements

- **FR-DASH-01: Parental Gate Access**: The dashboard must be accessible only via a Parental Gate (e.g., 3-second long-press) from the Home screen.
- **FR-DASH-02: Today's Summary**: Display a simple list of the 3 core habits with completion status (✅/❌) for the current day.
- **FR-DASH-03: 7-Day Streak Calendar**: Visualize completion status for the last 7 days (sliding window). A day is marked "complete" only if ALL 3 habits were finished.
- **FR-DASH-04: Bolt Statistics**: Show total bolts earned (all-time), total bolts spent, current balance, and the average number of habits completed per day.
- **FR-DASH-05: Reset Today's Progress**: Provide an administrative action to clear today's habit logs to allow for corrections.
- **FR-DASH-06: Navigation**: Include a direct link to the Reward Management (Parental settings) from the dashboard.

## Non-Functional Requirements

- **NFR-DASH-01: Visual Style**: The UI should be clean, professional, and data-focused, using the project's "Professional" theme variant.
- **NFR-DASH-02: Performance**: Dashboard data queries must be optimized to ensure the screen loads in under 1 second.
- **NFR-DASH-03: Security**: Ensure the Parental Gate is robust to prevent accidental access by children.

## Acceptance Criteria

- [ ] Parent can access the dashboard via a 3-second long-press on a specific Home screen element.
- [ ] Dashboard correctly shows ✅ for completed habits and ❌ for incomplete ones today.
- [ ] Streak calendar correctly identifies "complete" days (3/3 habits) for the past week.
- [ ] Bolt statistics accurately reflect data from `profiles`, `habits_log`, and `coupons`.
- [ ] "Reset Today" successfully clears logs for the current date only.
- [ ] Link to Reward Management navigates to the correct screen.

## Out of Scope

- Detailed historical logs beyond the 7-day window (to be addressed in a future "History" feature).
- Multi-child support (MVP focus is on a single child profile).
- Exporting data to CSV/PDF (deferred to a later phase).
