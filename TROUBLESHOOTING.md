# Troubleshooting Guide

## "Database error querying schema" Error

This error occurs when the database tables haven't been created yet. Follow these steps:

### Step 1: Run the SQL Scripts

1. Go to your Supabase dashboard: https://supabase.com/dashboard
2. Select your project
3. Click on "SQL Editor" in the left sidebar
4. Run each script in order:

#### Script 1: Create Tables (001-create-tables.sql)
- Copy the contents of `scripts/001-create-tables.sql`
- Paste into SQL Editor
- Click "Run"
- You should see: "Success. No rows returned"

#### Script 2: Seed Data (002-seed-data.sql)
- Copy the contents of `scripts/002-seed-data.sql`
- Paste into SQL Editor
- Click "Run"
- You should see: "Success. X rows returned" (sample sweets data)

#### Script 3: Fix Auth Trigger (004-fix-auth-trigger.sql)
- Copy the contents of `scripts/004-fix-auth-trigger.sql`
- Paste into SQL Editor
- Click "Run"

#### Script 4: Create Admin (005-set-admin-role.sql)
- Copy the contents of `scripts/005-set-admin-role.sql`
- Paste into SQL Editor
- Click "Run"
- This creates your admin account with email: shubhamtawale98@gmail.com

### Step 2: Verify Tables Were Created

Run this query in SQL Editor:
\`\`\`sql
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public'
ORDER BY table_name;
\`\`\`

You should see:
- profiles
- purchases
- sweets

### Step 3: Check Row Level Security

Run this query:
\`\`\`sql
SELECT schemaname, tablename, policyname 
FROM pg_policies 
WHERE schemaname = 'public';
\`\`\`

You should see multiple RLS policies for each table.

### Step 4: Verify Admin Account

Run this query:
\`\`\`sql
SELECT id, email, role FROM profiles WHERE email = 'shubhamtawale98@gmail.com';
\`\`\`

You should see your admin profile with role = 'admin'.

### Step 5: Test Login

1. Go to `/auth/login`
2. Login with:
   - Email: shubhamtawale98@gmail.com
   - Password: Pass@1234
3. You should be redirected to the dashboard
4. Click "Admin Panel" button to access admin features

## Common Issues

### Issue: "No rows returned" for sweets
**Solution**: Run script `002-seed-data.sql` to add sample sweets.

### Issue: Can't see Admin Panel button
**Solution**: Your account isn't set as admin. Run `005-set-admin-role.sql`.

### Issue: "User not found" after signup
**Solution**: The auto-profile creation trigger might have failed. The app should create profiles automatically now.

### Issue: Console shows "[v0] Error..."
**Solution**: Check the browser console (F12) for detailed error messages. The logs will tell you exactly which query is failing.

## Debug Mode

The app now has debug logging enabled. Open your browser console (F12) to see:
- `[v0] Dashboard - User:` - Shows current user
- `[v0] Dashboard - Profile query:` - Shows profile fetch result
- `[v0] Admin page - User:` - Shows admin authentication
- `[v0] Error fetching sweets:` - Shows database query errors

## Still Having Issues?

1. Check that all environment variables are set in Vercel/v0
2. Verify your Supabase project is active (not paused)
3. Check the Supabase logs in your dashboard under "Logs" → "Postgres Logs"
4. Make sure RLS policies are enabled and correct
