import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import RewardShopScreen from '../reward-shop';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import { audioService } from '../../src/lib/audio_service';

vi.mock('../../src/lib/audio_service', () => ({
  audioService: {
    init: vi.fn(),
    playSound: vi.fn(),
    playMusic: vi.fn(),
    stopMusic: vi.fn(),
    setVolume: vi.fn(),
    setMute: vi.fn(),
  },
}));

vi.mock('../../src/lib/haptic_feedback', () => ({
  hapticFeedback: {
    impact: vi.fn(),
    notification: vi.fn(),
    selection: vi.fn(),
  },
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
    const { findByText, getAllByText } = render(<RewardShopScreen />);

    // Wait for rewards to load
    await findByText('Expensive Reward');

    const redeemButtons = getAllByText('Redeem');
    // Test Reward (10 bolts) - should be enabled
    expect(redeemButtons[0].closest('button')).not.toHaveProperty('disabled', true);

    // Expensive Reward (100 bolts) - should be disabled
    const expensiveRedeemBtn = redeemButtons[1].closest('button');
    expect(expensiveRedeemBtn).toHaveProperty('disabled', true);
  });

  it('has correct accessibility properties for reward cards', async () => {
    const { findByTestId } = render(<RewardShopScreen />);
    const card = await findByTestId('reward-card-c1');

    expect(card.getAttribute('accessibilitylabel')).toBe(
      'Reward: Test Reward, Cost: 10 Bolts, Category: Physical',
    );
  });

  it('triggers audio VO when reward card is pressed (Read to me)', async () => {
    const { findByTestId } = render(<RewardShopScreen />);
    const card = await findByTestId('reward-card-c1');

    fireEvent.click(card);

    expect(audioService.playSound).toHaveBeenCalledWith(
      'vo-instruction',
      expect.objectContaining({ uri: expect.any(String) }),
    );
  });
});
