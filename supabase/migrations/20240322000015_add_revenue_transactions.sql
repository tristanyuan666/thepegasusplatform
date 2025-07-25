-- Add revenue_transactions table for real revenue tracking

CREATE TABLE IF NOT EXISTS revenue_transactions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  platform VARCHAR(50) NOT NULL,
  transaction_type VARCHAR(50) NOT NULL,
  amount DECIMAL(10,2) NOT NULL,
  currency VARCHAR(3) DEFAULT 'USD',
  description TEXT,
  transaction_date DATE NOT NULL,
  status VARCHAR(20) DEFAULT 'completed',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_revenue_transactions_user_id ON revenue_transactions(user_id);
CREATE INDEX IF NOT EXISTS idx_revenue_transactions_platform ON revenue_transactions(platform);
CREATE INDEX IF NOT EXISTS idx_revenue_transactions_transaction_date ON revenue_transactions(transaction_date);
CREATE INDEX IF NOT EXISTS idx_revenue_transactions_transaction_type ON revenue_transactions(transaction_type);

-- Enable realtime
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_publication_tables 
        WHERE pubname = 'supabase_realtime' 
        AND tablename = 'revenue_transactions'
    ) THEN
        ALTER PUBLICATION supabase_realtime ADD TABLE revenue_transactions;
    END IF;
END $$;

-- Add RLS policies
ALTER TABLE revenue_transactions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own revenue transactions"
  ON revenue_transactions FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own revenue transactions"
  ON revenue_transactions FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own revenue transactions"
  ON revenue_transactions FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own revenue transactions"
  ON revenue_transactions FOR DELETE
  USING (auth.uid() = user_id);

CREATE POLICY "Service role can manage all revenue transactions"
  ON revenue_transactions FOR ALL
  USING (auth.role() = 'service_role');

-- Insert some sample data for testing (optional)
INSERT INTO revenue_transactions (user_id, platform, transaction_type, amount, description, transaction_date) VALUES
  ('16e1478f-2000-4ee8-8945-ddcba94f9a0f', 'instagram', 'sponsored_post', 450.00, 'Sponsored post for fitness brand', '2024-01-15'),
  ('16e1478f-2000-4ee8-8945-ddcba94f9a0f', 'youtube', 'ad_revenue', 320.00, 'Ad revenue from video views', '2024-01-12'),
  ('16e1478f-2000-4ee8-8945-ddcba94f9a0f', 'tiktok', 'brand_deal', 280.00, 'Brand partnership campaign', '2024-01-10'),
  ('16e1478f-2000-4ee8-8945-ddcba94f9a0f', 'instagram', 'affiliate', 200.00, 'Affiliate commission from product sales', '2024-01-08')
ON CONFLICT DO NOTHING; 