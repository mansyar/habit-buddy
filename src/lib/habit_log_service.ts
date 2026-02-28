import { supabase, withTimeout } from './supabase';
import { initializeSQLite } from './sqlite';
import { checkIsOnline } from './network';
import { HabitLog, HabitStatus } from '../types/habit_log';
import * as Crypto from 'expo-crypto';
import { profileService } from './profile_service';
import { Profile } from '../types/profile';
import { format } from 'date-fns';

class HabitLogService {
  async logCompletion(data: {
    profile_id: string;
    habit_id: string;
    status: HabitStatus;
    duration_seconds: number;
    bolts_earned: number;
  }): Promise<HabitLog> {
    const isOnline = await checkIsOnline();
    const id = Crypto.randomUUID();
    const completed_at = new Date().toISOString();
    const lastModified = new Date().toISOString();
    const syncStatus = isOnline ? 'synced' : 'pending';

    const log: HabitLog = {
      id,
      ...data,
      sync_status: syncStatus,
      last_modified: lastModified,
      completed_at,
    };

    // Save to local SQLite
    const db = await initializeSQLite();
    await db.runAsync(
      `INSERT INTO habits_log (id, profile_id, habit_id, status, duration_seconds, bolts_earned, sync_status, last_modified, completed_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      log.id,
      log.profile_id,
      log.habit_id,
      log.status,
      log.duration_seconds,
      log.bolts_earned,
      log.sync_status || 'pending',
      log.last_modified || new Date().toISOString(),
      log.completed_at,
    );

    // If online, sync to Supabase
    if (isOnline) {
      // Create a clean object for Supabase without sync tracking columns
      const { sync_status, last_modified, ...supabaseLog } = log;
      try {
        const { error } = await withTimeout(
          supabase.from('habits_log').insert([supabaseLog]).select().single(),
        );

        if (error) throw error;
      } catch (err) {
        console.error('Supabase habit_log sync error:', err);
        // Mark as pending in SQLite
        await db.runAsync(`UPDATE habits_log SET sync_status = 'pending' WHERE id = ?`, log.id);
        // Queue for sync later
        await db.runAsync(
          `INSERT INTO sync_queue (table_name, operation, data) VALUES (?, ?, ?)`,
          'habits_log',
          'INSERT',
          JSON.stringify(supabaseLog),
        );
      }
    } else {
      // Offline, queue for sync
      const { sync_status, last_modified, ...supabaseLog } = log;
      await db.runAsync(
        `INSERT INTO sync_queue (table_name, operation, data) VALUES (?, ?, ?)`,
        'habits_log',
        'INSERT',
        JSON.stringify(supabaseLog),
      );
    }

    return log;
  }

  async logMissionResult(data: {
    profile_id: string;
    habit_id: string;
    status: HabitStatus;
    duration_seconds: number;
    bolts_earned: number;
  }): Promise<{ log: HabitLog; profile: Profile | null }> {
    const log = await this.logCompletion(data);
    let updatedProfile = null;

    if (data.status === 'success' && data.bolts_earned > 0) {
      updatedProfile = await profileService.updateBoltBalance(data.profile_id, data.bolts_earned);
    } else {
      updatedProfile = await profileService.getProfile(data.profile_id);
    }

    return { log, profile: updatedProfile };
  }

  async getTodaysLogs(profile_id: string): Promise<HabitLog[]> {
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);
    const isoStart = startOfDay.toISOString();

    const db = await initializeSQLite();
    const logs = (await db.getAllAsync(
      `SELECT * FROM habits_log WHERE profile_id = ? AND completed_at >= ?`,
      profile_id,
      isoStart,
    )) as HabitLog[];

    return logs;
  }

  async getStreakData(profile_id: string, days: number = 7): Promise<any> {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);
    startDate.setHours(0, 0, 0, 0);
    const isoStart = startDate.toISOString();

    const db = await initializeSQLite();
    const logs = await db.getAllAsync(
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

  async resetTodayProgress(profile_id: string): Promise<void> {
    const isOnline = await checkIsOnline();
    const today = format(new Date(), 'yyyy-MM-dd');

    const db = await initializeSQLite();
    await db.runAsync(
      `DELETE FROM habits_log WHERE profile_id = ? AND date(completed_at) = date(?)`,
      profile_id,
      today,
    );

    if (isOnline) {
      try {
        const { error } = await withTimeout(
          supabase
            .from('habits_log')
            .delete()
            .eq('profile_id', profile_id)
            .gte('completed_at', today + 'T00:00:00.000Z'),
        );

        if (error) throw error;
      } catch (err) {
        console.error('Supabase habit_log delete error:', err);
      }
    }
  }
}

export const habitLogService = new HabitLogService();
