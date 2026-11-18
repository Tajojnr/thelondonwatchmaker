"use client";
import React, { useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { WORKSHOP_SERVICES } from '@/data/services';

const CATEGORIES = [
  { id: 'all', label: 'Complete Workshop Menu' },
  { id: 'overhaul', label: 'Calibre Overhauls' },
  { id: 'diagnostics', label: 'Live Diagnostics' },
  { id: 'restoration', label: 'Finishing & Case' },
];

export default function ServicesPage() {
  const [activeCategory, setActiveCategory] = useState('all');

  const filteredServices = WORKSHOP_SERVICES.filter((s) => {
    if (activeCategory === 'all') return true;
    return s.category === activeCategory;
  });

  return (
    <main className="bg-[#06100C] text-[#F7F4EE] min-h-screen pt-32 pb-24 selection:bg-[#C9A050] selection:text-[#06100C]">
      {/* Editorial Header */}
      <section className="max-w-7xl mx-auto px-6 mb-16">
        <div className="flex flex-col md:flex-row md:items-end justify-between border-b border-white/10 pb-12 gap-8">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <span className="w-8 h-px bg-[#C9A050]" />
              <span className="text-[11px] font-mono tracking-[0.28em] uppercase text-[#C9A050]">
                Hatton Garden Workshop • Bench Direct
              </span>
            </div>
            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-playfair tracking-tight leading-[1.05]">
              Master <span className="italic font-normal text-[#C9A050]">Horological</span> Services
            </h1>
          </div>

          <p className="text-white/60 font-inter text-sm md:text-base max-w-md leading-relaxed">
            Every operation is executed by Jonathan Santos inside our Hatton Garden workshop. No 6-month brand queues, no outsourced third-party hubs.
          </p>
        </div>

        {/* Guarantees Ribbon */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-px bg-white/10 border border-white/10 mt-8 text-xs font-mono tracking-wider">
          <div className="bg-[#0C1E17] p-4 text-center">
            <span className="text-[#C9A050] block mb-1">✓ DIAGNOSTICS</span>
            <span className="text-white/80">While-You-Watch</span>
          </div>
          <div className="bg-[#0C1E17] p-4 text-center">
            <span className="text-[#C9A050] block mb-1">✓ REGULATION</span>
            <span className="text-white/80">Witschi 5-Position COSC</span>
          </div>
          <div className="bg-[#0C1E17] p-4 text-center">
            <span className="text-[#C9A050] block mb-1">✓ WARRANTY</span>
            <span className="text-white/80">Up to 24 Months</span>
          </div>
          <div className="bg-[#0C1E17] p-4 text-center">
            <span className="text-[#C9A050] block mb-1">✓ AUTHENTIC</span>
            <span className="text-white/80">OEM Swiss Lubricants</span>
          </div>
        </div>

        {/* Category Filter */}
        <div className="flex flex-wrap gap-2 mt-12">
          {CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`px-5 py-2.5 text-xs font-mono uppercase tracking-widest transition-all duration-300 border ${
                activeCategory === cat.id
                  ? 'bg-[#C9A050] text-[#06100C] border-[#C9A050] font-bold shadow-[0_0_15px_rgba(201,160,80,0.3)]'
                  : 'bg-transparent text-white/60 border-white/10 hover:border-white/30 hover:text-white'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </section>

      {/* Services Grid */}
      <section className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-px bg-white/10 border border-white/10">
          <AnimatePresence mode="popLayout">
            {filteredServices.map((service, idx) => (
              <motion.div
                layout
                key={service.id || idx}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.96 }}
                transition={{ duration: 0.35, delay: idx * 0.05 }}
                className="bg-[#0C1E17] p-8 md:p-10 flex flex-col justify-between group hover:bg-[#112920] transition-colors duration-500 relative"
              >
                {/* Hairline accent top */}
                <div className="absolute top-0 left-0 right-0 h-[2px] bg-transparent group-hover:bg-[#C9A050] transition-colors duration-500" />

                <div>
                  <div className="flex items-start justify-between mb-6">
                    <span className="text-3xl filter saturate-50 group-hover:saturate-100 transition-all">
                      {service.icon || "⚙️"}
                    </span>
                    <span className="text-[10px] font-mono tracking-widest text-[#C9A050] uppercase px-2 py-1 bg-[#C9A050]/10 border border-[#C9A050]/20">
                      {service.turnaround || "Fast Track"}
                    </span>
                  </div>

                  <h3 className="text-2xl font-playfair font-normal text-white group-hover:text-[#C9A050] transition-colors mb-3">
                    {service.title}
                  </h3>

                  <p className="text-white/65 text-sm font-inter leading-relaxed mb-8">
                    {service.description}
                  </p>

                  {/* Highlights list if available */}
                  {service.highlights && (
                    <ul className="space-y-2 mb-8 text-xs font-inter text-white/50 border-t border-white/5 pt-4">
                      {service.highlights.map((h, i) => (
                        <li key={i} className="flex items-center gap-2">
                          <span className="w-1.5 h-1.5 bg-[#C9A050]" />
                          <span>{h}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>

                <div className="pt-6 border-t border-white/10 flex items-end justify-between">
                  <div>
                    <span className="text-[10px] font-mono uppercase tracking-widest text-white/40 block mb-1">
                      Starting Investment
                    </span>
                    <span className="text-xl font-playfair font-bold text-[#C9A050]">
                      {service.price}
                    </span>
                  </div>

                  <Link
                    href={`/book?service=${service.id}`}
                    className="text-xs font-mono uppercase tracking-wider text-white hover:text-[#C9A050] transition-colors flex items-center gap-1 group/btn"
                  >
                    <span>Reserve</span>
                    <span className="inline-block transform group-hover/btn:translate-x-1 transition-transform">→</span>
                  </Link>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </section>

      {/* Bespoke Bench Quote Banner */}
      <section className="max-w-7xl mx-auto px-6 mt-20">
        <div className="bg-gradient-to-br from-[#0C1E17] to-[#06100C] border border-[#C9A050]/30 p-8 md:p-14 relative overflow-hidden">
          <div className="relative z-10 max-w-3xl">
            <span className="text-[11px] font-mono tracking-[0.25em] text-[#C9A050] uppercase block mb-3">
              Independent Horological Specialist
            </span>
            <h2 className="text-3xl md:text-5xl font-playfair text-white mb-4 leading-tight">
              Have a Complication, Vintage Calibre, or Bespoke Request?
            </h2>
            <p className="text-white/70 text-sm md:text-base font-inter mb-8 leading-relaxed">
              We regularly restore vintage Speedmasters, perpetual calendars, sub-seconds chronometers, and family heirlooms other shops turn away. Bring your timepiece to Unit 04, 62 Hatton Garden.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 items-stretch sm:items-center">
              <Link
                href="/book"
                className="btn-gold px-8 py-4 text-xs font-mono uppercase tracking-widest text-center"
              >
                Book Bench Consultation
              </Link>
              <a
                href="https://wa.me/447892883885?text=Hello%20Jonathan,%20I%20have%20a%20watch%20service%20enquiry"
                target="_blank"
                rel="noopener noreferrer"
                className="px-8 py-4 border border-[#25D366]/40 hover:border-[#25D366] text-[#25D366] hover:bg-[#25D366]/10 text-xs font-mono uppercase tracking-widest text-center transition-colors flex items-center justify-center gap-2"
              >
                <span>WhatsApp Jonathan Santos</span>
              </a>
            </div>
          </div>

          {/* Background Watermark */}
          <div className="absolute -right-10 -bottom-10 text-[180px] font-playfair italic font-bold text-white/[0.02] select-none pointer-events-none">
            LWM
          </div>
        </div>
      </section>
    </main>
  );
}