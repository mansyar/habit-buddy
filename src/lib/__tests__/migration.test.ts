import { expect, test, vi, describe, beforeEach } from 'vitest';
import { profileService } from '../profile_service';
import { supabase } from '../supabase';

// Mock SQLite
const mockDb = {
  runAsync: vi.fn(async () => {}),
  getFirstAsync: vi.fn(async () => ({ id: 'guest-123', child_name: 'Buddy', is_guest: 1 })),
};

vi.mock('../sqlite', () => ({
  initializeSQLite: vi.fn(() => Promise.resolve(mockDb)),
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

    // Mock response for migration
    (supabase.maybeSingle as any).mockResolvedValueOnce({
      data: { id: 'user123', user_id: 'user123', child_name: 'Buddy' },
      error: null,
    });

    const migratedProfile = await profileService.migrateGuestToUser(guestId, userId);

    expect(supabase.from).toHaveBeenCalledWith('profiles');
    expect(migratedProfile?.user_id).toBe(userId);
    expect(migratedProfile?.is_guest).toBe(false);
  });
});
