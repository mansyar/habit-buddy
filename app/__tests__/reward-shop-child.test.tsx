import React from 'react';
import { render, fireEvent, waitFor, act } from '@testing-library/react';
import RewardShopScreen from '../reward-shop';
import { vi, describe, it, expect, beforeEach, afterEach } from 'vitest';
import { couponService } from '../../src/lib/coupon_service';

// Mock Lucide icons
vi.mock('lucide-react-native', () => ({
  Gift: (props: any) => <div {...props}>GiftIcon</div>,
  Plus: (props: any) => <div {...props}>PlusIcon</div>,
  Settings: (props: any) => <div {...props}>SettingsIcon</div>,
  Trash2: (props: any) => <div {...props}>TrashIcon</div>,
  Edit2: (props: any) => <div {...props}>EditIcon</div>,
  Check: (props: any) => <div {...props}>CheckIcon</div>,
  X: (props: any) => <div {...props}>XIcon</div>,
  History: (props: any) => <div {...props}>HistoryIcon</div>,
  Activity: (props: any) => <div {...props}>ActivityIcon</div>,
  Shield: (props: any) => <div {...props}>ShieldIcon</div>,
  Star: (props: any) => <div {...props}>StarIcon</div>,
  ChevronLeft: (props: any) => <div {...props}>BackIcon</div>,
}));

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
  const expensiveCoupon = {
    id: 'c2',
    profile_id: 'p1',
    title: 'Expensive Reward',
    bolt_cost: 100,
    category: 'Privilege',
    is_redeemed: false,
    created_at: new Date().toISOString(),
  };
  return {
    couponService: {
      createCoupon: vi.fn(() => Promise.resolve({ id: 'c1' })),
      getCoupons: vi.fn(() => Promise.resolve([mockCoupon, expensiveCoupon])),
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

describe('RewardShopScreen - Child Interface', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('displays active rewards in a grid', async () => {
    const { getByText, findByText } = render(<RewardShopScreen />);
    expect(await findByText('Test Reward')).toBeTruthy();
    expect(getByText('10 Bolts')).toBeTruthy();
  });

  it('disables the "Redeem" button if user has insufficient bolts', async () => {
    const { getByText, findByText, getAllByText } = render(<RewardShopScreen />);

    // Wait for rewards to load
    await findByText('Expensive Reward');

    const redeemButtons = getAllByText('Redeem');
    // Test Reward (10 bolts) - should be enabled
    expect(redeemButtons[0].closest('div')).not.toHaveProperty('disabled', true);

    // Expensive Reward (100 bolts) - should be disabled
    // In our web mock, we use 'disabled' prop on div/button
    const expensiveRedeemBtn = redeemButtons[1].parentElement;
    expect(expensiveRedeemBtn).toHaveProperty('disabled', true);
  });
});
