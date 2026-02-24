import { expect, test, vi, describe, beforeEach } from 'vitest';
import { habitLogService } from '../habit_log_service';
import { supabase } from '../supabase';
import { initializeSQLite } from '../sqlite';
import { checkIsOnline } from '../network';

// Mock Supabase client
vi.mock('../supabase', () => ({
  supabase: {
    from: vi.fn(() => ({
      select: vi.fn(() => ({
        eq: vi.fn(() => ({
          gte: vi.fn(() => Promise.resolve({ data: [], error: null })),
        })),
      })),
      insert: vi.fn(() => ({
        select: vi.fn(() => ({
          single: vi.fn(() => Promise.resolve({ data: { id: 'log-123' }, error: null })),
        })),
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
  execSync: vi.fn(),
  runSync: vi.fn(),
  getFirstSync: vi.fn(),
  getAllSync: vi.fn(() => []),
};

vi.mock('../sqlite', () => ({
  initializeSQLite: vi.fn(() => Promise.resolve(mockDb)),
}));

describe('HabitLogService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('logCompletion', () => {
    test('should save habit log to SQLite and Supabase when online', async () => {
      const logData = {
        profile_id: 'p1',
        habit_id: 'brush_teeth',
        status: 'success' as const,
        duration_seconds: 120,
        bolts_earned: 1,
      };

      const log = await habitLogService.logCompletion(logData);

      expect(mockDb.runSync).toHaveBeenCalledWith(
        expect.stringContaining('INSERT INTO habits_log'),
        expect.any(String),
        logData.profile_id,
        logData.habit_id,
        logData.status,
        logData.duration_seconds,
        logData.bolts_earned,
        expect.any(String),
      );
      expect(supabase.from).toHaveBeenCalledWith('habits_log');
      expect(log.habit_id).toBe('brush_teeth');
    });

    test('should save to SQLite only when offline', async () => {
      (checkIsOnline as any).mockResolvedValueOnce(false);

      const logData = {
        profile_id: 'p1',
        habit_id: 'brush_teeth',
        status: 'success' as const,
        duration_seconds: 120,
        bolts_earned: 1,
      };

      await habitLogService.logCompletion(logData);

      expect(mockDb.runSync).toHaveBeenCalled();
      expect(supabase.from).not.toHaveBeenCalled();
    });
  });

  describe('getTodaysLogs', () => {
    test('should fetch logs from SQLite', async () => {
      const mockLogs = [{ id: '1', habit_id: 'brush_teeth', status: 'success' }];
      mockDb.getAllSync.mockReturnValueOnce(mockLogs);

      const logs = await habitLogService.getTodaysLogs('p1');

      expect(logs).toEqual(mockLogs);
      expect(mockDb.getAllSync).toHaveBeenCalledWith(
        expect.stringContaining('SELECT * FROM habits_log WHERE profile_id = ?'),
        'p1',
        expect.any(String),
      );
    });
  });
});
