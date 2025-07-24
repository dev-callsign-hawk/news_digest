import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Download, History, Loader2 } from "lucide-react";

interface HistoryRecord {
  id: string;
  region: string;
  news_beat: string;
  requested_date: string;
  articles_generated: number;
  generation_status: string;
  created_at: string;
}

export const NewsHistory = () => {
  const [history, setHistory] = useState<HistoryRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [downloading, setDownloading] = useState(false);
  const { toast } = useToast();

  const fetchHistory = async () => {
    try {
      const { data, error } = await supabase
        .from('news_generation_history')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(10);

      if (error) throw error;
      setHistory(data || []);
    } catch (error) {
      console.error('Error fetching history:', error);
      toast({
        title: "Failed to load history",
        description: "Please try refreshing the page.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const downloadArticles = async () => {
    setDownloading(true);
    try {
      const { data, error } = await supabase
        .from('news_articles')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      // Convert to CSV format
      const csvHeaders = ['Headline', 'Summary', 'Region', 'News Beat', 'Published Date', 'Tags', 'Created At'];
      const csvRows = data.map(article => [
        `"${article.headline}"`,
        `"${article.summary}"`,
        article.region,
        article.news_beat,
        article.published_date,
        `"${article.tags?.join(', ') || ''}"`,
        new Date(article.created_at).toLocaleDateString()
      ]);

      const csvContent = [csvHeaders.join(','), ...csvRows.map(row => row.join(','))].join('\n');
      
      // Create and download file
      const blob = new Blob([csvContent], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `news_articles_${new Date().toISOString().split('T')[0]}.csv`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);

      toast({
        title: "Download Complete",
        description: `Downloaded ${data.length} articles as CSV file.`,
      });
    } catch (error) {
      console.error('Error downloading articles:', error);
      toast({
        title: "Download Failed",
        description: "Failed to download articles. Please try again.",
        variant: "destructive",
      });
    } finally {
      setDownloading(false);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <History className="h-5 w-5" />
              Generation History
            </CardTitle>
            <CardDescription>
              Track your news generation requests and download data
            </CardDescription>
          </div>
          <Button 
            onClick={downloadArticles} 
            disabled={downloading}
            variant="outline"
            className="flex items-center gap-2"
          >
            {downloading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Downloading...
              </>
            ) : (
              <>
                <Download className="h-4 w-4" />
                Download CSV
              </>
            )}
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {history.length === 0 ? (
          <p className="text-muted-foreground text-center py-4">
            No generation history found. Generate some news to see your history here.
          </p>
        ) : (
          <div className="space-y-4">
            {history.map((record) => (
              <div key={record.id} className="border rounded-lg p-4 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="font-medium">
                    {record.region} • {record.news_beat}
                  </div>
                  <Badge 
                    variant={record.generation_status === 'completed' ? 'default' : 'secondary'}
                  >
                    {record.generation_status}
                  </Badge>
                </div>
                <div className="text-sm text-muted-foreground">
                  Date: {new Date(record.requested_date).toLocaleDateString()} • 
                  Generated: {record.articles_generated} articles • 
                  Created: {new Date(record.created_at).toLocaleDateString()}
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};