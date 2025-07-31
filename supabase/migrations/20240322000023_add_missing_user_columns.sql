-- Add missing columns to users table
ALTER TABLE IF EXISTS public.users 
ADD COLUMN IF NOT EXISTS bio TEXT;

ALTER TABLE IF EXISTS public.users 
ADD COLUMN IF NOT EXISTS website TEXT;

ALTER TABLE IF EXISTS public.users 
ADD COLUMN IF NOT EXISTS location TEXT;

-- Ensure all required columns exist
ALTER TABLE IF EXISTS public.users 
ADD COLUMN IF NOT EXISTS niche TEXT;

ALTER TABLE IF EXISTS public.users 
ADD COLUMN IF NOT EXISTS tone TEXT;

ALTER TABLE IF EXISTS public.users 
ADD COLUMN IF NOT EXISTS content_format TEXT;

ALTER TABLE IF EXISTS public.users 
ADD COLUMN IF NOT EXISTS fame_goals TEXT;

-- Add indexes for better performance
CREATE INDEX IF NOT EXISTS idx_users_bio ON public.users(bio);
CREATE INDEX IF NOT EXISTS idx_users_website ON public.users(website);
CREATE INDEX IF NOT EXISTS idx_users_location ON public.users(location); 