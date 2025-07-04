-- Add additional columns to users table for onboarding and profile data
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS niche text;
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS tone text;
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS fame_goals text;
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS onboarding_completed boolean DEFAULT false;
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS content_format text;
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS follower_count integer DEFAULT 0;
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS viral_score integer DEFAULT 0;
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS monetization_forecast decimal DEFAULT 0;

-- Create content_queue table
CREATE TABLE IF NOT EXISTS public.content_queue (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id text REFERENCES public.users(user_id),
    title text NOT NULL,
    content text NOT NULL,
    content_type text NOT NULL,
    platform text NOT NULL,
    scheduled_for timestamp with time zone,
    status text DEFAULT 'draft',
    viral_score integer DEFAULT 0,
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create analytics table
CREATE TABLE IF NOT EXISTS public.analytics (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id text REFERENCES public.users(user_id),
    platform text NOT NULL,
    metric_type text NOT NULL,
    metric_value integer NOT NULL,
    date date NOT NULL,
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create user_onboarding table
CREATE TABLE IF NOT EXISTS public.user_onboarding (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id text REFERENCES public.users(user_id) UNIQUE,
    step_1_completed boolean DEFAULT false,
    step_2_completed boolean DEFAULT false,
    step_3_completed boolean DEFAULT false,
    step_4_completed boolean DEFAULT false,
    completed_at timestamp with time zone,
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Add indexes
CREATE INDEX IF NOT EXISTS content_queue_user_id_idx ON public.content_queue(user_id);
CREATE INDEX IF NOT EXISTS analytics_user_id_idx ON public.analytics(user_id);
CREATE INDEX IF NOT EXISTS user_onboarding_user_id_idx ON public.user_onboarding(user_id);

-- Enable RLS
ALTER TABLE public.content_queue ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.analytics ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_onboarding ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Users can manage own content queue" ON public.content_queue
    FOR ALL USING (auth.uid()::text = user_id);

CREATE POLICY "Users can view own analytics" ON public.analytics
    FOR SELECT USING (auth.uid()::text = user_id);

CREATE POLICY "Users can manage own onboarding" ON public.user_onboarding
    FOR ALL USING (auth.uid()::text = user_id);

-- Enable realtime
alter publication supabase_realtime add table content_queue;
alter publication supabase_realtime add table analytics;
alter publication supabase_realtime add table user_onboarding;