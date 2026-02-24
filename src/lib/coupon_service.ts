import { supabase } from './supabase';
import { initializeSQLite } from './sqlite';
import { checkIsOnline } from './network';
import { Coupon } from '../types/coupon';
import * as Crypto from 'expo-crypto';

class CouponService {
  async createCoupon(data: {
    profile_id: string;
    title: string;
    bolt_cost: number;
  }): Promise<Coupon> {
    const isOnline = await checkIsOnline();
    const id = Crypto.randomUUID();
    const created_at = new Date().toISOString();

    const coupon: Coupon = {
      id,
      ...data,
      is_redeemed: false,
      created_at,
    };

    // Save to local SQLite
    const db = await initializeSQLite();
    await db.runAsync(
      `INSERT INTO coupons (id, profile_id, title, bolt_cost, is_redeemed, created_at)
       VALUES (?, ?, ?, ?, ?, ?)`,
      coupon.id,
      coupon.profile_id,
      coupon.title,
      coupon.bolt_cost,
      0,
      coupon.created_at,
    );

    // Sync to Supabase if online
    if (isOnline) {
      const { error } = await supabase.from('coupons').insert([coupon]).select().single();

      if (error) {
        console.error('Supabase coupon sync error:', error.message);
        await db.runAsync(
          `INSERT INTO sync_queue (table_name, operation, data) VALUES (?, ?, ?)`,
          'coupons',
          'INSERT',
          JSON.stringify(coupon),
        );
      }
    } else {
      await db.runAsync(
        `INSERT INTO sync_queue (table_name, operation, data) VALUES (?, ?, ?)`,
        'coupons',
        'INSERT',
        JSON.stringify(coupon),
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
            `INSERT OR REPLACE INTO coupons (id, profile_id, title, bolt_cost, is_redeemed, created_at)
             VALUES (?, ?, ?, ?, ?, ?)`,
            c.id,
            c.profile_id,
            c.title,
            c.bolt_cost,
            c.is_redeemed ? 1 : 0,
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

    // Update locally
    await db.runAsync(`UPDATE coupons SET is_redeemed = 1 WHERE id = ?`, id);

    // Sync to Supabase
    if (isOnline) {
      const { error } = await supabase.from('coupons').update({ is_redeemed: true }).eq('id', id);

      if (error) {
        console.error('Supabase coupon redeem sync error:', error.message);
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
}

export const couponService = new CouponService();
