// src/lib/news.ts

export interface RawArticle {
  title: string;
  description: string;
  url: string;
  urlToImage: string | null;
  source: {
    id: string | null;
    name: string;
  };
  publishedAt: string;
}

export async function fetchCandidateNews(): Promise<RawArticle[]> {
  const apiKey = process.env.NEWS_API_KEY;
  if (!apiKey) {
    throw new Error("Missing NEWS_API_KEY environment variable.");
  }

  // Trusted and science-heavy domains
  const domains = "apnews.com,reuters.com,bbc.com,npr.org,pbs.org,sciencenews.org,smithsonianmag.com";

  // We removed the exact quotes ("") so it can find these words naturally.
  // We kept the strict negative words (-) to block depressing news.
  const query = "(breakthrough OR cure OR discovery OR inspiring OR uplifting OR philanthropy OR milestone OR humanitarian) -death -killed -crash -murder -war -fatal -arrest -crisis -tragedy -scandal";

  // Look back 14 days instead of 3 days so we always find amazing news!
  const fromDate = new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString().split("T")[0];

  const url = `https://newsapi.org/v2/everything?q=${encodeURIComponent(
    query
  )}&domains=${domains}&from=${fromDate}&sortBy=relevancy&pageSize=20&language=en&apiKey=${apiKey}`;

  const res = await fetch(url);
  if (!res.ok) {
    const errorBody = await res.text();
    throw new Error(`NewsAPI error [${res.status}]: ${errorBody}`);
  }

  const data = await res.json();

  // Strip removed articles or items missing core fields
  return (data.articles || []).filter(
    (article: RawArticle) =>
      article.title &&
      article.title !== "[Removed]" &&
      article.description &&
      article.url
  );
}
