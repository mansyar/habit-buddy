import { vi, describe, it, expect, beforeEach } from 'vitest';
import { profileService } from '../profile_service';
import { habitLogService } from '../habit_log_service';
import { couponService } from '../coupon_service';
import { supabase } from '../supabase';
import { initializeSQLite } from '../sqlite';
import { checkIsOnline } from '../network';

vi.mock('../supabase', async (importOriginal) => {
  const actual = (await importOriginal()) as any;
  return {
    ...actual,
    supabase: {
      from: vi.fn(() => ({
        upsert: vi.fn(() => ({
          select: vi.fn(() => ({
            maybeSingle: vi.fn(() => Promise.reject(new Error('Supabase Error'))),
          })),
        })),
        insert: vi.fn(() => ({
          select: vi.fn(() => ({
            single: vi.fn(() => Promise.reject(new Error('Supabase Error'))),
          })),
        })),
        update: vi.fn(() => ({
          eq: vi.fn(() => Promise.reject(new Error('Supabase Error'))),
        })),
        delete: vi.fn(() => ({
          eq: vi.fn(() => ({
            gte: vi.fn(() => Promise.reject(new Error('Supabase Error'))),
          })),
        })),
        select: vi.fn(() => ({
          eq: vi.fn(() => Promise.reject(new Error('Supabase Error'))),
          or: vi.fn(() => ({
            maybeSingle: vi.fn(() => Promise.reject(new Error('Supabase Error'))),
          })),
        })),
      })),
    },
  };
});

vi.mock('../network', () => ({
  checkIsOnline: vi.fn(() => Promise.resolve(true)),
}));

describe('Service Fallbacks', () => {
  beforeEach(async () => {
    vi.clearAllMocks();
    const db = await initializeSQLite();
    await db.execAsync(
      'DELETE FROM profiles; DELETE FROM habits_log; DELETE FROM coupons; DELETE FROM sync_queue;',
    );
  });

  it('ProfileService.createProfile falls back to SQLite on Supabase error', async () => {
    const db = await initializeSQLite();
    vi.spyOn(db, 'runAsync');

    const profile = await profileService.createProfile({ child_name: 'Fallback Rex' }, 'user123');

    expect(profile.child_name).toBe('Fallback Rex');
    expect(profile.sync_status).toBe('pending');

    // Should have inserted into profiles
    expect(db.runAsync).toHaveBeenCalledWith(
      expect.stringContaining('INSERT INTO profiles'),
      expect.anything(),
      expect.anything(),
      expect.anything(),
      expect.anything(),
      expect.anything(),
      expect.anything(),
      expect.anything(),
      expect.anything(),
      expect.anything(),
      expect.anything(),
      expect.anything(),
    );

    // Should have updated to pending on error
    expect(db.runAsync).toHaveBeenCalledWith(
      expect.stringContaining("UPDATE profiles SET sync_status = 'pending'"),
      expect.anything(),
      profile.id,
    );

    // Should have inserted into sync_queue
    expect(db.runAsync).toHaveBeenCalledWith(
      expect.stringContaining('INSERT INTO sync_queue'),
      'profiles',
      'UPSERT',
      expect.stringContaining('Fallback Rex'),
    );
  });

  it('HabitLogService.logCompletion falls back to SQLite on Supabase error', async () => {
    const db = await initializeSQLite();
    vi.spyOn(db, 'runAsync');

    const log = await habitLogService.logCompletion({
      profile_id: 'p1',
      habit_id: 'h1',
      status: 'success',
      duration_seconds: 60,
      bolts_earned: 5,
    });

    expect(log.sync_status).toBe('pending');

    // Should have inserted into habits_log
    expect(db.runAsync).toHaveBeenCalledWith(
      expect.stringContaining('INSERT INTO habits_log'),
      expect.anything(),
      expect.anything(),
      expect.anything(),
      expect.anything(),
      expect.anything(),
      expect.anything(),
      expect.anything(),
      expect.anything(),
      expect.anything(),
    );

    // Should have updated to pending on error
    expect(db.runAsync).toHaveBeenCalledWith(
      expect.stringContaining("UPDATE habits_log SET sync_status = 'pending'"),
      log.id,
    );

    // Should have inserted into sync_queue
    expect(db.runAsync).toHaveBeenCalledWith(
      expect.stringContaining('INSERT INTO sync_queue'),
      'habits_log',
      'INSERT',
      expect.stringContaining('h1'),
    );
  });

  it('CouponService.createCoupon falls back to SQLite on Supabase error', async () => {
    const db = await initializeSQLite();
    vi.spyOn(db, 'runAsync');

    const coupon = await couponService.createCoupon({
      profile_id: 'p1',
      title: 'Fallback Reward',
      bolt_cost: 10,
    });

    expect(coupon.sync_status).toBe('pending');

    // Should have inserted into coupons
    expect(db.runAsync).toHaveBeenCalledWith(
      expect.stringContaining('INSERT INTO coupons'),
      expect.anything(),
      expect.anything(),
      expect.anything(),
      expect.anything(),
      expect.anything(),
      expect.anything(),
      expect.anything(),
      expect.anything(),
      expect.anything(),
    );

    // Should have updated to pending on error
    expect(db.runAsync).toHaveBeenCalledWith(
      expect.stringContaining("UPDATE coupons SET sync_status = 'pending'"),
      coupon.id,
    );

    // Should have inserted into sync_queue
    expect(db.runAsync).toHaveBeenCalledWith(
      expect.stringContaining('INSERT INTO sync_queue'),
      'coupons',
      'INSERT',
      expect.stringContaining('Fallback Reward'),
    );
  });

  it('services handle network timeout gracefully', async () => {
    vi.useFakeTimers();
    // Mock Supabase to never resolve (simulating hang/timeout)
    (supabase.from as any).mockReturnValue({
      insert: vi.fn(() => ({
        select: vi.fn(() => ({
          single: vi.fn(() => new Promise(() => {})), // never resolves
        })),
      })),
    });

    const db = await initializeSQLite();
    vi.spyOn(db, 'runAsync');

    // Trigger the service call
    const logPromise = habitLogService.logCompletion({
      profile_id: 'p1',
      habit_id: 'h1',
      status: 'success',
      duration_seconds: 60,
      bolts_earned: 5,
    });

    // Advance timers by 11 seconds
    await vi.advanceTimersByTimeAsync(11000);

    const log = await logPromise;

    expect(log.sync_status).toBe('pending');
    expect(db.runAsync).toHaveBeenCalledWith(
      expect.stringContaining("UPDATE habits_log SET sync_status = 'pending'"),
      log.id,
    );

    vi.useRealTimers();
  });
});
