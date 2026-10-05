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

// 1. NewsAPI (Professional Outlets)
async function fetchNewsApiArticles(): Promise<RawArticle[]> {
  const apiKey = process.env.NEWS_API_KEY;
  if (!apiKey) return [];

  const domains = "apnews.com,reuters.com,bbc.com,npr.org,pbs.org,sciencenews.org";
  const query = "(breakthrough OR cure OR discovery OR inspiring OR uplifting OR philanthropy OR milestone OR humanitarian) -death -killed -crash -murder -war -fatal -arrest -crisis -tragedy -scandal";
  const fromDate = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split("T")[0];

  const url = `https://newsapi.org/v2/everything?q=${encodeURIComponent(query)}&domains=${domains}&from=${fromDate}&sortBy=publishedAt&pageSize=15&language=en&apiKey=${apiKey}`;

  try {
    const res = await fetch(url);
    if (!res.ok) return [];
    const data = await res.json();
    return (data.articles || []).map((art: any) => ({
      title: art.title,
      description: art.description || "An uplifting story from trusted global sources.",
      url: art.url,
      urlToImage: art.urlToImage,
      source: { id: null, name: art.source?.name || "Global News" },
      publishedAt: art.publishedAt,
    }));
  } catch (e) {
    return [];
  }
}

// 2. Reddit r/UpliftingNews (Crowdsourced Social Media)
async function fetchRedditArticles(): Promise<RawArticle[]> {
  try {
    const res = await fetch("https://www.reddit.com/r/upliftingnews/hot.json?limit=20", {
      headers: { "User-Agent": "HumanityHighlights/1.0" },
    });
    if (!res.ok) return [];
    
    const data = await res.json();
    const posts = data.data?.children || [];

    return posts
      .map((p: any) => {
        const post = p.data;
        if (post.stickied || !post.url) return null;

        let imageUrl = null;
        if (post.preview?.images?.[0]?.source?.url) {
          imageUrl = post.preview.images[0].source.url.replace(/&amp;/g, '&');
        } else if (post.thumbnail?.startsWith('http')) {
          imageUrl = post.thumbnail;
        }

        return {
          title: post.title,
          description: `Community-shared positive story via Reddit (${post.score} upvotes).`,
          url: post.url,
          urlToImage: imageUrl,
          source: { id: null, name: "Reddit /r/UpliftingNews" },
          publishedAt: new Date(post.created_utc * 1000).toISOString(),
        };
      })
      .filter(Boolean) as RawArticle[];
  } catch (e) {
    return [];
  }
}

// 3. NASA Astronomy Picture of the Day
async function fetchNasaApodArticle(): Promise<RawArticle[]> {
  try {
    const res = await fetch("https://api.nasa.gov/planetary/apod?api_key=DEMO_KEY");
    if (!res.ok) return [];
    
    const data = await res.json();
    if (!data.title || !data.url) return [];

    return [{
      title: `NASA Science Update: ${data.title}`,
      description: data.explanation || "A magnificent look at our universe and scientific progress.",
      url: data.hdurl || data.url,
      urlToImage: data.url,
      source: { id: null, name: "NASA Science" },
      publishedAt: data.date || new Date().toISOString(),
    }];
  } catch (e) {
    return [];
  }
}

// 4. Hacker News (Tech & Scientific Breakthroughs)
async function fetchHackerNewsArticles(): Promise<RawArticle[]> {
  try {
    const res = await fetch("https://hn.algolia.com/api/v1/search?query=breakthrough+cure+discovery+milestone+success&tags=story&numericFilters=points>30");
    if (!res.ok) return [];

    const data = await res.json();
    const hits = data.hits || [];

    return hits.slice(0, 10).map((hit: any) => ({
      title: hit.title,
      description: `Global tech and scientific breakthrough discussed by engineers (${hit.points} points).`,
      url: hit.url || `https://news.ycombinator.com/item?id=${hit.objectID}`,
      urlToImage: null,
      source: { id: null, name: "Hacker News / Tech" },
      publishedAt: hit.created_at || new Date().toISOString(),
    }));
  } catch (e) {
    return [];
  }
}

// 5. Wikipedia "On This Day" (Strictly 4 items)
async function fetchWikipediaMilestones(): Promise<RawArticle[]> {
  try {
    const today = new Date();
    const month = today.getMonth() + 1;
    const day = today.getDate();

    const res = await fetch(`https://en.wikipedia.org/api/rest_v1/feed/onthisday/events/${month}/${day}`);
    if (!res.ok) return [];

    const data = await res.json();
    const events = data.events || [];

    return events
      .filter((e: any) => {
        const text = (e.text || "").toLowerCase();
        return (
          text.includes("discover") ||
          text.includes("first") ||
          text.includes("invent") ||
          text.includes("launch") ||
          text.includes("establish") ||
          text.includes("peace") ||
          text.includes("cure")
        );
      })
      .slice(0, 4) // EXACTLY 4 WIKIPEDIA ITEMS
      .map((e: any) => {
        const page = e.pages?.[0];
        return {
          title: `Milestone in History (${e.year}): ${e.text}`,
          description: `A monumental achievement from humanity's past recorded on this day.`,
          url: page?.content_urls?.desktop?.page || "https://en.wikipedia.org",
          urlToImage: page?.thumbnail?.source || null,
          source: { id: null, name: `Wikipedia History (${e.year})` },
          publishedAt: new Date().toISOString(),
        };
      });
  } catch (e) {
    return [];
  }
}

// Helper to shuffle arrays randomly
function shuffleArray<T>(array: T[]): T[] {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

// Combine: 4 Wikipedia milestones + 6 modern articles = Exactly 10 total articles
export async function fetchCandidateNews(): Promise<RawArticle[]> {
  console.log("Fetching precisely 10 articles (4 Wikipedia + 6 Modern Sources)...");
  
  const [newsApi, reddit, nasa, hackerNews, wikipedia] = await Promise.all([
    fetchNewsApiArticles(),
    fetchRedditArticles(),
    fetchNasaApodArticle(),
    fetchHackerNewsArticles(),
    fetchWikipediaMilestones(),
  ]);

  // Take exactly 4 Wikipedia items
  const wikiItems = wikipedia.slice(0, 4);

  // Combine modern sources and deduplicate
  const modernPool = [...newsApi, ...reddit, ...nasa, ...hackerNews];
  const seenUrls = new Set<string>();
  const uniqueModern = modernPool.filter(article => {
    if (!article.title || !article.url || seenUrls.has(article.url)) return false;
    seenUrls.add(article.url);
    return true;
  });

  // Take exactly 6 modern items
  const modernItems = uniqueModern.slice(0, 6);

  // Combine to form a total of 10 items
  const combined = [...wikiItems, ...modernItems];

  // Randomize the order so the 4 Wikipedia items are blended naturally with the 6 modern stories
  return shuffleArray(combined);
}
