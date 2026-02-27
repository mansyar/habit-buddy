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
      update: vi.fn(() => ({
        eq: vi.fn(() => Promise.resolve({ error: null })),
      })),
      delete: vi.fn(() => ({
        eq: vi.fn(() => ({
          gte: vi.fn(() => Promise.resolve({ error: null })),
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
  execAsync: vi.fn(async () => {}),
  runAsync: vi.fn(async () => {}),
  getFirstAsync: vi.fn(async () => null),
  getAllAsync: vi.fn(async () => []),
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

      expect(mockDb.runAsync).toHaveBeenCalledWith(
        expect.stringContaining('INSERT INTO habits_log'),
        expect.any(String), // id
        logData.profile_id,
        logData.habit_id,
        logData.status,
        logData.duration_seconds,
        logData.bolts_earned,
        'synced', // sync_status
        expect.any(String), // last_modified
        expect.any(String), // completed_at
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

      expect(mockDb.runAsync).toHaveBeenCalled();
      expect(supabase.from).not.toHaveBeenCalled();
    });
  });

  describe('getTodaysLogs', () => {
    test('should fetch logs from SQLite', async () => {
      const mockLogs = [{ id: '1', habit_id: 'brush_teeth', status: 'success' }];
      mockDb.getAllAsync.mockResolvedValueOnce(mockLogs);

      const logs = await habitLogService.getTodaysLogs('p1');

      expect(logs).toEqual(mockLogs);
      expect(mockDb.getAllAsync).toHaveBeenCalledWith(
        expect.stringContaining('SELECT * FROM habits_log WHERE profile_id = ?'),
        'p1',
        expect.any(String),
      );
    });
  });

  describe('logMissionResult', () => {
    test('should log completion and update balance', async () => {
      const data = {
        profile_id: 'p1',
        habit_id: 'brush_teeth',
        status: 'success' as const,
        duration_seconds: 120,
        bolts_earned: 1,
      };

      // Mock for getProfile inside updateBoltBalance
      mockDb.getFirstAsync.mockResolvedValueOnce({ id: 'p1', bolt_balance: 5, is_guest: 0 });

      const result = await habitLogService.logMissionResult(data);

      expect(result.log).toBeDefined();
      expect(result.profile?.bolt_balance).toBe(6);
      expect(mockDb.runAsync).toHaveBeenCalledWith(
        expect.stringContaining('UPDATE profiles SET bolt_balance = ?'),
        6, // newBalance
        'synced', // syncStatus
        expect.any(String), // lastModified
        expect.any(String), // updatedAt
        'p1', // profileId
      );
    });
  });

  describe('resetTodayProgress', () => {
    test("should delete today's logs for the profile", async () => {
      await habitLogService.resetTodayProgress('p1');

      expect(mockDb.runAsync).toHaveBeenCalledWith(
        expect.stringContaining(
          'DELETE FROM habits_log WHERE profile_id = ? AND date(completed_at) = date(?)',
        ),
        'p1',
        expect.any(String),
      );

      // Also check if it tries to sync with Supabase (optional, but good if we want consistency)
      expect(supabase.from).toHaveBeenCalledWith('habits_log');
    });
  });
});
