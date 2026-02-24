import { expect, test, vi, describe, beforeEach } from 'vitest';
import { profileService } from '../profile_service';
import { supabase } from '../supabase';

// Mock Supabase client
vi.mock('../supabase', () => ({
  supabase: {
    from: vi.fn(() => ({
      upsert: vi.fn(() => ({
        select: vi.fn(() => ({
          single: vi.fn(() =>
            Promise.resolve({
              data: { id: 'user123', name: 'Buddy', is_guest: false },
              error: null,
            }),
          ),
        })),
      })),
    })),
  },
}));

describe('Migration Logic', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test('should migrate guest data to Supabase profile', async () => {
    const guestProfile = { name: 'Buddy', avatar: 'dog', is_guest: true } as any;
    const userId = 'user123';

    const migratedProfile = await profileService.migrateGuestToUser(guestProfile, userId);

    expect(supabase.from).toHaveBeenCalledWith('profiles');
    expect(migratedProfile.id).toBe(userId);
    expect(migratedProfile.is_guest).toBe(false);
  });
});
