import * as SecureStore from 'expo-secure-store';
import { supabase } from './supabase';
import { Profile } from '../types/profile';

const GUEST_PROFILE_KEY = 'habit-buddy-guest-profile';

class ProfileService {
  async createProfile(data: Partial<Profile>, isGuest: boolean): Promise<Profile> {
    if (isGuest) {
      const profile: Profile = {
        id: 'guest-' + Date.now(),
        name: data.name || 'Guest',
        avatar: data.avatar || 'default',
        is_guest: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      await SecureStore.setItemAsync(GUEST_PROFILE_KEY, JSON.stringify(profile));
      return profile;
    }

    const { data: profile, error } = await supabase
      .from('profiles')
      .insert([data])
      .select()
      .single();

    if (error) {
      throw new Error(error.message);
    }

    return profile;
  }

  async getGuestProfile(): Promise<Profile | null> {
    const data = await SecureStore.getItemAsync(GUEST_PROFILE_KEY);
    if (!data) return null;
    try {
      return JSON.parse(data);
    } catch {
      return null;
    }
  }

  async clearGuestProfile(): Promise<void> {
    await SecureStore.deleteItemAsync(GUEST_PROFILE_KEY);
  }

  async migrateGuestToUser(guestData: Partial<Profile>, userId: string): Promise<Profile> {
    const profileData = {
      ...guestData,
      id: userId,
      is_guest: false,
      updated_at: new Date().toISOString(),
    };

    const { data: profile, error } = await supabase
      .from('profiles')
      .upsert([profileData])
      .select()
      .single();

    if (error) {
      throw new Error(error.message);
    }

    // Clear guest data from storage after successful migration
    await this.clearGuestProfile();

    return profile;
  }

  async getProfile(userId: string): Promise<Profile | null> {
    const { data: profile, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();

    if (error) {
      return null;
    }

    return profile;
  }
}

export const profileService = new ProfileService();
