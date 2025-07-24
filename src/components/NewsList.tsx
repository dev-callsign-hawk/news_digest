import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { NewsCard } from "./NewsCard";
import { useToast } from "@/hooks/use-toast";
import { Loader2, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";

interface NewsArticle {
  id: string;
  headline: string;
  summary: string;
  published_date: string;
  tags: string[];
  source_url: string;
  region: string;
  news_beat: string;
}

interface NewsListProps {
  refreshTrigger: number;
}

export const NewsList = ({ refreshTrigger }: NewsListProps) => {
  const [articles, setArticles] = useState<NewsArticle[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchArticles = async () => {
    try {
      const { data, error } = await supabase
        .from('news_articles')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(20);

      if (error) throw error;
      setArticles(data || []);
    } catch (error) {
      console.error('Error fetching articles:', error);
      toast({
        title: "Failed to load articles",
        description: "Please try refreshing the page.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchArticles();
  }, [refreshTrigger]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (articles.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground mb-4">No news articles found. Generate some to get started!</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Latest News Articles</h2>
        <Button 
          onClick={fetchArticles} 
          variant="outline" 
          size="sm"
          className="flex items-center gap-2"
        >
          <RefreshCw className="h-4 w-4" />
          Refresh
        </Button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {articles.map((article) => (
          <NewsCard
            key={article.id}
            headline={article.headline}
            summary={article.summary}
            published_date={article.published_date}
            tags={article.tags}
            source_url={article.source_url}
            region={article.region}
            news_beat={article.news_beat}
          />
        ))}
      </div>
    </div>
  );
};