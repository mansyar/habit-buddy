import { supabase } from './supabase';
import { Profile } from '../types/profile';

class ProfileService {
  async createProfile(data: Partial<Profile>, isGuest: boolean): Promise<Profile> {
    if (isGuest) {
      // TODO: Implement local SQLite profile creation in a later step
      // For now, let's just mock it or throw an error if not handled
      return {
        id: 'guest-' + Date.now(),
        name: data.name || 'Guest',
        avatar: data.avatar || 'default',
        is_guest: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };
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
