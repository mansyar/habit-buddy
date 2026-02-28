import { supabase, withTimeout } from './supabase';
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
      selected_buddy: data.selected_buddy || 'dino',
      bolt_balance: data.bolt_balance || 0,
      is_guest: !userId,
      sync_status: 'pending',
      last_modified: new Date().toISOString(),
      created_at: data.created_at || new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    // Always save to local SQLite first
    const db = await initializeSQLite();
    await db.runAsync(
      `INSERT INTO profiles (id, user_id, child_name, avatar_id, selected_buddy, bolt_balance, is_guest, sync_status, last_modified, created_at, updated_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      profile.id,
      profile.user_id,
      profile.child_name,
      profile.avatar_id,
      profile.selected_buddy,
      profile.bolt_balance,
      profile.is_guest ? 1 : 0,
      profile.sync_status || 'pending',
      profile.last_modified || new Date().toISOString(),
      profile.created_at,
      profile.updated_at,
    );

    // If online and authenticated, save to Supabase
    if (isOnline && userId) {
      try {
        const { data: remoteProfile, error } = await withTimeout(
          supabase
            .from('profiles')
            .upsert([
              {
                id: profile.id,
                user_id: profile.user_id,
                child_name: profile.child_name,
                avatar_id: profile.avatar_id,
                selected_buddy: profile.selected_buddy,
                bolt_balance: profile.bolt_balance,
                created_at: profile.created_at,
                updated_at: profile.updated_at,
              },
            ])
            .select()
            .maybeSingle(),
        );

        if (error) throw error;

        if (remoteProfile) {
          await db.runAsync(`UPDATE profiles SET sync_status = 'synced' WHERE id = ?`, profile.id);
          return {
            ...remoteProfile,
            is_guest: false,
            sync_status: 'synced',
          };
        }
      } catch (err) {
        console.error('Supabase profile sync error:', err);
        // Ensure marked as pending in SQLite and queued
        await db.runAsync(
          `UPDATE profiles SET sync_status = 'pending', last_modified = ? WHERE id = ?`,
          new Date().toISOString(),
          profile.id,
        );

        await db.runAsync(
          `INSERT INTO sync_queue (table_name, operation, data) VALUES (?, ?, ?)`,
          'profiles',
          'UPSERT',
          JSON.stringify(profile),
        );
      }
    } else if (!profile.is_guest) {
      // Offline and not a guest, queue in sync_queue
      await db.runAsync(
        `INSERT INTO sync_queue (table_name, operation, data) VALUES (?, ?, ?)`,
        'profiles',
        'UPSERT',
        JSON.stringify(profile),
      );
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
      try {
        // Use .or() to search by either id or user_id
        const { data: remoteProfile, error } = await withTimeout(
          supabase.from('profiles').select('*').or(`id.eq.${id},user_id.eq.${id}`).maybeSingle(), // Use maybeSingle to avoid 406 error if not found
        );

        if (!error && remoteProfile) {
          // Cache to local SQLite - set is_guest to 0 as it came from Supabase
          await db.runAsync(
            `INSERT OR REPLACE INTO profiles (id, user_id, child_name, avatar_id, selected_buddy, bolt_balance, is_guest, sync_status, last_modified, created_at, updated_at)
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            remoteProfile.id,
            remoteProfile.user_id,
            remoteProfile.child_name,
            remoteProfile.avatar_id,
            remoteProfile.selected_buddy,
            remoteProfile.bolt_balance,
            0,
            'synced',
            new Date().toISOString(),
            remoteProfile.created_at,
            remoteProfile.updated_at,
          );
          return {
            ...remoteProfile,
            is_guest: false,
            sync_status: 'synced',
          };
        } else if (error) {
          console.error('Supabase getProfile error:', error.message);
        }
      } catch (err) {
        console.error('Supabase getProfile failed:', err);
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

    const isOnline = await this.isOnline();
    const updatedAt = new Date().toISOString();
    const lastModified = new Date().toISOString();
    const syncStatus = isOnline ? 'synced' : 'pending';

    const updatedProfile: Profile = {
      ...guestProfile,
      user_id: userId,
      is_guest: false,
      sync_status: syncStatus,
      last_modified: lastModified,
      updated_at: updatedAt,
    };

    // Update locally
    await db.runAsync(
      `UPDATE profiles SET user_id = ?, is_guest = 0, sync_status = ?, last_modified = ?, updated_at = ? WHERE id = ?`,
      userId,
      syncStatus,
      lastModified,
      updatedAt,
      guestId,
    );

    // Sync to Supabase
    if (isOnline) {
      try {
        const { data: remoteProfile, error } = await withTimeout(
          supabase
            .from('profiles')
            .upsert([
              {
                id: updatedProfile.id,
                user_id: updatedProfile.user_id,
                child_name: updatedProfile.child_name,
                avatar_id: updatedProfile.avatar_id,
                selected_buddy: updatedProfile.selected_buddy,
                bolt_balance: updatedProfile.bolt_balance,
                created_at: updatedProfile.created_at,
                updated_at: updatedProfile.updated_at,
              },
            ])
            .select()
            .maybeSingle(),
        );

        if (!error && remoteProfile) {
          return {
            ...remoteProfile,
            is_guest: false,
            sync_status: 'synced',
          };
        } else if (error) {
          throw error;
        }
      } catch (err) {
        console.error('Supabase migration error:', err);
        // Ensure it's marked as pending
        await db.runAsync(`UPDATE profiles SET sync_status = 'pending' WHERE id = ?`, guestId);
        await db.runAsync(
          `INSERT INTO sync_queue (table_name, operation, data) VALUES (?, ?, ?)`,
          'profiles',
          'UPSERT',
          JSON.stringify(updatedProfile),
        );
      }
    } else {
      await db.runAsync(
        `INSERT INTO sync_queue (table_name, operation, data) VALUES (?, ?, ?)`,
        'profiles',
        'UPSERT',
        JSON.stringify(updatedProfile),
      );
    }

    return updatedProfile;
  }

  async updateBoltBalance(profileId: string, additionalBolts: number): Promise<Profile | null> {
    const isOnline = await this.isOnline();
    const db = await initializeSQLite();

    // Get current balance
    const currentProfile = await this.getProfile(profileId);
    if (!currentProfile) return null;

    const newBalance = currentProfile.bolt_balance + additionalBolts;
    const updatedAt = new Date().toISOString();
    const lastModified = new Date().toISOString();
    const syncStatus = 'pending';

    // Update locally
    await db.runAsync(
      `UPDATE profiles SET bolt_balance = ?, sync_status = ?, last_modified = ?, updated_at = ? WHERE id = ?`,
      newBalance,
      syncStatus,
      lastModified,
      updatedAt,
      profileId,
    );

    const updatedProfile: Profile = {
      ...currentProfile,
      bolt_balance: newBalance,
      sync_status: syncStatus,
      last_modified: lastModified,
      updated_at: updatedAt,
    };

    // Sync to Supabase if not a guest
    if (isOnline && !currentProfile.is_guest) {
      try {
        const { error } = await withTimeout(
          supabase
            .from('profiles')
            .update({ bolt_balance: newBalance, updated_at: updatedAt })
            .eq('id', profileId),
        );

        if (error) throw error;

        // Update to synced on success
        await db.runAsync(`UPDATE profiles SET sync_status = 'synced' WHERE id = ?`, profileId);
        updatedProfile.sync_status = 'synced';
      } catch (err) {
        console.error('Supabase balance update error:', err);
        // Mark as pending
        await db.runAsync(`UPDATE profiles SET sync_status = 'pending' WHERE id = ?`, profileId);
        // Queue for sync later
        await db.runAsync(
          `INSERT INTO sync_queue (table_name, operation, data) VALUES (?, ?, ?)`,
          'profiles',
          'UPDATE',
          JSON.stringify({ id: profileId, bolt_balance: newBalance, updated_at: updatedAt }),
        );
      }
    } else if (!isOnline && !currentProfile.is_guest) {
      // Offline, queue for sync
      await db.runAsync(
        `INSERT INTO sync_queue (table_name, operation, data) VALUES (?, ?, ?)`,
        'profiles',
        'UPDATE',
        JSON.stringify({ id: profileId, bolt_balance: newBalance, updated_at: updatedAt }),
      );
    }

    return updatedProfile;
  }
}

export const profileService = new ProfileService();
