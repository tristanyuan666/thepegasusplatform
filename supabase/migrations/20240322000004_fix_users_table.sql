-- Fix users table structure and ensure proper authentication flow

-- First, ensure the users table has the correct structure
ALTER TABLE public.users 
  ALTER COLUMN id SET DEFAULT gen_random_uuid(),
  ALTER COLUMN token_identifier SET NOT NULL;

-- Add missing columns if they don't exist
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS subscription text DEFAULT 'free';
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS credits text DEFAULT '0';
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS name text;
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS image text;

-- Ensure RLS policies are correct for users table
DROP POLICY IF EXISTS "Users can manage own profile" ON public.users;
DROP POLICY IF EXISTS "Users can insert own profile" ON public.users;
DROP POLICY IF EXISTS "Users can view own profile" ON public.users;
DROP POLICY IF EXISTS "Users can update own profile" ON public.users;

-- Create comprehensive RLS policies for users table
CREATE POLICY "Users can view own profile" ON public.users
    FOR SELECT USING (auth.uid()::text = user_id);

CREATE POLICY "Users can insert own profile" ON public.users
    FOR INSERT WITH CHECK (auth.uid()::text = user_id);

CREATE POLICY "Users can update own profile" ON public.users
    FOR UPDATE USING (auth.uid()::text = user_id);

-- Fix data type inconsistencies in analytics table
ALTER TABLE public.analytics 
  ALTER COLUMN metric_type TYPE text,
  ALTER COLUMN metric_value TYPE integer;

-- Add missing column if it doesn't exist
ALTER TABLE public.analytics ADD COLUMN IF NOT EXISTS metric_name text;

-- Update analytics policies
DROP POLICY IF EXISTS "Users can view own analytics" ON public.analytics;
CREATE POLICY "Users can manage own analytics" ON public.analytics
    FOR ALL USING (auth.uid()::text = user_id);

-- Ensure content_queue has proper structure
ALTER TABLE public.content_queue 
  ADD COLUMN IF NOT EXISTS media_urls text[],
  ALTER COLUMN viral_score TYPE integer;

-- Update content_queue policies
DROP POLICY IF EXISTS "Users can manage own content" ON public.content_queue;
DROP POLICY IF EXISTS "Users can manage own content queue" ON public.content_queue;
CREATE POLICY "Users can manage own content" ON public.content_queue
    FOR ALL USING (auth.uid()::text = user_id);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_users_user_id ON public.users(user_id);
CREATE INDEX IF NOT EXISTS idx_users_email ON public.users(email);
CREATE INDEX IF NOT EXISTS idx_users_token_identifier ON public.users(token_identifier);

-- Enable realtime for users table if not already enabled
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_publication_tables WHERE pubname = 'supabase_realtime' AND tablename = 'users') THEN
        ALTER PUBLICATION supabase_realtime ADD TABLE users;
    END IF;
END $$;
