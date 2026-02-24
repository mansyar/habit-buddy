ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS is_guest boolean DEFAULT false;
