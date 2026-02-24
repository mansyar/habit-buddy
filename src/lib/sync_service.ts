import { supabase } from './supabase';
import { initializeSQLite } from './sqlite';
import { checkIsOnline } from './network';

export interface SyncItem {
  id: number;
  table_name: string;
  operation: 'INSERT' | 'UPDATE' | 'DELETE';
  data: string;
  status: 'pending' | 'processing' | 'failed';
}

class SyncService {
  private isSyncing = false;

  async processQueue(): Promise<void> {
    if (this.isSyncing) return;

    const isOnline = await checkIsOnline();
    if (!isOnline) return;

    this.isSyncing = true;
    console.log('SyncService: Starting synchronization...');

    try {
      const db = await initializeSQLite();
      const queue = db.getAllSync(
        `SELECT * FROM sync_queue WHERE status = 'pending' ORDER BY created_at ASC`,
      ) as SyncItem[];

      if (queue.length === 0) {
        console.log('SyncService: Queue is empty.');
        this.isSyncing = false;
        return;
      }

      for (const item of queue) {
        let data;
        try {
          data = JSON.parse(item.data);
        } catch (e) {
          console.error(`SyncService: Malformed data in item ${item.id}`);
          db.runSync(`UPDATE sync_queue SET status = 'failed' WHERE id = ?`, item.id);
          continue;
        }

        let success = false;

        try {
          if (item.operation === 'INSERT') {
            const { error } = await supabase.from(item.table_name).insert([data]);
            if (!error) success = true;
            else console.error(`SyncService: Insert failed for ${item.table_name}:`, error.message);
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
            db.runSync(`DELETE FROM sync_queue WHERE id = ?`, item.id);
          } else {
            db.runSync(`UPDATE sync_queue SET status = 'failed' WHERE id = ?`, item.id);
          }
        } catch (e: any) {
          console.error(`SyncService: Error processing item ${item.id}:`, e.message);
          db.runSync(`UPDATE sync_queue SET status = 'failed' WHERE id = ?`, item.id);
        }
      }
    } catch (e: any) {
      console.error('SyncService: Synchronization failed:', e.message);
    } finally {
      this.isSyncing = false;
      console.log('SyncService: Synchronization complete.');
    }
  }
}

export const syncService = new SyncService();
