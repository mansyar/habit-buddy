export interface Coupon {
  id: string;
  profile_id: string;
  title: string;
  bolt_cost: number;
  category: 'Physical' | 'Privilege' | 'Activity';
  is_redeemed: boolean;
  created_at: string;
}
