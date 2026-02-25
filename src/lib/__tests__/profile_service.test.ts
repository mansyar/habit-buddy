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
        expect.any(String),
        null,
        'Offline Buddy',
        expect.anything(),
        expect.anything(),
        expect.anything(),
        1,
        expect.anything(),
        expect.anything(),
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
});
