import { expect, test, vi, describe, beforeEach } from 'vitest';
import { couponService } from '../coupon_service';
import { supabase } from '../supabase';
import { initializeSQLite } from '../sqlite';
import { checkIsOnline } from '../network';
import { profileService } from '../profile_service';

// Mock ProfileService
vi.mock('../profile_service', () => ({
  profileService: {
    getProfile: vi.fn(() => Promise.resolve({ id: 'p1', bolt_balance: 100 })),
    updateBoltBalance: vi.fn(() => Promise.resolve({})),
  },
}));

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

describe('CouponService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test('should create a coupon', async () => {
    const couponData = {
      profile_id: 'p1',
      title: 'Ice Cream',
      bolt_cost: 10,
      category: 'Physical' as const,
    };

    const coupon = await couponService.createCoupon(couponData);

    expect(mockDb.runAsync).toHaveBeenCalledWith(
      expect.stringContaining('INSERT INTO coupons'),
      expect.any(String),
      couponData.profile_id,
      couponData.title,
      couponData.bolt_cost,
      'Physical',
      0,
      expect.any(String),
    );
    expect(coupon.title).toBe('Ice Cream');
  });

  test('should fetch coupons from SQLite', async () => {
    const mockCoupons = [{ id: 'c1', title: 'Ice Cream', is_redeemed: 0 }];
    mockDb.getAllAsync.mockResolvedValueOnce(mockCoupons);

    const coupons = await couponService.getCoupons('p1');
    expect(coupons[0].title).toBe('Ice Cream');
    expect(mockDb.getAllAsync).toHaveBeenCalled();
  });

  test('should redeem a coupon', async () => {
    const couponId = 'c1';
    const mockCoupon = { id: 'c1', profile_id: 'p1', bolt_cost: 10, is_redeemed: 0 };
    mockDb.getFirstAsync.mockResolvedValueOnce(mockCoupon);

    await couponService.redeemCoupon(couponId);

    expect(mockDb.runAsync).toHaveBeenCalledWith(
      expect.stringContaining('UPDATE coupons SET is_redeemed = 1'),
      couponId,
    );
    expect(supabase.from).toHaveBeenCalledWith('coupons');
  });
});
