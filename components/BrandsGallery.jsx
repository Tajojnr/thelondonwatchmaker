// components/BrandsScrollGallery.jsx
'use client';
import Link from 'next/link';

const BRANDS = [
  { 
    name: 'Rolex', 
    cal: 'Cal. 3135 / 3235 / 4130', 
    models: 'Submariner, Daytona, Datejust, GMT-Master II',
    turnaround: 'Same-Day Diagnostics', 
    badge: 'Chronometer Spec' 
  },
  { 
    name: 'Patek Philippe', 
    cal: 'Cal. 324 S C / 240 / CH 28', 
    models: 'Nautilus, Aquanaut, Calatrava, Complications',
    turnaround: 'Microscope Inspection', 
    badge: 'Haute Horlogerie' 
  },
  { 
    name: 'Richard Mille', 
    cal: 'RMAC1 / RMUL2 / RM50', 
    models: 'RM 011, RM 035, RM 055, Tourbillons',
    turnaround: '15-Min On-Site Fix', 
    badge: '5.0★ Verified' 
  },
  { 
    name: 'Audemars Piguet', 
    cal: 'Cal. 3120 / 4302 / 2385', 
    models: 'Royal Oak, Offshore, Concept Chrono',
    turnaround: 'Gasket & Pressure Test', 
    badge: 'Royal Oak Bench' 
  },
  { 
    name: 'Omega', 
    cal: 'Co-Axial 8800 / 3861 / 1861', 
    models: 'Speedmaster Moonwatch, Seamaster 300M',
    turnaround: '48-Hour Regulation', 
    badge: 'Co-Axial Master' 
  },
  { 
    name: 'TAG Heuer & Breitling', 
    cal: 'Calibre 16 / Heuer 02 / B01', 
    models: 'Monaco, Carrera, Navitimer, Chronomat',
    turnaround: '5-Minute Pusher Alignment', 
    badge: 'Instant Bench Service' 
  },
  { 
    name: 'Cartier & Jaeger-LeCoultre', 
    cal: 'Cal. 1847 MC / 846 / 925', 
    models: 'Santos, Tank, Reverso, Master Ultra Thin',
    turnaround: 'Sapphire & Lapidary Polish', 
    badge: 'Lapidary Finish' 
  },
  { 
    name: 'Vintage & Antique Clocks', 
    cal: 'Westminster Chime & Pocket Calibres', 
    models: 'Smiths, Longines, Zenith, Vintage Heirlooms',
    turnaround: 'Full Custom Restoration', 
    badge: 'Patina Preserved' 
  }
];

export default function BrandsScrollGallery() {
  return (
    <section className="py-16 bg-[#06100C] border-y border-[#C9A050]/20 overflow-hidden relative">
      <div className="max-w-7xl mx-auto px-6 mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <span className="text-[10px] font-mono uppercase tracking-[0.3em] text-[#C9A050] font-bold">
            Swiss &amp; British Horological Expertise
          </span>
          <h3 className="font-[family-name:var(--font-playfair)] text-2xl sm:text-3xl text-[#F7F4EE] mt-1 font-light">
            Manufactures &amp; Calibres Mastered
          </h3>
        </div>
        <p className="text-xs text-[#F7F4EE]/60 font-mono">
          All repairs executed on-site at 62 Hatton Garden with genuine Swiss parts &amp; diagnostic microscopes.
        </p>
      </div>

      {/* Brand Cards Grid */}
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {BRANDS.map((brand, i) => (
            <div
              key={i}
              className="bg-[#0C1E17] border border-[#C9A050]/20 hover:border-[#C9A050] transition-all p-5 rounded-xl flex flex-col justify-between group"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[9px] font-mono uppercase tracking-widest text-[#C9A050] bg-[#C9A050]/10 px-2 py-0.5 rounded border border-[#C9A050]/30">
                    {brand.badge}
                  </span>
                  <span className="text-xs text-[#25D366] font-mono">⚡ {brand.turnaround}</span>
                </div>
                <h4 className="font-[family-name:var(--font-playfair)] text-lg text-[#F7F4EE] group-hover:text-[#C9A050] transition-colors">
                  {brand.name}
                </h4>
                <p className="text-[11px] text-[#F7F4EE]/50 font-mono mt-1">
                  {brand.cal}
                </p>
                <p className="text-xs text-[#F7F4EE]/70 mt-2 font-light line-clamp-2">
                  {brand.models}
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-[#C9A050]/15">
                <Link
                  href={`/book?brand=${encodeURIComponent(brand.name)}`}
                  className="text-[10px] uppercase tracking-wider font-mono text-[#C9A050] group-hover:text-white flex items-center justify-between transition-colors"
                >
                  <span>Book {brand.name} Bench Service</span>
                  <span>→</span>
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}