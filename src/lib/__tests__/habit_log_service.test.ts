import { expect, test, vi, describe, beforeEach } from 'vitest';
import { habitLogService } from '../habit_log_service';
import { supabase } from '../supabase';
import { checkIsOnline } from '../network';

vi.mock('../supabase', () => {
  const mockSupabase = {
    from: vi.fn(() => mockSupabase),
    select: vi.fn(() => mockSupabase),
    insert: vi.fn(() => mockSupabase),
    update: vi.fn(() => mockSupabase),
    delete: vi.fn(() => mockSupabase),
    eq: vi.fn(() => mockSupabase),
    gte: vi.fn(() => mockSupabase),
    or: vi.fn(() => mockSupabase),
    single: vi.fn(() => Promise.resolve({ data: { id: 'log-123' }, error: null })),
    maybeSingle: vi.fn(() => Promise.resolve({ data: null, error: null })),
  };
  return {
    withTimeout: vi.fn((promise) => promise),
    supabase: mockSupabase,
  };
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
        expect.any(String),
        logData.profile_id,
        logData.habit_id,
        logData.status,
        logData.duration_seconds,
        logData.bolts_earned,
        'pending',
        expect.any(String),
        expect.any(String),
      );

      expect(mockDb.runAsync).toHaveBeenCalledWith(
        expect.stringContaining("UPDATE habits_log SET sync_status = 'synced'"),
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

      expect(mockDb.runAsync).toHaveBeenCalled();
      expect(supabase.from).not.toHaveBeenCalled();
    });

    test('should handle Supabase error and queue for sync', async () => {
      const logData = {
        profile_id: 'p1',
        habit_id: 'brush_teeth',
        status: 'success' as const,
        duration_seconds: 120,
        bolts_earned: 1,
      };

      // Mock error from Supabase
      vi.mocked(supabase.from('habits_log').insert([]).select().single).mockResolvedValueOnce({
        error: { message: 'Supabase Error' },
      } as any);

      await habitLogService.logCompletion(logData);

      // Should have inserted into sync_queue
      expect(mockDb.runAsync).toHaveBeenCalledWith(
        expect.stringContaining('INSERT INTO sync_queue'),
        'habits_log',
        'INSERT',
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

      mockDb.getFirstAsync.mockResolvedValueOnce({ id: 'p1', bolt_balance: 5, is_guest: 0 });

      const result = await habitLogService.logMissionResult(data);

      expect(result.log).toBeDefined();
      expect(result.profile?.bolt_balance).toBe(6);
    });

    test('should NOT update balance if status is failure', async () => {
      const data = {
        profile_id: 'p1',
        habit_id: 'brush_teeth',
        status: 'failure' as const,
        duration_seconds: 0,
        bolts_earned: 0,
      };

      mockDb.getFirstAsync.mockResolvedValueOnce({ id: 'p1', bolt_balance: 5, is_guest: 0 });

      const result = await habitLogService.logMissionResult(data);

      expect(result.log.status).toBe('failure');
      const updateCall = mockDb.runAsync.mock.calls.find((call) =>
        call[0].includes('UPDATE profiles SET bolt_balance'),
      );
      expect(updateCall).toBeUndefined();
    });
  });

  describe('getTodaysLogs', () => {
    test('should fetch logs from SQLite', async () => {
      const mockLogs = [{ id: '1', habit_id: 'brush_teeth', status: 'success' }];
      mockDb.getAllAsync.mockResolvedValueOnce(mockLogs);

      const logs = await habitLogService.getTodaysLogs('p1');

      expect(logs).toEqual(mockLogs);
    });
  });

  describe('getStreakData', () => {
    test('should fetch streak data from SQLite', async () => {
      const mockStreaks = [{ date: '2023-01-01', count: 1 }];
      mockDb.getAllAsync.mockResolvedValueOnce(mockStreaks);

      const streaks = await habitLogService.getStreakData('p1');

      expect(streaks).toEqual(mockStreaks);
    });
  });

  describe('resetTodayProgress', () => {
    test("should delete today's logs for the profile", async () => {
      await habitLogService.resetTodayProgress('p1');
      expect(mockDb.runAsync).toHaveBeenCalled();
    });

    test('should handle Supabase delete error gracefully', async () => {
      vi.mocked(supabase.from('habits_log').delete().eq('', '').gte).mockResolvedValueOnce({
        error: { message: 'Delete Error' },
      } as any);

      await habitLogService.resetTodayProgress('p1');
      expect(mockDb.runAsync).toHaveBeenCalled();
    });
  });
});
