-- Enhance platform_connections table with comprehensive data fields

-- Add new columns for comprehensive platform data
ALTER TABLE IF EXISTS platform_connections 
ADD COLUMN IF NOT EXISTS display_name VARCHAR(255);

ALTER TABLE IF EXISTS platform_connections 
ADD COLUMN IF NOT EXISTS bio TEXT;

ALTER TABLE IF EXISTS platform_connections 
ADD COLUMN IF NOT EXISTS profile_image TEXT;

ALTER TABLE IF EXISTS platform_connections 
ADD COLUMN IF NOT EXISTS verified BOOLEAN DEFAULT false;

ALTER TABLE IF EXISTS platform_connections 
ADD COLUMN IF NOT EXISTS average_views INTEGER DEFAULT 0;

ALTER TABLE IF EXISTS platform_connections 
ADD COLUMN IF NOT EXISTS average_likes INTEGER DEFAULT 0;

ALTER TABLE IF EXISTS platform_connections 
ADD COLUMN IF NOT EXISTS average_comments INTEGER DEFAULT 0;

ALTER TABLE IF EXISTS platform_connections 
ADD COLUMN IF NOT EXISTS average_shares INTEGER DEFAULT 0;

ALTER TABLE IF EXISTS platform_connections 
ADD COLUMN IF NOT EXISTS content_type VARCHAR(50) DEFAULT 'mixed';

ALTER TABLE IF EXISTS platform_connections 
ADD COLUMN IF NOT EXISTS niche VARCHAR(100);

ALTER TABLE IF EXISTS platform_connections 
ADD COLUMN IF NOT EXISTS location VARCHAR(255);

ALTER TABLE IF EXISTS platform_connections 
ADD COLUMN IF NOT EXISTS website TEXT;

ALTER TABLE IF EXISTS platform_connections 
ADD COLUMN IF NOT EXISTS contact_email VARCHAR(255);

-- Add comprehensive metadata column for additional data
ALTER TABLE IF EXISTS platform_connections 
ADD COLUMN IF NOT EXISTS metadata JSONB DEFAULT '{}'::jsonb;

-- Create indexes for performance on new fields
CREATE INDEX IF NOT EXISTS idx_platform_connections_niche ON platform_connections(niche);
CREATE INDEX IF NOT EXISTS idx_platform_connections_content_type ON platform_connections(content_type);
CREATE INDEX IF NOT EXISTS idx_platform_connections_verified ON platform_connections(verified);

-- Add comments for documentation
COMMENT ON COLUMN platform_connections.display_name IS 'Display name on the platform';
COMMENT ON COLUMN platform_connections.bio IS 'Bio or description from the platform';
COMMENT ON COLUMN platform_connections.profile_image IS 'Profile image URL';
COMMENT ON COLUMN platform_connections.verified IS 'Whether the account is verified';
COMMENT ON COLUMN platform_connections.average_views IS 'Average views per post';
COMMENT ON COLUMN platform_connections.average_likes IS 'Average likes per post';
COMMENT ON COLUMN platform_connections.average_comments IS 'Average comments per post';
COMMENT ON COLUMN platform_connections.average_shares IS 'Average shares per post';
COMMENT ON COLUMN platform_connections.content_type IS 'Type of content posted';
COMMENT ON COLUMN platform_connections.niche IS 'Content niche/category';
COMMENT ON COLUMN platform_connections.location IS 'Account location';
COMMENT ON COLUMN platform_connections.website IS 'Website URL';
COMMENT ON COLUMN platform_connections.contact_email IS 'Contact email';
COMMENT ON COLUMN platform_connections.metadata IS 'Additional platform-specific data'; 