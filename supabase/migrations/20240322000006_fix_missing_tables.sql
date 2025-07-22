-- Fix missing social_connections table and other database issues

-- First, check the actual data type of user_id in users table
-- and create social_connections table with matching type
CREATE TABLE IF NOT EXISTS social_connections (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  platform VARCHAR(50) NOT NULL,
  platform_user_id VARCHAR(255),
  access_token TEXT,
  refresh_token TEXT,
  expires_at TIMESTAMP WITH TIME ZONE,
  username VARCHAR(255),
  follower_count INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Ensure subscriptions table has proper structure
ALTER TABLE subscriptions ADD COLUMN IF NOT EXISTS plan_name VARCHAR(100);
ALTER TABLE subscriptions ADD COLUMN IF NOT EXISTS features_used JSONB DEFAULT '{}'::jsonb;
ALTER TABLE subscriptions ADD COLUMN IF NOT EXISTS usage_limits JSONB DEFAULT '{}'::jsonb;
ALTER TABLE subscriptions ADD COLUMN IF NOT EXISTS billing_history JSONB DEFAULT '[]'::jsonb;

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_social_connections_user_id ON social_connections(user_id);
CREATE INDEX IF NOT EXISTS idx_social_connections_platform ON social_connections(platform);
CREATE INDEX IF NOT EXISTS idx_subscriptions_user_id_status ON subscriptions(user_id, status);

-- Enable realtime (only if not already added)
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_publication_tables 
        WHERE pubname = 'supabase_realtime' 
        AND tablename = 'social_connections'
    ) THEN
        ALTER PUBLICATION supabase_realtime ADD TABLE social_connections;
    END IF;
END $$;
