-- Fix platform_connections table and ensure all required tables exist

-- Create platform_connections table (alias for social_connections)
CREATE TABLE IF NOT EXISTS platform_connections (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  platform VARCHAR(50) NOT NULL,
  platform_user_id VARCHAR(255),
  platform_username VARCHAR(255),
  access_token TEXT,
  refresh_token TEXT,
  expires_at TIMESTAMP WITH TIME ZONE,
  is_active BOOLEAN DEFAULT true,
  connected_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  last_sync TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create analytics table if it doesn't exist
CREATE TABLE IF NOT EXISTS analytics (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  total_followers INTEGER DEFAULT 0,
  total_views INTEGER DEFAULT 0,
  engagement_rate DECIMAL(5,2) DEFAULT 0,
  viral_score INTEGER DEFAULT 0,
  content_count INTEGER DEFAULT 0,
  revenue DECIMAL(10,2) DEFAULT 0,
  growth_rate DECIMAL(5,2) DEFAULT 0,
  platform VARCHAR(50),
  period_start TIMESTAMP WITH TIME ZONE,
  period_end TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_platform_connections_user_id ON platform_connections(user_id);
CREATE INDEX IF NOT EXISTS idx_platform_connections_platform ON platform_connections(platform);
CREATE INDEX IF NOT EXISTS idx_platform_connections_is_active ON platform_connections(is_active);
CREATE INDEX IF NOT EXISTS idx_analytics_user_id ON analytics(user_id);
CREATE INDEX IF NOT EXISTS idx_analytics_created_at ON analytics(created_at);

-- Enable realtime for new tables
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_publication_tables 
        WHERE pubname = 'supabase_realtime' 
        AND tablename = 'platform_connections'
    ) THEN
        ALTER PUBLICATION supabase_realtime ADD TABLE platform_connections;
    END IF;
    
    IF NOT EXISTS (
        SELECT 1 FROM pg_publication_tables 
        WHERE pubname = 'supabase_realtime' 
        AND tablename = 'analytics'
    ) THEN
        ALTER PUBLICATION supabase_realtime ADD TABLE analytics;
    END IF;
END $$;

-- Add RLS policies for platform_connections
ALTER TABLE platform_connections ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view their own platform connections" ON platform_connections;
CREATE POLICY "Users can view their own platform connections"
  ON platform_connections FOR SELECT
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert their own platform connections" ON platform_connections;
CREATE POLICY "Users can insert their own platform connections"
  ON platform_connections FOR INSERT
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update their own platform connections" ON platform_connections;
CREATE POLICY "Users can update their own platform connections"
  ON platform_connections FOR UPDATE
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete their own platform connections" ON platform_connections;
CREATE POLICY "Users can delete their own platform connections"
  ON platform_connections FOR DELETE
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Service role can manage all platform connections" ON platform_connections;
CREATE POLICY "Service role can manage all platform connections"
  ON platform_connections FOR ALL
  USING (auth.role() = 'service_role');

-- Add RLS policies for analytics
ALTER TABLE analytics ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view their own analytics" ON analytics;
CREATE POLICY "Users can view their own analytics"
  ON analytics FOR SELECT
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert their own analytics" ON analytics;
CREATE POLICY "Users can insert their own analytics"
  ON analytics FOR INSERT
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Service role can manage all analytics" ON analytics;
CREATE POLICY "Service role can manage all analytics"
  ON analytics FOR ALL
  USING (auth.role() = 'service_role'); 