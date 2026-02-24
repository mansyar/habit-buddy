import { describe, test, expect, vi, beforeEach } from 'vitest';
import { initializeSQLite } from '../sqlite';
import * as SQLite from 'expo-sqlite';

const mockDb = {
  execAsync: vi.fn(),
  getAllAsync: vi.fn(async () => []),
};

// Mock expo-sqlite
vi.mock('expo-sqlite', () => ({
  openDatabaseAsync: vi.fn(async () => mockDb),
}));

describe('SQLite Initialization', () => {
  beforeEach(async () => {
    vi.clearAllMocks();
    // Use resetModules to clear singleton if needed, or manually re-import
    const sqlite = await import('../sqlite');
    (sqlite as any).dbPromise = null;
  });

  test('should create profiles, habits_log, and coupons tables', async () => {
    await initializeSQLite();

    // Verify that execAsync was called to create tables
    expect(mockDb.execAsync).toHaveBeenCalled();

    // Check if the specific tables were mentioned in the SQL
    const calls = (mockDb.execAsync as any).mock.calls;
    const allSql = calls.map((call: any[]) => call[0]).join('\n');

    expect(allSql).toContain('CREATE TABLE IF NOT EXISTS profiles');
    expect(allSql).toContain('is_guest INTEGER DEFAULT 0');
    expect(allSql).toContain('CREATE TABLE IF NOT EXISTS habits_log');
    expect(allSql).toContain('CREATE TABLE IF NOT EXISTS coupons');
    expect(allSql).toContain('CREATE TABLE IF NOT EXISTS sync_queue');
  });

  test('should perform basic CRUD operations on profiles', async () => {
    const db = await initializeSQLite();

    // Create (Insert)
    (db as any).runAsync = vi.fn();
    const profile = { id: 'p1', child_name: 'Buddy', bolt_balance: 10 };
    await db.runAsync(
      `INSERT INTO profiles (id, child_name, bolt_balance) VALUES (?, ?, ?)`,
      profile.id,
      profile.child_name,
      profile.bolt_balance,
    );

    expect(db.runAsync).toHaveBeenCalledWith(
      expect.stringContaining('INSERT INTO profiles'),
      profile.id,
      profile.child_name,
      profile.bolt_balance,
    );

    // Read (Select)
    (db as any).getFirstAsync = vi.fn(async () => profile);
    const result = await db.getFirstAsync(`SELECT * FROM profiles WHERE id = ?`, profile.id);

    expect(result).toEqual(profile);
    expect(db.getFirstAsync).toHaveBeenCalledWith(
      expect.stringContaining('SELECT * FROM profiles'),
      profile.id,
    );

    // Update
    const newName = 'Best Buddy';
    await db.runAsync(`UPDATE profiles SET child_name = ? WHERE id = ?`, newName, profile.id);
    expect(db.runAsync).toHaveBeenCalledWith(
      expect.stringContaining('UPDATE profiles SET child_name'),
      newName,
      profile.id,
    );

    // Delete
    await db.runAsync(`DELETE FROM profiles WHERE id = ?`, profile.id);
    expect(db.runAsync).toHaveBeenCalledWith(
      expect.stringContaining('DELETE FROM profiles'),
      profile.id,
    );
  });
});
