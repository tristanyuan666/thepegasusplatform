-- Add metadata column to checkout_sessions table if it doesn't exist
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'checkout_sessions' 
        AND column_name = 'metadata'
    ) THEN
        ALTER TABLE checkout_sessions ADD COLUMN metadata JSONB DEFAULT '{}';
    END IF;
END $$;

-- Add index for metadata queries if it doesn't exist
CREATE INDEX IF NOT EXISTS idx_checkout_sessions_metadata ON checkout_sessions USING GIN (metadata); 