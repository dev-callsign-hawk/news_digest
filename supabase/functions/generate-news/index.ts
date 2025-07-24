import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
const supabaseKey = Deno.env.get('SUPABASE_ANON_KEY')!;
const geminiApiKey = Deno.env.get('GEMINI_API_KEY');

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { region, zone, requestedDate } = await req.json();
    
    console.log(`Generating news for ${region}, ${zone} on ${requestedDate}`);

    if (!geminiApiKey) {
      throw new Error('Gemini API key not configured');
    }

    const prompt = `Generate 5 realistic news headlines and summaries for ${region}, ${zone} region for ${requestedDate}. 
    Style: Times of India format - engaging, informative headlines. 
    Include: local politics, development, social issues, infrastructure, education.
    Format as JSON array with: headline, summary, tags (array of 3-5 relevant tags).
    Make it realistic and region-appropriate.`;

    const response = await fetch('https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-goog-api-key': geminiApiKey,
      },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: prompt
          }]
        }]
      }),
    });

    if (!response.ok) {
      throw new Error(`Gemini API error: ${response.statusText}`);
    }

    const data = await response.json();
    const generatedText = data.candidates[0].content.parts[0].text;
    
    // Parse the JSON from Gemini response
    let newsArticles;
    try {
      const jsonMatch = generatedText.match(/\[[\s\S]*\]/);
      if (jsonMatch) {
        newsArticles = JSON.parse(jsonMatch[0]);
      } else {
        throw new Error('No valid JSON found in response');
      }
    } catch (parseError) {
      console.error('JSON parsing error:', parseError);
      // Fallback: create structured data from the text
      newsArticles = [{
        headline: "News Generated Successfully",
        summary: generatedText.slice(0, 200) + "...",
        tags: ["news", region.toLowerCase(), zone.toLowerCase()]
      }];
    }

    // Initialize Supabase client
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Store articles in database
    const articlesToInsert = newsArticles.map((article: any) => ({
      headline: article.headline,
      summary: article.summary,
      region: region,
      zone: zone,
      published_date: requestedDate,
      tags: article.tags || ["news"],
      source_url: "https://timesofindia.indiatimes.com",
      content_generated_by: "gemini-2.0-flash"
    }));

    const { data: insertedArticles, error: insertError } = await supabase
      .from('news_articles')
      .insert(articlesToInsert)
      .select();

    if (insertError) {
      console.error('Database insert error:', insertError);
      throw insertError;
    }

    console.log(`Successfully generated and stored ${insertedArticles.length} articles`);

    return new Response(JSON.stringify({ 
      articles: insertedArticles,
      count: insertedArticles.length 
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in generate-news function:', error);
    return new Response(JSON.stringify({ 
      error: error.message,
      details: 'Failed to generate news articles'
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});