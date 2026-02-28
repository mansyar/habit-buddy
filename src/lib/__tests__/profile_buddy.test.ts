import { expect, test, vi, describe, beforeEach } from 'vitest';
import { profileService } from '../profile_service';
import { supabase } from '../supabase';

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

describe('Profile Buddy Selection', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test('should create a profile with selected_buddy', async () => {
    const profileData = {
      child_name: 'Buddy',
      avatar_id: 'dog',
      selected_buddy: 'dino',
    };

    // Setup mock return for upsert via supabase mock in vitest.setup.ts
    // We can access it via the imported supabase object
    (supabase.maybeSingle as any).mockResolvedValueOnce({
      data: { id: '123', child_name: 'Buddy', selected_buddy: 'dino' },
      error: null,
    });

    const profile = await profileService.createProfile(profileData, 'user-123');

    // Check if SQLite insert includes selected_buddy
    expect(mockDb.runAsync).toHaveBeenCalledWith(
      expect.stringContaining('selected_buddy'),
      expect.anything(), // id
      'user-123', // user_id
      'Buddy', // child_name
      'dog', // avatar_id
      'dino', // selected_buddy
      0, // bolt_balance
      0, // is_guest
      'pending', // initial sync_status is now pending
      expect.anything(), // last_modified
      expect.anything(), // created_at
      expect.anything(), // updated_at
    );

    // Should have updated to synced after success
    expect(mockDb.runAsync).toHaveBeenCalledWith(
      expect.stringContaining("UPDATE profiles SET sync_status = 'synced'"),
      expect.anything(),
    );

    expect(profile.selected_buddy).toBe('dino');
  });
});
