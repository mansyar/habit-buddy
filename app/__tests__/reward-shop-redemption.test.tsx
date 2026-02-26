import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react';
import RewardShopScreen from '../reward-shop';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import { couponService } from '../../src/lib/coupon_service';

vi.mock('../../src/lib/coupon_service', () => {
  const mockCoupon = {
    id: 'c1',
    profile_id: 'p1',
    title: 'Test Reward',
    bolt_cost: 10,
    category: 'Physical',
    is_redeemed: false,
    created_at: new Date().toISOString(),
  };
  return {
    couponService: {
      createCoupon: vi.fn(() => Promise.resolve({ id: 'c1' })),
      getCoupons: vi.fn(() => Promise.resolve([mockCoupon])),
      redeemCoupon: vi.fn(() => Promise.resolve()),
      deleteCoupon: vi.fn(() => Promise.resolve()),
      updateCoupon: vi.fn(() => Promise.resolve()),
    },
  };
});

vi.mock('../../src/lib/profile_service', () => ({
  profileService: {
    getProfile: vi.fn(() => Promise.resolve({ id: 'p1', bolt_balance: 50 })),
  },
}));

vi.mock('../../src/store/auth_store', () => {
  return {
    useAuthStore: vi.fn(() => ({ profile: { id: 'p1', bolt_balance: 50 } })),
  };
});

describe('RewardShopScreen - Redemption', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('triggers redeemCoupon after confirmation', async () => {
    const { getByText, findByText } = render(<RewardShopScreen />);

    const redeemButton = await findByText('Redeem');
    fireEvent.click(redeemButton);

    // Confirm Modal should appear
    expect(await findByText(/Are you sure/i)).toBeTruthy();

    const yesButton = getByText(/Yes! Redeem/i);
    fireEvent.click(yesButton);

    await waitFor(() => {
      expect(couponService.redeemCoupon).toHaveBeenCalledWith('c1');
    });
  });
});
