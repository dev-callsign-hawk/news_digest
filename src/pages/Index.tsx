import { useState } from "react";
import { NewsGenerator } from "@/components/NewsGenerator";
import { NewsList } from "@/components/NewsList";
import { NewsHistory } from "@/components/NewsHistory";
import { Header } from "@/components/Header";

const Index = () => {
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const handleNewsGenerated = () => {
    setRefreshTrigger(prev => prev + 1);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
            AI-Powered News Generation
          </h1>
          <p className="text-xl text-muted-foreground">
            Create Times of India style content with artificial intelligence
          </p>
        </div>

        <div className="space-y-8">
          <NewsGenerator onNewsGenerated={handleNewsGenerated} />
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <NewsList refreshTrigger={refreshTrigger} />
            </div>
            <div>
              <NewsHistory />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
