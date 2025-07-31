-- Fix user_settings table issues causing 406 errors
-- Drop existing policies that might be causing conflicts
DROP POLICY IF EXISTS "Users can view their own settings" ON public.user_settings;
DROP POLICY IF EXISTS "Users can insert their own settings" ON public.user_settings;
DROP POLICY IF EXISTS "Users can update their own settings" ON public.user_settings;
DROP POLICY IF EXISTS "Users can delete their own settings" ON public.user_settings;
DROP POLICY IF EXISTS "Users can view own settings" ON public.user_settings;
DROP POLICY IF EXISTS "Users can insert own settings" ON public.user_settings;
DROP POLICY IF EXISTS "Users can update own settings" ON public.user_settings;
DROP POLICY IF EXISTS "Users can delete own settings" ON public.user_settings;

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

-- Create new, simplified policies
CREATE POLICY "Enable read access for users to their own settings" ON public.user_settings
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Enable insert access for users to their own settings" ON public.user_settings
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Enable update access for users to their own settings" ON public.user_settings
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Enable delete access for users to their own settings" ON public.user_settings
  FOR DELETE USING (auth.uid() = user_id);

-- Grant necessary permissions
GRANT ALL ON public.user_settings TO authenticated;
GRANT USAGE ON SCHEMA public TO authenticated;

-- Create function to handle settings upsert
CREATE OR REPLACE FUNCTION handle_user_settings_upsert()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.user_settings (user_id, notifications, privacy, updated_at)
  VALUES (NEW.user_id, NEW.notifications, NEW.privacy, NOW())
  ON CONFLICT (user_id)
  DO UPDATE SET
    notifications = EXCLUDED.notifications,
    privacy = EXCLUDED.privacy,
    updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for automatic settings management
DROP TRIGGER IF EXISTS user_settings_upsert_trigger ON public.user_settings;
CREATE TRIGGER user_settings_upsert_trigger
  BEFORE INSERT OR UPDATE ON public.user_settings
  FOR EACH ROW
  EXECUTE FUNCTION handle_user_settings_upsert(); 