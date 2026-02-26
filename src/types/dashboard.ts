export interface BoltStats {
  total_earned: number;
  total_spent: number;
  current_balance: number;
}

export interface HabitSummary {
  habit_id: string;
  name: string;
  is_completed: boolean;
}

export interface WeeklyStreakData {
  date: string; // YYYY-MM-DD
  completed_count: number;
  total_count: number;
  is_fully_completed: boolean;
}

export interface DashboardStats {
  bolt_stats: BoltStats;
  daily_average_habits: number;
  weekly_streak: WeeklyStreakData[];
  today_summary: HabitSummary[];
}
