import { expect, test, vi, describe, beforeEach } from 'vitest';
import { profileService } from '../profile_service';
import { supabase } from '../supabase';

// Mock Supabase client
vi.mock('../supabase', () => ({
  supabase: {
    from: vi.fn(() => ({
      select: vi.fn(() => ({
        single: vi.fn(() =>
          Promise.resolve({
            data: { id: 'user123', child_name: 'Buddy', is_guest: false },
            error: null,
          }),
        ),
      })),
      upsert: vi.fn(() => ({
        select: vi.fn(() => ({
          single: vi.fn(() =>
            Promise.resolve({
              data: { id: 'user123', user_id: 'user123', child_name: 'Buddy', is_guest: false },
              error: null,
            }),
          ),
        })),
      })),
    })),
  },
}));

// Mock SQLite
vi.mock('../sqlite', () => ({
  initializeSQLite: vi.fn(() =>
    Promise.resolve({
      runSync: vi.fn(),
      getFirstSync: vi.fn(() => ({ id: 'guest-123', child_name: 'Buddy', is_guest: 1 })),
    }),
  ),
}));

// Mock Network
vi.mock('../network', () => ({
  checkIsOnline: vi.fn(() => Promise.resolve(true)),
}));

describe('Migration Logic', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test('should migrate guest data to Supabase profile', async () => {
    const guestId = 'guest-123';
    const userId = 'user123';

    const migratedProfile = await profileService.migrateGuestToUser(guestId, userId);

    expect(supabase.from).toHaveBeenCalledWith('profiles');
    expect(migratedProfile?.user_id).toBe(userId);
    expect(migratedProfile?.is_guest).toBe(false);
  });
});
