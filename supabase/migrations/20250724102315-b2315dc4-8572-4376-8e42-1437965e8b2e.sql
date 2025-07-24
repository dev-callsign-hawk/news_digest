-- Add INSERT policy for news_articles table to allow edge function to insert articles
CREATE POLICY "Allow news generation service to insert articles" 
ON news_articles 
FOR INSERT 
WITH CHECK (true);

-- Also add UPDATE policy in case we need to update articles later
CREATE POLICY "Allow news generation service to update articles" 
ON news_articles 
FOR UPDATE 
USING (true);