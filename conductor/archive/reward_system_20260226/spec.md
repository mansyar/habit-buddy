# Specification: Reward System (Phase 5)

## Overview

The Reward System allows parents to incentivize healthy habits by creating real-world rewards that children can "purchase" with their earned Gold Bolts. This bridges digital achievements with tangible positive reinforcement.

## Functional Requirements

### 1. Reward Shop (Child Interface)

- **Bolt Balance:** Display the child's current total Gold Bolts prominently.
- **Reward Listing:** Show all available (non-redeemed) rewards with their title, bolt cost, and a category icon (Physical, Privilege, or Activity).
- **Redemption Logic:**
  - The "Redeem" button is only active if the child has enough bolts.
  - Tapping "Redeem" opens a child-friendly confirmation dialog ("Are you sure you want to use your bolts for this?").
- **Success Celebration:** Upon redemption, trigger a `BuddyAnimation` celebration (e.g., buddy jumping/cheering) and play a celebratory SFX.

### 2. Coupon Management (Parent Interface)

- **Parental Gate:** Access to management is protected by a simple gate (e.g., a "Parent Only" button requiring a 3-second long-press or a simple math sum) to prevent children from editing rewards.
- **Reward CRUD:**
  - **Create:** Add new rewards with a title (e.g., "Extra Bedtime Story"), a bolt cost, and a category selection.
  - **Edit/Delete:** Modify or remove existing rewards.
- **Redeemed History:** A full, scrollable list of all coupons that have been redeemed, helping parents keep track of what they "owe" the child.

### 3. Data & State

- **Bolt Deduction:** Immediately subtract the cost from the `profiles.bolt_balance` in both Supabase and local SQLite.
- **Coupon Updates:** Mark the coupon status as `redeemed` and record the timestamp.

## Non-Functional Requirements

- **Toddler-Friendly UI:** Use large, vibrant tap targets (min 44x44dp) and icons to represent reward types.
- **Offline Reliability:** Allow redemption while offline, with the `SyncService` handling the bolt deduction and coupon status update once back online.

## Acceptance Criteria

- [ ] Parents can successfully create a reward "New Toy" for 20 bolts.
- [ ] A child with 15 bolts sees the "Redeem" button as disabled for the "New Toy" reward.
- [ ] A child with 20+ bolts can redeem the reward, triggering the buddy celebration and reducing their balance correctly.
- [ ] The "New Toy" reward moves from the active shop list to the parent's "Full History" list.

## Out of Scope

- Integration with physical e-commerce stores.
- Automated email/push notifications to parents upon redemption (for MVP).
