import { expect, test, vi, describe, beforeEach } from 'vitest';
import { syncService } from '../sync_service';
import { supabase } from '../supabase';
import { checkIsOnline, networkService } from '../network';

// Mock Supabase
vi.mock('../supabase', () => {
  const mock: any = {
    from: vi.fn(() => mock),
    upsert: vi.fn(() => Promise.resolve({ error: null })),
    update: vi.fn(() => mock),
    delete: vi.fn(() => mock),
    eq: vi.fn(() => Promise.resolve({ error: null })),
    channel: vi.fn(() => mock),
    on: vi.fn(() => mock),
    subscribe: vi.fn(() => mock),
    removeChannel: vi.fn(),
  };
  return { supabase: mock };
});

// Mock Network
vi.mock('../network', () => ({
  checkIsOnline: vi.fn(() => Promise.resolve(true)),
  networkService: {
    setSyncError: vi.fn(),
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

describe('SyncService Logic (Retries & Backoff)', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.useFakeTimers();
  });

  test('should increment retry_count and set last_retry on Supabase failure', async () => {
    const pendingHabits = [
      { id: 'h1', status: 'success', sync_status: 'pending', retry_count: 0, last_retry: null },
    ];

    mockDb.getAllAsync
      .mockResolvedValueOnce([]) // profiles
      .mockResolvedValueOnce(pendingHabits) // habits_log
      .mockResolvedValueOnce([]); // coupons

    vi.mocked(supabase.upsert).mockResolvedValueOnce({
      error: { message: 'Network Timeout' },
    } as any);

    await (syncService as any).syncPendingChanges();

    expect(mockDb.runAsync).toHaveBeenCalledWith(
      expect.stringContaining(
        'UPDATE habits_log SET retry_count = retry_count + 1, last_retry = ? WHERE id = ?',
      ),
      expect.any(String),
      'h1',
    );
  });

  test('should skip sync if backoff delay has not passed', async () => {
    const lastRetry = new Date().toISOString();
    const pendingHabits = [
      {
        id: 'h2',
        status: 'success',
        sync_status: 'pending',
        retry_count: 1,
        last_retry: lastRetry,
      },
    ];

    mockDb.getAllAsync
      .mockResolvedValueOnce([]) // profiles
      .mockResolvedValueOnce(pendingHabits) // habits_log
      .mockResolvedValueOnce([]); // coupons

    await (syncService as any).syncPendingChanges();
    expect(supabase.from).not.toHaveBeenCalled();
  });

  test('should retry sync after backoff delay has passed', async () => {
    const now = Date.now();
    const lastRetry = new Date(now - 31000).toISOString();
    const pendingHabits = [
      {
        id: 'h3',
        status: 'success',
        sync_status: 'pending',
        retry_count: 1,
        last_retry: lastRetry,
      },
    ];

    mockDb.getAllAsync
      .mockResolvedValueOnce([]) // profiles
      .mockResolvedValueOnce(pendingHabits) // habits_log
      .mockResolvedValueOnce([]); // coupons

    vi.mocked(supabase.upsert).mockResolvedValueOnce({ error: null } as any);

    await (syncService as any).syncPendingChanges();
    expect(supabase.from).toHaveBeenCalledWith('habits_log');
    expect(supabase.upsert).toHaveBeenCalled();
  });

  test('should set sync error state in network service when max retries hit', async () => {
    mockDb.getFirstAsync.mockResolvedValueOnce({ id: 'f1' });
    await (syncService as any).checkSyncFailures();
    expect(networkService.setSyncError).toHaveBeenCalledWith(true);
  });

  test('should handle mapping for profiles and coupons', async () => {
    const pendingProfiles = [
      {
        id: 'p1',
        child_name: 'Buddy',
        is_guest: 1,
        sync_status: 'pending',
        retry_count: 0,
        last_retry: null,
      },
    ];
    const pendingCoupons = [
      {
        id: 'c1',
        title: 'Treat',
        is_redeemed: 1,
        sync_status: 'pending',
        retry_count: 0,
        last_retry: null,
      },
    ];

    mockDb.getAllAsync
      .mockResolvedValueOnce(pendingProfiles)
      .mockResolvedValueOnce([]) // habits_log
      .mockResolvedValueOnce(pendingCoupons);

    await (syncService as any).syncPendingChanges();

    // Check profile mapping (is_guest removed)
    expect(supabase.from).toHaveBeenCalledWith('profiles');
    expect(supabase.upsert).toHaveBeenCalledWith([expect.not.objectContaining({ is_guest: 1 })]);

    // Check coupon mapping (is_redeemed to boolean)
    expect(supabase.from).toHaveBeenCalledWith('coupons');
    expect(supabase.upsert).toHaveBeenCalledWith([expect.objectContaining({ is_redeemed: true })]);
  });

  test('processSyncQueue should handle malformed JSON', async () => {
    const queue = [
      {
        id: 1,
        table_name: 'profiles',
        operation: 'INSERT',
        data: '{ invalid json }',
        retry_count: 0,
        last_retry: null,
      },
    ];
    mockDb.getAllAsync.mockResolvedValueOnce(queue);

    await (syncService as any).processSyncQueue();

    expect(mockDb.runAsync).toHaveBeenCalledWith(
      expect.stringContaining("UPDATE sync_queue SET status = 'failed' WHERE id = ?"),
      1,
    );
  });

  test('processSyncQueue should handle UPDATE and DELETE operations', async () => {
    const queue = [
      {
        id: 1,
        table_name: 'profiles',
        operation: 'UPDATE',
        data: JSON.stringify({ id: 'p1', name: 'New' }),
        retry_count: 0,
        last_retry: null,
      },
      {
        id: 2,
        table_name: 'profiles',
        operation: 'DELETE',
        data: JSON.stringify({ id: 'p2' }),
        retry_count: 0,
        last_retry: null,
      },
    ];
    mockDb.getAllAsync.mockResolvedValueOnce(queue);

    await (syncService as any).processSyncQueue();

    expect(supabase.update).toHaveBeenCalled();
    expect(supabase.delete).toHaveBeenCalled();
    // Verify deletion from queue on success
    expect(mockDb.runAsync).toHaveBeenCalledWith('DELETE FROM sync_queue WHERE id = ?', 1);
    expect(mockDb.runAsync).toHaveBeenCalledWith('DELETE FROM sync_queue WHERE id = ?', 2);
  });

  test('subscribeToAllChanges should setup channel and handles callbacks', async () => {
    const unsubscribe = await syncService.subscribeToAllChanges();

    expect(supabase.channel).toHaveBeenCalledWith('schema-db-changes');
    expect(supabase.on).toHaveBeenCalledWith(
      'postgres_changes',
      expect.any(Object),
      expect.any(Function),
    );

    // Trigger callback
    const callback = (supabase.on as any).mock.calls[0][2];

    // Test INSERT for profiles
    await callback({
      table: 'profiles',
      eventType: 'INSERT',
      new: {
        id: 'p1',
        user_id: 'u1',
        child_name: 'Buddy',
        avatar_id: 'a1',
        selected_buddy: 'b1',
        bolt_balance: 10,
        created_at: '2023-01-01',
        updated_at: '2023-01-01',
      },
    });
    expect(mockDb.runAsync).toHaveBeenCalledWith(
      expect.stringContaining('INSERT OR REPLACE INTO profiles'),
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
      expect.anything(),
    );

    // Test UPDATE for habits_log
    await callback({
      table: 'habits_log',
      eventType: 'UPDATE',
      new: {
        id: 'h1',
        profile_id: 'p1',
        habit_id: 'brush',
        status: 'success',
        duration_seconds: 60,
        bolts_earned: 5,
        completed_at: '2023-01-01',
      },
    });
    expect(mockDb.runAsync).toHaveBeenCalledWith(
      expect.stringContaining('INSERT OR REPLACE INTO habits_log'),
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

    // Test DELETE
    await callback({
      table: 'profiles',
      eventType: 'DELETE',
      old: { id: 'p1' },
    });
    expect(mockDb.runAsync).toHaveBeenCalledWith('DELETE FROM profiles WHERE id = ?', 'p1');

    unsubscribe();
    expect(supabase.removeChannel).toHaveBeenCalled();
  });
});
