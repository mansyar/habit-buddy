import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import RewardShopScreen from '../reward-shop';
import { vi, describe, it, expect, beforeEach } from 'vitest';

vi.mock('../../src/lib/coupon_service', () => {
  const mockCoupon = {
    id: 'c1',
    profile_id: 'p1',
    title: 'Active Reward',
    bolt_cost: 10,
    category: 'Physical',
    is_redeemed: false,
    created_at: new Date().toISOString(),
  };
  const mockRedeemed = {
    id: 'c2',
    profile_id: 'p1',
    title: 'Old Reward',
    bolt_cost: 20,
    category: 'Activity',
    is_redeemed: true,
    created_at: new Date().toISOString(),
  };
  return {
    couponService: {
      createCoupon: vi.fn(() => Promise.resolve({ id: 'c1' })),
      getCoupons: vi.fn(() => Promise.resolve([mockCoupon, mockRedeemed])),
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

describe('RewardShopScreen - Reward History', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('shows only redeemed coupons in history view', async () => {
    const { getByText, queryByText, findByText, getByTestId } = render(<RewardShopScreen />);

    // Trigger Parental Gate
    const gateButton = getByText('Parent Settings');
    fireEvent.mouseDown(gateButton);
    await new Promise((resolve) => setTimeout(resolve, 50));
    fireEvent.mouseUp(gateButton);

    // Should see active reward by default in management
    expect(await findByText('Parent Control Panel')).toBeTruthy();
    expect(await findByText('Active Reward')).toBeTruthy();
    expect(queryByText('Old Reward')).toBeNull();

    // Toggle History
    const historyButton = getByTestId('icon-History');
    fireEvent.click(historyButton);

    // Should see old reward and NOT active reward
    expect(await findByText('Old Reward')).toBeTruthy();
    expect(queryByText('Active Reward')).toBeNull();
  });
});
