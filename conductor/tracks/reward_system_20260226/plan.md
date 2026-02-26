# Implementation Plan: Reward System (Phase 5)

## Phase 1: Data Schema & Service Enhancements [checkpoint: 33d9567]

- [x] Task: Conductor - Update `Coupon` type and database schema 07b482e
  - [x] Add `category` field to `Coupon` interface and SQLite schema
  - [x] Add `category` to Supabase migration script
- [x] Task: Conductor - Implement bolt deduction in `CouponService.redeemCoupon()` d900b8a
  - [x] Red: Test that `redeemCoupon` calls `ProfileService.updateBalance` with the negative bolt cost
  - [x] Red: Test that `redeemCoupon` fails if `profile.bolt_balance < coupon.bolt_cost`
  - [x] Green: Implement logic to fetch coupon cost, check balance, and deduct bolts before marking as redeemed
- [x] Task: Conductor - Enhance `CouponService` CRUD for categories 07b482e
  - [x] Red: Test `createCoupon` and `getCoupons` properly handle/return the `category` field
  - [x] Green: Update SQL queries and Supabase calls to include the `category` column
- [x] Task: Conductor - User Manual Verification 'Data Schema & Service Enhancements' (Protocol in workflow.md)

## Phase 2: Parental Management UI [checkpoint: c0c9fcf]

- [x] Task: Conductor - Implement `ParentalGate` component 1f511b2
  - [x] Red: Test that the gate only triggers its `onSuccess` callback after a continuous 3-second press
  - [x] Green: Implement logic using `Pressable` and a timer (or Reanimated) to track long-press duration
- [x] Task: Conductor - Build Reward Management screen c2541cc
  - [x] Red: Test that the "Add Reward" form validates that `bolt_cost` is a positive integer
  - [x] Green: Build the form and list view for active coupons
- [x] Task: Conductor - Build "Edit Reward" and "Delete Reward" functionality e48201b
  - [x] Red: Test that deleting a coupon removes it from the local list immediately
  - [x] Green: Implement CRUD handlers and UI buttons for editing/deleting
- [x] Task: Conductor - Build Redeemed History screen 6692239
  - [x] Red: Test that the history list only displays coupons where `is_redeemed` is true
  - [x] Green: Implement the filtered list view and date formatting for redemptions
- [x] Task: Conductor - User Manual Verification 'Parental Management UI' (Protocol in workflow.md)

## Phase 3: Reward Shop (Child Interface) [checkpoint: 0ab99fe]

- [x] Task: Conductor - Build `RewardShop` screen layout c2541cc
  - [x] Red: Test that the screen correctly displays the current user's `bolt_balance` from the store
  - [x] Green: Implement the shell with the balance display and reward grid
- [x] Task: Conductor - Implement `CouponCard` component c2541cc
  - [x] Red: Test that the "Redeem" button is disabled if `userBolts < coupon.bolt_cost`
  - [x] Green: Implement the card UI with conditional button state logic
- [x] Task: Conductor - Create child-friendly "Confirm Redemption" modal 555d456
  - [x] Red: Test that tapping "Yes" in the modal triggers the `redeemCoupon` service call
  - [x] Green: Build the modal with large, toddler-friendly buttons
- [x] Task: Conductor - Integrate celebration and success SFX a1afb88
  - [x] Red: Test that `BuddyAnimation` receives the `success` state upon redemption resolve
  - [x] Green: Hook into the redemption promise to trigger SFX and animations
- [x] Task: Conductor - User Manual Verification 'Reward Shop' (Protocol in workflow.md)

## Phase 4: Final Polish & Verification

- [x] Task: Conductor - Audit tap targets and accessibility
  - [x] Ensure all buttons are at least 44x44dp
  - [x] Verify color contrast for parent-facing text
- [x] Task: Conductor - Verify offline sync for redemptions d900b8a
  - [x] Red: Simulate offline redemption and verify it is added to `sync_queue`
  - [x] Green: Ensure `SyncService` processes the redemption and balance update when back online
- [x] Task: Conductor - Update `docs/roadmap.md` to mark Phase 5 as complete d33cad8
- [ ] Task: Conductor - User Manual Verification 'Final Polish & Verification' (Protocol in workflow.md)
