// src/app/page.tsx
import { supabaseAdmin } from "../lib/supabase";
import StoryDeck from "../components/StoryDeck";

export const dynamic = 'force-dynamic';

export default async function Home() {
  const { data: stories, error } = await supabaseAdmin
    .from("daily_highlights")
    .select("*")
    .order("fetched_date", { ascending: false })
    .order("created_at", { ascending: false })
    .limit(8);

  if (error) {
    console.error("Error fetching stories:", error);
  }

  return <StoryDeck stories={stories || []} />;
}
