import { expect, test, vi, describe, beforeEach } from 'vitest';
import React from 'react';
import { render, fireEvent, act } from '@testing-library/react';
import RewardShopScreen from '../reward-shop';
import { useAuthStore } from '../../src/store/auth_store';
import { couponService } from '../../src/lib/coupon_service';

// Mock react-native components to ensure accessibilityLabel maps to aria-label for web testing
// We use div for Pressable to avoid nested button issues
vi.mock('react-native', async (importActual) => {
  const actual: any = await importActual();
  return {
    ...actual,
    TouchableOpacity: ({ children, onPress, accessibilityLabel, testID, disabled, style }: any) => (
      <button
        onClick={onPress}
        aria-label={accessibilityLabel}
        data-testid={testID}
        disabled={disabled}
        style={style}
      >
        {children}
      </button>
    ),
    Pressable: ({ children, onPress, accessibilityLabel, testID, disabled, style }: any) => (
      <div
        onClick={disabled ? undefined : onPress}
        aria-label={accessibilityLabel}
        data-testid={testID}
        style={{
          cursor: disabled ? 'default' : 'pointer',
          border: 'none',
          background: 'none',
          ...style,
        }}
        role="button"
      >
        {children}
      </div>
    ),
    View: ({ children, accessibilityLabel, accessibilityRole, style, testID }: any) => (
      <div
        aria-label={accessibilityLabel}
        role={accessibilityRole}
        style={style}
        data-testid={testID}
      >
        {children}
      </div>
    ),
  };
});

vi.mock('../../src/components/ScaleButton', () => ({
  ScaleButton: ({ children, onPress, disabled, style, accessibilityLabel }: any) => (
    <button
      onClick={disabled ? undefined : onPress}
      data-testid="scale-button"
      style={{ cursor: disabled ? 'default' : 'pointer', ...style }}
      disabled={disabled}
      aria-label={accessibilityLabel}
    >
      {children}
    </button>
  ),
}));

vi.mock('../../src/store/auth_store', () => ({
  useAuthStore: vi.fn(),
}));

vi.mock('../../src/store/buddy_store', () => ({
  useBuddyStore: vi.fn(() => ({ selectedBuddy: 'dino' })),
}));

vi.mock('../../src/lib/coupon_service', () => ({
  couponService: {
    getCoupons: vi.fn(),
    redeemCoupon: vi.fn(),
    deleteCoupon: vi.fn(),
    updateCoupon: vi.fn(),
    createCoupon: vi.fn(),
  },
}));

vi.mock('../../src/lib/audio_service', () => ({
  audioService: { playSound: vi.fn() },
}));

vi.mock('../../src/lib/haptic_feedback', () => ({
  hapticFeedback: { notification: vi.fn() },
}));

// Mock ParentalGate to bypass or trigger easily
vi.mock('../../src/components/ParentalGate', () => ({
  ParentalGate: ({ children, onSuccess }: any) => (
    <div onClick={onSuccess} data-testid="parental-gate" role="button">
      {children}
    </div>
  ),
}));

describe('RewardShopScreen Accessibility and States', () => {
  const mockCoupons = [
    {
      id: 'c1',
      title: 'Ice Cream',
      bolt_cost: 10,
      category: 'Physical',
      is_redeemed: false,
      created_at: '2023-01-01',
    },
    {
      id: 'c2',
      title: 'Extra Game Time',
      bolt_cost: 100,
      category: 'Privilege',
      is_redeemed: false,
      created_at: '2023-01-01',
    },
  ];

  beforeEach(() => {
    vi.clearAllMocks();
    (useAuthStore as any).mockReturnValue({ profile: { id: 'p1', bolt_balance: 50 } });
    (couponService.getCoupons as any).mockResolvedValue(mockCoupons);
  });

  test('has correct accessibility labels for shop rewards', async () => {
    const { findByLabelText } = render(<RewardShopScreen />);

    expect(
      await findByLabelText('Reward: Ice Cream, Cost: 10 Bolts, Category: Physical'),
    ).toBeTruthy();
    expect(
      await findByLabelText('Reward: Extra Game Time, Cost: 100 Bolts, Category: Privilege'),
    ).toBeTruthy();
  });

  test('disables redeem button if balance is insufficient', async () => {
    const { findAllByText } = render(<RewardShopScreen />);

    const redeemButtons = await findAllByText('Redeem');

    // Ice cream (10 bolts) - should be enabled (balance 50)
    const iceCreamBtn = redeemButtons[0].closest('button');
    expect(iceCreamBtn?.disabled).toBe(false);

    // Extra Game Time (100 bolts) - should be disabled
    const gameTimeBtn = redeemButtons[1].closest('button');
    expect(gameTimeBtn?.disabled).toBe(true);
  });

  test('renders history correctly in parent mode', async () => {
    const redeemedCoupons = [
      {
        id: 'r1',
        title: 'Movie Night',
        bolt_cost: 30,
        category: 'Activity',
        is_redeemed: true,
        created_at: '2023-01-01',
      },
    ];
    (couponService.getCoupons as any).mockResolvedValue([...mockCoupons, ...redeemedCoupons]);

    const { getByText, findByText, findByLabelText } = render(<RewardShopScreen />);

    // Enter parent mode
    const parentButton = getByText('Parent');
    await act(async () => {
      fireEvent.click(parentButton);
    });

    // Toggle history
    const historyBtn = await findByLabelText('View Redeemed History');
    await act(async () => {
      fireEvent.click(historyBtn);
    });

    expect(await findByText('Movie Night')).toBeTruthy();
    expect(getByText(/30 Bolts • Activity/)).toBeTruthy();
  });
});
