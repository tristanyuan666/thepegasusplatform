-- Fix platform_connections table schema to match code expectations

-- Add missing columns to platform_connections table
ALTER TABLE IF EXISTS platform_connections 
ADD COLUMN IF NOT EXISTS follower_count INTEGER DEFAULT 0;

ALTER TABLE IF EXISTS platform_connections 
ADD COLUMN IF NOT EXISTS engagement_rate DECIMAL(5,2) DEFAULT 0.0;

ALTER TABLE IF EXISTS platform_connections 
ADD COLUMN IF NOT EXISTS username VARCHAR(255);

-- Update existing records to have default values
UPDATE platform_connections 
SET follower_count = 0 
WHERE follower_count IS NULL;

UPDATE platform_connections 
SET engagement_rate = 0.0 
WHERE engagement_rate IS NULL;

UPDATE platform_connections 
SET username = platform_username 
WHERE username IS NULL AND platform_username IS NOT NULL;

-- Ensure indexes exist for performance
CREATE INDEX IF NOT EXISTS idx_platform_connections_follower_count ON platform_connections(follower_count);
CREATE INDEX IF NOT EXISTS idx_platform_connections_engagement_rate ON platform_connections(engagement_rate);

-- Add comments for documentation
COMMENT ON COLUMN platform_connections.follower_count IS 'Number of followers on the platform';
COMMENT ON COLUMN platform_connections.engagement_rate IS 'Engagement rate percentage (0-100)';
COMMENT ON COLUMN platform_connections.username IS 'Username on the platform'; 