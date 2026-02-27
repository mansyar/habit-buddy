export interface Profile {
  id: string;
  user_id: string | null;
  child_name: string;
  avatar_id: string;
  selected_buddy: string;
  bolt_balance: number;
  is_guest: boolean;
  sync_status?: 'synced' | 'pending';
  last_modified?: string;
  retry_count?: number;
  created_at: string;
  updated_at: string;
}
