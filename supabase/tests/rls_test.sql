begin;
select plan(5);

-- 1. Setup: Create dummy users
insert into auth.users (id, email) 
values 
('00000000-0000-0000-0000-000000000001', 'user1@example.com'),
('00000000-0000-0000-0000-000000000002', 'user2@example.com');

-- 2. Test Profile Insertion (Should succeed for own profile)
set local role authenticated;
select set_config('request.jwt.claims', '{"sub": "00000000-0000-0000-0000-000000000001"}', true);

select lives_ok(
    $$ insert into public.profiles (user_id, child_name) values ('00000000-0000-0000-0000-000000000001', 'User 1 Child') $$,
    'Users can insert their own profile'
);

-- 3. Test Profile Isolation (Should fail for someone else's profile)
select throws_ok(
    $$ insert into public.profiles (user_id, child_name) values ('00000000-0000-0000-0000-000000000002', 'User 2 Child') $$,
    'new row violates row-level security policy for table "profiles"',
    'Users cannot insert a profile for a different user ID'
);

-- 4. Test Habit Log Access (Should succeed for own profile)
-- Get the profile ID created in step 2
select lives_ok(
    $$ insert into public.habits_log (profile_id, habit_id, status) 
       values ((select id from public.profiles where user_id = '00000000-0000-0000-0000-000000000001'), 'brush_teeth', 'success') $$,
    'Users can insert habit logs for their own profile'
);

-- 5. Test Habit Log Isolation (Should fail for someone else's profile)
-- Switch to user 2
select set_config('request.jwt.claims', '{"sub": "00000000-0000-0000-0000-000000000002"}', true);

select throws_ok(
    $$ insert into public.habits_log (profile_id, habit_id, status) 
       values ((select id from public.profiles where user_id = '00000000-0000-0000-0000-000000000001'), 'brush_teeth', 'success') $$,
    'new row violates row-level security policy for table "habits_log"',
    'Users cannot insert habit logs for a profile they do not own'
);

-- 6. Test Coupon Access (Should succeed for own profile)
select set_config('request.jwt.claims', '{"sub": "00000000-0000-0000-0000-000000000001"}', true);

select lives_ok(
    $$ insert into public.coupons (profile_id, title, bolt_cost) 
       values ((select id from public.profiles where user_id = '00000000-0000-0000-0000-000000000001'), 'Ice Cream', 10) $$,
    'Users can insert coupons for their own profile'
);

select * from finish();
rollback;
