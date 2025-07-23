-- Add indexes for better webhook performance
-- This migration adds indexes to improve checkout session and subscription lookups

-- Index for checkout sessions by status and creation time (for webhook fallback)
CREATE INDEX IF NOT EXISTS idx_checkout_sessions_status_created 
ON checkout_sessions (status, created_at DESC);

-- Index for checkout sessions by user_id (for user-specific lookups)
CREATE INDEX IF NOT EXISTS idx_checkout_sessions_user_id 
ON checkout_sessions (user_id);

-- Index for subscriptions by stripe_id (for upsert operations)
CREATE INDEX IF NOT EXISTS idx_subscriptions_stripe_id 
ON subscriptions (stripe_id);

-- Index for subscriptions by user_id and status (for active subscription checks)
CREATE INDEX IF NOT EXISTS idx_subscriptions_user_status 
ON subscriptions (user_id, status);

-- Index for users by email (for customer email lookups)
CREATE INDEX IF NOT EXISTS idx_users_email 
ON users (email);

-- Index for users by creation time (for fallback user selection)
CREATE INDEX IF NOT EXISTS idx_users_created_at 
ON users (created_at DESC);

-- Add comments for documentation
COMMENT ON INDEX idx_checkout_sessions_status_created IS 'Optimizes webhook fallback logic for finding recent checkout sessions';
COMMENT ON INDEX idx_checkout_sessions_user_id IS 'Optimizes user-specific checkout session lookups';
COMMENT ON INDEX idx_subscriptions_stripe_id IS 'Optimizes subscription upsert operations';
COMMENT ON INDEX idx_subscriptions_user_status IS 'Optimizes active subscription checks for users';
COMMENT ON INDEX idx_users_email IS 'Optimizes user lookups by email from Stripe customer data';
COMMENT ON INDEX idx_users_created_at IS 'Optimizes fallback user selection for webhook processing'; 