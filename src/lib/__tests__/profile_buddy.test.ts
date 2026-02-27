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

    // Setup mock return for upsert
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
      'synced', // sync_status
      expect.anything(), // last_modified
      expect.anything(), // created_at
      expect.anything(), // updated_at
    );

    expect(profile.selected_buddy).toBe('dino');
  });
});
