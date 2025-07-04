-- Fix RLS policies for users table to allow profile creation
DROP POLICY IF EXISTS "Users can manage own profile" ON public.users;
CREATE POLICY "Users can manage own profile" ON public.users
    FOR ALL USING (auth.uid()::text = user_id);

-- Allow users to insert their own profile during signup
DROP POLICY IF EXISTS "Users can insert own profile" ON public.users;
CREATE POLICY "Users can insert own profile" ON public.users
    FOR INSERT WITH CHECK (auth.uid()::text = user_id);

-- Create missing tables first (content_queue and analytics are referenced but may not exist)
CREATE TABLE IF NOT EXISTS content_queue (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id text REFERENCES users(user_id) ON DELETE CASCADE,
  content_type VARCHAR(50) NOT NULL,
  title VARCHAR(255),
  content TEXT NOT NULL,
  media_urls TEXT[],
  platform VARCHAR(50) NOT NULL,
  status VARCHAR(20) DEFAULT 'draft',
  scheduled_for TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  hashtags TEXT[],
  thumbnail_url TEXT,
  duration INTEGER,
  auto_post BOOLEAN DEFAULT false,
  posted_at TIMESTAMP WITH TIME ZONE,
  post_url TEXT,
  performance_data JSONB
);

CREATE TABLE IF NOT EXISTS analytics (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id text REFERENCES users(user_id) ON DELETE CASCADE,
  platform VARCHAR(50) NOT NULL,
  metric_name VARCHAR(100) NOT NULL,
  metric_value INTEGER NOT NULL,
  date DATE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  content_id UUID REFERENCES content_queue(id),
  engagement_rate DECIMAL(5,2),
  reach INTEGER,
  impressions INTEGER,
  shares INTEGER,
  comments INTEGER,
  likes INTEGER,
  saves INTEGER
);

-- Fix data type inconsistencies in social_connections table
-- First drop the table if it exists to recreate with correct types
DROP TABLE IF EXISTS social_connections CASCADE;

-- Recreate social_connections table with correct user_id reference
CREATE TABLE IF NOT EXISTS social_connections (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id text REFERENCES users(user_id) ON DELETE CASCADE,
  platform VARCHAR(50) NOT NULL,
  platform_user_id VARCHAR(255),
  access_token TEXT,
  refresh_token TEXT,
  expires_at TIMESTAMP WITH TIME ZONE,
  username VARCHAR(255),
  follower_count INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Fix data type inconsistencies in viral_scores table
DROP TABLE IF EXISTS viral_scores CASCADE;

-- Recreate viral_scores table with correct user_id reference
CREATE TABLE IF NOT EXISTS viral_scores (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id text REFERENCES users(user_id) ON DELETE CASCADE,
  content_id UUID REFERENCES content_queue(id) ON DELETE CASCADE,
  score INTEGER NOT NULL CHECK (score >= 0 AND score <= 100),
  factors JSONB,
  predicted_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  actual_performance JSONB,
  accuracy_score DECIMAL(5,2)
);

-- Create content_performance table (was missing)
CREATE TABLE IF NOT EXISTS content_performance (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  content_id UUID REFERENCES content_queue(id) ON DELETE CASCADE,
  platform VARCHAR(50) NOT NULL,
  views INTEGER DEFAULT 0,
  likes INTEGER DEFAULT 0,
  comments INTEGER DEFAULT 0,
  shares INTEGER DEFAULT 0,
  saves INTEGER DEFAULT 0,
  reach INTEGER DEFAULT 0,
  impressions INTEGER DEFAULT 0,
  engagement_rate DECIMAL(5,2) DEFAULT 0,
  viral_score INTEGER DEFAULT 0,
  tracked_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Fix data type inconsistencies in user_goals table
DROP TABLE IF EXISTS user_goals CASCADE;

-- Recreate user_goals table with correct user_id reference
CREATE TABLE IF NOT EXISTS user_goals (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id text REFERENCES users(user_id) ON DELETE CASCADE,
  goal_type VARCHAR(50) NOT NULL,
  target_value INTEGER NOT NULL,
  current_value INTEGER DEFAULT 0,
  target_date DATE,
  is_achieved BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Fix data type inconsistencies in monetization_data table
DROP TABLE IF EXISTS monetization_data CASCADE;

-- Recreate monetization_data table with correct user_id reference
CREATE TABLE IF NOT EXISTS monetization_data (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id text REFERENCES users(user_id) ON DELETE CASCADE,
  platform VARCHAR(50) NOT NULL,
  revenue_source VARCHAR(100) NOT NULL,
  amount DECIMAL(10,2) NOT NULL,
  currency VARCHAR(3) DEFAULT 'USD',
  date DATE NOT NULL,
  content_id UUID REFERENCES content_queue(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create subscription_plans table if it doesn't exist
CREATE TABLE IF NOT EXISTS subscription_plans (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  stripe_price_id VARCHAR(255) UNIQUE NOT NULL,
  price_monthly INTEGER NOT NULL,
  price_yearly INTEGER,
  features JSONB NOT NULL,
  limits JSONB NOT NULL,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS on tables
ALTER TABLE content_queue ENABLE ROW LEVEL SECURITY;
ALTER TABLE analytics ENABLE ROW LEVEL SECURITY;
ALTER TABLE social_connections ENABLE ROW LEVEL SECURITY;
ALTER TABLE viral_scores ENABLE ROW LEVEL SECURITY;
ALTER TABLE content_performance ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_goals ENABLE ROW LEVEL SECURITY;
ALTER TABLE monetization_data ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscription_plans ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for tables
DROP POLICY IF EXISTS "Users can manage own content" ON content_queue;
CREATE POLICY "Users can manage own content" ON content_queue
    FOR ALL USING (auth.uid()::text = user_id);

DROP POLICY IF EXISTS "Users can view own analytics" ON analytics;
CREATE POLICY "Users can view own analytics" ON analytics
    FOR ALL USING (auth.uid()::text = user_id);

DROP POLICY IF EXISTS "Users can manage own social connections" ON social_connections;
CREATE POLICY "Users can manage own social connections" ON social_connections
    FOR ALL USING (auth.uid()::text = user_id);

DROP POLICY IF EXISTS "Users can view own viral scores" ON viral_scores;
CREATE POLICY "Users can view own viral scores" ON viral_scores
    FOR ALL USING (auth.uid()::text = user_id);

DROP POLICY IF EXISTS "Users can view own content performance" ON content_performance;
CREATE POLICY "Users can view own content performance" ON content_performance
    FOR ALL USING (auth.uid()::text IN (
        SELECT user_id FROM content_queue WHERE id = content_performance.content_id
    ));

DROP POLICY IF EXISTS "Users can manage own goals" ON user_goals;
CREATE POLICY "Users can manage own goals" ON user_goals
    FOR ALL USING (auth.uid()::text = user_id);

DROP POLICY IF EXISTS "Users can view own monetization data" ON monetization_data;
CREATE POLICY "Users can view own monetization data" ON monetization_data
    FOR ALL USING (auth.uid()::text = user_id);

DROP POLICY IF EXISTS "Public access to subscription plans" ON subscription_plans;
CREATE POLICY "Public access to subscription plans" ON subscription_plans
    FOR SELECT USING (true);

-- Add indexes for performance
CREATE INDEX IF NOT EXISTS idx_content_queue_user_id ON content_queue(user_id);
CREATE INDEX IF NOT EXISTS idx_content_queue_scheduled_for ON content_queue(scheduled_for);
CREATE INDEX IF NOT EXISTS idx_content_queue_user_id_status ON content_queue(user_id, status);
CREATE INDEX IF NOT EXISTS idx_analytics_user_id ON analytics(user_id);
CREATE INDEX IF NOT EXISTS idx_social_connections_user_id ON social_connections(user_id);
CREATE INDEX IF NOT EXISTS idx_social_connections_platform ON social_connections(platform);
CREATE INDEX IF NOT EXISTS idx_viral_scores_user_id ON viral_scores(user_id);
CREATE INDEX IF NOT EXISTS idx_viral_scores_content_id ON viral_scores(content_id);
CREATE INDEX IF NOT EXISTS idx_content_performance_content_id ON content_performance(content_id);
CREATE INDEX IF NOT EXISTS idx_content_performance_platform ON content_performance(platform);
CREATE INDEX IF NOT EXISTS idx_user_goals_user_id ON user_goals(user_id);
CREATE INDEX IF NOT EXISTS idx_monetization_data_user_id ON monetization_data(user_id);

-- Enable realtime for tables (skip if already added)
DO $
BEGIN
    -- Only add tables to realtime publication if they're not already there
    IF NOT EXISTS (SELECT 1 FROM pg_publication_tables WHERE pubname = 'supabase_realtime' AND tablename = 'content_queue') THEN
        ALTER PUBLICATION supabase_realtime ADD TABLE content_queue;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_publication_tables WHERE pubname = 'supabase_realtime' AND tablename = 'analytics') THEN
        ALTER PUBLICATION supabase_realtime ADD TABLE analytics;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_publication_tables WHERE pubname = 'supabase_realtime' AND tablename = 'social_connections') THEN
        ALTER PUBLICATION supabase_realtime ADD TABLE social_connections;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_publication_tables WHERE pubname = 'supabase_realtime' AND tablename = 'viral_scores') THEN
        ALTER PUBLICATION supabase_realtime ADD TABLE viral_scores;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_publication_tables WHERE pubname = 'supabase_realtime' AND tablename = 'content_performance') THEN
        ALTER PUBLICATION supabase_realtime ADD TABLE content_performance;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_publication_tables WHERE pubname = 'supabase_realtime' AND tablename = 'user_goals') THEN
        ALTER PUBLICATION supabase_realtime ADD TABLE user_goals;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_publication_tables WHERE pubname = 'supabase_realtime' AND tablename = 'monetization_data') THEN
        ALTER PUBLICATION supabase_realtime ADD TABLE monetization_data;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_publication_tables WHERE pubname = 'supabase_realtime' AND tablename = 'subscription_plans') THEN
        ALTER PUBLICATION supabase_realtime ADD TABLE subscription_plans;
    END IF;
END $;

-- Insert default subscription plans
INSERT INTO subscription_plans (name, stripe_price_id, price_monthly, price_yearly, features, limits) VALUES
('starter', 'price_starter_monthly', 3900, 39000, 
 '{"ai_content": true, "basic_analytics": true, "platforms": 2, "support": "email"}',
 '{"posts_per_month": 50, "platforms": 2, "storage_gb": 5}'
),
('growth', 'price_growth_monthly', 5900, 59000,
 '{"ai_content": true, "advanced_analytics": true, "viral_predictor": true, "all_platforms": true, "priority_support": true, "auto_scheduling": true}',
 '{"posts_per_month": -1, "platforms": -1, "storage_gb": 50}'
),
('empire', 'price_empire_monthly', 9900, 99000,
 '{"everything": true, "custom_branding": true, "api_access": true, "dedicated_manager": true, "custom_integrations": true, "white_label": true}',
 '{"posts_per_month": -1, "platforms": -1, "storage_gb": 500, "team_members": 10}'
)
ON CONFLICT (stripe_price_id) DO NOTHING;
