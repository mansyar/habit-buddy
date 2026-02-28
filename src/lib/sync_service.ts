import { supabase, withTimeout } from './supabase';
import { initializeSQLite } from './sqlite';
import { checkIsOnline, networkService } from './network';

export interface SyncItem {
  id: number;
  table_name: string;
  operation: 'INSERT' | 'UPDATE' | 'DELETE' | 'UPSERT';
  data: string;
  status: 'pending' | 'processing' | 'failed';
  retry_count: number;
}

class SyncService {
  private isSyncing = false;
  private MAX_RETRIES = 3;
  private BASE_RETRY_DELAY = 30000; // 30 seconds

  /**
   * Exponential backoff calculation.
   * Returns true if enough time has passed since last_retry.
   */
  private shouldRetry(retryCount: number, lastRetryStr: string | null): boolean {
    if (!lastRetryStr || retryCount === 0) return true;

    const lastRetry = new Date(lastRetryStr).getTime();
    const now = Date.now();

    // delay = base * 2^(retryCount - 1)
    const delay = this.BASE_RETRY_DELAY * Math.pow(2, retryCount - 1);

    return now - lastRetry >= delay;
  }

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
    networkService.setSyncError(false);

    try {
      // 1. Sync pending records in core tables (using sync markers)
      await this.syncPendingChanges();

      // 2. Process legacy sync_queue for complex operations
      await this.processSyncQueue();

      // 3. Check if we have persistent failures
      await this.checkSyncFailures();
    } catch (e: any) {
      console.error('SyncService: Synchronization failed:', e.message);
    } finally {
      this.isSyncing = false;
      console.log('SyncService: Synchronization complete.');
    }
  }

  /**
   * Checks if any records have hit MAX_RETRIES.
   */
  private async checkSyncFailures(): Promise<void> {
    const db = await initializeSQLite();
    const tables = ['profiles', 'habits_log', 'coupons'];

    let hasFailures = false;

    for (const table of tables) {
      const failed = await db.getFirstAsync(
        `SELECT id FROM ${table} WHERE sync_status = 'pending' AND retry_count >= ?`,
        this.MAX_RETRIES,
      );
      if (failed) {
        hasFailures = true;
        break;
      }
    }

    if (!hasFailures) {
      const queueFailed = await db.getFirstAsync(
        `SELECT id FROM sync_queue WHERE status = 'pending' AND retry_count >= ?`,
        this.MAX_RETRIES,
      );
      if (queueFailed) hasFailures = true;
    }

    networkService.setSyncError(hasFailures);
  }

  /**
   * Finds all records with sync_status = 'pending' in core tables and pushes them to Supabase.
   */
  async syncPendingChanges(): Promise<void> {
    const db = await initializeSQLite();
    const tablesToSync = ['profiles', 'habits_log', 'coupons'];

    for (const table of tablesToSync) {
      // Pick records that haven't exceeded MAX_RETRIES.
      // We still filter by retry_count here for efficiency,
      // then shouldRetry handles the time-based backoff.
      const pendingRecords = (await db.getAllAsync(
        `SELECT * FROM ${table} WHERE sync_status = 'pending' AND retry_count < ?`,
        this.MAX_RETRIES,
      )) as any[];

      if (pendingRecords.length === 0) continue;

      console.log(`SyncService: Found ${pendingRecords.length} pending records in ${table}`);

      for (const record of pendingRecords) {
        // Apply backoff check
        if (!this.shouldRetry(record.retry_count, record.last_retry)) {
          continue;
        }

        // Prepare record for Supabase (remove internal sync columns)
        const { sync_status, last_modified, retry_count, last_retry, ...supabaseData } = record;

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
            // Success! Mark as synced locally and reset retry count
            await db.runAsync(
              `UPDATE ${table} SET sync_status = 'synced', retry_count = 0, last_retry = NULL WHERE id = ?`,
              record.id,
            );
          } else {
            // Failure! Increment retry count and set last_retry
            await db.runAsync(
              `UPDATE ${table} SET retry_count = retry_count + 1, last_retry = ? WHERE id = ?`,
              new Date().toISOString(),
              record.id,
            );
            console.error(
              `SyncService: Failed to sync ${table} record ${record.id}:`,
              error.message,
            );
          }
        } catch (e: any) {
          console.error(`SyncService: Error syncing ${table} record ${record.id}:`, e.message);
          await db.runAsync(
            `UPDATE ${table} SET retry_count = retry_count + 1, last_retry = ? WHERE id = ?`,
            new Date().toISOString(),
            record.id,
          );
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
      `SELECT * FROM sync_queue WHERE status = 'pending' AND retry_count < ? ORDER BY created_at ASC`,
      this.MAX_RETRIES,
    )) as SyncItem[];

    if (queue.length === 0) return;

    for (const item of queue) {
      // Apply backoff check
      if (!this.shouldRetry(item.retry_count, item.last_retry)) {
        continue;
      }

      let data;
      try {
        data = JSON.parse(item.data);
      } catch {
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
          // Increment retry count and set last_retry
          await db.runAsync(
            `UPDATE sync_queue SET retry_count = retry_count + 1, last_retry = ? WHERE id = ?`,
            new Date().toISOString(),
            item.id,
          );
        }
      } catch (e: any) {
        console.error(`SyncService: Error processing queue item ${item.id}:`, e.message);
        await db.runAsync(
          `UPDATE sync_queue SET retry_count = retry_count + 1, last_retry = ? WHERE id = ?`,
          new Date().toISOString(),
          item.id,
        );
      }
    }
  }

  /**
   * Subscribes to Supabase Realtime changes for all core tables.
   * This ensures multi-device synchronization.
   */
  async subscribeToAllChanges(): Promise<() => void> {
    const channel = supabase
      .channel('schema-db-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
        },
        async (payload: any) => {
          const { table, eventType, new: newRecord, old: oldRecord } = payload;
          const db = await initializeSQLite();

          console.log(`SyncService: Realtime ${eventType} on ${table}`);

          if (eventType === 'INSERT' || eventType === 'UPDATE') {
            const record = newRecord;

            // Map types for SQLite
            if (table === 'profiles') {
              await db.runAsync(
                `INSERT OR REPLACE INTO profiles (id, user_id, child_name, avatar_id, selected_buddy, bolt_balance, is_guest, sync_status, retry_count, last_modified, created_at, updated_at)
                 VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
                record.id,
                record.user_id,
                record.child_name,
                record.avatar_id,
                record.selected_buddy,
                record.bolt_balance,
                0, // Came from Supabase, not guest
                'synced',
                0, // Reset retry count
                new Date().toISOString(),
                record.created_at,
                record.updated_at,
              );
            } else if (table === 'habits_log') {
              await db.runAsync(
                `INSERT OR REPLACE INTO habits_log (id, profile_id, habit_id, status, duration_seconds, bolts_earned, sync_status, retry_count, last_modified, completed_at)
                 VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
                record.id,
                record.profile_id,
                record.habit_id,
                record.status,
                record.duration_seconds,
                record.bolts_earned,
                'synced',
                0,
                new Date().toISOString(),
                record.completed_at,
              );
            } else if (table === 'coupons') {
              await db.runAsync(
                `INSERT OR REPLACE INTO coupons (id, profile_id, title, bolt_cost, category, is_redeemed, sync_status, retry_count, last_modified, created_at)
                 VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
                record.id,
                record.profile_id,
                record.title,
                record.bolt_cost,
                record.category || 'Physical',
                record.is_redeemed ? 1 : 0,
                'synced',
                0,
                new Date().toISOString(),
                record.created_at,
              );
            }
          } else if (eventType === 'DELETE') {
            const id = (oldRecord as any).id;
            if (id) {
              await db.runAsync(`DELETE FROM ${table} WHERE id = ?`, id);
            }
          }
        },
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }
}

export const syncService = new SyncService();
