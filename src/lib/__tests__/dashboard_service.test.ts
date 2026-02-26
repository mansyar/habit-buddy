import { expect, test, vi, describe, beforeEach, afterEach } from 'vitest';
import { dashboardService } from '../dashboard_service';

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

describe('DashboardService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2026-02-26T12:00:00Z'));
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  describe('getBoltStats', () => {
    test('should return correct bolt statistics', async () => {
      // Mock profile for current balance
      mockDb.getFirstAsync.mockResolvedValueOnce({ bolt_balance: 100 });

      // Mock habits_log for total earned
      // Note: In real implementation we might use SUM() in SQL
      mockDb.getFirstAsync.mockResolvedValueOnce({ total_earned: 150 });

      // Mock coupons for total spent
      mockDb.getFirstAsync.mockResolvedValueOnce({ total_spent: 50 });

      const stats = await dashboardService.getBoltStats('p1');

      expect(stats).toEqual({
        total_earned: 150,
        total_spent: 50,
        current_balance: 100,
      });
    });
  });

  describe('getDailyAverageHabits', () => {
    test('should calculate daily average correctly', async () => {
      // Mock count of logs / unique days
      mockDb.getFirstAsync.mockResolvedValueOnce({ avg_habits: 2.5 });

      const average = await dashboardService.getDailyAverageHabits('p1');

      expect(average).toBe(2.5);
    });
  });

  describe('getWeeklyStreakData', () => {
    test('should return 7 days of streak data', async () => {
      const mockLogs = [
        { date: '2026-02-26', count: 3 },
        { date: '2026-02-25', count: 2 },
        // ... more days
      ];
      mockDb.getAllAsync.mockResolvedValueOnce(mockLogs);

      const streak = await dashboardService.getWeeklyStreakData('p1');

      expect(streak).toHaveLength(7);
      expect(streak[0].is_fully_completed).toBe(true); // 3 habits completed
      expect(streak[1].is_fully_completed).toBe(false); // only 2 habits completed
    });
  });

  describe('getDashboardStats', () => {
    test('should aggregate all stats', async () => {
      // This might call the other methods
      const stats = await dashboardService.getDashboardStats('p1');

      expect(stats.bolt_stats).toBeDefined();
      expect(stats.weekly_streak).toHaveLength(7);
      expect(stats.today_summary).toBeDefined();
    });
  });
});
