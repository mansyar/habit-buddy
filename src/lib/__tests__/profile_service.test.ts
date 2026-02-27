import { expect, test, vi, describe, beforeEach } from 'vitest';
import { profileService } from '../profile_service';
import { supabase } from '../supabase';
import { initializeSQLite } from '../sqlite';
import { checkIsOnline } from '../network';

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

    test('should fetch profile from Supabase', async () => {
      // Setup mock return for getProfile
      (supabase.maybeSingle as any).mockResolvedValueOnce({
        data: { id: 'user-123', child_name: 'Buddy' },
        error: null,
      });

      const profile = await profileService.getProfile('user-123');
      expect(profile?.child_name).toBe('Buddy');
      expect(supabase.from).toHaveBeenCalledWith('profiles');
      expect(supabase.or).toHaveBeenCalledWith(expect.stringContaining('id.eq.user-123'));
    });
  });

  describe('Offline/Guest Mode', () => {
    test('should create a profile in SQLite when offline', async () => {
      // Mock Network as offline
      (checkIsOnline as any).mockResolvedValueOnce(false);

      const profileData = { child_name: 'Offline Buddy' };
      await profileService.createProfile(profileData, null);

      expect(mockDb.runAsync).toHaveBeenCalledWith(
        expect.stringContaining('INSERT INTO profiles'),
        expect.any(String), // id
        null, // user_id
        'Offline Buddy', // child_name
        expect.anything(), // avatar_id
        expect.anything(), // selected_buddy
        expect.anything(), // bolt_balance
        1, // is_guest
        'pending', // sync_status
        expect.anything(), // last_modified
        expect.anything(), // created_at
        expect.anything(), // updated_at
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

  describe('updateBoltBalance', () => {
    test('should update balance in SQLite and Supabase when online', async () => {
      const profileId = 'p1';
      mockDb.getFirstAsync.mockResolvedValueOnce({ id: 'p1', bolt_balance: 5, is_guest: 0 });

      const updatedProfile = await profileService.updateBoltBalance(profileId, 2);

      expect(updatedProfile?.bolt_balance).toBe(7);
      expect(mockDb.runAsync).toHaveBeenCalledWith(
        expect.stringContaining('UPDATE profiles SET bolt_balance = ?'),
        7, // newBalance
        'synced', // syncStatus
        expect.any(String), // lastModified
        expect.any(String), // updatedAt
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
  });
});
