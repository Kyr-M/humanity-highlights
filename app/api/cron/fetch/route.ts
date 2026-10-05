// src/app/api/cron/fetch/route.ts
import { NextResponse } from 'next/server';
import { fetchCandidateNews } from '../../../../lib/news';
import { filterAndCurateStories } from '../../../../lib/sentiment';
import { saveDailyHighlights } from '../../../../lib/storage';

// Allow this serverless function to run longer (helpful for API calls)
export const maxDuration = 60; 

export async function GET(request: Request) {
  // 1. Verify Authorization so only Vercel (or you) can trigger this
  const authHeader = request.headers.get('authorization');
  const cronSecret = process.env.CRON_SECRET;

  if (authHeader !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    console.log("Starting daily fetch...");
    
    // 2. Fetch candidate news
    const rawNews = await fetchCandidateNews();
    console.log(`Fetched ${rawNews.length} candidates from NewsAPI.`);

    // 3. Filter and curate the top 5 with AI
    const curatedNews = await filterAndCurateStories(rawNews);
    console.log(`Curated ${curatedNews.length} stories via OpenAI.`);

    // 4. Save to Database
    const savedData = await saveDailyHighlights(curatedNews);
    console.log("Successfully saved to Supabase.");

    return NextResponse.json({
      success: true,
      message: `Successfully processed and saved ${savedData?.length || 0} stories.`,
    });
    
  } catch (error: any) {
    console.error("Cron Job Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
