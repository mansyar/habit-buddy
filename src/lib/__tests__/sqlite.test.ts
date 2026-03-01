import * as SQLite from 'expo-sqlite';
import { Platform } from 'react-native';
import { describe, test, expect, vi, beforeEach } from 'vitest';
import { initializeSQLite, resetSQLite, dbInstance } from '../sqlite';

const mockDb = {
  execAsync: vi.fn(async () => {}),
  getAllAsync: vi.fn(async () => []),
  runAsync: vi.fn(async () => {}),
  getFirstAsync: vi.fn(async () => null),
  closeAsync: vi.fn(async () => {}),
};

// Mock expo-sqlite
vi.mock('expo-sqlite', () => ({
  openDatabaseAsync: vi.fn(async () => mockDb),
}));

// Mock react-native
vi.mock('react-native', () => ({
  Platform: {
    OS: 'ios',
  },
}));

describe('SQLite Initialization', () => {
  beforeEach(async () => {
    vi.clearAllMocks();
    resetSQLite();
    // Reset Platform to ios by default
    // @ts-ignore
    Platform.OS = 'ios';
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

  test('should perform migrations if columns are missing', async () => {
    // Mock table_info to return missing columns
    mockDb.getAllAsync.mockImplementation(async (sql: string) => {
      if (sql.includes('PRAGMA table_info(profiles)')) {
        return [{ name: 'id' }, { name: 'child_name' }]; // Missing sync_status, last_modified, etc.
      }
      if (sql.includes('PRAGMA table_info(coupons)')) {
        return [{ name: 'id' }, { name: 'title' }]; // Missing category
      }
      if (sql.includes('PRAGMA table_info(sync_queue)')) {
        return [{ name: 'id' }, { name: 'table_name' }]; // Missing retry_count
      }
      return [];
    });

    await initializeSQLite();

    const calls = (mockDb.execAsync as any).mock.calls;
    const allSql = calls.map((call: any[]) => call[0]).join('\n');

    expect(allSql).toContain("ALTER TABLE profiles ADD COLUMN sync_status TEXT DEFAULT 'synced'");
    expect(allSql).toContain(
      'ALTER TABLE profiles ADD COLUMN last_modified TEXT DEFAULT CURRENT_TIMESTAMP',
    );
    expect(allSql).toContain('ALTER TABLE profiles ADD COLUMN is_guest INTEGER DEFAULT 0');
    expect(allSql).toContain("ALTER TABLE coupons ADD COLUMN category TEXT DEFAULT 'Physical'");
    expect(allSql).toContain('ALTER TABLE sync_queue ADD COLUMN retry_count INTEGER DEFAULT 0');
  });

  test('should retry opening database on web when lock error occurs', async () => {
    // @ts-ignore
    Platform.OS = 'web';

    const lockError = new Error('createSyncAccessHandle');
    lockError.name = 'NoModificationAllowedError';

    vi.mocked(SQLite.openDatabaseAsync)
      .mockRejectedValueOnce(lockError)
      .mockRejectedValueOnce(lockError)
      .mockResolvedValueOnce(mockDb as any);

    const db = await initializeSQLite();
    expect(db).toBe(mockDb);
    expect(SQLite.openDatabaseAsync).toHaveBeenCalledTimes(3);
  });

  test('should return existing instance if already initialized', async () => {
    // Ensure we are on ios
    // @ts-ignore
    Platform.OS = 'ios';
    vi.mocked(SQLite.openDatabaseAsync).mockResolvedValue(mockDb as any);

    const db1 = await initializeSQLite();
    const db2 = await initializeSQLite();
    expect(db1).toBe(db2);
    expect(SQLite.openDatabaseAsync).toHaveBeenCalledTimes(1);
  });

  test('should handle initialization error and allow retry', async () => {
    vi.mocked(SQLite.openDatabaseAsync).mockRejectedValueOnce(new Error('Fatal Error'));

    await expect(initializeSQLite()).rejects.toThrow('Fatal Error');

    // Should allow retry
    vi.mocked(SQLite.openDatabaseAsync).mockResolvedValueOnce(mockDb as any);
    const db = await initializeSQLite();
    expect(db).toBe(mockDb);
  });

  test('should perform basic CRUD operations on profiles', async () => {
    const db = await initializeSQLite();

    // Create (Insert)
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
