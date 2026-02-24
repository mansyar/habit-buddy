-- RLS Policies for PROFILES
create policy "Users can only access their own profile"
  on public.profiles
  for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- RLS Policies for HABITS_LOG
create policy "Users can only access their own habit logs"
  on public.habits_log
  for all
  using (
    exists (
      select 1 from public.profiles
      where profiles.id = habits_log.profile_id
      and profiles.user_id = auth.uid()
    )
  )
  with check (
    exists (
      select 1 from public.profiles
      where profiles.id = habits_log.profile_id
      and profiles.user_id = auth.uid()
    )
  );

-- RLS Policies for COUPONS
create policy "Users can only access their own coupons"
  on public.coupons
  for all
  using (
    exists (
      select 1 from public.profiles
      where profiles.id = coupons.profile_id
      and profiles.user_id = auth.uid()
    )
  )
  with check (
    exists (
      select 1 from public.profiles
      where profiles.id = coupons.profile_id
      and profiles.user_id = auth.uid()
    )
  );
