import { expect, test, vi, describe, beforeEach } from 'vitest';
import React from 'react';
import { render } from '@testing-library/react';
import HomeScreen from '../(tabs)/index';
import MissionScreen from '../mission/[id]';
import RewardShopScreen from '../reward-shop';
import { useAuthStore } from '../../src/store/auth_store';
import { useHabitStore } from '../../src/store/habit_store';
import { useBuddyStore } from '../../src/store/buddy_store';
import { couponService } from '../../src/lib/coupon_service';

// Mock expo-haptics to avoid EventEmitter error in jsdom
vi.mock('expo-haptics', () => ({
  impactAsync: vi.fn(),
  notificationAsync: vi.fn(),
  selectionAsync: vi.fn(),
  ImpactFeedbackStyle: { Light: 0, Medium: 1, Heavy: 2 },
  NotificationFeedbackType: { Success: 0, Warning: 1, Error: 2 },
}));

// Use mocks from vitest.setup.ts but ensure stores are consistent
vi.mock('../../src/store/auth_store', () => ({
  useAuthStore: vi.fn(),
}));

vi.mock('../../src/store/habit_store', () => ({
  useHabitStore: vi.fn(),
}));

vi.mock('../../src/store/buddy_store', () => ({
  useBuddyStore: vi.fn(),
}));

vi.mock('../../src/lib/coupon_service', () => ({
  couponService: {
    getCoupons: vi.fn(),
  },
}));

describe('Snapshot Tests', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    (useAuthStore as any).mockReturnValue({
      profile: { id: 'p1', child_name: 'Buddy', bolt_balance: 50, selected_buddy: 'dino' },
    });
    (useHabitStore as any).mockReturnValue({
      completedHabitIds: ['tooth-brushing'],
      getCompletionPercentage: () => 33,
      loadTodaysHabits: vi.fn(),
    });
    (useBuddyStore as any).mockReturnValue({
      selectedBuddy: 'dino',
      state: 'idle',
    });
    (couponService.getCoupons as any).mockResolvedValue([
      {
        id: 'c1',
        title: 'Ice Cream',
        bolt_cost: 10,
        category: 'Physical',
        is_redeemed: false,
        created_at: '2023-01-01',
      },
    ]);
  });

  test('HomeScreen snapshot', () => {
    const { asFragment } = render(<HomeScreen />);
    expect(asFragment()).toMatchSnapshot();
  });

  test('MissionScreen snapshot', () => {
    const { asFragment } = render(<MissionScreen />);
    expect(asFragment()).toMatchSnapshot();
  });

  test('RewardShopScreen snapshot', () => {
    const { asFragment } = render(<RewardShopScreen />);
    expect(asFragment()).toMatchSnapshot();
  });
});
