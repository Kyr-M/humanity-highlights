// src/components/StoryDeck.tsx
"use client";

import { useState, useEffect } from "react";

export default function StoryDeck({ stories }: { stories: any[] }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [quote, setQuote] = useState({ 
    text: "The best way to find yourself is to lose yourself in the service of others.", 
    author: "Mahatma Gandhi" 
  });

  useEffect(() => {
    async function fetchLiveQuote() {
      try {
        const res = await fetch("https://dummyjson.com/quotes/random");
        if (res.ok) {
          const data = await res.json();
          setQuote({ text: data.quote, author: data.author });
        }
      } catch (e) {
        // Fallback handled
      }
    }
    fetchLiveQuote();
  }, []);

  if (!stories || stories.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#f2efe9] text-stone-900 font-serif">
        <p className="text-xl tracking-widest uppercase">No editions printed for today</p>
      </div>
    );
  }

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % stories.length);
  };

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + stories.length) % stories.length);
  };

  const story = stories[currentIndex];
  const currentDate = new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }).toUpperCase();

  return (
    <main className="min-h-screen bg-[#f2efe9] text-stone-900 font-serif py-6 px-4 sm:px-6 lg:px-10 flex flex-col items-center selection:bg-stone-300">
      
      {/* Master Newspaper Sheet */}
      <div className="max-w-7xl w-full border-4 border-stone-900 p-4 sm:p-8 bg-[#f2efe9] shadow-[0_25px_60px_rgba(0,0,0,0.2)] relative">
        
        {/* Top Info Ribbon */}
        <div className="flex justify-between items-center text-[10px] sm:text-xs font-sans uppercase tracking-widest border-b border-stone-900 pb-1 mb-3 text-stone-700">
          <span>Weather: Clear & Bright Worldwide</span>
          <span>The Voice of Global Progress</span>
          <span>Price: Gratitude & Focus</span>
        </div>

        {/* Massive Broadsheet Title */}
        <header className="text-center py-2 border-b-4 border-stone-900">
          <h1 className="text-3xl sm:text-6xl md:text-7xl font-black uppercase tracking-tight text-stone-900 font-serif leading-none">
            The Humanity Highlights
          </h1>
          <p className="text-xs sm:text-sm italic font-serif text-stone-700 tracking-widest mt-1">
            "All the Uplifting News That Inspires the World"
          </p>
        </header>

        {/* Double-Lined Metadata Bar */}
        <div className="border-t-2 border-b-2 border-stone-900 py-1.5 my-3 flex flex-wrap justify-between items-center text-[10px] sm:text-xs uppercase tracking-widest font-sans font-bold text-stone-900">
          <span>Edition No. {currentIndex + 101}</span>
          <span>•</span>
          <span>Front Page Chronicle</span>
          <span>•</span>
          <span>{currentDate}</span>
        </div>

        {/* 2-Column Asymmetric Broadsheet Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mt-4 items-start">
          
          {/* LEFT COLUMN (Span 4): All 10 Wire Briefs Index */}
          <div className="lg:col-span-4 space-y-3 lg:border-r-2 lg:border-stone-900 lg:pr-5 flex flex-col justify-between">
            <div>
              <div className="border-b-2 border-stone-900 pb-1 mb-3">
                <h4 className="text-[10px] font-sans font-extrabold uppercase tracking-widest bg-stone-900 text-white px-2 py-0.5 inline-block">
                  Complete Wire Index (10 Dispatches)
                </h4>
              </div>

              <div className="space-y-2.5 max-h-[850px] overflow-y-auto pr-1">
                {stories.map((s, idx) => (
                  <div 
                    key={idx} 
                    onClick={() => setCurrentIndex(idx)}
                    className={`cursor-pointer p-2.5 transition-all border-b border-stone-300 ${
                      idx === currentIndex ? 'bg-stone-300/80 border-l-4 border-l-stone-900 shadow-inner' : 'hover:bg-stone-300/40'
                    }`}
                  >
                    <span className="text-[9px] font-sans font-bold text-stone-600 uppercase block mb-0.5">
                      Dispatch #{idx + 1} — {s.source_name}
                    </span>
                    <h5 className="text-xs font-bold leading-snug line-clamp-2 text-stone-900 font-serif">
                      {s.title}
                    </h5>
                  </div>
                ))}
              </div>
            </div>

            {/* Philosophical Note */}
            <div className="border-2 border-stone-900 p-3 bg-[#e9e4d5] shadow-sm mt-4">
              <span className="text-[9px] font-sans font-bold uppercase tracking-widest block text-stone-600 mb-1">
                Daily Philosophical Note
              </span>
              <p className="text-[11px] italic font-serif text-stone-900 leading-relaxed">
                "{quote.text}"
              </p>
              <p className="text-[9px] font-sans font-bold uppercase tracking-wider text-right mt-1 text-stone-800">
                — {quote.author}
              </p>
            </div>
          </div>

          {/* RIGHT COLUMN (Span 8): Main Active Lead Feature Story */}
          <div className="lg:col-span-8 flex flex-col space-y-5 lg:pl-2">
            
            {/* Headline Section */}
            <div className="border-b-2 border-stone-900 pb-3">
              <div className="flex items-center space-x-2 mb-1">
                <span className="text-[10px] font-sans font-bold uppercase tracking-widest bg-stone-900 text-[#f2efe9] px-2 py-0.5">
                  {story.source_name}
                </span>
                <span className="text-[10px] font-sans text-stone-600 italic">
                  [ FEATURED FRONT PAGE STORY #{currentIndex + 1} ]
                </span>
              </div>
              
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-black leading-tight text-stone-900 font-serif">
                {story.title}
              </h2>
            </div>

            {/* Clean Featured Image (Centered & Framed) */}
            {story.image_url && (
              <div className="border-2 border-stone-900 p-2 bg-white shadow-md max-w-2xl mx-auto w-full">
                <div className="w-full aspect-[16/9] bg-stone-200 overflow-hidden relative">
                  <img 
                    src={story.image_url} 
                    alt="Story visual" 
                    className="w-full h-full object-cover grayscale contrast-125 hover:grayscale-0 transition-all duration-700" 
                  />
                </div>
                <div className="pt-2 px-1 text-[10px] font-sans italic text-stone-600 border-t border-stone-200 mt-1">
                  Photographic Archive via {story.source_name}.
                </div>
              </div>
            )}

            {/* Story Summary Text (Multi-column newspaper layout) */}
            <div className="text-stone-900 font-serif text-sm sm:text-base leading-relaxed text-justify columns-1 sm:columns-2 gap-6 pt-2 border-t border-stone-300">
              <p className="first-letter:text-4xl first-letter:font-black first-letter:float-left first-letter:mr-2 first-letter:leading-none">
                {story.summary}
              </p>
            </div>

            {/* Action Bar & Controls */}
            <div className="flex flex-wrap justify-between items-center py-3 border-t-2 border-b-2 border-stone-900 gap-2">
              <button 
                onClick={handlePrev}
                className="px-4 py-2 border border-stone-900 text-stone-900 hover:bg-stone-900 hover:text-[#f2efe9] transition-all text-xs font-sans font-bold uppercase tracking-wider"
              >
                ← Previous Story
              </button>

              <a 
                href={story.url}
                target="_blank"
                rel="noopener noreferrer"
                className="px-6 py-2 bg-stone-900 text-[#f2efe9] hover:bg-emerald-800 transition-colors text-xs font-sans font-bold uppercase tracking-widest shadow"
              >
                Read Original Archive Article →
              </a>

              <button 
                onClick={handleNext}
                className="px-4 py-2 border border-stone-900 text-stone-900 hover:bg-stone-900 hover:text-[#f2efe9] transition-all text-xs font-sans font-bold uppercase tracking-wider"
              >
                Next Story →
              </button>
            </div>

          </div>

        </div>

        {/* Newspaper Footer */}
        <footer className="mt-10 pt-3 border-t-2 border-stone-900 text-center text-[10px] font-sans uppercase tracking-widest text-stone-700">
          <p>The Humanity Highlights Gazette • Autonomous Daily Positive Print Edition • © {new Date().getFullYear()}</p>
        </footer>

      </div>

    </main>
  );
}
