import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ExternalLink, Calendar } from "lucide-react";

interface NewsCardProps {
  headline: string;
  summary: string;
  published_date: string;
  tags: string[];
  source_url: string;
  region: string;
  news_beat: string;
}

export const NewsCard = ({ 
  headline, 
  summary, 
  published_date, 
  tags, 
  source_url, 
  region, 
  news_beat 
}: NewsCardProps) => {
  return (
    <Card className="h-full hover:shadow-lg transition-shadow duration-200">
      <CardHeader>
        <div className="flex items-start justify-between gap-4">
          <CardTitle className="text-lg leading-tight">{headline}</CardTitle>
          <a 
            href={source_url} 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-muted-foreground hover:text-primary"
          >
            <ExternalLink className="h-4 w-4" />
          </a>
        </div>
        <CardDescription className="flex items-center gap-2 text-sm">
          <Calendar className="h-3 w-3" />
          {new Date(published_date).toLocaleDateString('en-IN')}
          <span className="mx-2">•</span>
          {region} • {news_beat}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm text-muted-foreground leading-relaxed">{summary}</p>
        <div className="flex flex-wrap gap-2">
          {tags.map((tag, index) => (
            <Badge key={index} variant="secondary" className="text-xs">
              {tag}
            </Badge>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};