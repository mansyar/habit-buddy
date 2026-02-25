import { expect, test, vi, describe, beforeEach } from 'vitest';
import { profileService } from '../profile_service';
import { habitLogService } from '../habit_log_service';
import { syncService } from '../sync_service';
import { supabase } from '../supabase';
import { initializeSQLite } from '../sqlite';
import { checkIsOnline } from '../network';

// Mock Supabase client
vi.mock('../supabase', () => ({
  supabase: {
    from: vi.fn(() => ({
      select: vi.fn(() => ({
        eq: vi.fn(() => ({
          single: vi.fn(() => Promise.resolve({ data: null, error: null })),
        })),
      })),
      insert: vi.fn(() => ({
        select: vi.fn(() => ({
          single: vi.fn(() => Promise.resolve({ data: { id: 'remote-id' }, error: null })),
        })),
      })),
      upsert: vi.fn(() => ({
        select: vi.fn(() => ({
          single: vi.fn(() => Promise.resolve({ data: { id: 'remote-id' }, error: null })),
        })),
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

describe('Data Layer Integration', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test('full offline-to-online sync flow', async () => {
    // 1. Start Offline
    (checkIsOnline as any).mockResolvedValue(false);

    // 2. Perform actions while offline
    const profileData = { child_name: 'Offline Buddy' };
    const profile = await profileService.createProfile(profileData, null);

    expect(mockDb.runAsync).toHaveBeenCalledWith(
      expect.stringContaining('INSERT INTO profiles'),
      expect.any(String),
      null,
      'Offline Buddy',
      expect.anything(),
      expect.anything(),
      expect.anything(),
      1,
      expect.anything(),
      expect.anything(),
    );
    expect(supabase.from).not.toHaveBeenCalled();

    const logData = {
      profile_id: profile.id,
      habit_id: 'brush_teeth',
      status: 'success' as const,
      duration_seconds: 60,
      bolts_earned: 1,
    };
    await habitLogService.logCompletion(logData);

    // Verify sync_queue was populated
    expect(mockDb.runAsync).toHaveBeenCalledWith(
      expect.stringContaining('INSERT INTO sync_queue'),
      'habits_log',
      'INSERT',
      expect.stringContaining('brush_teeth'),
    );

    // 3. Go Online
    (checkIsOnline as any).mockResolvedValue(true);

    // 4. Trigger Sync
    const mockQueueItems = [
      {
        id: 1,
        table_name: 'habits_log',
        operation: 'INSERT',
        data: JSON.stringify({ ...logData, id: 'l1' }),
      },
    ];
    mockDb.getAllAsync.mockResolvedValueOnce(mockQueueItems);

    await syncService.processQueue();

    // 5. Verify Supabase was called during sync
    expect(supabase.from).toHaveBeenCalledWith('habits_log');
    expect(mockDb.runAsync).toHaveBeenCalledWith(
      expect.stringContaining('DELETE FROM sync_queue WHERE id = ?'),
      1,
    );
  });
});
