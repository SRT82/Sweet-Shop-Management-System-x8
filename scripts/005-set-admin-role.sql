-- Create Admin User: Shubham Rajanand Tawale
-- This script creates the user in auth.users and sets up the admin profile

-- Step 1: Delete existing user if they exist (to avoid conflicts)
DELETE FROM auth.users WHERE email = 'shubhamtawale98@gmail.com';

-- Step 2: Create auth user with email and password
INSERT INTO auth.users (
  id,
  instance_id,
  email,
  encrypted_password,
  email_confirmed_at,
  raw_app_meta_data,
  raw_user_meta_data,
  created_at,
  updated_at,
  confirmation_token,
  recovery_token,
  email_change_token_new,
  role,
  aud
) VALUES (
  gen_random_uuid(),
  '00000000-0000-0000-0000-000000000000',
  'shubhamtawale98@gmail.com',
  crypt('Pass@1234', gen_salt('bf')), -- Password: Pass@1234
  NOW(),
  '{"provider":"email","providers":["email"]}'::jsonb,
  '{"full_name":"Shubham Rajanand Tawale"}'::jsonb,
  NOW(),
  NOW(),
  '',
  '',
  '',
  'authenticated',
  'authenticated'
);

-- Step 3: Get the user ID and create profile with admin role
DO $$
DECLARE
  user_id uuid;
BEGIN
  SELECT id INTO user_id FROM auth.users WHERE email = 'shubhamtawale98@gmail.com';
  
  -- Delete existing profile if it exists
  DELETE FROM public.profiles WHERE id = user_id;
  
  -- Create new profile with admin role
  INSERT INTO public.profiles (id, full_name, email, role, created_at, updated_at)
  VALUES (
    user_id,
    'Shubham Rajanand Tawale',
    'shubhamtawale98@gmail.com',
    'admin',
    NOW(),
    NOW()
  );
END $$;

-- Step 4: Verify the admin user was created
SELECT id, full_name, email, role, created_at 
FROM profiles 
WHERE email = 'shubhamtawale98@gmail.com';
