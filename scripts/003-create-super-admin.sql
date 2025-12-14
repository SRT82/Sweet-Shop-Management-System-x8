-- Create Super Admin User
-- This script will create a super admin account for Shubham Rajanand Tawale

-- Note: This creates the user directly in auth.users
-- Password: Iamtheshubhamtawale
-- Email: shubhamtawale98@gmail.com

-- Insert into auth.users (this requires admin privileges)
INSERT INTO auth.users (
  instance_id,
  id,
  aud,
  role,
  email,
  encrypted_password,
  email_confirmed_at,
  created_at,
  updated_at,
  raw_app_meta_data,
  raw_user_meta_data,
  is_super_admin,
  confirmation_token
)
VALUES (
  '00000000-0000-0000-0000-000000000000',
  gen_random_uuid(),
  'authenticated',
  'authenticated',
  'shubhamtawale98@gmail.com',
  crypt('Iamtheshubhamtawale', gen_salt('bf')),
  now(),
  now(),
  now(),
  '{"provider":"email","providers":["email"]}',
  '{"full_name":"Shubham Rajanand Tawale"}',
  false,
  ''
);

-- Get the user ID that was just created
DO $$
DECLARE
  user_uuid uuid;
BEGIN
  SELECT id INTO user_uuid FROM auth.users WHERE email = 'shubhamtawale98@gmail.com';
  
  -- Create profile with admin role
  INSERT INTO public.profiles (id, email, full_name, role, created_at)
  VALUES (
    user_uuid,
    'shubhamtawale98@gmail.com',
    'Shubham Rajanand Tawale',
    'admin',
    now()
  )
  ON CONFLICT (id) DO UPDATE
  SET role = 'admin', full_name = 'Shubham Rajanand Tawale';
END $$;
