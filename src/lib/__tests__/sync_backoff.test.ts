import { vi, describe, it, expect, beforeEach, afterEach } from 'vitest';
import { syncService } from '../sync_service';
import { supabase } from '../supabase';
import { initializeSQLite } from '../sqlite';
import { checkIsOnline } from '../network';

vi.mock('../supabase', () => ({
  supabase: {
    from: vi.fn(() => ({
      upsert: vi.fn(() => Promise.resolve({ error: new Error('Network Error') })),
    })),
  },
}));

vi.mock('../network', () => ({
  checkIsOnline: vi.fn(() => Promise.resolve(true)),
}));

describe('Sync Backoff', () => {
  beforeEach(async () => {
    vi.clearAllMocks();
    vi.useFakeTimers();
    const db = await initializeSQLite();
    await db.execAsync('DELETE FROM profiles; DELETE FROM sync_queue;');
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('respects exponential backoff delay', async () => {
    const db = await initializeSQLite();

    // 1. Set current time to a fixed point
    const now = new Date('2026-02-28T12:00:00Z').getTime();
    vi.setSystemTime(now);

    const lastRetry = new Date(now - 10000).toISOString();
    const mockProfile = {
      id: 'p1',
      child_name: 'Backoff Buddy',
      sync_status: 'pending',
      retry_count: 1,
      last_retry: lastRetry,
    };

    // 2. Setup mock DB returns
    vi.mocked(db.getAllAsync).mockImplementation(async (query: string) => {
      if (query.includes('FROM profiles')) return [mockProfile];
      return [];
    });

    // 3. Run sync. Delay for retry_count=1 is 30s. 10s passed < 30s.
    await syncService.processQueue();
    expect(supabase.from).not.toHaveBeenCalled();

    // 4. Move clock forward by 25s (total 35s since last retry)
    vi.setSystemTime(now + 25000);

    // 5. Run sync again.
    await syncService.processQueue();
    expect(supabase.from).toHaveBeenCalledWith('profiles');
  });
});
