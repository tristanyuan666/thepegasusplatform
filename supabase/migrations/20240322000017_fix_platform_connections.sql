-- Fix platform_connections table constraints
-- First, drop the problematic constraint if it exists
DO $$ 
BEGIN
    IF EXISTS (
        SELECT 1 FROM information_schema.table_constraints 
        WHERE constraint_name = 'platform_connections_user_id_platform_key'
    ) THEN
        ALTER TABLE public.platform_connections DROP CONSTRAINT platform_connections_user_id_platform_key;
    END IF;
END $$;

-- Remove duplicate entries before adding unique constraint
DELETE FROM public.platform_connections 
WHERE id IN (
    SELECT id FROM (
        SELECT id, ROW_NUMBER() OVER (PARTITION BY user_id, platform ORDER BY created_at DESC) as rn
        FROM public.platform_connections
    ) t WHERE t.rn > 1
);

-- Add the correct unique constraint
ALTER TABLE public.platform_connections ADD CONSTRAINT platform_connections_user_id_platform_unique UNIQUE (user_id, platform);

-- Add missing columns if they don't exist
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'platform_connections' AND column_name = 'connected_at') THEN
        ALTER TABLE public.platform_connections ADD COLUMN connected_at TIMESTAMP WITH TIME ZONE;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'platform_connections' AND column_name = 'last_sync') THEN
        ALTER TABLE public.platform_connections ADD COLUMN last_sync TIMESTAMP WITH TIME ZONE;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'platform_connections' AND column_name = 'platform_username') THEN
        ALTER TABLE public.platform_connections ADD COLUMN platform_username VARCHAR(255);
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'platform_connections' AND column_name = 'follower_count') THEN
        ALTER TABLE public.platform_connections ADD COLUMN follower_count INTEGER DEFAULT 0;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'platform_connections' AND column_name = 'engagement_rate') THEN
        ALTER TABLE public.platform_connections ADD COLUMN engagement_rate DECIMAL(5,2) DEFAULT 0.0;
    END IF;
END $$; 