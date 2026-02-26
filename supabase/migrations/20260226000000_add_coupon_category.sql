-- Add category column to coupons table
ALTER TABLE coupons ADD COLUMN category TEXT DEFAULT 'Physical' CHECK (category IN ('Physical', 'Privilege', 'Activity'));
