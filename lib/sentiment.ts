// src/lib/sentiment.ts
import OpenAI from "openai";
import { RawArticle } from "./news";

export interface CuratedStory {
  title: string;
  summary: string;
  url: string;
  image_url: string | null;
  source_name: string;
}

export async function filterAndCurateStories(articles: RawArticle[]): Promise<CuratedStory[]> {
  if (!articles.length) return [];

  // 1. Define our zero-cost fallback strategy
  const executeFallback = () => {
    console.log("Executing zero-cost fallback curation...");
    return articles.slice(0, 8).map(article => ({
      title: article.title,
      summary: article.description || "An uplifting story from around the world.",
      url: article.url,
      image_url: article.urlToImage,
      source_name: article.source?.name || "Trusted News Source"
    }));
  };

  // 2. Check if we even have an API key configured
  if (!process.env.OPENAI_API_KEY) {
    console.log("No OPENAI_API_KEY found. Defaulting to fallback.");
    return executeFallback();
  }

  // 3. Attempt the AI Curation
  try {
    console.log("Attempting AI curation with OpenAI...");
    const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
    
    const candidates = articles.map((article, index) => ({
      id: index,
      title: article.title,
      description: article.description,
      source: article.source.name,
      url: article.url,
      image_url: article.urlToImage,
    }));

    const prompt = `
You are an editor for "Humanity Highlights", a website that showcases genuinely uplifting, positive stories about humanity.
Evaluate the following candidate news stories:
${JSON.stringify(candidates, null, 2)}

STRICT CURATION RULES:
1. Select EXACTLY 5 stories that represent human kindness, scientific breakthroughs, environmental restoration, charity, or inspiring community progress.
2. EXCLUDE "silver lining" stories (e.g., people surviving after a fatal tragedy).
3. Write a concise, 2-to-3 sentence uplifting summary for each selected story.
4. Retain the exact original URL, image_url, and source_name.

Respond ONLY with a JSON object in this format:
{ "stories": [ { "title": "string", "summary": "string", "url": "string", "image_url": "string or null", "source_name": "string" } ] }
`;

    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      response_format: { type: "json_object" },
      temperature: 0.2,
      messages: [
        { role: "system", content: "You are an expert news curator specializing in constructive journalism." },
        { role: "user", content: prompt },
      ],
    });

    const content = response.choices[0].message.content;
    if (!content) throw new Error("OpenAI returned an empty response.");

    const parsed = JSON.parse(content);
    console.log("AI curation successful!");
    return (parsed.stories || []) as CuratedStory[];

  } catch (error: any) {
    // 4. If OpenAI fails (e.g. 429 Out of Credits), catch it and run the fallback!
    console.warn(`OpenAI Curation Failed (${error.message}). Switching to fallback.`);
    return executeFallback();
  }
}
