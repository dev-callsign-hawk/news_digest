import { useState } from "react";
import { NewsGenerator } from "@/components/NewsGenerator";
import { NewsList } from "@/components/NewsList";

const Index = () => {
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const handleNewsGenerated = () => {
    setRefreshTrigger(prev => prev + 1);
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
            Zone News Generator
          </h1>
          <p className="text-xl text-muted-foreground">
            AI-powered news generation with Times of India style content
          </p>
        </div>

        <div className="space-y-8">
          <NewsGenerator onNewsGenerated={handleNewsGenerated} />
          <NewsList refreshTrigger={refreshTrigger} />
        </div>
      </div>
    </div>
  );
};

export default Index;
