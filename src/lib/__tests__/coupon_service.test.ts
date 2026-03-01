import { expect, test, vi, describe, beforeEach } from 'vitest';
import { couponService } from '../coupon_service';
import { supabase } from '../supabase';
import { checkIsOnline } from '../network';

// Mock ProfileService
vi.mock('../profile_service', () => ({
  profileService: {
    getProfile: vi.fn(() => Promise.resolve({ id: 'p1', bolt_balance: 100 })),
    updateBoltBalance: vi.fn(() => Promise.resolve({})),
  },
}));

// Mock Supabase client
vi.mock('../supabase', () => ({
  withTimeout: vi.fn((promise) => promise),
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
      delete: vi.fn(() => ({
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
    vi.mocked(checkIsOnline).mockResolvedValue(true);
  });

  test('should create a coupon (offline)', async () => {
    vi.mocked(checkIsOnline).mockResolvedValueOnce(false);

    const couponData = {
      profile_id: 'p1',
      title: 'Offline Coupon',
      bolt_cost: 5,
    };

    await couponService.createCoupon(couponData);

    // Should add to sync_queue
    expect(mockDb.runAsync).toHaveBeenCalledWith(
      expect.stringContaining('INSERT INTO sync_queue'),
      'coupons',
      'INSERT',
      expect.any(String),
    );
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
      expect.any(String), // id
      couponData.profile_id,
      couponData.title,
      couponData.bolt_cost,
      'Physical', // category
      0, // is_redeemed
      'pending', // initial sync_status is now pending
      expect.any(String), // last_modified
      expect.any(String), // created_at
    );

    // Should have updated to synced after success
    expect(mockDb.runAsync).toHaveBeenCalledWith(
      expect.stringContaining("UPDATE coupons SET sync_status = 'synced'"),
      expect.any(String),
    );

    expect(coupon.title).toBe('Ice Cream');
  });

  test('should handle createCoupon sync error', async () => {
    vi.mocked(supabase.from).mockReturnValueOnce({
      insert: vi.fn(() => ({
        select: vi.fn(() => ({
          single: vi.fn(() => Promise.resolve({ error: { message: 'Supabase Error' } })),
        })),
      })),
    } as any);

    const couponData = {
      profile_id: 'p1',
      title: 'Ice Cream',
      bolt_cost: 10,
    };

    await couponService.createCoupon(couponData);

    // Should update status to pending on error
    expect(mockDb.runAsync).toHaveBeenCalledWith(
      expect.stringContaining("UPDATE coupons SET sync_status = 'pending'"),
      expect.any(String),
    );

    // Should add to sync_queue
    expect(mockDb.runAsync).toHaveBeenCalledWith(
      expect.stringContaining('INSERT INTO sync_queue'),
      'coupons',
      'INSERT',
      expect.any(String),
    );
  });

  test('should fetch coupons from SQLite', async () => {
    const mockCoupons = [{ id: 'c1', title: 'Ice Cream', is_redeemed: 0 }];
    mockDb.getAllAsync.mockResolvedValueOnce(mockCoupons);

    const coupons = await couponService.getCoupons('p1');
    expect(coupons[0].title).toBe('Ice Cream');
    expect(mockDb.getAllAsync).toHaveBeenCalled();
  });

  test('should fetch coupons from Supabase when local is empty', async () => {
    mockDb.getAllAsync.mockResolvedValueOnce([]); // Local empty
    const remoteCoupons = [
      { id: 'c2', title: 'Pizza', profile_id: 'p1', bolt_cost: 20, created_at: '2023-01-01' },
    ];

    vi.mocked(supabase.from).mockReturnValueOnce({
      select: vi.fn(() => ({
        eq: vi.fn(() => Promise.resolve({ data: remoteCoupons, error: null })),
      })),
    } as any);

    const coupons = await couponService.getCoupons('p1');
    expect(coupons).toHaveLength(1);
    expect(coupons[0].title).toBe('Pizza');

    // Should cache to SQLite
    expect(mockDb.runAsync).toHaveBeenCalledWith(
      expect.stringContaining('INSERT OR REPLACE INTO coupons'),
      expect.any(String),
      expect.any(String),
      expect.any(String),
      expect.any(Number),
      expect.any(String),
      expect.any(Number),
      'synced',
      expect.any(String),
      expect.any(String),
    );
  });

  test('should handle getCoupons Supabase error', async () => {
    mockDb.getAllAsync.mockResolvedValueOnce([]); // Local empty
    vi.mocked(supabase.from).mockReturnValueOnce({
      select: vi.fn(() => ({
        eq: vi.fn(() => Promise.resolve({ error: { message: 'Fetch Error' } })),
      })),
    } as any);

    const coupons = await couponService.getCoupons('p1');
    expect(coupons).toHaveLength(0);
  });

  test('should redeem a coupon', async () => {
    const couponId = 'c1';
    const mockCoupon = { id: 'c1', profile_id: 'p1', bolt_cost: 10, is_redeemed: 0 };
    mockDb.getFirstAsync.mockResolvedValueOnce(mockCoupon);

    await couponService.redeemCoupon(couponId);

    expect(mockDb.runAsync).toHaveBeenCalledWith(
      expect.stringContaining('UPDATE coupons SET is_redeemed = 1'),
      'pending',
      expect.any(String),
      couponId,
    );

    // Should have updated to synced after success
    expect(mockDb.runAsync).toHaveBeenCalledWith(
      expect.stringContaining("UPDATE coupons SET sync_status = 'synced'"),
      couponId,
    );
  });

  test('should redeem a coupon (offline)', async () => {
    vi.mocked(checkIsOnline).mockResolvedValueOnce(false);
    const mockCoupon = { id: 'c1', profile_id: 'p1', bolt_cost: 10, is_redeemed: 0 };
    mockDb.getFirstAsync.mockResolvedValueOnce(mockCoupon);

    await couponService.redeemCoupon('c1');

    // Should add to sync_queue
    expect(mockDb.runAsync).toHaveBeenCalledWith(
      expect.stringContaining('INSERT INTO sync_queue'),
      'coupons',
      'UPDATE',
      expect.any(String),
    );
  });

  test('should handle redeemCoupon sync error', async () => {
    const mockCoupon = { id: 'c1', profile_id: 'p1', bolt_cost: 10, is_redeemed: 0 };
    mockDb.getFirstAsync.mockResolvedValueOnce(mockCoupon);
    vi.mocked(supabase.from).mockReturnValueOnce({
      update: vi.fn(() => ({
        eq: vi.fn(() => Promise.resolve({ error: { message: 'Redeem Sync Error' } })),
      })),
    } as any);

    await couponService.redeemCoupon('c1');

    // Should update to pending
    expect(mockDb.runAsync).toHaveBeenCalledWith(
      expect.stringContaining("UPDATE coupons SET sync_status = 'pending'"),
      'c1',
    );
  });

  test('should handle redeemCoupon errors', async () => {
    // 1. Coupon not found
    mockDb.getFirstAsync.mockResolvedValueOnce(null);
    await expect(couponService.redeemCoupon('missing')).rejects.toThrow('Coupon not found');

    // 2. Already redeemed
    mockDb.getFirstAsync.mockResolvedValueOnce({ id: 'c1', is_redeemed: 1 });
    await expect(couponService.redeemCoupon('c1')).rejects.toThrow('Coupon already redeemed');

    // 3. Insufficient bolts
    mockDb.getFirstAsync.mockResolvedValueOnce({
      id: 'c1',
      is_redeemed: 0,
      profile_id: 'p1',
      bolt_cost: 500,
    });
    await expect(couponService.redeemCoupon('c1')).rejects.toThrow('Insufficient bolts');
  });

  test('should delete a coupon', async () => {
    const couponId = 'c1';
    await couponService.deleteCoupon(couponId);

    expect(mockDb.runAsync).toHaveBeenCalledWith(
      expect.stringContaining('DELETE FROM coupons'),
      couponId,
    );
  });

  test('should delete a coupon (offline)', async () => {
    vi.mocked(checkIsOnline).mockResolvedValueOnce(false);
    await couponService.deleteCoupon('c1');

    // Should add to sync_queue
    expect(mockDb.runAsync).toHaveBeenCalledWith(
      expect.stringContaining('INSERT INTO sync_queue'),
      'coupons',
      'DELETE',
      expect.any(String),
    );
  });

  test('should handle deleteCoupon sync error', async () => {
    vi.mocked(supabase.from).mockReturnValueOnce({
      delete: vi.fn(() => ({
        eq: vi.fn(() => Promise.resolve({ error: { message: 'Delete Error' } })),
      })),
    } as any);

    await couponService.deleteCoupon('c1');

    // Should add to sync_queue
    expect(mockDb.runAsync).toHaveBeenCalledWith(
      expect.stringContaining('INSERT INTO sync_queue'),
      'coupons',
      'DELETE',
      expect.any(String),
    );
  });

  test('should update a coupon', async () => {
    const couponId = 'c1';
    const updateData = { title: 'New Title' };
    await couponService.updateCoupon(couponId, updateData);

    expect(mockDb.runAsync).toHaveBeenCalledWith(
      expect.stringContaining('UPDATE coupons SET title = ?'),
      'New Title',
      'pending',
      expect.any(String),
      couponId,
    );
  });

  test('should update a coupon (offline)', async () => {
    vi.mocked(checkIsOnline).mockResolvedValueOnce(false);
    await couponService.updateCoupon('c1', { title: 'Offline' });

    // Should add to sync_queue
    expect(mockDb.runAsync).toHaveBeenCalledWith(
      expect.stringContaining('INSERT INTO sync_queue'),
      'coupons',
      'UPDATE',
      expect.any(String),
    );
  });

  test('should handle updateCoupon sync error', async () => {
    vi.mocked(supabase.from).mockReturnValueOnce({
      update: vi.fn(() => ({
        eq: vi.fn(() => Promise.resolve({ error: { message: 'Update Error' } })),
      })),
    } as any);

    await couponService.updateCoupon('c1', { title: 'New' });

    // Should add to sync_queue
    expect(mockDb.runAsync).toHaveBeenCalledWith(
      expect.stringContaining('INSERT INTO sync_queue'),
      'coupons',
      'UPDATE',
      expect.any(String),
    );
  });
});
