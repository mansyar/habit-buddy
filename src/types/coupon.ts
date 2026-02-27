export interface Coupon {
  id: string;
  profile_id: string;
  title: string;
  bolt_cost: number;
  category: 'Physical' | 'Privilege' | 'Activity';
  is_redeemed: boolean;
  sync_status?: 'synced' | 'pending';
  last_modified?: string;
  retry_count?: number;
  created_at: string;
}
