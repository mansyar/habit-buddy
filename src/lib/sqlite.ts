import * as SQLite from 'expo-sqlite';
import { Platform } from 'react-native';

let dbPromise: Promise<SQLite.SQLiteDatabase> | null = null;
let dbInstance: SQLite.SQLiteDatabase | null = null;

/**
 * Ensures the database is closed on web when the window is unloaded.
 * This helps prevent NoModificationAllowedError (OPFS lock) on reloads.
 */
if (Platform.OS === 'web' && typeof window !== 'undefined') {
  window.addEventListener('beforeunload', () => {
    if (dbInstance && 'closeAsync' in dbInstance && typeof dbInstance.closeAsync === 'function') {
      // Note: closeAsync might be a no-op or throw if already closing,
      // but we try to be a good citizen for OPFS.
      (dbInstance.closeAsync as () => Promise<void>)();
    }
  });
}

export const initializeSQLite = async (): Promise<SQLite.SQLiteDatabase> => {
  // Return the existing instance if already fully initialized
  if (dbInstance) return dbInstance;

  // If initialization is in progress, return the existing promise
  if (dbPromise) return dbPromise;

  dbPromise = (async () => {
    try {
      let db: SQLite.SQLiteDatabase;

      if (Platform.OS === 'web') {
        let retries = 0;
        const maxRetries = 10; // Increased retries

        while (true) {
          try {
            db = await SQLite.openDatabaseAsync('habit_buddy.db');
            break;
          } catch (error) {
            retries++;
            const errorMessage = error instanceof Error ? error.message : '';
            const errorName = error instanceof Error ? error.name : '';

            const isLockError =
              errorName === 'NoModificationAllowedError' ||
              errorMessage.includes('NoModificationAllowedError') ||
              errorMessage.includes('createSyncAccessHandle');

            if (isLockError && retries <= maxRetries) {
              console.warn(`SQLite: OPFS lock detected, retrying (${retries}/${maxRetries})...`);
              // Exponential backoff
              await new Promise((resolve) => setTimeout(resolve, 500 * Math.pow(1.2, retries)));
              continue;
            }
            console.error('SQLite initialization failed:', error);
            throw error;
          }
        }
      } else {
        db = await SQLite.openDatabaseAsync('habit_buddy.db');
      }

      dbInstance = db;

      // 1. Ensure core tables exist
      await db.execAsync(`
        CREATE TABLE IF NOT EXISTS profiles (
          id TEXT PRIMARY KEY,
          user_id TEXT,
          child_name TEXT NOT NULL,
          avatar_id TEXT,
          bolt_balance INTEGER DEFAULT 0,
          is_guest INTEGER DEFAULT 0,
          created_at TEXT DEFAULT CURRENT_TIMESTAMP,
          updated_at TEXT DEFAULT CURRENT_TIMESTAMP
        );

        CREATE TABLE IF NOT EXISTS habits_log (
          id TEXT PRIMARY KEY,
          profile_id TEXT NOT NULL,
          habit_id TEXT NOT NULL,
          status TEXT NOT NULL CHECK (status IN ('success', 'sleepy')),
          duration_seconds INTEGER DEFAULT 0,
          bolts_earned INTEGER DEFAULT 0,
          completed_at TEXT DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY (profile_id) REFERENCES profiles (id) ON DELETE CASCADE
        );

        CREATE TABLE IF NOT EXISTS coupons (
          id TEXT PRIMARY KEY,
          profile_id TEXT NOT NULL,
          title TEXT NOT NULL,
          bolt_cost INTEGER NOT NULL,
          is_redeemed INTEGER DEFAULT 0,
          created_at TEXT DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY (profile_id) REFERENCES profiles (id) ON DELETE CASCADE
        );

        CREATE TABLE IF NOT EXISTS sync_queue (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          table_name TEXT NOT NULL,
          operation TEXT NOT NULL,
          data TEXT NOT NULL,
          status TEXT DEFAULT 'pending',
          created_at TEXT DEFAULT CURRENT_TIMESTAMP
        );
      `);

      // 2. Migration: Ensure is_guest column exists (for users with existing DB)
      try {
        const tableInfo = (await db.getAllAsync('PRAGMA table_info(profiles)')) as {
          name: string;
        }[];
        const hasIsGuest = tableInfo.some((col) => col.name === 'is_guest');

        if (!hasIsGuest) {
          await db.execAsync('ALTER TABLE profiles ADD COLUMN is_guest INTEGER DEFAULT 0');
        }
      } catch (e) {
        console.warn('Migration check failed:', e);
      }

      return db;
    } catch (error) {
      dbPromise = null; // Clear the promise on failure so we can retry
      throw error;
    }
  })();

  return dbPromise;
};
