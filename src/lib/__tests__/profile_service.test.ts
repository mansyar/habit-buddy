import { expect, test, vi, describe, beforeEach } from 'vitest';
import { profileService } from '../profile_service';
import { supabase } from '../supabase';
import { initializeSQLite } from '../sqlite';
import { checkIsOnline } from '../network';

// Mock Supabase client
vi.mock('../supabase', () => ({
  supabase: {
    from: vi.fn(() => ({
      select: vi.fn(() => ({
        eq: vi.fn(() => ({
          single: vi.fn(() => Promise.resolve({ data: null, error: null })),
        })),
      })),
      insert: vi.fn(() => ({
        select: vi.fn(() => ({
          single: vi.fn(() =>
            Promise.resolve({ data: { id: '123', child_name: 'Buddy' }, error: null }),
          ),
        })),
      })),
      upsert: vi.fn(() => ({
        select: vi.fn(() => ({
          single: vi.fn(() =>
            Promise.resolve({ data: { id: '123', child_name: 'Buddy' }, error: null }),
          ),
        })),
      })),
    })),
  },
}));

// Mock Network
vi.mock('../network', () => ({
  checkIsOnline: vi.fn(() => Promise.resolve(true)),
}));

// Mock SQLite
const mockDb = {
  execSync: vi.fn(),
  runSync: vi.fn(),
  getFirstSync: vi.fn(),
  getAllSync: vi.fn(() => []),
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
      const profile = await profileService.createProfile(profileData, 'user-123');

      expect(supabase.from).toHaveBeenCalledWith('profiles');
      expect(profile.child_name).toBe('Buddy');
    });

    test('should fetch profile from Supabase', async () => {
      (supabase.from as any).mockImplementationOnce(() => ({
        select: vi.fn(() => ({
          eq: vi.fn(() => ({
            single: vi.fn(() =>
              Promise.resolve({ data: { id: 'user-123', child_name: 'Buddy' }, error: null }),
            ),
          })),
        })),
      }));

      const profile = await profileService.getProfile('user-123');
      expect(profile?.child_name).toBe('Buddy');
      expect(supabase.from).toHaveBeenCalledWith('profiles');
    });
  });

  describe('Offline/Guest Mode', () => {
    test('should create a profile in SQLite when offline', async () => {
      // Mock Network as offline
      (checkIsOnline as any).mockResolvedValueOnce(false);

      const profileData = { child_name: 'Offline Buddy' };
      await profileService.createProfile(profileData, null);

      expect(mockDb.runSync).toHaveBeenCalledWith(
        expect.stringContaining('INSERT INTO profiles'),
        expect.any(String),
        null,
        'Offline Buddy',
        expect.anything(),
        expect.anything(),
        1,
        expect.anything(),
        expect.anything(),
      );
    });

    test('should fetch profile from SQLite when offline', async () => {
      (checkIsOnline as any).mockResolvedValueOnce(false);

      mockDb.getFirstSync.mockReturnValueOnce({ id: 'local-123', child_name: 'SQLite Buddy' });

      const profile = await profileService.getProfile('local-123');
      expect(profile?.child_name).toBe('SQLite Buddy');
      expect(mockDb.getFirstSync).toHaveBeenCalledWith(
        expect.stringContaining('SELECT * FROM profiles'),
        'local-123',
      );
    });
  });
});
