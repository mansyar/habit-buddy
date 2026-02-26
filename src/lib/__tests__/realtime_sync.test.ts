import { expect, test, vi, describe, beforeEach } from 'vitest';
import { syncService } from '../sync_service';
import { supabase } from '../supabase';
import { initializeSQLite } from '../sqlite';

// Mock Supabase with Realtime
vi.mock('../supabase', () => {
  let channelCallback: (payload: any) => void = () => {};
  const mock: any = {
    channel: vi.fn(() => ({
      on: vi.fn((event, filter, cb) => {
        channelCallback = cb;
        return mock.channel();
      }),
      subscribe: vi.fn(),
    })),
    from: vi.fn(() => mock),
    select: vi.fn(() => mock),
    upsert: vi.fn(() => mock),
    eq: vi.fn(() => mock),
    removeChannel: vi.fn(),
    _triggerRealtime: (payload: any) => channelCallback(payload),
  };
  return { supabase: mock };
});

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

describe('Realtime Sync', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test('should subscribe to changes and update local SQLite', async () => {
    // Start subscriptions
    await syncService.subscribeToAllChanges();

    expect(supabase.channel).toHaveBeenCalled();

    // Simulate remote update from Supabase Realtime
    const payload = {
      table: 'profiles',
      eventType: 'UPDATE',
      new: {
        id: 'p1',
        child_name: 'Remote Buddy',
        bolt_balance: 100,
        updated_at: new Date().toISOString(),
      },
    };

    await (supabase as any)._triggerRealtime(payload);

    expect(mockDb.runAsync).toHaveBeenCalled();
    const call = vi.mocked(mockDb.runAsync).mock.calls[0];
    expect(call[0]).toContain('INSERT OR REPLACE INTO profiles');
    expect(call[1]).toBe('p1');
    expect(call[3]).toBe('Remote Buddy');
    expect(call[6]).toBe(100);
  });
});
