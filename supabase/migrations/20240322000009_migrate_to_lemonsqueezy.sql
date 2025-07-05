-- Migration to update database schema for Lemon Squeezy
-- This migration updates existing tables to work with Lemon Squeezy instead of Stripe

-- Update subscription_plans table to use Lemon Squeezy variant IDs instead of Stripe price IDs
ALTER TABLE subscription_plans 
RENAME COLUMN stripe_price_id TO lemonsqueezy_variant_id;

-- Update subscriptions table to use Lemon Squeezy subscription IDs
ALTER TABLE subscriptions 
RENAME COLUMN stripe_id TO lemonsqueezy_subscription_id;

-- Update checkout_sessions table to use Lemon Squeezy session IDs
ALTER TABLE checkout_sessions 
RENAME COLUMN stripe_customer_id TO lemonsqueezy_customer_id;

ALTER TABLE checkout_sessions 
RENAME COLUMN stripe_subscription_id TO lemonsqueezy_subscription_id;

-- Update webhook_events table to track Lemon Squeezy events
ALTER TABLE webhook_events 
RENAME COLUMN stripe_event_id TO lemonsqueezy_event_id;

-- Add new columns for Lemon Squeezy specific data
ALTER TABLE subscriptions 
ADD COLUMN IF NOT EXISTS lemonsqueezy_customer_id TEXT,
ADD COLUMN IF NOT EXISTS lemonsqueezy_order_id TEXT;

-- Update indexes
DROP INDEX IF EXISTS idx_subscription_plans_stripe_price_id;
CREATE INDEX IF NOT EXISTS idx_subscription_plans_lemonsqueezy_variant_id ON subscription_plans(lemonsqueezy_variant_id);

DROP INDEX IF EXISTS idx_subscriptions_stripe_id;
CREATE INDEX IF NOT EXISTS idx_subscriptions_lemonsqueezy_subscription_id ON subscriptions(lemonsqueezy_subscription_id);

-- Update RLS policies to use new column names
DROP POLICY IF EXISTS "Users can view their own subscriptions" ON subscriptions;
CREATE POLICY "Users can view their own subscriptions"
  ON subscriptions FOR SELECT
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update their own subscriptions" ON subscriptions;
CREATE POLICY "Users can update their own subscriptions"
  ON subscriptions FOR UPDATE
  USING (auth.uid() = user_id);

-- Add comments to document the changes
COMMENT ON COLUMN subscription_plans.lemonsqueezy_variant_id IS 'Lemon Squeezy variant ID for this plan';
COMMENT ON COLUMN subscriptions.lemonsqueezy_subscription_id IS 'Lemon Squeezy subscription ID';
COMMENT ON COLUMN subscriptions.lemonsqueezy_customer_id IS 'Lemon Squeezy customer ID';
COMMENT ON COLUMN subscriptions.lemonsqueezy_order_id IS 'Lemon Squeezy order ID'; 