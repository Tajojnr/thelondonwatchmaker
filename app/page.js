// app/page.js
import Hero from '@/components/Hero';
import ExplodedDiagnostics from '@/components/ExplodedDiagnostics';
import IndependentAdvantage from '@/components/IndependentAdvantage';
import MovementMacro from '@/components/MovementMacro';
import BrandsScrollGallery from '@/components/BrandsScrollGallery';
import ServicesScrollSection from '@/components/ServicesScrollSection';
import { WORKSHOP_SERVICES } from '@/data/services';
import { GOOGLE_REVIEWS } from '@/data/reviews';
import Link from 'next/link';

// Title and description are inherited from app/layout.js

const display = 'font-[family-name:var(--font-display)]';
const wrap = 'mx-auto max-w-7xl px-6 md:px-12';
const h2 = `${display} text-4xl font-medium leading-[1.05] tracking-tight text-balance md:text-6xl`;
const focusRing =
  'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#C9A050]';

const STATS = [
  { value: '5.0', label: 'from 103 Google reviews' },
  { value: '15 minutes', label: 'for on-the-spot fixes' },
  { value: '12 to 24 months', label: 'guarantee on overhauls' },
  { value: 'Hatton Garden', label: 'central London workshop' },
];

const MAPS_URL =
  'https://www.google.com/maps/search/?api=1&query=62+Hatton+Garden+London+EC1N+8LR';
const WHATSAPP_URL =
  'https://wa.me/447892883885?text=Hello%20Jonathan%2C%20I%20am%20coming%20to%20Hatton%20Garden%20today.';

export default function HomePage() {
  const services = WORKSHOP_SERVICES || [];
  const reviews = (GOOGLE_REVIEWS || []).slice(0, 6);
  const [featured, ...otherReviews] = reviews;

  return (
    <>
      {/* 1. Master bench hero (36 frames: /frames/bench-hero) */}
      <Hero />

      {/* 2. Proof, kept quiet: four figures, no decoration */}
      <section className="border-y border-[#C9A050]/20 bg-[#0C1E17] py-12 md:py-14">
        <div className={`${wrap} grid grid-cols-2 gap-x-8 gap-y-10 md:grid-cols-4`}>
          {STATS.map((s, i) => (
            <div
              key={s.value}
              className={i > 0 ? 'md:border-l md:border-[#C9A050]/15 md:pl-8' : ''}
            >
              <p className={`${display} text-3xl font-medium text-[#C9A050] md:text-4xl`}>
                {s.value}
              </p>
              <p className="mt-2 text-sm text-[#F7F4EE]/65">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 3. Live diagnostics dissection (30 frames: /frames/exploded-diagnostics) */}
      <ExplodedDiagnostics />

      {/* 4. Interactive morphing comparison (30 frames: /frames/morph-complication) */}
      <IndependentAdvantage />

      {/* 5. Calibre macro overhaul showcase (30 frames: /frames/movement-macro) */}
      <MovementMacro />

      {/* 6. Pinned watch gallery (35 frames: /frames/auction + transparent watches) */}
      <BrandsScrollGallery />

      {/* 7. Services: scroll through the price list over the original hero footage */}
      <ServicesScrollSection services={services} />

      {/* 8. Reviews: one voice leads, the rest follow quietly */}
      <section id="reviews" className="border-t border-[#C9A050]/20 bg-[#06100C] py-24 md:py-32">
        <div className={wrap}>
          <h2 className={`${h2} max-w-3xl`}>Rated 5.0 from 103 Google reviews</h2>

          {featured && (
            <figure className="mt-16 max-w-4xl">
              <blockquote
                className={`${display} text-3xl leading-[1.2] text-[#F7F4EE] md:text-5xl`}
              >
                “{featured.quote || featured.content}”
              </blockquote>
              <figcaption className="mt-8 text-sm text-[#F7F4EE]/65">
                <span className="text-[#F7F4EE]">{featured.author}</span>
                {featured.watchMentioned || featured.role
                  ? `, ${featured.watchMentioned || featured.role}`
                  : ''}
                {featured.date ? `, ${featured.date}` : ''}
              </figcaption>
            </figure>
          )}

          {otherReviews.length > 0 && (
            <div className="mt-20 grid gap-x-16 gap-y-12 md:grid-cols-2">
              {otherReviews.map((rev) => (
                <figure key={rev.id} className="border-t border-[#C9A050]/20 pt-6">
                  <blockquote className="text-base leading-relaxed text-[#F7F4EE]/80">
                    “{rev.quote || rev.content}”
                  </blockquote>
                  <figcaption className="mt-5 text-sm text-[#F7F4EE]/60">
                    <span className="text-[#F7F4EE]">{rev.author}</span>
                    {rev.watchMentioned || rev.role ? `, ${rev.watchMentioned || rev.role}` : ''}
                    {rev.date ? `, ${rev.date}` : ''}
                  </figcaption>
                </figure>
              ))}
            </div>
          )}

          <div className="mt-16">
            <Link href="/reviews" className="btn-outline inline-block">
              Read all 103 reviews
            </Link>
          </div>
        </div>
      </section>

           {/* 7. Hatton Garden Workshop & Interactive Map Section */}
      <section id="visit" className="py-24 px-6 md:px-12 bg-[#06100C] border-t border-[#C9A050]/20 text-[#F7F4EE]">
        <div className="max-w-7xl mx-auto">
          
          {/* Main Container */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-stretch">
            
            {/* Left Column: Workshop Details & CTAs (5 Columns) */}
            <div className="lg:col-span-5 flex flex-col justify-between space-y-8">
              <div>
                <span className="text-[10px] font-mono tracking-[0.28em] uppercase text-[#C9A050] font-semibold block mb-3">
                  Central London Workshop
                </span>
                <h2 className="font-[family-name:var(--font-display)] text-4xl sm:text-5xl lg:text-6xl font-normal leading-[1.05] mb-4">
                  Visit Jonathan at <br />
                  <span className="italic text-[#C9A050]">62 Hatton Garden</span>
                </h2>
                <p className="text-white/70 text-sm leading-relaxed max-w-md font-light mb-8">
                  Walk-ins and scheduled bench consultations are both welcome. Diagnostics and timing tests are performed live at the counter.
                </p>

                {/* CTAs */}
                <div className="flex flex-col sm:flex-row gap-3 pt-1">
                  <Link href="/book" className="btn-gold text-center text-xs">
                    Book a Bench Consultation
                  </Link>
                  <a
                    href="https://wa.me/447892883885?text=Hello%20Jonathan,%20I%20am%20visiting%20Hatton%20Garden%20today."
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-whatsapp-minimal text-center text-xs"
                  >
                    WhatsApp +44 7892 883885
                  </a>
                </div>
              </div>

              {/* Practical Atelier Details Grid */}
              <div className="border-t border-white/10 pt-8 space-y-6 text-xs">
                
                {/* Address & Direct Directions */}
                <div>
                  <span className="text-[10px] font-mono uppercase tracking-widest text-[#C9A050] block mb-1">
                    Address
                  </span>
                  <p className="text-white font-medium text-sm leading-snug">
                    Unit 04, Colonial Buildings (Edelsteen)
                  </p>
                  <p className="text-white/70">62 Hatton Garden, London EC1N 8LR</p>
                  <a
                    href="https://maps.google.com/?q=62+Hatton+Garden,+London+EC1N+8LR"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[#C9A050] hover:text-[#d8b263] transition-colors inline-flex items-center gap-1.5 mt-2 font-mono text-[11px] tracking-wider uppercase underline underline-offset-4"
                  >
                    <span>Open in Google Maps</span>
                    <span>↗</span>
                  </a>
                </div>

                {/* Opening Hours */}
                <div>
                  <span className="text-[10px] font-mono uppercase tracking-widest text-[#C9A050] block mb-1">
                    Opening Hours
                  </span>
                  <p className="text-white font-medium">Monday – Friday: 10:30 AM – 5:30 PM</p>
                  <p className="text-white/50 text-[11px] mt-0.5">Saturday – Sunday: Closed (By Appointment)</p>
                </div>

                {/* Nearest Tube & Transit */}
                <div>
                  <span className="text-[10px] font-mono uppercase tracking-widest text-[#C9A050] block mb-1">
                    Transit &amp; Accessibility
                  </span>
                  <div className="space-y-1 text-white/70">
                    <p>• <strong>Farringdon Station:</strong> 3 min walk (Elizabeth line, Thameslink, Circle, Hammersmith &amp; City, Metropolitan)</p>
                    <p>• <strong>Chancery Lane:</strong> 4 min walk (Central line)</p>
                    <p>• <strong>Accessibility:</strong> Wheelchair accessible with assistive hearing loop (T-setting)</p>
                  </div>
                </div>

              </div>
            </div>

            {/* Right Column: Embedded Dark-Themed Google Map (7 Columns) */}
            <div className="lg:col-span-7 flex flex-col">
              <div className="relative w-full h-full min-h-[460px] lg:min-h-[580px] bg-[#0C1E17] border border-[#C9A050]/30 overflow-hidden shadow-2xl">
                
                {/* Floating Atelier Pin Badge */}
                <div className="absolute top-4 left-4 z-20 bg-[#06100C]/90 backdrop-blur-md border border-[#C9A050]/50 px-4 py-2.5 flex items-center gap-3 shadow-lg pointer-events-none">
                  <span className="w-2 h-2 rounded-full bg-[#25D366] animate-pulse" />
                  <div>
                    <span className="font-[family-name:var(--font-display)] text-sm text-white font-medium block leading-none">
                      The London Watchmaker
                    </span>
                    <span className="text-[9px] font-mono tracking-widest uppercase text-[#C9A050] block mt-0.5">
                      Unit 04 • 62 Hatton Garden
                    </span>
                  </div>
                </div>

                {/* Google Maps iFrame with dark horological tone filter */}
                <iframe
                  title="The London Watchmaker Location - 62 Hatton Garden, London"
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2482.6842065874413!2d-0.10984852338006834!3d51.519018471815195!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x48761b5204c32eb3%3A0x6b63f5fa9321e065!2s62%20Hatton%20Garden%2C%20London%20EC1N%208LR!5e0!3m2!1sen!2suk!4v1710000000000!5m2!1sen!2suk"
                  width="100%"
                  height="100%"
                  style={{
                    border: 0,
                    filter: 'invert(90%) hue-rotate(180deg) contrast(1.1) saturate(0.4)',
                    minHeight: '100%',
                    width: '100%',
                  }}
                  allowFullScreen=""
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  className="w-full h-full absolute inset-0"
                />

                {/* Ambient Hairline Overlay */}
                <div className="absolute inset-0 pointer-events-none border border-white/5" />
              </div>
            </div>

          </div>

        </div>
      </section>
    </>
  );
}