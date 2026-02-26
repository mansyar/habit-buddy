import { expect, test, vi, describe, beforeEach } from 'vitest';
import { couponService } from '../coupon_service';
import { profileService } from '../profile_service';
import { initializeSQLite } from '../sqlite';

// Mock Supabase client
vi.mock('../supabase', () => ({
  supabase: {
    from: vi.fn(() => ({
      select: vi.fn(() => ({
        eq: vi.fn(() => Promise.resolve({ data: [], error: null })),
      })),
      update: vi.fn(() => ({
        eq: vi.fn(() => Promise.resolve({ error: null })),
      })),
    })),
  },
}));

// Mock Network
vi.mock('../network', () => ({
  checkIsOnline: vi.fn(() => Promise.resolve(true)),
}));

// Mock SQLite
const mockDb = {
  execAsync: vi.fn(async () => {}),
  runAsync: vi.fn(async () => {}),
  getFirstAsync: vi.fn(async () => null),
  getAllAsync: vi.fn(async () => []),
};

vi.mock('../sqlite', () => ({
  initializeSQLite: vi.fn(() => Promise.resolve(mockDb)),
}));

// Mock ProfileService
vi.mock('../profile_service', () => ({
  profileService: {
    getProfile: vi.fn(),
    updateBoltBalance: vi.fn(),
  },
}));

describe('Reward System Phase 2: Bolt Deduction', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test('redeemCoupon should deduct bolts and mark as redeemed', async () => {
    const mockCoupon = {
      id: 'c1',
      profile_id: 'p1',
      title: 'Ice Cream',
      bolt_cost: 10,
      is_redeemed: false,
    };

    const mockProfile = {
      id: 'p1',
      bolt_balance: 15,
    };

    // Setup mocks
    mockDb.getFirstAsync.mockResolvedValueOnce(mockCoupon); // Fetching coupon info
    (profileService.getProfile as any).mockResolvedValueOnce(mockProfile);
    (profileService.updateBoltBalance as any).mockResolvedValueOnce({
      ...mockProfile,
      bolt_balance: 5,
    });

    await couponService.redeemCoupon('c1');

    // Should fetch the coupon first to know the cost
    expect(mockDb.getFirstAsync).toHaveBeenCalledWith(
      expect.stringContaining('SELECT * FROM coupons'),
      'c1',
    );

    // Should check balance and deduct
    expect(profileService.updateBoltBalance).toHaveBeenCalledWith('p1', -10);

    // Should update coupon status
    expect(mockDb.runAsync).toHaveBeenCalledWith(
      expect.stringContaining('UPDATE coupons SET is_redeemed = 1'),
      'c1',
    );
  });

  test('redeemCoupon should throw error if insufficient bolts', async () => {
    const mockCoupon = {
      id: 'c1',
      profile_id: 'p1',
      title: 'Expensive Toy',
      bolt_cost: 100,
      is_redeemed: false,
    };

    const mockProfile = {
      id: 'p1',
      bolt_balance: 15,
    };

    // Setup mocks
    mockDb.getFirstAsync.mockResolvedValueOnce(mockCoupon);
    (profileService.getProfile as any).mockResolvedValueOnce(mockProfile);

    await expect(couponService.redeemCoupon('c1')).rejects.toThrow('Insufficient bolts');

    // Should NOT have updated balance or marked as redeemed
    expect(profileService.updateBoltBalance).not.toHaveBeenCalled();
    expect(mockDb.runAsync).not.toHaveBeenCalledWith(
      expect.stringContaining('UPDATE coupons SET is_redeemed = 1'),
      expect.anything(),
    );
  });
});
