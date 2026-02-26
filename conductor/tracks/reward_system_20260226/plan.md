# Implementation Plan: Reward System (Phase 5)

## Phase 1: Data Schema & Service Enhancements

- [~] Task: Conductor - Update `Coupon` type and database schema
  - [ ] Add `category` field to `Coupon` interface and SQLite schema
  - [ ] Add `category` to Supabase migration script
- [ ] Task: Conductor - Implement bolt deduction in `CouponService.redeemCoupon()`
  - [ ] Red: Test that `redeemCoupon` calls `ProfileService.updateBalance` with the negative bolt cost
  - [ ] Red: Test that `redeemCoupon` fails if `profile.bolt_balance < coupon.bolt_cost`
  - [ ] Green: Implement logic to fetch coupon cost, check balance, and deduct bolts before marking as redeemed
- [ ] Task: Conductor - Enhance `CouponService` CRUD for categories
  - [ ] Red: Test `createCoupon` and `getCoupons` properly handle/return the `category` field
  - [ ] Green: Update SQL queries and Supabase calls to include the `category` column
- [ ] Task: Conductor - User Manual Verification 'Data Schema & Service Enhancements' (Protocol in workflow.md)

## Phase 2: Parental Management UI

- [ ] Task: Conductor - Implement `ParentalGate` component
  - [ ] Red: Test that the gate only triggers its `onSuccess` callback after a continuous 3-second press
  - [ ] Green: Implement logic using `Pressable` and a timer (or Reanimated) to track long-press duration
- [ ] Task: Conductor - Build Reward Management screen
  - [ ] Red: Test that the "Add Reward" form validates that `bolt_cost` is a positive integer
  - [ ] Green: Build the form and list view for active coupons
- [ ] Task: Conductor - Build "Edit Reward" and "Delete Reward" functionality
  - [ ] Red: Test that deleting a coupon removes it from the local list immediately
  - [ ] Green: Implement CRUD handlers and UI buttons for editing/deleting
- [ ] Task: Conductor - Build Redeemed History screen
  - [ ] Red: Test that the history list only displays coupons where `is_redeemed` is true
  - [ ] Green: Implement the filtered list view and date formatting for redemptions
- [ ] Task: Conductor - User Manual Verification 'Parental Management UI' (Protocol in workflow.md)

## Phase 3: Reward Shop (Child Interface)

- [ ] Task: Conductor - Build `RewardShop` screen layout
  - [ ] Red: Test that the screen correctly displays the current user's `bolt_balance` from the store
  - [ ] Green: Implement the shell with the balance display and reward grid
- [ ] Task: Conductor - Implement `CouponCard` component
  - [ ] Red: Test that the "Redeem" button is disabled if `userBolts < coupon.bolt_cost`
  - [ ] Green: Implement the card UI with conditional button state logic
- [ ] Task: Conductor - Create child-friendly "Confirm Redemption" modal
  - [ ] Red: Test that tapping "Yes" in the modal triggers the `redeemCoupon` service call
  - [ ] Green: Build the modal with large, toddler-friendly buttons
- [ ] Task: Conductor - Integrate celebration and success SFX
  - [ ] Red: Test that `BuddyAnimation` receives the `success` state upon redemption resolve
  - [ ] Green: Hook into the redemption promise to trigger SFX and animations
- [ ] Task: Conductor - User Manual Verification 'Reward Shop' (Protocol in workflow.md)

## Phase 4: Final Polish & Verification

- [ ] Task: Conductor - Audit tap targets and accessibility
  - [ ] Ensure all buttons are at least 44x44dp
  - [ ] Verify color contrast for parent-facing text
- [ ] Task: Conductor - Verify offline sync for redemptions
  - [ ] Red: Simulate offline redemption and verify it is added to `sync_queue`
  - [ ] Green: Ensure `SyncService` processes the redemption and balance update when back online
- [ ] Task: Conductor - Update `docs/roadmap.md` to mark Phase 5 as complete
- [ ] Task: Conductor - User Manual Verification 'Final Polish & Verification' (Protocol in workflow.md)
