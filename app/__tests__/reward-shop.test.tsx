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
}));

vi.mock('../../src/lib/coupon_service', () => ({
  couponService: {
    createCoupon: vi.fn(() => Promise.resolve({ id: 'c1' })),
    getCoupons: vi.fn(() => Promise.resolve([])),
    redeemCoupon: vi.fn(() => Promise.resolve()),
  },
}));

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

describe('RewardShopScreen - Reward Management', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('validates that bolt_cost is a positive integer', async () => {
    const { getByText, getByPlaceholderText, queryByText, findByText } = render(
      <RewardShopScreen />,
    );

    // Trigger Parental Gate
    const gateButton = getByText('Parent Settings');
    fireEvent.mouseDown(gateButton);

    // Wait for the 10ms delay
    await new Promise((resolve) => setTimeout(resolve, 50));

    fireEvent.mouseUp(gateButton);

    // Should now be in Admin mode
    const addRewardButton = await findByText('Add New Reward');
    fireEvent.click(addRewardButton);

    const titleInput = getByPlaceholderText('Reward title (e.g., Ice Cream)');
    const costInput = getByPlaceholderText('Bolt cost');
    const submitButton = getByText('Save Reward');

    // Test non-positive bolt_cost
    fireEvent.change(titleInput, { target: { value: 'Freezing' } });
    fireEvent.change(costInput, { target: { value: '0' } });
    fireEvent.click(submitButton);

    expect(await findByText('Bolt cost must be at least 1')).toBeTruthy();
    expect(couponService.createCoupon).not.toHaveBeenCalled();

    // Test valid submission
    fireEvent.change(costInput, { target: { value: '10' } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(couponService.createCoupon).toHaveBeenCalled();
    });
  });
});
