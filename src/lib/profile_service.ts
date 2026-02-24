import { supabase } from './supabase';
import { initializeSQLite } from './sqlite';
import { checkIsOnline } from './network';
import { Profile } from '../types/profile';
import * as Crypto from 'expo-crypto';

class ProfileService {
  private async isOnline(): Promise<boolean> {
    return checkIsOnline();
  }

  async createProfile(data: Partial<Profile>, userId: string | null): Promise<Profile> {
    const isOnline = await this.isOnline();
    const id = data.id || Crypto.randomUUID();

    const profile: Profile = {
      id,
      user_id: userId,
      child_name: data.child_name || 'Child',
      avatar_id: data.avatar_id || 'default',
      bolt_balance: data.bolt_balance || 0,
      is_guest: !userId,
      created_at: data.created_at || new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    // Always save to local SQLite first
    const db = await initializeSQLite();
    await db.runAsync(
      `INSERT INTO profiles (id, user_id, child_name, avatar_id, bolt_balance, is_guest, created_at, updated_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      profile.id,
      profile.user_id,
      profile.child_name,
      profile.avatar_id,
      profile.bolt_balance,
      profile.is_guest ? 1 : 0,
      profile.created_at,
      profile.updated_at,
    );

    // If online and authenticated, save to Supabase
    if (isOnline && userId) {
      const { data: remoteProfile, error } = await supabase
        .from('profiles')
        .upsert([
          {
            id: profile.id,
            user_id: profile.user_id,
            child_name: profile.child_name,
            avatar_id: profile.avatar_id,
            bolt_balance: profile.bolt_balance,
            created_at: profile.created_at,
            updated_at: profile.updated_at,
          },
        ])
        .select()
        .maybeSingle();

      if (error) {
        console.error('Supabase profile sync error:', error.message);
        // We don't throw here because local save succeeded
      } else if (remoteProfile) {
        return {
          ...remoteProfile,
          is_guest: false,
        };
      }
    }

    return profile;
  }

  async getProfile(id: string): Promise<Profile | null> {
    const isOnline = await this.isOnline();

    // Check SQLite first (source of truth for offline/recent changes)
    const db = await initializeSQLite();
    // Try to find by profile id OR user_id
    const localProfile = (await db.getFirstAsync(
      `SELECT * FROM profiles WHERE id = ? OR user_id = ?`,
      id,
      id,
    )) as Profile | null;

    if (localProfile) {
      return {
        ...localProfile,
        is_guest: !!localProfile.is_guest,
      };
    }

    // If not found locally and online, check Supabase
    if (isOnline) {
      // Use .or() to search by either id or user_id
      const { data: remoteProfile, error } = await supabase
        .from('profiles')
        .select('*')
        .or(`id.eq.${id},user_id.eq.${id}`)
        .maybeSingle(); // Use maybeSingle to avoid 406 error if not found

      if (!error && remoteProfile) {
        // Cache to local SQLite - set is_guest to 0 as it came from Supabase
        await db.runAsync(
          `INSERT OR REPLACE INTO profiles (id, user_id, child_name, avatar_id, bolt_balance, is_guest, created_at, updated_at)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
          remoteProfile.id,
          remoteProfile.user_id,
          remoteProfile.child_name,
          remoteProfile.avatar_id,
          remoteProfile.bolt_balance,
          0,
          remoteProfile.created_at,
          remoteProfile.updated_at,
        );
        return {
          ...remoteProfile,
          is_guest: false,
        };
      } else if (error) {
        console.error('Supabase getProfile error:', error.message);
      }
    }

    return null;
  }

  async getGuestProfile(): Promise<Profile | null> {
    const db = await initializeSQLite();
    const localProfile = (await db.getFirstAsync(
      `SELECT * FROM profiles WHERE is_guest = 1 LIMIT 1`,
    )) as any;

    if (localProfile) {
      return {
        ...localProfile,
        is_guest: true,
      };
    }
    return null;
  }

  async migrateGuestToUser(guestId: string, userId: string): Promise<Profile | null> {
    const db = await initializeSQLite();
    const guestProfile = await this.getGuestProfile();

    if (!guestProfile) return null;

    const updatedProfile: Profile = {
      ...guestProfile,
      user_id: userId,
      is_guest: false,
      updated_at: new Date().toISOString(),
    };

    // Update locally
    await db.runAsync(
      `UPDATE profiles SET user_id = ?, is_guest = 0, updated_at = ? WHERE id = ?`,
      userId,
      updatedProfile.updated_at,
      guestId,
    );

    // Sync to Supabase
    if (await this.isOnline()) {
      const { data: remoteProfile, error } = await supabase
        .from('profiles')
        .upsert([
          {
            id: updatedProfile.id,
            user_id: updatedProfile.user_id,
            child_name: updatedProfile.child_name,
            avatar_id: updatedProfile.avatar_id,
            bolt_balance: updatedProfile.bolt_balance,
            created_at: updatedProfile.created_at,
            updated_at: updatedProfile.updated_at,
          },
        ])
        .select()
        .maybeSingle();

      if (!error && remoteProfile) {
        return {
          ...remoteProfile,
          is_guest: false,
        };
      }
    }

    return updatedProfile;
  }
}

export const profileService = new ProfileService();
