import { supabase } from './supabase';
import { initializeSQLite } from './sqlite';
import { checkIsOnline } from './network';

export interface SyncItem {
  id: number;
  table_name: string;
  operation: 'INSERT' | 'UPDATE' | 'DELETE' | 'UPSERT';
  data: string;
  status: 'pending' | 'processing' | 'failed';
}

class SyncService {
  private isSyncing = false;

  /**
   * Main entry point for synchronization.
   * Processes both the explicit sync_queue and pending records in tables.
   */
  async processQueue(): Promise<void> {
    if (this.isSyncing) return;

    const isOnline = await checkIsOnline();
    if (!isOnline) return;

    this.isSyncing = true;
    console.log('SyncService: Starting synchronization...');

    try {
      // 1. Sync pending records in core tables (using sync markers)
      await this.syncPendingChanges();

      // 2. Process legacy sync_queue for complex operations
      await this.processSyncQueue();
    } catch (e: any) {
      console.error('SyncService: Synchronization failed:', e.message);
    } finally {
      this.isSyncing = false;
      console.log('SyncService: Synchronization complete.');
    }
  }

  /**
   * Finds all records with sync_status = 'pending' in core tables and pushes them to Supabase.
   */
  private async syncPendingChanges(): Promise<void> {
    const db = await initializeSQLite();
    const tablesToSync = ['profiles', 'habits_log', 'coupons'];

    for (const table of tablesToSync) {
      const pendingRecords = (await db.getAllAsync(
        `SELECT * FROM ${table} WHERE sync_status = 'pending'`,
      )) as any[];

      if (pendingRecords.length === 0) continue;

      console.log(`SyncService: Found ${pendingRecords.length} pending records in ${table}`);

      for (const record of pendingRecords) {
        // Prepare record for Supabase (remove internal sync columns)
        const { sync_status, last_modified, ...supabaseData } = record;

        // Handle boolean fields for SQLite -> Supabase mapping if needed
        if (table === 'profiles') {
          supabaseData.is_guest = undefined; // Supabase doesn't have is_guest
        } else if (table === 'coupons') {
          supabaseData.is_redeemed = !!supabaseData.is_redeemed;
        }

        try {
          // Push to Supabase using upsert (Last-Write-Wins policy from client)
          const { error } = await supabase.from(table).upsert([supabaseData]);

          if (!error) {
            // Success! Mark as synced locally
            await db.runAsync(`UPDATE ${table} SET sync_status = 'synced' WHERE id = ?`, record.id);
          } else {
            console.error(
              `SyncService: Failed to sync ${table} record ${record.id}:`,
              error.message,
            );
          }
        } catch (e: any) {
          console.error(`SyncService: Error syncing ${table} record ${record.id}:`, e.message);
        }
      }
    }
  }

  /**
   * Processes the explicit sync_queue table.
   */
  private async processSyncQueue(): Promise<void> {
    const db = await initializeSQLite();
    const queue = (await db.getAllAsync(
      `SELECT * FROM sync_queue WHERE status = 'pending' ORDER BY created_at ASC`,
    )) as SyncItem[];

    if (queue.length === 0) return;

    for (const item of queue) {
      let data;
      try {
        data = JSON.parse(item.data);
      } catch (e) {
        console.error(`SyncService: Malformed data in item ${item.id}`);
        await db.runAsync(`UPDATE sync_queue SET status = 'failed' WHERE id = ?`, item.id);
        continue;
      }

      let success = false;

      try {
        if (item.operation === 'INSERT' || item.operation === 'UPSERT') {
          const { error } = await supabase.from(item.table_name).upsert([data]);
          if (!error) success = true;
          else console.error(`SyncService: Upsert failed for ${item.table_name}:`, error.message);
        } else if (item.operation === 'UPDATE') {
          const { error } = await supabase.from(item.table_name).update(data).eq('id', data.id);
          if (!error) success = true;
          else console.error(`SyncService: Update failed for ${item.table_name}:`, error.message);
        } else if (item.operation === 'DELETE') {
          const { error } = await supabase.from(item.table_name).delete().eq('id', data.id);
          if (!error) success = true;
          else console.error(`SyncService: Delete failed for ${item.table_name}:`, error.message);
        }

        if (success) {
          await db.runAsync(`DELETE FROM sync_queue WHERE id = ?`, item.id);
        } else {
          await db.runAsync(`UPDATE sync_queue SET status = 'failed' WHERE id = ?`, item.id);
        }
      } catch (e: any) {
        console.error(`SyncService: Error processing queue item ${item.id}:`, e.message);
        await db.runAsync(`UPDATE sync_queue SET status = 'failed' WHERE id = ?`, item.id);
      }
    }
  }
}

export const syncService = new SyncService();
