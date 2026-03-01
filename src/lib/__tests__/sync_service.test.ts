import { expect, test, vi, describe, beforeEach } from 'vitest';
import { syncService } from '../sync_service';
import { supabase } from '../supabase';
import { checkIsOnline } from '../network';

// Mock Supabase client
vi.mock('../supabase', () => ({
  supabase: {
    from: vi.fn(() => ({
      insert: vi.fn(() => Promise.resolve({ error: null })),
      update: vi.fn(() => ({
        eq: vi.fn(() => Promise.resolve({ error: null })),
      })),
      upsert: vi.fn(() => Promise.resolve({ error: null })),
      delete: vi.fn(() => ({
        eq: vi.fn(() => Promise.resolve({ error: null })),
      })),
    })),
    channel: vi.fn(),
    removeChannel: vi.fn(),
  },
  withTimeout: vi.fn((promise) => promise),
}));

// Mock Network
vi.mock('../network', () => ({
  checkIsOnline: vi.fn(() => Promise.resolve(true)),
  networkService: {
    setSyncError: vi.fn(),
    getHasSyncError: vi.fn(() => false),
    subscribeToSyncError: vi.fn(() => () => {}),
  },
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

describe('SyncService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test('should process sync queue items', async () => {
    const mockQueueItems = [
      {
        id: 1,
        table_name: 'habits_log',
        operation: 'INSERT',
        data: JSON.stringify({ id: 'l1', habit_id: 'brush_teeth' }),
      },
    ];

    // syncPendingChanges is called first (3 tables)
    mockDb.getAllAsync
      .mockResolvedValueOnce([]) // profiles
      .mockResolvedValueOnce([]) // habits_log
      .mockResolvedValueOnce([]) // coupons
      .mockResolvedValueOnce(mockQueueItems); // sync_queue

    await syncService.processQueue();

    expect(supabase.from).toHaveBeenCalledWith('habits_log');
    expect(mockDb.runAsync).toHaveBeenCalledWith(
      expect.stringContaining('DELETE FROM sync_queue WHERE id = ?'),
      1,
    );
  });

  test('should handle malformed JSON in sync queue', async () => {
    const mockQueueItems = [
      {
        id: 1,
        table_name: 'profiles',
        operation: 'UPSERT',
        data: 'invalid json',
      },
    ];

    mockDb.getAllAsync
      .mockResolvedValueOnce([]) // profiles
      .mockResolvedValueOnce([]) // habits_log
      .mockResolvedValueOnce([]) // coupons
      .mockResolvedValueOnce(mockQueueItems); // sync_queue

    await syncService.processQueue();

    expect(mockDb.runAsync).toHaveBeenCalledWith(
      expect.stringContaining("UPDATE sync_queue SET status = 'failed'"),
      1,
    );
  });

  test('should respect backoff logic', async () => {
    const lastRetry = new Date(Date.now() - 5000).toISOString(); // 5 seconds ago
    const mockPendingProfiles = [
      { id: 'p1', child_name: 'Backoff Buddy', retry_count: 1, last_retry: lastRetry },
    ];

    mockDb.getAllAsync
      .mockResolvedValueOnce(mockPendingProfiles) // profiles
      .mockResolvedValueOnce([]) // habits_log
      .mockResolvedValueOnce([]) // coupons
      .mockResolvedValueOnce([]); // sync_queue

    await syncService.processQueue();

    // Since BASE_RETRY_DELAY is 30s, 5s is too early.
    // upsert should NOT be called.
    expect(supabase.from).not.toHaveBeenCalled();
  });

  test('should process UPDATE and DELETE in sync queue', async () => {
    const mockQueueItems = [
      {
        id: 1,
        table_name: 'profiles',
        operation: 'UPDATE',
        data: JSON.stringify({ id: 'p1', child_name: 'Updated Name' }),
      },
      {
        id: 2,
        table_name: 'coupons',
        operation: 'DELETE',
        data: JSON.stringify({ id: 'c1' }),
      },
    ];

    mockDb.getAllAsync
      .mockResolvedValueOnce([]) // profiles
      .mockResolvedValueOnce([]) // habits_log
      .mockResolvedValueOnce([]) // coupons
      .mockResolvedValueOnce(mockQueueItems); // sync_queue

    await syncService.processQueue();

    expect(supabase.from).toHaveBeenCalledWith('profiles');
    expect(supabase.from).toHaveBeenCalledWith('coupons');
    expect(mockDb.runAsync).toHaveBeenCalledWith(
      expect.stringContaining('DELETE FROM sync_queue WHERE id = ?'),
      1,
    );
    expect(mockDb.runAsync).toHaveBeenCalledWith(
      expect.stringContaining('DELETE FROM sync_queue WHERE id = ?'),
      2,
    );
  });

  test('should unsubscribe from realtime changes', async () => {
    const channelMock: any = {
      on: vi.fn().mockReturnThis(),
      subscribe: vi.fn(() => channelMock),
    };
    (supabase.channel as any).mockReturnValue(channelMock);

    const unsubscribe = await syncService.subscribeToAllChanges();
    unsubscribe();

    expect(supabase.removeChannel).toHaveBeenCalledWith(channelMock);
  });

  test('should handle sync failures and increment retry count', async () => {
    const mockPendingProfiles = [
      { id: 'p1', child_name: 'Fail Buddy', retry_count: 0, last_retry: null },
    ];

    vi.mocked(supabase.from).mockReturnValueOnce({
      upsert: vi.fn(() => Promise.resolve({ error: { message: 'Sync Error' } })),
    } as any);

    mockDb.getAllAsync
      .mockResolvedValueOnce(mockPendingProfiles) // profiles
      .mockResolvedValueOnce([]) // habits_log
      .mockResolvedValueOnce([]) // coupons
      .mockResolvedValueOnce([]); // sync_queue

    await syncService.processQueue();

    expect(mockDb.runAsync).toHaveBeenCalledWith(
      expect.stringContaining('UPDATE profiles SET retry_count = retry_count + 1'),
      expect.any(String),
      'p1',
    );
  });

  test('should sync pending coupons', async () => {
    const mockPendingCoupons = [
      { id: 'c1', title: 'Pending Coupon', is_redeemed: 1, retry_count: 0, last_retry: null },
    ];

    mockDb.getAllAsync
      .mockResolvedValueOnce([]) // profiles
      .mockResolvedValueOnce([]) // habits_log
      .mockResolvedValueOnce(mockPendingCoupons) // coupons
      .mockResolvedValueOnce([]); // sync_queue

    await syncService.processQueue();

    expect(supabase.from).toHaveBeenCalledWith('coupons');
    expect(mockDb.runAsync).toHaveBeenCalledWith(
      expect.stringContaining("UPDATE coupons SET sync_status = 'synced'"),
      'c1',
    );
  });

  test('should sync pending habits_log', async () => {
    const mockPendingHabits = [
      { id: 'l1', habit_id: 'brush_teeth', status: 'success', retry_count: 0, last_retry: null },
    ];

    mockDb.getAllAsync
      .mockResolvedValueOnce([]) // profiles
      .mockResolvedValueOnce(mockPendingHabits) // habits_log
      .mockResolvedValueOnce([]) // coupons
      .mockResolvedValueOnce([]); // sync_queue

    await syncService.processQueue();

    expect(supabase.from).toHaveBeenCalledWith('habits_log');
    expect(mockDb.runAsync).toHaveBeenCalledWith(
      expect.stringContaining("UPDATE habits_log SET sync_status = 'synced'"),
      'l1',
    );
  });

  test('should set sync error when max retries exceeded', async () => {
    mockDb.getFirstAsync.mockResolvedValueOnce({ id: 'p1' }); // Found a failed record

    // We can call private method checkSyncFailures indirectly by running processQueue
    mockDb.getAllAsync.mockResolvedValue([]); // No pending items

    await syncService.processQueue();

    // @ts-ignore
    const { networkService } = await import('../network');
    expect(networkService.setSyncError).toHaveBeenCalledWith(true);
  });

  describe('Realtime Subscription', () => {
    test('should handle realtime INSERT/UPDATE for profiles', async () => {
      let callback: (payload: any) => void = () => {};
      const channelMock = {
        on: vi.fn((event, filter, cb) => {
          callback = cb;
          return channelMock;
        }),
        subscribe: vi.fn(),
      };
      (supabase.channel as any).mockReturnValue(channelMock);

      await syncService.subscribeToAllChanges();

      const payload = {
        table: 'profiles',
        eventType: 'INSERT',
        new: {
          id: 'r1',
          user_id: 'u1',
          child_name: 'Real Buddy',
          avatar_id: 'dog',
          selected_buddy: 'dino',
          bolt_balance: 10,
          created_at: '2023-01-01',
          updated_at: '2023-01-01',
        },
      };

      await callback(payload);

      expect(mockDb.runAsync).toHaveBeenCalledWith(
        expect.stringContaining('INSERT OR REPLACE INTO profiles'),
        'r1',
        'u1',
        'Real Buddy',
        'dog',
        'dino',
        10,
        0,
        'synced',
        0,
        expect.any(String),
        '2023-01-01',
        '2023-01-01',
      );
    });

    test('should handle realtime INSERT/UPDATE for habits_log', async () => {
      let callback: (payload: any) => void = () => {};
      const channelMock = {
        on: vi.fn((event, filter, cb) => {
          callback = cb;
          return channelMock;
        }),
        subscribe: vi.fn(),
      };
      (supabase.channel as any).mockReturnValue(channelMock);

      await syncService.subscribeToAllChanges();

      const payload = {
        table: 'habits_log',
        eventType: 'INSERT',
        new: {
          id: 'l1',
          profile_id: 'p1',
          habit_id: 'h1',
          status: 'success',
          duration_seconds: 60,
          bolts_earned: 5,
          completed_at: '2023-01-01',
        },
      };

      await callback(payload);

      expect(mockDb.runAsync).toHaveBeenCalledWith(
        expect.stringContaining('INSERT OR REPLACE INTO habits_log'),
        'l1',
        'p1',
        'h1',
        'success',
        60,
        5,
        'synced',
        0,
        expect.any(String),
        '2023-01-01',
      );
    });

    test('should handle realtime INSERT/UPDATE for coupons', async () => {
      let callback: (payload: any) => void = () => {};
      const channelMock = {
        on: vi.fn((event, filter, cb) => {
          callback = cb;
          return channelMock;
        }),
        subscribe: vi.fn(),
      };
      (supabase.channel as any).mockReturnValue(channelMock);

      await syncService.subscribeToAllChanges();

      const payload = {
        table: 'coupons',
        eventType: 'UPDATE',
        new: {
          id: 'c1',
          profile_id: 'p1',
          title: 'Remote Coupon',
          bolt_cost: 20,
          category: 'Physical',
          is_redeemed: true,
          created_at: '2023-01-01',
        },
      };

      await callback(payload);

      expect(mockDb.runAsync).toHaveBeenCalledWith(
        expect.stringContaining('INSERT OR REPLACE INTO coupons'),
        'c1',
        'p1',
        'Remote Coupon',
        20,
        'Physical',
        1,
        'synced',
        0,
        expect.any(String),
        '2023-01-01',
      );
    });

    test('should handle realtime DELETE', async () => {
      let callback: (payload: any) => void = () => {};
      const channelMock = {
        on: vi.fn((event, filter, cb) => {
          callback = cb;
          return channelMock;
        }),
        subscribe: vi.fn(),
      };
      (supabase.channel as any).mockReturnValue(channelMock);

      await syncService.subscribeToAllChanges();

      const payload = {
        table: 'habits_log',
        eventType: 'DELETE',
        old: { id: 'l1' },
      };

      await callback(payload);

      expect(mockDb.runAsync).toHaveBeenCalledWith(
        expect.stringContaining('DELETE FROM habits_log WHERE id = ?'),
        'l1',
      );
    });
  });
});
