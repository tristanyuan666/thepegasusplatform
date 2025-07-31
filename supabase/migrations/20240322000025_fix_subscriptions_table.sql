-- Ensure subscriptions table exists with proper structure
CREATE TABLE IF NOT EXISTS public.subscriptions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  stripe_id TEXT,
  customer_id TEXT,
  price_id TEXT,
  status TEXT DEFAULT 'inactive',
  current_period_start BIGINT,
  current_period_end BIGINT,
  cancel_at_period_end BOOLEAN DEFAULT false,
  amount INTEGER,
  currency TEXT DEFAULT 'usd',
  interval TEXT,
  plan_name TEXT,
  billing_cycle TEXT,
  features_used JSONB DEFAULT '{}',
  usage_limits JSONB DEFAULT '{}',
  billing_history JSONB DEFAULT '{}',
  stripe_subscription_id TEXT,
  stripe_customer_id TEXT,
  stripe_payment_intent_id TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add indexes for better performance
CREATE INDEX IF NOT EXISTS idx_subscriptions_user_id ON public.subscriptions(user_id);
CREATE INDEX IF NOT EXISTS idx_subscriptions_status ON public.subscriptions(status);
CREATE INDEX IF NOT EXISTS idx_subscriptions_stripe_id ON public.subscriptions(stripe_id);

-- Enable RLS
ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
DROP POLICY IF EXISTS "Users can view own subscriptions" ON public.subscriptions;
CREATE POLICY "Users can view own subscriptions" ON public.subscriptions
  FOR SELECT USING (auth.uid()::text = user_id::text);

DROP POLICY IF EXISTS "Users can insert own subscriptions" ON public.subscriptions;
CREATE POLICY "Users can insert own subscriptions" ON public.subscriptions
  FOR INSERT WITH CHECK (auth.uid()::text = user_id::text);

DROP POLICY IF EXISTS "Users can update own subscriptions" ON public.subscriptions;
CREATE POLICY "Users can update own subscriptions" ON public.subscriptions
  FOR UPDATE USING (auth.uid()::text = user_id::text);

DROP POLICY IF EXISTS "Users can delete own subscriptions" ON public.subscriptions;
CREATE POLICY "Users can delete own subscriptions" ON public.subscriptions
  FOR DELETE USING (auth.uid()::text = user_id::text);

-- Grant permissions
GRANT ALL ON public.subscriptions TO authenticated; 