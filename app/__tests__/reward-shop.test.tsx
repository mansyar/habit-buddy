import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react';
import RewardShopScreen from '../reward-shop';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import { couponService } from '../../src/lib/coupon_service';

vi.mock('../../src/lib/coupon_service', () => {
  const mockCoupon = {
    id: 'c1',
    profile_id: 'p1',
    title: 'Delete Me',
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

vi.mock('../../src/lib/haptic_feedback', () => ({
  hapticFeedback: {
    impact: vi.fn(),
    notification: vi.fn(),
    selection: vi.fn(),
  },
}));

describe('RewardShopScreen - Reward Management', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('validates that bolt_cost is a positive integer', async () => {
    const { getByText, getByPlaceholderText, findByText } = render(<RewardShopScreen />);

    // Trigger Parental Gate
    const gateButton = getByText('Parent');
    fireEvent.mouseDown(gateButton);
    await new Promise((resolve) => setTimeout(resolve, 50));
    fireEvent.mouseUp(gateButton);

    // Should now be in Admin mode
    const addRewardButton = await findByText('Add New');
    fireEvent.click(addRewardButton);

    const titleInput = getByPlaceholderText('Reward title (e.g., Ice Cream)');
    const costInput = getByPlaceholderText('Bolt cost');
    const submitButton = getByText('Save Reward');

    // Test non-positive bolt_cost
    fireEvent.change(titleInput, { target: { value: 'Freezing' } });
    fireEvent.change(costInput, { target: { value: '0' } });
    fireEvent.click(submitButton);

    expect(await findByText('Bolt cost must be between 1 and 200')).toBeTruthy();
    expect(couponService.createCoupon).not.toHaveBeenCalled();

    // Test valid submission
    fireEvent.change(costInput, { target: { value: '10' } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(couponService.createCoupon).toHaveBeenCalled();
    });
  });

  it('validates coupon title length and maximum bolt cost', async () => {
    const { getByText, getByPlaceholderText, findByText } = render(<RewardShopScreen />);

    // Trigger Parental Gate
    const gateButton = getByText('Parent');
    fireEvent.mouseDown(gateButton);
    await new Promise((resolve) => setTimeout(resolve, 50));
    fireEvent.mouseUp(gateButton);

    const addRewardButton = await findByText('Add New');
    fireEvent.click(addRewardButton);

    const titleInput = getByPlaceholderText('Reward title (e.g., Ice Cream)');
    const costInput = getByPlaceholderText('Bolt cost');
    const submitButton = getByText('Save Reward');

    // Test title too short
    fireEvent.change(titleInput, { target: { value: 'A' } });
    fireEvent.change(costInput, { target: { value: '10' } });
    fireEvent.click(submitButton);
    expect(await findByText('Title must be between 2 and 20 characters')).toBeTruthy();

    // Test title too long
    fireEvent.change(titleInput, { target: { value: 'This is a very long title for a coupon' } });
    fireEvent.click(submitButton);
    expect(await findByText('Title must be between 2 and 20 characters')).toBeTruthy();

    // Test bolt cost too high
    fireEvent.change(titleInput, { target: { value: 'Valid Title' } });
    fireEvent.change(costInput, { target: { value: '250' } });
    fireEvent.click(submitButton);
    expect(await findByText('Bolt cost must be between 1 and 200')).toBeTruthy();
  });

  it('deletes a coupon and removes it from the list', async () => {
    const { getByText, findByText } = render(<RewardShopScreen />);

    // Trigger Parental Gate
    const gateButton = getByText('Parent');
    fireEvent.mouseDown(gateButton);
    await new Promise((resolve) => setTimeout(resolve, 50));
    fireEvent.mouseUp(gateButton);

    expect(await findByText('Delete Me')).toBeTruthy();

    const deleteButton = getByText('Trash2');
    fireEvent.click(deleteButton);

    await waitFor(() => {
      expect(couponService.deleteCoupon).toHaveBeenCalledWith('c1');
    });
  });

  it('edits an existing coupon', async () => {
    const { getByText, getByPlaceholderText, findByText } = render(<RewardShopScreen />);

    // Trigger Parental Gate
    const gateButton = getByText('Parent');
    fireEvent.mouseDown(gateButton);
    await new Promise((resolve) => setTimeout(resolve, 50));
    fireEvent.mouseUp(gateButton);

    const editButton = await findByText('Edit2');
    fireEvent.click(editButton);

    const titleInput = getByPlaceholderText('Reward title (e.g., Ice Cream)');
    fireEvent.change(titleInput, { target: { value: 'Updated Title' } });

    const submitButton = getByText('Save Reward');
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(couponService.updateCoupon).toHaveBeenCalledWith(
        'c1',
        expect.objectContaining({
          title: 'Updated Title',
        }),
      );
    });
  });

  it('handles error when saving reward', async () => {
    (couponService.createCoupon as any).mockRejectedValue(new Error('Save Failed'));
    const { getByText, findByText, getByPlaceholderText, getByLabelText } = render(
      <RewardShopScreen />,
    );

    // Admin mode
    const gateButton = getByLabelText('Parent Mode');
    fireEvent.mouseDown(gateButton);
    await new Promise((resolve) => setTimeout(resolve, 50));
    fireEvent.mouseUp(gateButton);

    fireEvent.click(await findByText('Add New'));
    fireEvent.change(getByPlaceholderText('Reward title (e.g., Ice Cream)'), {
      target: { value: 'New' },
    });
    fireEvent.change(getByPlaceholderText('Bolt cost'), { target: { value: '10' } });
    fireEvent.click(getByText('Save Reward'));

    expect(await findByText('Failed to save reward')).toBeTruthy();
  });

  it('toggles between active and history view', async () => {
    const { getByText, findByText, queryByText, getByLabelText } = render(<RewardShopScreen />);

    // Admin mode
    const gateButton = getByLabelText('Parent Mode');
    fireEvent.mouseDown(gateButton);
    await new Promise((resolve) => setTimeout(resolve, 50));
    fireEvent.mouseUp(gateButton);

    expect(await findByText('Delete Me')).toBeTruthy();

    const historyToggle = getByLabelText('View Redeemed History');
    fireEvent.click(historyToggle);

    expect(await findByText('Redeemed History')).toBeTruthy();
    expect(queryByText('Delete Me')).toBeNull();
  });

  it('redeems a reward successfully', async () => {
    const { getByText, findByText, queryByText } = render(<RewardShopScreen />);

    const redeemButton = await findByText('Redeem');
    fireEvent.click(redeemButton);

    const confirmButton = await findByText('Yes! Redeem');
    fireEvent.click(confirmButton);

    await waitFor(() => {
      expect(couponService.redeemCoupon).toHaveBeenCalledWith('c1');
    });

    expect(await findByText('Hooray!')).toBeTruthy();
    expect(await findByText('Awesome!')).toBeTruthy();

    fireEvent.click(getByText('Awesome!'));
    await waitFor(() => {
      expect(queryByText('Hooray!')).toBeNull();
    });
  });
});
