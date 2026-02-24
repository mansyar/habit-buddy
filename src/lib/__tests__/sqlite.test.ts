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
});
