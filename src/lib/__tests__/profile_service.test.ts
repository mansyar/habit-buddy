import { expect, test, vi, describe, beforeEach } from 'vitest';
import { profileService } from '../profile_service';
import { supabase, withTimeout } from '../supabase';
import { checkIsOnline } from '../network';

// Mock Supabase lib
vi.mock('../supabase', () => ({
  supabase: {
    from: vi.fn(function (this: any) {
      return this;
    }),
    select: vi.fn(function (this: any) {
      return this;
    }),
    insert: vi.fn(function (this: any) {
      return this;
    }),
    update: vi.fn(function (this: any) {
      return this;
    }),
    upsert: vi.fn(function (this: any) {
      return this;
    }),
    delete: vi.fn(function (this: any) {
      return this;
    }),
    eq: vi.fn(function (this: any) {
      return this;
    }),
    or: vi.fn(function (this: any) {
      return this;
    }),
    maybeSingle: vi.fn(() => Promise.resolve({ data: null, error: null })),
    single: vi.fn(() => Promise.resolve({ data: null, error: null })),
    gte: vi.fn(() => Promise.resolve({ data: [], error: null })),
  },
  withTimeout: vi.fn((promise) => promise),
  SUPABASE_TIMEOUT: 10000,
}));

// Mock Network
vi.mock('../network', () => ({
  checkIsOnline: vi.fn(() => Promise.resolve(true)),
}));

// Mock SQLite
const mockDb = {
  execAsync: vi.fn(async () => {}),
  runAsync: vi.fn(async () => {}),
  getFirstAsync: vi.fn(async () => null),
  getAllAsync: vi.fn(async () => []),
};

vi.mock('../sqlite', () => ({
  initializeSQLite: vi.fn(() => Promise.resolve(mockDb)),
}));

describe('ProfileService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Online Mode', () => {
    test('should create a profile in Supabase', async () => {
      const profileData = { child_name: 'Buddy', avatar_id: 'dog' };

      // Setup mock return for upsert
      (supabase.maybeSingle as any).mockResolvedValueOnce({
        data: { id: '123', child_name: 'Buddy' },
        error: null,
      });

      const profile = await profileService.createProfile(profileData, 'user-123');

      expect(supabase.from).toHaveBeenCalledWith('profiles');
      expect(profile.child_name).toBe('Buddy');
    });

    test('should handle createProfile sync error', async () => {
      (supabase.maybeSingle as any).mockResolvedValueOnce({
        data: null,
        error: { message: 'Sync Error' },
      });

      await profileService.createProfile({ child_name: 'Buddy' }, 'user-123');

      // Should add to sync_queue
      expect(mockDb.runAsync).toHaveBeenCalledWith(
        expect.stringContaining('INSERT INTO sync_queue'),
        'profiles',
        'UPSERT',
        expect.any(String),
      );
    });

    test('should cache profile to SQLite when fetched from Supabase', async () => {
      mockDb.getFirstAsync.mockResolvedValueOnce(null); // Not found locally
      (supabase.maybeSingle as any).mockResolvedValueOnce({
        data: {
          id: 'remote-123',
          user_id: 'auth-123',
          child_name: 'Remote Buddy',
          avatar_id: 'bear',
          selected_buddy: 'bear',
          bolt_balance: 50,
          created_at: '2023-01-01',
          updated_at: '2023-01-01',
        },
        error: null,
      });

      const profile = await profileService.getProfile('remote-123');
      expect(profile?.child_name).toBe('Remote Buddy');

      // Should cache to SQLite
      expect(mockDb.runAsync).toHaveBeenCalledWith(
        expect.stringContaining('INSERT OR REPLACE INTO profiles'),
        'remote-123',
        'auth-123',
        'Remote Buddy',
        'bear',
        'bear',
        50,
        0,
        'synced',
        expect.any(String),
        '2023-01-01',
        '2023-01-01',
      );
    });
  });

  describe('Offline/Guest Mode', () => {
    test('should queue creation in sync_queue if authenticated but offline', async () => {
      (checkIsOnline as any).mockResolvedValueOnce(false);

      await profileService.createProfile({ child_name: 'Offline Auth' }, 'user-123');

      // Should add to sync_queue (since not a guest)
      expect(mockDb.runAsync).toHaveBeenCalledWith(
        expect.stringContaining('INSERT INTO sync_queue'),
        'profiles',
        'UPSERT',
        expect.stringContaining('"user_id":"user-123"'),
      );
    });

    test('should fetch profile from SQLite when offline', async () => {
      (checkIsOnline as any).mockResolvedValueOnce(false);

      mockDb.getFirstAsync.mockResolvedValueOnce({ id: 'local-123', child_name: 'SQLite Buddy' });

      const profile = await profileService.getProfile('local-123');
      expect(profile?.child_name).toBe('SQLite Buddy');
      expect(mockDb.getFirstAsync).toHaveBeenCalledWith(
        expect.stringContaining('SELECT * FROM profiles'),
        'local-123',
        'local-123',
      );
    });
  });

  describe('migrateGuestToUser', () => {
    test('should migrate guest profile to authenticated user', async () => {
      mockDb.getFirstAsync.mockResolvedValueOnce({
        id: 'guest-123',
        is_guest: 1,
        child_name: 'Guest',
      });
      (supabase.maybeSingle as any).mockResolvedValueOnce({
        data: { id: 'guest-123', user_id: 'auth-123' },
        error: null,
      });

      const profile = await profileService.migrateGuestToUser('guest-123', 'auth-123');

      expect(profile?.user_id).toBe('auth-123');
      expect(profile?.is_guest).toBe(false);
      expect(mockDb.runAsync).toHaveBeenCalledWith(
        expect.stringContaining('UPDATE profiles SET user_id = ?, is_guest = 0'),
        'auth-123',
        'synced',
        expect.any(String),
        expect.any(String),
        'guest-123',
      );
    });

    test('should handle migration sync failure', async () => {
      mockDb.getFirstAsync.mockResolvedValueOnce({
        id: 'guest-123',
        is_guest: 1,
        child_name: 'Guest',
      });
      (supabase.maybeSingle as any).mockResolvedValueOnce({ error: { message: 'Migrate Fail' } });

      await profileService.migrateGuestToUser('guest-123', 'auth-123');

      // Should queue for sync
      expect(mockDb.runAsync).toHaveBeenCalledWith(
        expect.stringContaining('INSERT INTO sync_queue'),
        'profiles',
        'UPSERT',
        expect.stringContaining('"user_id":"auth-123"'),
      );
    });
  });

  describe('updateBoltBalance', () => {
    test('should update balance in SQLite and Supabase when online', async () => {
      const profileId = 'p1';
      mockDb.getFirstAsync.mockResolvedValueOnce({ id: 'p1', bolt_balance: 5, is_guest: 0 });

      const updatedProfile = await profileService.updateBoltBalance(profileId, 2);

      expect(updatedProfile?.bolt_balance).toBe(7);
      expect(mockDb.runAsync).toHaveBeenCalledWith(
        expect.stringContaining('UPDATE profiles SET bolt_balance = ?'),
        7, // newBalance
        'pending', // initial syncStatus is now pending
        expect.any(String), // lastModified
        expect.any(String), // updatedAt
        profileId,
      );

      // Should have updated to synced after success
      expect(mockDb.runAsync).toHaveBeenCalledWith(
        expect.stringContaining("UPDATE profiles SET sync_status = 'synced'"),
        profileId,
      );

      expect(supabase.from).toHaveBeenCalledWith('profiles');
      expect(supabase.update).toHaveBeenCalledWith(expect.objectContaining({ bolt_balance: 7 }));
    });

    test('should update balance only in SQLite when offline', async () => {
      (checkIsOnline as any).mockResolvedValueOnce(false);
      const profileId = 'p1';
      mockDb.getFirstAsync.mockResolvedValueOnce({ id: 'p1', bolt_balance: 5, is_guest: 0 });

      const updatedProfile = await profileService.updateBoltBalance(profileId, 3);

      expect(updatedProfile?.bolt_balance).toBe(8);
      expect(supabase.from).not.toHaveBeenCalled();
      // Should queue for sync
      expect(mockDb.runAsync).toHaveBeenCalledWith(
        expect.stringContaining('INSERT INTO sync_queue'),
        'profiles',
        'UPDATE',
        expect.stringContaining('"bolt_balance":8'),
      );
    });

    test('should handle updateBoltBalance sync failure', async () => {
      const profileId = 'p1';
      mockDb.getFirstAsync.mockResolvedValueOnce({ id: 'p1', bolt_balance: 5, is_guest: 0 });
      (supabase.update as any).mockReturnValueOnce({
        eq: vi.fn(() => Promise.resolve({ error: { message: 'Balance Sync Error' } })),
      });

      await profileService.updateBoltBalance(profileId, 5);

      // Should mark as pending and queue
      expect(mockDb.runAsync).toHaveBeenCalledWith(
        expect.stringContaining('INSERT INTO sync_queue'),
        'profiles',
        'UPDATE',
        expect.stringContaining('"bolt_balance":10'),
      );
    });
  });
});
