-- Add metadata column to checkout_sessions table
ALTER TABLE checkout_sessions 
ADD COLUMN IF NOT EXISTS metadata JSONB DEFAULT '{}';

-- Add index for metadata queries
CREATE INDEX IF NOT EXISTS idx_checkout_sessions_metadata ON checkout_sessions USING GIN (metadata); 