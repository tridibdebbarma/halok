-- ==========================================
-- Run this in Supabase SQL Editor to confirm
-- the admin user so they can log in
-- ==========================================

-- Confirm the admin user's email (bypass email verification)
UPDATE auth.users 
SET email_confirmed_at = NOW(),
    confirmation_token = '',
    raw_app_meta_data = raw_app_meta_data || '{"provider":"email","providers":["email"]}'::jsonb
WHERE email = 'admin@halok.co.in';

-- Verify it worked (should show the confirmed user)
SELECT id, email, email_confirmed_at, created_at 
FROM auth.users 
WHERE email = 'admin@halok.co.in';
