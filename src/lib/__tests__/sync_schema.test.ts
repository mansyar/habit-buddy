import { describe, test, expect, vi, beforeEach } from 'vitest';
import { initializeSQLite, resetSQLite } from '../sqlite';
import * as SQLite from 'expo-sqlite';

const mockDb = {
  execAsync: vi.fn(async () => {}),
  getAllAsync: vi.fn(async () => []),
  runAsync: vi.fn(async () => {}),
  getFirstAsync: vi.fn(async () => null),
};

// Mock expo-sqlite
vi.mock('expo-sqlite', () => ({
  openDatabaseAsync: vi.fn(async () => mockDb),
}));

describe('SQLite Sync Schema Extension', () => {
  beforeEach(async () => {
    vi.clearAllMocks();
    resetSQLite();
  });

  test('should include sync_status and last_modified in core table creation', async () => {
    await initializeSQLite();

    const calls = (mockDb.execAsync as any).mock.calls;
    const allSql = calls.map((call: any[]) => call[0]).join('\n');

    const tables = ['profiles', 'habits_log', 'coupons'];

    tables.forEach((table) => {
      expect(allSql).toContain(`CREATE TABLE IF NOT EXISTS ${table}`);
      // These should be in the initial CREATE TABLE statements
      expect(allSql).toContain("sync_status TEXT DEFAULT 'synced'");
      expect(allSql).toContain('last_modified TEXT DEFAULT CURRENT_TIMESTAMP');
    });
  });

  test('should perform migrations to add sync columns if they dont exist', async () => {
    // Mock table_info to simulate existing tables without sync columns
    mockDb.getAllAsync.mockImplementation(async (sql: string) => {
      if (sql.includes('PRAGMA table_info')) {
        return [
          { name: 'id' },
          { name: 'child_name' },
          // Missing sync_status and last_modified
        ];
      }
      return [];
    });

    await initializeSQLite();

    const calls = (mockDb.execAsync as any).mock.calls;
    const allSql = calls.map((call: any[]) => call[0]).join('\n');

    expect(allSql).toContain('ALTER TABLE profiles ADD COLUMN sync_status');
    expect(allSql).toContain('ALTER TABLE profiles ADD COLUMN last_modified');
    expect(allSql).toContain('ALTER TABLE habits_log ADD COLUMN sync_status');
    expect(allSql).toContain('ALTER TABLE habits_log ADD COLUMN last_modified');
    expect(allSql).toContain('ALTER TABLE coupons ADD COLUMN sync_status');
    expect(allSql).toContain('ALTER TABLE coupons ADD COLUMN last_modified');
  });
});
