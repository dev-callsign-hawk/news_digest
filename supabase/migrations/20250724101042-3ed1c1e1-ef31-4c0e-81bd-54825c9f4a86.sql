-- Update zone_type enum to news_beat_type with news categories
DROP TYPE IF EXISTS zone_type CASCADE;
CREATE TYPE news_beat_type AS ENUM (
  'sports',
  'agriculture', 
  'politics',
  'technology',
  'health',
  'business',
  'entertainment',
  'crime',
  'real_estate',
  'education',
  'environment',
  'lifestyle',
  'international'
);

-- Update news_articles table to use news_beat instead of zone
ALTER TABLE news_articles 
DROP COLUMN IF EXISTS zone CASCADE;

ALTER TABLE news_articles 
ADD COLUMN news_beat news_beat_type;

-- Update news_requests table to use news_beat instead of zone
ALTER TABLE news_requests 
DROP COLUMN IF EXISTS zone CASCADE;

ALTER TABLE news_requests 
ADD COLUMN news_beat news_beat_type;

-- Update user_preferences table to use news_beat instead of zone
ALTER TABLE user_preferences 
DROP COLUMN IF EXISTS preferred_zones CASCADE;

ALTER TABLE user_preferences 
ADD COLUMN preferred_beats news_beat_type[];

-- Create news_generation_history table for tracking
CREATE TABLE news_generation_history (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id),
  region region_type,
  news_beat news_beat_type,
  requested_date DATE NOT NULL,
  articles_generated INTEGER DEFAULT 0,
  generation_status TEXT DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS on news_generation_history
ALTER TABLE news_generation_history ENABLE ROW LEVEL SECURITY;

-- Create policies for news_generation_history
CREATE POLICY "Users can view their own generation history" 
ON news_generation_history 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own generation history" 
ON news_generation_history 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own generation history" 
ON news_generation_history 
FOR UPDATE 
USING (auth.uid() = user_id);

-- Add trigger for updated_at on news_generation_history
CREATE TRIGGER update_news_generation_history_updated_at
BEFORE UPDATE ON news_generation_history
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();