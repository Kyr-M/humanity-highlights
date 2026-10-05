// src/lib/storage.ts
import { supabaseAdmin } from "./supabase";
import { CuratedStory } from "./sentiment";

export async function saveDailyHighlights(stories: CuratedStory[]) {
  if (!stories || stories.length === 0) {
    return [];
  }

  const today = new Date().toISOString().split("T")[0];
  
  // Calculate the date 30 days ago
  const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split("T")[0];

  // 1. Format the new stories for insertion
  const rows = stories.map((story) => ({
    title: story.title,
    url: story.url,
    image_url: story.image_url,
    summary: story.summary,
    source_name: story.source_name,
    fetched_date: today,
  }));

  // 2. Save today's stories
  const { data, error } = await supabaseAdmin
    .from("daily_highlights")
    .upsert(rows, { onConflict: "url" })
    .select();

  if (error) {
    throw new Error(`Supabase insertion failed: ${error.message}`);
  }

  // 3. AUTO-CLEANUP: Delete anything older than 30 days
  console.log(`Cleaning up old stories (before ${thirtyDaysAgo})...`);
  const { error: cleanupError } = await supabaseAdmin
    .from("daily_highlights")
    .delete()
    .lt("fetched_date", thirtyDaysAgo);

  if (cleanupError) {
    console.warn(`Cleanup warning: ${cleanupError.message}`);
  }

  return data;
}
