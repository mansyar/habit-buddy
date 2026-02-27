import { supabase } from './supabase';
import { initializeSQLite } from './sqlite';
import { profileService } from './profile_service';
import { checkIsOnline } from './network';
import { Coupon } from '../types/coupon';
import * as Crypto from 'expo-crypto';

class CouponService {
  async createCoupon(data: {
    profile_id: string;
    title: string;
    bolt_cost: number;
    category?: 'Physical' | 'Privilege' | 'Activity';
  }): Promise<Coupon> {
    const isOnline = await checkIsOnline();
    const id = Crypto.randomUUID();
    const created_at = new Date().toISOString();
    const lastModified = new Date().toISOString();
    const syncStatus = isOnline ? 'synced' : 'pending';

    const coupon: Coupon = {
      id,
      category: 'Physical',
      ...data,
      is_redeemed: false,
      sync_status: syncStatus,
      last_modified: lastModified,
      created_at,
    };

    // Save to local SQLite
    const db = await initializeSQLite();
    await db.runAsync(
      `INSERT INTO coupons (id, profile_id, title, bolt_cost, category, is_redeemed, sync_status, last_modified, created_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      coupon.id,
      coupon.profile_id,
      coupon.title,
      coupon.bolt_cost,
      coupon.category,
      0,
      coupon.sync_status || 'pending',
      coupon.last_modified || new Date().toISOString(),
      coupon.created_at,
    );

    // Sync to Supabase if online
    if (isOnline) {
      const { sync_status, last_modified, ...supabaseCoupon } = coupon;
      const { error } = await supabase.from('coupons').insert([supabaseCoupon]).select().single();

      if (error) {
        console.error('Supabase coupon sync error:', error.message);
        await db.runAsync(`UPDATE coupons SET sync_status = 'pending' WHERE id = ?`, coupon.id);
        await db.runAsync(
          `INSERT INTO sync_queue (table_name, operation, data) VALUES (?, ?, ?)`,
          'coupons',
          'INSERT',
          JSON.stringify(supabaseCoupon),
        );
      }
    } else {
      const { sync_status, last_modified, ...supabaseCoupon } = coupon;
      await db.runAsync(
        `INSERT INTO sync_queue (table_name, operation, data) VALUES (?, ?, ?)`,
        'coupons',
        'INSERT',
        JSON.stringify(supabaseCoupon),
      );
    }

    return coupon;
  }

  async getCoupons(profile_id: string): Promise<Coupon[]> {
    const isOnline = await checkIsOnline();
    const db = await initializeSQLite();
    const localCoupons = (await db.getAllAsync(
      `SELECT * FROM coupons WHERE profile_id = ?`,
      profile_id,
    )) as any[];

    const formattedCoupons = localCoupons.map((c) => ({
      ...c,
      is_redeemed: !!c.is_redeemed,
    }));

    if (formattedCoupons.length > 0) return formattedCoupons;

    if (isOnline) {
      const { data: remoteCoupons, error } = await supabase
        .from('coupons')
        .select('*')
        .eq('profile_id', profile_id);

      if (!error && remoteCoupons) {
        // Cache to local SQLite
        for (const c of remoteCoupons) {
          await db.runAsync(
            `INSERT OR REPLACE INTO coupons (id, profile_id, title, bolt_cost, category, is_redeemed, sync_status, last_modified, created_at)
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            c.id,
            c.profile_id,
            c.title,
            c.bolt_cost,
            c.category || 'Physical',
            c.is_redeemed ? 1 : 0,
            'synced',
            new Date().toISOString(),
            c.created_at,
          );
        }
        return remoteCoupons;
      }
    }

    return [];
  }

  async redeemCoupon(id: string): Promise<void> {
    const isOnline = await checkIsOnline();
    const db = await initializeSQLite();

    // 1. Fetch coupon details
    const coupon = (await db.getFirstAsync(
      `SELECT * FROM coupons WHERE id = ?`,
      id,
    )) as Coupon | null;

    if (!coupon) throw new Error('Coupon not found');
    if (coupon.is_redeemed) throw new Error('Coupon already redeemed');

    // 2. Fetch profile to check balance
    const profile = await profileService.getProfile(coupon.profile_id);
    if (!profile) throw new Error('Profile not found');

    if (profile.bolt_balance < coupon.bolt_cost) {
      throw new Error('Insufficient bolts');
    }

    // 3. Deduct bolts
    await profileService.updateBoltBalance(coupon.profile_id, -coupon.bolt_cost);

    // 4. Update locally
    const lastModified = new Date().toISOString();
    const syncStatus = isOnline ? 'synced' : 'pending';
    await db.runAsync(
      `UPDATE coupons SET is_redeemed = 1, sync_status = ?, last_modified = ? WHERE id = ?`,
      syncStatus,
      lastModified,
      id,
    );

    // Sync to Supabase
    if (isOnline) {
      const { error } = await supabase.from('coupons').update({ is_redeemed: true }).eq('id', id);

      if (error) {
        console.error('Supabase coupon redeem sync error:', error.message);
        await db.runAsync(`UPDATE coupons SET sync_status = 'pending' WHERE id = ?`, id);
        await db.runAsync(
          `INSERT INTO sync_queue (table_name, operation, data) VALUES (?, ?, ?)`,
          'coupons',
          'UPDATE',
          JSON.stringify({ id, is_redeemed: true }),
        );
      }
    } else {
      await db.runAsync(
        `INSERT INTO sync_queue (table_name, operation, data) VALUES (?, ?, ?)`,
        'coupons',
        'UPDATE',
        JSON.stringify({ id, is_redeemed: true }),
      );
    }
  }

  async deleteCoupon(id: string): Promise<void> {
    const isOnline = await checkIsOnline();
    const db = await initializeSQLite();

    // Delete locally
    await db.runAsync(`DELETE FROM coupons WHERE id = ?`, id);

    // Sync to Supabase
    if (isOnline) {
      const { error } = await supabase.from('coupons').delete().eq('id', id);

      if (error) {
        console.error('Supabase coupon delete error:', error.message);
        await db.runAsync(
          `INSERT INTO sync_queue (table_name, operation, data) VALUES (?, ?, ?)`,
          'coupons',
          'DELETE',
          JSON.stringify({ id }),
        );
      }
    } else {
      await db.runAsync(
        `INSERT INTO sync_queue (table_name, operation, data) VALUES (?, ?, ?)`,
        'coupons',
        'DELETE',
        JSON.stringify({ id }),
      );
    }
  }

  async updateCoupon(id: string, data: Partial<Coupon>): Promise<void> {
    const isOnline = await checkIsOnline();
    const db = await initializeSQLite();

    // Update locally
    const lastModified = new Date().toISOString();
    const syncStatus = isOnline ? 'synced' : 'pending';

    const entries = Object.entries(data);
    const sets = entries.map(([key]) => `${key} = ?`).join(', ');
    const values = entries.map(([, value]) => value);

    await db.runAsync(
      `UPDATE coupons SET ${sets}, sync_status = ?, last_modified = ? WHERE id = ?`,
      ...values,
      syncStatus,
      lastModified,
      id,
    );

    // Sync to Supabase
    if (isOnline) {
      const { error } = await supabase.from('coupons').update(data).eq('id', id);

      if (error) {
        console.error('Supabase coupon update error:', error.message);
        await db.runAsync(`UPDATE coupons SET sync_status = 'pending' WHERE id = ?`, id);
        await db.runAsync(
          `INSERT INTO sync_queue (table_name, operation, data) VALUES (?, ?, ?)`,
          'coupons',
          'UPDATE',
          JSON.stringify({ id, ...data }),
        );
      }
    } else {
      await db.runAsync(
        `INSERT INTO sync_queue (table_name, operation, data) VALUES (?, ?, ?)`,
        'coupons',
        'UPDATE',
        JSON.stringify({ id, ...data }),
      );
    }
  }
}

export const couponService = new CouponService();
