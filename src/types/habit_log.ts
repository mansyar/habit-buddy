export type HabitStatus = 'success' | 'sleepy';

export interface HabitLog {
  id: string;
  profile_id: string;
  habit_id: string;
  status: HabitStatus;
  duration_seconds: number;
  bolts_earned: number;
  sync_status?: 'synced' | 'pending';
  last_modified?: string;
  retry_count?: number;
  completed_at: string;
}
