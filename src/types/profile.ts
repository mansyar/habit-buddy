export interface Profile {
  id: string;
  user_id: string | null;
  child_name: string;
  avatar_id: string;
  bolt_balance: number;
  is_guest: boolean;
  created_at: string;
  updated_at: string;
}
