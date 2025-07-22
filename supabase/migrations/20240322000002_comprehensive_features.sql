-- Enhanced database schema for comprehensive Pegasus features

-- Social Media Connections Table
CREATE TABLE IF NOT EXISTS social_connections (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id TEXT REFERENCES users(user_id) ON DELETE CASCADE,
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

-- Content Scheduling Enhancement
ALTER TABLE content_queue ADD COLUMN IF NOT EXISTS hashtags TEXT[];
ALTER TABLE content_queue ADD COLUMN IF NOT EXISTS thumbnail_url TEXT;
ALTER TABLE content_queue ADD COLUMN IF NOT EXISTS duration INTEGER;
ALTER TABLE content_queue ADD COLUMN IF NOT EXISTS auto_post BOOLEAN DEFAULT false;
ALTER TABLE content_queue ADD COLUMN IF NOT EXISTS posted_at TIMESTAMP WITH TIME ZONE;
ALTER TABLE content_queue ADD COLUMN IF NOT EXISTS post_url TEXT;
ALTER TABLE content_queue ADD COLUMN IF NOT EXISTS performance_data JSONB;

-- Analytics Enhancement
ALTER TABLE analytics ADD COLUMN IF NOT EXISTS content_id UUID REFERENCES content_queue(id);
ALTER TABLE analytics ADD COLUMN IF NOT EXISTS engagement_rate DECIMAL(5,2);
ALTER TABLE analytics ADD COLUMN IF NOT EXISTS reach INTEGER;
ALTER TABLE analytics ADD COLUMN IF NOT EXISTS impressions INTEGER;
ALTER TABLE analytics ADD COLUMN IF NOT EXISTS shares INTEGER;
ALTER TABLE analytics ADD COLUMN IF NOT EXISTS comments INTEGER;
ALTER TABLE analytics ADD COLUMN IF NOT EXISTS likes INTEGER;
ALTER TABLE analytics ADD COLUMN IF NOT EXISTS saves INTEGER;

-- Viral Score Tracking
CREATE TABLE IF NOT EXISTS viral_scores (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id TEXT REFERENCES users(user_id) ON DELETE CASCADE,
  content_id UUID REFERENCES content_queue(id) ON DELETE CASCADE,
  score INTEGER NOT NULL CHECK (score >= 0 AND score <= 100),
  factors JSONB,
  predicted_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  actual_performance JSONB,
  accuracy_score DECIMAL(5,2)
);

-- Subscription Plans
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

-- User Subscription Enhancement
ALTER TABLE subscriptions ADD COLUMN IF NOT EXISTS plan_name VARCHAR(100);
ALTER TABLE subscriptions ADD COLUMN IF NOT EXISTS features_used JSONB DEFAULT '{}'::jsonb;
ALTER TABLE subscriptions ADD COLUMN IF NOT EXISTS usage_limits JSONB DEFAULT '{}'::jsonb;
ALTER TABLE subscriptions ADD COLUMN IF NOT EXISTS billing_history JSONB DEFAULT '[]'::jsonb;

-- Content Performance Tracking
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

-- User Goals and Targets
CREATE TABLE IF NOT EXISTS user_goals (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id TEXT REFERENCES users(user_id) ON DELETE CASCADE,
  goal_type VARCHAR(50) NOT NULL,
  target_value INTEGER NOT NULL,
  current_value INTEGER DEFAULT 0,
  target_date DATE,
  is_achieved BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Monetization Tracking
CREATE TABLE IF NOT EXISTS monetization_data (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id TEXT REFERENCES users(user_id) ON DELETE CASCADE,
  platform VARCHAR(50) NOT NULL,
  revenue_source VARCHAR(100) NOT NULL,
  amount DECIMAL(10,2) NOT NULL,
  currency VARCHAR(3) DEFAULT 'USD',
  date DATE NOT NULL,
  content_id UUID REFERENCES content_queue(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_social_connections_user_id ON social_connections(user_id);
CREATE INDEX IF NOT EXISTS idx_social_connections_platform ON social_connections(platform);
CREATE INDEX IF NOT EXISTS idx_viral_scores_user_id ON viral_scores(user_id);
CREATE INDEX IF NOT EXISTS idx_viral_scores_content_id ON viral_scores(content_id);
CREATE INDEX IF NOT EXISTS idx_content_performance_content_id ON content_performance(content_id);
CREATE INDEX IF NOT EXISTS idx_content_performance_platform ON content_performance(platform);
CREATE INDEX IF NOT EXISTS idx_user_goals_user_id ON user_goals(user_id);
CREATE INDEX IF NOT EXISTS idx_monetization_data_user_id ON monetization_data(user_id);
CREATE INDEX IF NOT EXISTS idx_content_queue_scheduled_for ON content_queue(scheduled_for);
CREATE INDEX IF NOT EXISTS idx_content_queue_user_id_status ON content_queue(user_id, status);

-- Enable realtime for new tables
ALTER PUBLICATION supabase_realtime ADD TABLE social_connections;
ALTER PUBLICATION supabase_realtime ADD TABLE viral_scores;
ALTER PUBLICATION supabase_realtime ADD TABLE subscription_plans;
ALTER PUBLICATION supabase_realtime ADD TABLE content_performance;
ALTER PUBLICATION supabase_realtime ADD TABLE user_goals;
ALTER PUBLICATION supabase_realtime ADD TABLE monetization_data;

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
