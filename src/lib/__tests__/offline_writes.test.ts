import { expect, test, vi, describe, beforeEach } from 'vitest';
import { profileService } from '../profile_service';
import { habitLogService } from '../habit_log_service';
import { couponService } from '../coupon_service';
import { checkIsOnline } from '../network';

// Mock Network
vi.mock('../network', () => ({
  checkIsOnline: vi.fn(),
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

describe('Offline Writes with Sync Markers', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(checkIsOnline).mockResolvedValue(false); // Default to offline
  });

  test('ProfileService.updateBoltBalance should set sync_status to pending when offline', async () => {
    mockDb.getFirstAsync.mockResolvedValueOnce({ id: 'p1', bolt_balance: 10, is_guest: 0 });

    await profileService.updateBoltBalance('p1', 5);

    // Check if runAsync was called with sync_status = 'pending'
    const updateCall = (mockDb.runAsync as any).mock.calls.find((call: any[]) =>
      call[0].includes('UPDATE profiles SET bolt_balance = ?'),
    );

    expect(updateCall).toBeDefined();
    expect(updateCall[0]).toContain('sync_status = ?');
    expect(updateCall.some((arg: any) => arg === 'pending')).toBe(true);
  });

  test('HabitLogService.logCompletion should set sync_status to pending when offline', async () => {
    await habitLogService.logCompletion({
      profile_id: 'p1',
      habit_id: 'h1',
      status: 'success',
      duration_seconds: 60,
      bolts_earned: 10,
    });

    const insertCall = (mockDb.runAsync as any).mock.calls.find((call: any[]) =>
      call[0].includes('INSERT INTO habits_log'),
    );

    expect(insertCall).toBeDefined();
    expect(insertCall[0]).toContain('sync_status');
    // Check if 'pending' is one of the arguments
    expect(insertCall.some((arg: any) => arg === 'pending')).toBe(true);
  });

  test('CouponService.redeemCoupon should set sync_status to pending when offline', async () => {
    mockDb.getFirstAsync.mockResolvedValueOnce({
      id: 'c1',
      profile_id: 'p1',
      bolt_cost: 10,
      is_redeemed: 0,
    });
    // Mock getProfile call inside redeemCoupon
    mockDb.getFirstAsync.mockResolvedValueOnce({ id: 'p1', bolt_balance: 100, is_guest: 0 });

    await couponService.redeemCoupon('c1');

    const updateCall = (mockDb.runAsync as any).mock.calls.find((call: any[]) =>
      call[0].includes('UPDATE coupons SET is_redeemed = 1'),
    );

    expect(updateCall).toBeDefined();
    expect(updateCall[0]).toContain('sync_status = ?');
    expect(updateCall.some((arg: any) => arg === 'pending')).toBe(true);
  });
});
