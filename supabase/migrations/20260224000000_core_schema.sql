-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- PROFILES table
create table if not exists public.profiles (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references auth.users(id) on delete cascade,
  child_name text not null,
  avatar_id text,
  bolt_balance integer default 0 check (bolt_balance >= 0),
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- Index for user_id to speed up lookups
create index if not exists profiles_user_id_idx on public.profiles (user_id);

-- HABITS_LOG table
create table if not exists public.habits_log (
  id uuid primary key default uuid_generate_v4(),
  profile_id uuid references public.profiles(id) on delete cascade not null,
  habit_id text not null,
  status text not null check (status in ('success', 'sleepy')),
  duration_seconds integer default 0,
  bolts_earned integer default 0,
  completed_at timestamp with time zone default now()
);

-- Index for profile_id
create index if not exists habits_log_profile_id_idx on public.habits_log (profile_id);

-- COUPONS table
create table if not exists public.coupons (
  id uuid primary key default uuid_generate_v4(),
  profile_id uuid references public.profiles(id) on delete cascade not null,
  title text not null,
  bolt_cost integer not null check (bolt_cost >= 0),
  is_redeemed boolean default false,
  created_at timestamp with time zone default now()
);

-- Index for profile_id
create index if not exists coupons_profile_id_idx on public.coupons (profile_id);

-- Set up RLS (Task for next task, but we enable it here)
alter table public.profiles enable row level security;
alter table public.habits_log enable row level security;
alter table public.coupons enable row level security;
