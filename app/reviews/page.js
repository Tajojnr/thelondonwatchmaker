// app/reviews/page.js
"use client";
import React, { useState } from 'react';
import Link from 'next/link';
import { GOOGLE_REVIEWS } from '@/data/reviews';

const FILTER_TAGS = ['All', 'Rolex', 'Cartier', 'Omega', 'Vintage', 'Patek Philippe', 'Overhaul'];

export default function ReviewsPage() {
  const [activeFilter, setActiveFilter] = useState('All');

  const reviewsList = GOOGLE_REVIEWS || [];
  const filtered = reviewsList.filter((r) => {
    if (activeFilter === 'All') return true;
    const searchTarget = `${r.quote || r.content || ''} ${r.watchMentioned || r.role || ''} ${r.tag || r.badge || ''}`.toLowerCase();
    return searchTarget.includes(activeFilter.toLowerCase());
  });

  return (
    <main className="bg-[#06100C] text-[#F7F4EE] min-h-screen pt-32 pb-24 selection:bg-[#C9A050] selection:text-[#06100C]">
      <div className="max-w-7xl mx-auto px-6">
        
        {/* Header */}
        <header className="border-b border-[#C9A050]/20 pb-12 mb-12">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <span className="text-[11px] font-inter tracking-[0.25em] text-[#C9A050] uppercase block mb-3 font-semibold">
                100% Verified Google Reviews • 5.0 Star Rating
              </span>
              <h1 className="text-4xl sm:text-6xl font-playfair font-normal leading-tight">
                Hatton Garden <span className="italic text-[#C9A050]">Client Reviews</span>
              </h1>
            </div>
            
            <div className="flex items-center gap-6">
              <div className="text-right">
                <span className="text-3xl font-playfair text-[#C9A050] block font-bold leading-none mb-1">5.0 ★</span>
                <span className="text-[10px] font-inter uppercase tracking-widest text-white/50">103 Verified Ratings</span>
              </div>
              <a
                href="https://maps.google.com/?q=The+London+Watchmaker+Hatton+Garden"
                target="_blank"
                rel="noopener noreferrer"
                className="btn-gold !py-3 !px-5 text-xs font-inter"
              >
                View on Google Maps ↗
              </a>
            </div>
          </div>

          {/* Brand/Topic Filters */}
          <div className="flex flex-wrap gap-2 mt-8">
            {FILTER_TAGS.map((tag) => (
              <button
                key={tag}
                onClick={() => setActiveFilter(tag)}
                className={`px-4 py-2 text-xs font-inter uppercase tracking-wider border transition-all ${
                  activeFilter === tag
                    ? 'bg-[#C9A050] text-[#06100C] border-[#C9A050] font-bold'
                    : 'bg-transparent text-white/60 border-white/10 hover:border-white/30 hover:text-white'
                }`}
              >
                {tag}
              </button>
            ))}
          </div>
        </header>

        {/* Reviews Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((rev) => (
            <div
              key={rev.id}
              className="bg-[#0C1E17] border border-white/10 p-8 flex flex-col justify-between hover:border-[#C9A050]/40 transition-colors"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 bg-[#C9A050]/20 border border-[#C9A050]/30 flex items-center justify-center font-inter text-sm font-bold text-[#C9A050]">
                      {rev.avatar || (rev.author ? rev.author.charAt(0) : "C")}
                    </div>
                    <div>
                      <p className="text-sm font-bold text-white">{rev.author}</p>
                      <p className="text-[10px] font-inter text-white/40">{rev.date || "Verified Customer"}</p>
                    </div>
                  </div>
                  <span className="text-xs text-[#C9A050]">★★★★★</span>
                </div>

                <span className="inline-block text-[10px] font-inter uppercase tracking-wider text-[#25D366] bg-[#25D366]/10 px-2.5 py-0.5 border border-[#25D366]/20 mb-4 font-medium">
                  {rev.tag || rev.badge || "Verified Client"}
                </span>

                <p className="text-xs leading-relaxed text-white/80 font-light italic mb-6">
                  "{rev.quote || rev.content}"
                </p>
              </div>

              <div className="pt-4 border-t border-white/10 flex items-center justify-between text-[11px] font-inter text-white/50">
                <span>{rev.watchMentioned || rev.role || "Luxury Timepiece"}</span>
                <span className="text-[#C9A050] font-medium">{rev.timeframe || "Hatton Garden"}</span>
              </div>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="mt-16 text-center border-t border-white/10 pt-12">
          <h3 className="text-2xl font-playfair mb-3">Experience the Benchmark of Independent Watchmaking</h3>
          <p className="text-white/60 text-xs font-inter mb-6">Visit Unit 04, 62 Hatton Garden or speak directly with Jonathan Santos.</p>
          <Link href="/book" className="btn-gold">
            Book Live Diagnostic
          </Link>
        </div>

      </div>
    </main>
  );
}