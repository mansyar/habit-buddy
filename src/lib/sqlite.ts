import * as SQLite from 'expo-sqlite';

export const initializeSQLite = async () => {
  const db = SQLite.openDatabaseSync('habit_buddy.db');

  // Create tables to mirror Supabase schema
  db.execSync(`
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

  return db;
};
