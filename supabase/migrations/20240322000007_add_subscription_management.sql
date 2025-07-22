-- Add subscription management fields
ALTER TABLE subscriptions ADD COLUMN IF NOT EXISTS canceled_at TIMESTAMPTZ;
ALTER TABLE subscriptions ADD COLUMN IF NOT EXISTS cancel_reason TEXT;
ALTER TABLE subscriptions ADD COLUMN IF NOT EXISTS cancel_at_period_end BOOLEAN DEFAULT FALSE;

-- Add indexes for better performance
CREATE INDEX IF NOT EXISTS idx_subscriptions_user_status ON subscriptions(user_id, status);

-- Enable realtime for subscriptions table
ALTER PUBLICATION supabase_realtime ADD TABLE subscriptions;
