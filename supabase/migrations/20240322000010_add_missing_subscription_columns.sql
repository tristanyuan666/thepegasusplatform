-- Add missing columns to subscriptions table that webhook needs
ALTER TABLE subscriptions ADD COLUMN IF NOT EXISTS plan_name TEXT;
ALTER TABLE subscriptions ADD COLUMN IF NOT EXISTS billing_cycle TEXT DEFAULT 'monthly';

-- Add missing columns to users table that webhook needs
ALTER TABLE users ADD COLUMN IF NOT EXISTS plan TEXT;
ALTER TABLE users ADD COLUMN IF NOT EXISTS plan_status TEXT;
ALTER TABLE users ADD COLUMN IF NOT EXISTS plan_billing TEXT;
ALTER TABLE users ADD COLUMN IF NOT EXISTS plan_period_end BIGINT;
ALTER TABLE users ADD COLUMN IF NOT EXISTS is_active BOOLEAN DEFAULT FALSE;

-- Add missing columns to checkout_sessions table
CREATE TABLE IF NOT EXISTS checkout_sessions (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    session_id text UNIQUE,
    user_id text REFERENCES public.users(user_id),
    price_id text,
    plan_name text,
    billing_cycle text,
    amount bigint,
    currency text DEFAULT 'usd',
    status text DEFAULT 'pending',
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
    completed_at timestamp with time zone
);

-- Enable RLS for checkout_sessions
ALTER TABLE checkout_sessions ENABLE ROW LEVEL SECURITY;

-- Create policy for checkout_sessions
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE schemaname = 'public' 
        AND tablename = 'checkout_sessions' 
        AND policyname = 'Users can view own checkout sessions'
    ) THEN
        EXECUTE 'CREATE POLICY "Users can view own checkout sessions" ON public.checkout_sessions
                FOR SELECT USING (auth.uid()::text = user_id::text)';
    END IF;
END
$$; 