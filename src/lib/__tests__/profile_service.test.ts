import { expect, test, vi, describe, beforeEach } from 'vitest';
import { profileService } from '../profile_service';
import { supabase } from '../supabase';

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
          single: vi.fn(() => Promise.resolve({ data: { id: '123', name: 'Buddy' }, error: null })),
        })),
      })),
    })),
  },
}));

describe('ProfileService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test('should create a profile in Supabase', async () => {
    const profileData = { name: 'Buddy', avatar: 'dog' };
    const profile = await profileService.createProfile(profileData, false);

    expect(supabase.from).toHaveBeenCalledWith('profiles');
    expect(profile.name).toBe('Buddy');
  });

  test('should handle profile creation error', async () => {
    (supabase.from as any).mockImplementationOnce(() => ({
      insert: vi.fn(() => ({
        select: vi.fn(() => ({
          single: vi.fn(() => Promise.resolve({ data: null, error: { message: 'DB Error' } })),
        })),
      })),
    }));

    await expect(profileService.createProfile({ name: 'Buddy' }, false)).rejects.toThrow(
      'DB Error',
    );
  });
});
