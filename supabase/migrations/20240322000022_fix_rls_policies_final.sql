-- Fix RLS policies that are causing 406 errors
-- Drop all existing policies that might be causing conflicts
DROP POLICY IF EXISTS "Users can view own settings" ON public.user_settings;
DROP POLICY IF EXISTS "Users can insert own settings" ON public.user_settings;
DROP POLICY IF EXISTS "Users can update own settings" ON public.user_settings;
DROP POLICY IF EXISTS "Users can delete own settings" ON public.user_settings;
DROP POLICY IF EXISTS "Users can view their own settings" ON public.user_settings;
DROP POLICY IF EXISTS "Users can insert their own settings" ON public.user_settings;
DROP POLICY IF EXISTS "Users can update their own settings" ON public.user_settings;
DROP POLICY IF EXISTS "Users can delete their own settings" ON public.user_settings;
DROP POLICY IF EXISTS "Enable read access for users to their own settings" ON public.user_settings;
DROP POLICY IF EXISTS "Enable insert access for users to their own settings" ON public.user_settings;
DROP POLICY IF EXISTS "Enable update access for users to their own settings" ON public.user_settings;
DROP POLICY IF EXISTS "Enable delete access for users to their own settings" ON public.user_settings;

-- Ensure user_settings table exists with proper structure
CREATE TABLE IF NOT EXISTS public.user_settings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  notifications JSONB DEFAULT '{}',
  privacy JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add unique constraint if it doesn't exist
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'user_settings_user_id_unique') THEN
    ALTER TABLE public.user_settings ADD CONSTRAINT user_settings_user_id_unique UNIQUE (user_id);
  END IF;
END $$;

-- Create index if it doesn't exist
CREATE INDEX IF NOT EXISTS idx_user_settings_user_id ON public.user_settings(user_id);

-- Enable RLS
ALTER TABLE public.user_settings ENABLE ROW LEVEL SECURITY;

-- Create new, simplified policies with proper UUID comparison
CREATE POLICY "user_settings_select_policy" ON public.user_settings
  FOR SELECT USING (auth.uid()::text = user_id::text);

CREATE POLICY "user_settings_insert_policy" ON public.user_settings
  FOR INSERT WITH CHECK (auth.uid()::text = user_id::text);

CREATE POLICY "user_settings_update_policy" ON public.user_settings
  FOR UPDATE USING (auth.uid()::text = user_id::text);

CREATE POLICY "user_settings_delete_policy" ON public.user_settings
  FOR DELETE USING (auth.uid()::text = user_id::text);

-- Grant necessary permissions
GRANT ALL ON public.user_settings TO authenticated;
GRANT USAGE ON SCHEMA public TO authenticated;

-- Fix users table PATCH issues
ALTER TABLE IF EXISTS public.users 
ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();

-- Create trigger to update updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

DROP TRIGGER IF EXISTS update_users_updated_at ON public.users;
CREATE TRIGGER update_users_updated_at 
    BEFORE UPDATE ON public.users 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- Ensure users table has proper RLS policies
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view own profile" ON public.users;
CREATE POLICY "Users can view own profile" ON public.users
  FOR SELECT USING (auth.uid()::text = user_id::text);

DROP POLICY IF EXISTS "Users can insert own profile" ON public.users;
CREATE POLICY "Users can insert own profile" ON public.users
  FOR INSERT WITH CHECK (auth.uid()::text = user_id::text);

DROP POLICY IF EXISTS "Users can update own profile" ON public.users;
CREATE POLICY "Users can update own profile" ON public.users
  FOR UPDATE USING (auth.uid()::text = user_id::text);

DROP POLICY IF EXISTS "Users can delete own profile" ON public.users;
CREATE POLICY "Users can delete own profile" ON public.users
  FOR DELETE USING (auth.uid()::text = user_id::text);

-- Grant permissions for users table
GRANT ALL ON public.users TO authenticated; 