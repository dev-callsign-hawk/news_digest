-- Create enum for zones and regions
CREATE TYPE public.zone_type AS ENUM ('north', 'south', 'east', 'west', 'central', 'northeast');
CREATE TYPE public.region_type AS ENUM ('delhi', 'mumbai', 'kolkata', 'chennai', 'bangalore', 'hyderabad', 'pune', 'ahmedabad', 'jaipur', 'lucknow', 'kanpur', 'nagpur', 'indore', 'thane', 'bhopal', 'visakhapatnam', 'pimpri', 'patna', 'vadodara', 'ghaziabad', 'ludhiana', 'agra', 'nashik', 'faridabad', 'meerut', 'rajkot', 'kalyan', 'vasai', 'varanasi', 'srinagar', 'aurangabad', 'dhanbad', 'amritsar', 'navi_mumbai', 'allahabad', 'ranchi', 'howrah', 'coimbatore', 'jabalpur', 'gwalior', 'vijayawada', 'jodhpur', 'madurai', 'raipur', 'kota', 'guwahati', 'chandigarh', 'solapur', 'hubli', 'tiruchirappalli', 'bareilly', 'mysore', 'tiruppur', 'gurgaon', 'aligarh', 'jalandhar', 'bhubaneswar', 'salem', 'warangal', 'guntur', 'bhiwandi', 'saharanpur', 'gorakhpur', 'bikaner', 'amravati', 'noida', 'jamshedpur', 'bhilai', 'cuttack', 'firozabad', 'kochi', 'nellore', 'bhavnagar', 'dehradun', 'durgapur', 'asansol', 'rourkela', 'nanded', 'kolhapur', 'ajmer', 'akola', 'gulbarga', 'jamnagar', 'ujjain', 'loni', 'siliguri', 'jhansi', 'ulhasnagar', 'jammu', 'sangli_miraj_kupwad', 'mangalore', 'erode', 'belgaum', 'ambattur', 'tirunelveli', 'malegaon', 'gaya', 'jalgaon', 'udaipur', 'maheshtala');

-- Create profiles table
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT,
  full_name TEXT,
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS on profiles
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Create user preferences table
CREATE TABLE public.user_preferences (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  preferred_zones zone_type[],
  preferred_regions region_type[],
  notification_enabled BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id)
);

-- Enable RLS on user preferences
ALTER TABLE public.user_preferences ENABLE ROW LEVEL SECURITY;

-- Create news articles table
CREATE TABLE public.news_articles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  headline TEXT NOT NULL,
  summary TEXT,
  source_url TEXT NOT NULL,
  image_url TEXT,
  zone zone_type,
  region region_type,
  published_date DATE NOT NULL,
  content_generated_by TEXT DEFAULT 'gemini-2.0-flash',
  tags TEXT[],
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS on news articles
ALTER TABLE public.news_articles ENABLE ROW LEVEL SECURITY;

-- Create news requests table to track user searches
CREATE TABLE public.news_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  zone zone_type,
  region region_type,
  requested_date DATE NOT NULL,
  articles_found INTEGER DEFAULT 0,
  request_status TEXT DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS on news requests
ALTER TABLE public.news_requests ENABLE ROW LEVEL SECURITY;

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for automatic timestamp updates
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_user_preferences_updated_at
  BEFORE UPDATE ON public.user_preferences
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_news_articles_updated_at
  BEFORE UPDATE ON public.news_articles
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Create function to handle new user profiles
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = ''
AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data ->> 'full_name', NEW.raw_user_meta_data ->> 'name', NEW.email)
  );
  RETURN NEW;
END;
$$;

-- Create trigger for automatic profile creation
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- RLS Policies for profiles
CREATE POLICY "Users can view their own profile"
  ON public.profiles
  FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
  ON public.profiles
  FOR UPDATE
  USING (auth.uid() = id);

-- RLS Policies for user preferences
CREATE POLICY "Users can view their own preferences"
  ON public.user_preferences
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own preferences"
  ON public.user_preferences
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own preferences"
  ON public.user_preferences
  FOR UPDATE
  USING (auth.uid() = user_id);

-- RLS Policies for news articles (public read access)
CREATE POLICY "Anyone can view news articles"
  ON public.news_articles
  FOR SELECT
  USING (true);

-- RLS Policies for news requests
CREATE POLICY "Users can view their own news requests"
  ON public.news_requests
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own news requests"
  ON public.news_requests
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own news requests"
  ON public.news_requests
  FOR UPDATE
  USING (auth.uid() = user_id);

-- Create indexes for better performance
CREATE INDEX idx_news_articles_zone_region_date ON public.news_articles(zone, region, published_date);
CREATE INDEX idx_news_articles_published_date ON public.news_articles(published_date DESC);
CREATE INDEX idx_news_requests_user_date ON public.news_requests(user_id, requested_date DESC);
CREATE INDEX idx_user_preferences_user_id ON public.user_preferences(user_id);