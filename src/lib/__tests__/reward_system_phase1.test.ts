import { expect, test, vi, describe, beforeEach } from 'vitest';
import { couponService } from '../coupon_service';
import { supabase } from '../supabase';
import { initializeSQLite } from '../sqlite';

// Mock Supabase client
vi.mock('../supabase', () => ({
  supabase: {
    from: vi.fn(() => ({
      select: vi.fn(() => ({
        eq: vi.fn(() => Promise.resolve({ data: [], error: null })),
      })),
      insert: vi.fn(() => ({
        select: vi.fn(() => ({
          single: vi.fn(() => Promise.resolve({ data: { id: 'coupon-123' }, error: null })),
        })),
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

describe('Reward System Phase 1: Category Field', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test('createCoupon should handle category', async () => {
    const couponData = {
      profile_id: 'p1',
      title: 'Activity Reward',
      bolt_cost: 15,
      category: 'Activity' as any, // Cast to any because it doesn't exist yet
    };

    const coupon = await couponService.createCoupon(couponData);

    // This should fail because CouponService.createCoupon doesn't expect category yet
    expect(mockDb.runAsync).toHaveBeenCalledWith(
      expect.stringContaining('category'),
      expect.anything(),
      expect.anything(),
      expect.anything(),
      expect.anything(),
      expect.anything(),
      expect.anything(),
      expect.anything(),
    );
    expect(coupon).toHaveProperty('category', 'Activity');
  });

  test('getCoupons should return category', async () => {
    const mockCoupons = [
      { id: 'c1', title: 'Activity Reward', bolt_cost: 15, category: 'Activity', is_redeemed: 0 },
    ];
    mockDb.getAllAsync.mockResolvedValueOnce(mockCoupons);

    const coupons = await couponService.getCoupons('p1');
    expect(coupons[0]).toHaveProperty('category', 'Activity');
  });
});
