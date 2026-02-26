import { initializeSQLite } from './sqlite';
import { BoltStats, DashboardStats, HabitSummary, WeeklyStreakData } from '../types/dashboard';
import { CORE_HABITS } from '../constants/habits';
import { profileService } from './profile_service';
import { format, subDays, startOfDay } from 'date-fns';

class DashboardService {
  async getBoltStats(profile_id: string): Promise<BoltStats> {
    const db = await initializeSQLite();
    const profile = await profileService.getProfile(profile_id);

    const earnedRes = (await db.getFirstAsync(
      `SELECT SUM(bolts_earned) as total_earned FROM habits_log WHERE profile_id = ? AND status = 'success'`,
      profile_id,
    )) as { total_earned: number | null };

    const spentRes = (await db.getFirstAsync(
      `SELECT SUM(bolt_cost) as total_spent FROM coupons WHERE profile_id = ? AND is_redeemed = 1`,
      profile_id,
    )) as { total_spent: number | null };

    return {
      total_earned: earnedRes?.total_earned || 0,
      total_spent: spentRes?.total_spent || 0,
      current_balance: profile?.bolt_balance || 0,
    };
  }

  async getDailyAverageHabits(profile_id: string): Promise<number> {
    const db = await initializeSQLite();
    const res = (await db.getFirstAsync(
      `SELECT AVG(daily_count) as avg_habits FROM (
         SELECT count(*) as daily_count 
         FROM habits_log 
         WHERE profile_id = ? AND status = 'success' 
         GROUP BY date(completed_at)
       )`,
      profile_id,
    )) as { avg_habits: number | null };

    return res?.avg_habits || 0;
  }

  async getWeeklyStreakData(profile_id: string): Promise<WeeklyStreakData[]> {
    const db = await initializeSQLite();
    const today = startOfDay(new Date());
    const startDate = subDays(today, 6);
    const isoStart = startDate.toISOString();

    const logs = (await db.getAllAsync(
      `SELECT date(completed_at) as date, count(*) as count 
       FROM habits_log 
       WHERE profile_id = ? AND status = 'success' AND completed_at >= ?
       GROUP BY date(completed_at)`,
      profile_id,
      isoStart,
    )) as { date: string; count: number }[];

    const logMap = new Map(logs.map((l) => [l.date, l.count]));
    const result: WeeklyStreakData[] = [];

    for (let i = 0; i < 7; i++) {
      const d = new Date(startDate);
      d.setDate(d.getDate() + i);
      const dateStr = format(d, 'yyyy-MM-dd');
      const count = logMap.get(dateStr) || 0;

      result.push({
        date: dateStr,
        completed_count: count,
        total_count: CORE_HABITS.length,
        is_fully_completed: count >= CORE_HABITS.length,
      });
    }

    return result.reverse(); // Newest first
  }

  async getDashboardStats(profile_id: string): Promise<DashboardStats> {
    const [bolt_stats, daily_average_habits, weekly_streak] = await Promise.all([
      this.getBoltStats(profile_id),
      this.getDailyAverageHabits(profile_id),
      this.getWeeklyStreakData(profile_id),
    ]);

    // Today's summary
    const db = await initializeSQLite();
    const today = format(new Date(), 'yyyy-MM-dd');
    const todayLogs = (await db.getAllAsync(
      `SELECT habit_id FROM habits_log WHERE profile_id = ? AND status = 'success' AND date(completed_at) = date(?)`,
      profile_id,
      today,
    )) as { habit_id: string }[];

    const completedHabitIds = new Set(todayLogs.map((l) => l.habit_id));
    const today_summary: HabitSummary[] = CORE_HABITS.map((h) => ({
      habit_id: h.id,
      name: h.name,
      is_completed: completedHabitIds.has(h.id),
    }));

    return {
      bolt_stats,
      daily_average_habits,
      weekly_streak,
      today_summary,
    };
  }
}

export const dashboardService = new DashboardService();
