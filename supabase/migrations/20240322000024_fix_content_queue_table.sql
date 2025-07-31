-- Ensure content_queue table exists with proper structure
CREATE TABLE IF NOT EXISTS public.content_queue (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  content_type VARCHAR(50) DEFAULT 'post',
  platform VARCHAR(50) NOT NULL,
  viral_score INTEGER DEFAULT 0,
  estimated_reach INTEGER DEFAULT 0,
  hashtags TEXT[] DEFAULT '{}',
  status VARCHAR(20) DEFAULT 'draft',
  scheduled_at TIMESTAMP WITH TIME ZONE,
  published_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add indexes for better performance
CREATE INDEX IF NOT EXISTS idx_content_queue_user_id ON public.content_queue(user_id);
CREATE INDEX IF NOT EXISTS idx_content_queue_platform ON public.content_queue(platform);
CREATE INDEX IF NOT EXISTS idx_content_queue_status ON public.content_queue(status);
CREATE INDEX IF NOT EXISTS idx_content_queue_created_at ON public.content_queue(created_at);

-- Enable RLS
ALTER TABLE public.content_queue ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
DROP POLICY IF EXISTS "Users can view own content" ON public.content_queue;
CREATE POLICY "Users can view own content" ON public.content_queue
  FOR SELECT USING (auth.uid()::text = user_id::text);

DROP POLICY IF EXISTS "Users can insert own content" ON public.content_queue;
CREATE POLICY "Users can insert own content" ON public.content_queue
  FOR INSERT WITH CHECK (auth.uid()::text = user_id::text);

DROP POLICY IF EXISTS "Users can update own content" ON public.content_queue;
CREATE POLICY "Users can update own content" ON public.content_queue
  FOR UPDATE USING (auth.uid()::text = user_id::text);

DROP POLICY IF EXISTS "Users can delete own content" ON public.content_queue;
CREATE POLICY "Users can delete own content" ON public.content_queue
  FOR DELETE USING (auth.uid()::text = user_id::text);

-- Grant permissions
GRANT ALL ON public.content_queue TO authenticated; 