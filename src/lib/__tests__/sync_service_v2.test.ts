import { expect, test, vi, describe, beforeEach } from 'vitest';
import { syncService } from '../sync_service';
import { supabase } from '../supabase';

// Mock Supabase
vi.mock('../supabase', () => {
  const mock: any = {
    from: vi.fn(() => mock),
    select: vi.fn(() => mock),
    upsert: vi.fn(() => mock),
    eq: vi.fn(() => mock),
    maybeSingle: vi.fn(() => Promise.resolve({ data: null, error: null })),
  };
  return { supabase: mock };
});

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

describe('SyncService v2 (Sync Markers)', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test('syncPendingChanges should fetch and push pending profiles', async () => {
    const pendingProfiles = [
      { id: 'p1', child_name: 'Buddy', bolt_balance: 15, sync_status: 'pending' },
    ];

    // First call for profiles, then habits_log, then coupons
    mockDb.getAllAsync
      .mockResolvedValueOnce(pendingProfiles) // profiles
      .mockResolvedValueOnce([]) // habits_log
      .mockResolvedValueOnce([]); // coupons

    (supabase.upsert as any).mockResolvedValueOnce({ error: null });

    await (syncService as any).syncPendingChanges();

    expect(mockDb.getAllAsync).toHaveBeenCalledWith(
      expect.stringContaining("SELECT * FROM profiles WHERE sync_status = 'pending'"),
      3, // MAX_RETRIES
    );
    expect(supabase.from).toHaveBeenCalledWith('profiles');
    expect(supabase.upsert).toHaveBeenCalledWith(
      expect.arrayContaining([expect.objectContaining({ id: 'p1' })]),
    );

    // Should mark as synced and reset retry_count
    expect(mockDb.runAsync).toHaveBeenCalledWith(
      expect.stringContaining(
        "UPDATE profiles SET sync_status = 'synced', retry_count = 0, last_retry = NULL WHERE id = ?",
      ),
      'p1',
    );
  });

  test('syncPendingChanges should handle Supabase errors gracefully', async () => {
    const pendingHabits = [{ id: 'h1', status: 'success', sync_status: 'pending' }];

    mockDb.getAllAsync
      .mockResolvedValueOnce([]) // profiles
      .mockResolvedValueOnce(pendingHabits) // habits_log
      .mockResolvedValueOnce([]); // coupons

    (supabase.upsert as any).mockResolvedValueOnce({
      error: { message: 'Supabase Error' },
    });

    await (syncService as any).syncPendingChanges();

    // Should NOT mark as synced if failed
    const markSyncedCall = (mockDb.runAsync as any).mock.calls.find((call: any[]) =>
      call[0].includes("SET sync_status = 'synced'"),
    );
    expect(markSyncedCall).toBeUndefined();
  });
});
