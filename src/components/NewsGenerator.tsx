import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Loader2, Newspaper } from "lucide-react";

interface NewsGeneratorProps {
  onNewsGenerated: () => void;
}

export const NewsGenerator = ({ onNewsGenerated }: NewsGeneratorProps) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [region, setRegion] = useState("");
  const [zone, setZone] = useState("");
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const { toast } = useToast();

  const regions = [
    "North India", "South India", "East India", "West India", 
    "Central India", "Northeast India"
  ];

  const zones = [
    "Urban", "Rural", "Metro", "Tier-2 City", "Tier-3 City", 
    "Industrial", "Agricultural", "Coastal"
  ];

  const handleGenerateNews = async () => {
    if (!region || !zone) {
      toast({
        title: "Missing Information",
        description: "Please select both region and zone.",
        variant: "destructive",
      });
      return;
    }

    setIsGenerating(true);
    
    try {
      const { data, error } = await supabase.functions.invoke('generate-news', {
        body: {
          region,
          zone,
          requestedDate: date
        }
      });

      if (error) throw error;

      toast({
        title: "News Generated!",
        description: `Successfully generated ${data.count} news articles for ${region}, ${zone}.`,
      });

      onNewsGenerated();
    } catch (error) {
      console.error('Error generating news:', error);
      toast({
        title: "Generation Failed",
        description: "Failed to generate news articles. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Newspaper className="h-5 w-5" />
          Generate News Articles
        </CardTitle>
        <CardDescription>
          Generate AI-powered news articles for specific regions and zones using Times of India style
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="region">Region</Label>
            <Select value={region} onValueChange={setRegion}>
              <SelectTrigger>
                <SelectValue placeholder="Select a region" />
              </SelectTrigger>
              <SelectContent>
                {regions.map((r) => (
                  <SelectItem key={r} value={r}>{r}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="zone">Zone</Label>
            <Select value={zone} onValueChange={setZone}>
              <SelectTrigger>
                <SelectValue placeholder="Select a zone" />
              </SelectTrigger>
              <SelectContent>
                {zones.map((z) => (
                  <SelectItem key={z} value={z}>{z}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="date">Date</Label>
          <Input
            id="date"
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />
        </div>

        <Button 
          onClick={handleGenerateNews} 
          disabled={isGenerating || !region || !zone}
          className="w-full"
        >
          {isGenerating ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Generating News...
            </>
          ) : (
            "Generate News Articles"
          )}
        </Button>
      </CardContent>
    </Card>
  );
};