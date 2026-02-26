import { expect, test, vi, describe, beforeEach } from 'vitest';
import { syncService } from '../sync_service';
import { supabase } from '../supabase';
import { initializeSQLite } from '../sqlite';
import { checkIsOnline } from '../network';

// Mock Supabase
vi.mock('../supabase', () => {
  const mock: any = {
    from: vi.fn(() => mock),
    select: vi.fn(() => mock),
    upsert: vi.fn(() => mock),
    eq: vi.fn(() => mock),
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

describe('Sync Retry Logic', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test('should increment retry_count on failure', async () => {
    const pendingProfiles = [
      { id: 'p1', child_name: 'Buddy', sync_status: 'pending', retry_count: 0 },
    ];

    mockDb.getAllAsync
      .mockResolvedValueOnce(pendingProfiles) // for syncPendingChanges
      .mockResolvedValueOnce([]); // for processSyncQueue

    // Simulate failure
    (supabase.upsert as any).mockResolvedValueOnce({ error: { message: 'Network Timeout' } });

    await syncService.processQueue();

    expect(mockDb.runAsync).toHaveBeenCalledWith(
      expect.stringContaining('UPDATE profiles SET retry_count = retry_count + 1 WHERE id = ?'),
      'p1',
    );
  });

  test('should not attempt sync if retry_count >= 3', async () => {
    // getAllAsync should be called with retry_count < 3
    await syncService.syncPendingChanges();

    expect(mockDb.getAllAsync).toHaveBeenCalledWith(expect.stringContaining('retry_count < ?'), 3);
  });
});
