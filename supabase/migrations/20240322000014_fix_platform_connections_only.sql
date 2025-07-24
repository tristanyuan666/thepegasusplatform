-- Ensure platform_connections table exists with correct structure

-- Drop and recreate platform_connections table to ensure correct structure
DROP TABLE IF EXISTS platform_connections CASCADE;

CREATE TABLE platform_connections (
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

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_platform_connections_user_id ON platform_connections(user_id);
CREATE INDEX IF NOT EXISTS idx_platform_connections_platform ON platform_connections(platform);
CREATE INDEX IF NOT EXISTS idx_platform_connections_is_active ON platform_connections(is_active);

-- Enable realtime
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_publication_tables 
        WHERE pubname = 'supabase_realtime' 
        AND tablename = 'platform_connections'
    ) THEN
        ALTER PUBLICATION supabase_realtime ADD TABLE platform_connections;
    END IF;
END $$;

-- Add RLS policies
ALTER TABLE platform_connections ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own platform connections"
  ON platform_connections FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own platform connections"
  ON platform_connections FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own platform connections"
  ON platform_connections FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own platform connections"
  ON platform_connections FOR DELETE
  USING (auth.uid() = user_id);

CREATE POLICY "Service role can manage all platform connections"
  ON platform_connections FOR ALL
  USING (auth.role() = 'service_role'); 