# Implementation Plan: Reward System (Phase 5)

## Phase 1: Data Schema & Service Enhancements

- [ ] Task: Conductor - Update `Coupon` type and database schema to include `category` (Physical, Privilege, Activity)
- [ ] Task: Conductor - Write failing unit tests for `CouponService.redeemCoupon()` (validating bolt deduction logic via `ProfileService`)
- [ ] Task: Conductor - Implement bolt deduction in `CouponService.redeemCoupon()` to pass tests
- [ ] Task: Conductor - Update `CouponService.createCoupon()` and `getCoupons()` to handle the `category` field
- [ ] Task: Conductor - User Manual Verification 'Data Schema & Service Enhancements' (Protocol in workflow.md)

## Phase 2: Parental Management UI

- [ ] Task: Conductor - Implement `ParentalGate` component (3-second long press on "Parent Mode" button)
- [ ] Task: Conductor - Build Reward Management screen: List active coupons and "Add Reward" form
- [ ] Task: Conductor - Build "Edit Reward" and "Delete Reward" functionality
- [ ] Task: Conductor - Build Redeemed History screen (Display all coupons where `is_redeemed` is true)
- [ ] Task: Conductor - User Manual Verification 'Parental Management UI' (Protocol in workflow.md)

## Phase 3: Reward Shop (Child Interface)

- [ ] Task: Conductor - Build `RewardShop` screen layout (Display total bolts and available coupons)
- [ ] Task: Conductor - Implement `CouponCard` component with "Redeem" button (disabled if insufficient bolts)
- [ ] Task: Conductor - Create child-friendly "Confirm Redemption" modal
- [ ] Task: Conductor - Integrate `BuddyAnimation` celebration and success SFX into the redemption flow
- [ ] Task: Conductor - User Manual Verification 'Reward Shop' (Protocol in workflow.md)

## Phase 4: Final Polish & Verification

- [ ] Task: Conductor - Audit tap targets (min 44x44dp) and color contrast for Reward System screens
- [ ] Task: Conductor - Verify offline redemption works and syncs correctly via `SyncService`
- [ ] Task: Conductor - Update `docs/roadmap.md` to mark Phase 5 as complete
- [ ] Task: Conductor - User Manual Verification 'Final Polish & Verification' (Protocol in workflow.md)
