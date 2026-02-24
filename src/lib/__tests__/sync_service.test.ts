import { expect, test, vi, describe, beforeEach } from 'vitest';
import { syncService } from '../sync_service';
import { supabase } from '../supabase';
import { initializeSQLite } from '../sqlite';
import { checkIsOnline } from '../network';

// Mock Supabase client
vi.mock('../supabase', () => ({
  supabase: {
    from: vi.fn(() => ({
      insert: vi.fn(() => Promise.resolve({ error: null })),
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
    mockDb.getAllAsync.mockResolvedValueOnce(mockQueueItems);

    await syncService.processQueue();

    expect(supabase.from).toHaveBeenCalledWith('habits_log');
    expect(mockDb.runAsync).toHaveBeenCalledWith(
      expect.stringContaining('DELETE FROM sync_queue WHERE id = ?'),
      1,
    );
  });

  test('should not process queue when offline', async () => {
    (checkIsOnline as any).mockResolvedValueOnce(false);

    await syncService.processQueue();

    expect(supabase.from).not.toHaveBeenCalled();
    expect(mockDb.getAllAsync).not.toHaveBeenCalled();
  });
});
