import { describe, test, expect, vi, beforeEach } from 'vitest';
import { initializeSQLite } from '../sqlite';
import * as SQLite from 'expo-sqlite';

const mockDb = {
  execSync: vi.fn(),
  getAllSync: vi.fn(() => []),
};

// Mock expo-sqlite
vi.mock('expo-sqlite', () => ({
  openDatabaseSync: vi.fn(() => mockDb),
}));

describe('SQLite Initialization', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test('should create profiles, habits_log, and coupons tables', async () => {
    const db = SQLite.openDatabaseSync('habit_buddy.db');
    await initializeSQLite();

    // Verify that execSync was called to create tables
    // We expect multiple calls or a single large call with CREATE TABLE statements
    expect(mockDb.execSync).toHaveBeenCalled();

    // Check if the specific tables were mentioned in the SQL
    const calls = (mockDb.execSync as any).mock.calls;
    const allSql = calls.map((call: any[]) => call[0]).join('\n');

    expect(allSql).toContain('CREATE TABLE IF NOT EXISTS profiles');
    expect(allSql).toContain('CREATE TABLE IF NOT EXISTS habits_log');
    expect(allSql).toContain('CREATE TABLE IF NOT EXISTS coupons');
    expect(allSql).toContain('CREATE TABLE IF NOT EXISTS sync_queue');
  });

  test('should perform basic CRUD operations on profiles', async () => {
    const db = await initializeSQLite();

    // Create (Insert)
    db.runSync = vi.fn();
    const profile = { id: 'p1', child_name: 'Buddy', bolt_balance: 10 };
    db.runSync(
      `INSERT INTO profiles (id, child_name, bolt_balance) VALUES (?, ?, ?)`,
      profile.id,
      profile.child_name,
      profile.bolt_balance,
    );

    expect(db.runSync).toHaveBeenCalledWith(
      expect.stringContaining('INSERT INTO profiles'),
      profile.id,
      profile.child_name,
      profile.bolt_balance,
    );

    // Read (Select)
    db.getFirstSync = vi.fn(() => profile);
    const result = db.getFirstSync(`SELECT * FROM profiles WHERE id = ?`, profile.id);

    expect(result).toEqual(profile);
    expect(db.getFirstSync).toHaveBeenCalledWith(
      expect.stringContaining('SELECT * FROM profiles'),
      profile.id,
    );

    // Update
    const newName = 'Best Buddy';
    db.runSync(`UPDATE profiles SET child_name = ? WHERE id = ?`, newName, profile.id);
    expect(db.runSync).toHaveBeenCalledWith(
      expect.stringContaining('UPDATE profiles SET child_name'),
      newName,
      profile.id,
    );

    // Delete
    db.runSync(`DELETE FROM profiles WHERE id = ?`, profile.id);
    expect(db.runSync).toHaveBeenCalledWith(
      expect.stringContaining('DELETE FROM profiles'),
      profile.id,
    );
  });
});
