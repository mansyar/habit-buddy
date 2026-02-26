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
    const { getByText, queryByText, findByText } = render(<RewardShopScreen />);

    // Trigger Parental Gate
    const gateButton = getByText('Parent Settings');
    fireEvent.mouseDown(gateButton);
    await new Promise((resolve) => setTimeout(resolve, 50));
    fireEvent.mouseUp(gateButton);

    // Should see active reward by default in management
    expect(await findByText('Active Reward')).toBeTruthy();
    expect(queryByText('Old Reward')).toBeNull();

    // Toggle History
    const historyButton = getByText('HistoryIcon');
    fireEvent.click(historyButton);

    // Should see old reward and NOT active reward
    expect(await findByText('Old Reward')).toBeTruthy();
    expect(queryByText('Active Reward')).toBeNull();
  });
});
