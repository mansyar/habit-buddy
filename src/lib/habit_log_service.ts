import { supabase } from './supabase';
import { initializeSQLite } from './sqlite';
import { checkIsOnline } from './network';
import { HabitLog, HabitStatus } from '../types/habit_log';
import { v4 as uuidv4 } from 'uuid';

class HabitLogService {
  async logCompletion(data: {
    profile_id: string;
    habit_id: string;
    status: HabitStatus;
    duration_seconds: number;
    bolts_earned: number;
  }): Promise<HabitLog> {
    const isOnline = await checkIsOnline();
    const id = uuidv4();
    const completed_at = new Date().toISOString();

    const log: HabitLog = {
      id,
      ...data,
      completed_at,
    };

    // Save to local SQLite
    const db = await initializeSQLite();
    db.runSync(
      `INSERT INTO habits_log (id, profile_id, habit_id, status, duration_seconds, bolts_earned, completed_at)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      log.id,
      log.profile_id,
      log.habit_id,
      log.status,
      log.duration_seconds,
      log.bolts_earned,
      log.completed_at,
    );

    // If online, sync to Supabase
    if (isOnline) {
      const { error } = await supabase.from('habits_log').insert([log]).select().single();

      if (error) {
        console.error('Supabase habit_log sync error:', error.message);
        // Queue for sync later (SyncService task)
        db.runSync(
          `INSERT INTO sync_queue (table_name, operation, data) VALUES (?, ?, ?)`,
          'habits_log',
          'INSERT',
          JSON.stringify(log),
        );
      }
    } else {
      // Offline, queue for sync
      db.runSync(
        `INSERT INTO sync_queue (table_name, operation, data) VALUES (?, ?, ?)`,
        'habits_log',
        'INSERT',
        JSON.stringify(log),
      );
    }

    return log;
  }

  async getTodaysLogs(profile_id: string): Promise<HabitLog[]> {
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);
    const isoStart = startOfDay.toISOString();

    const db = await initializeSQLite();
    const logs = db.getAllSync(
      `SELECT * FROM habits_log WHERE profile_id = ? AND completed_at >= ?`,
      profile_id,
      isoStart,
    ) as HabitLog[];

    return logs;
  }

  async getStreakData(profile_id: string, days: number = 7): Promise<any> {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);
    startDate.setHours(0, 0, 0, 0);
    const isoStart = startDate.toISOString();

    const db = await initializeSQLite();
    const logs = db.getAllSync(
      `SELECT date(completed_at) as date, count(*) as count 
       FROM habits_log 
       WHERE profile_id = ? AND completed_at >= ? AND status = 'success'
       GROUP BY date(completed_at)
       ORDER BY date DESC`,
      profile_id,
      isoStart,
    );

    return logs;
  }
}

export const habitLogService = new HabitLogService();
