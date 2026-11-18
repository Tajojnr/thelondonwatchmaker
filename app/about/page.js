import Link from 'next/link';

export const metadata = {
  title: 'Our Story | Emkvy Timepieces',
  description: 'The story behind Emkvy Timepieces and Mukhtar Abbas: Nigeria\'s trusted plug for authentic luxury and gift-ready watches.',
};

const PILLARS = [
  {
    n: '01',
    title: '100% Verified Authenticity',
    body: 'No fakes, no stories. Every timepiece that passes through Emkvy is strictly verified for quality and originality. When we say authentic, we guarantee it.',
  },
  {
    n: '02',
    title: 'Nationwide Delivery',
    body: 'Distance is not a barrier. Whether you are in Lagos, Abuja, Kano, or anywhere across the 36 states, your timepiece gets to you safely and on schedule.',
  },
  {
    n: '03',
    title: 'The Personal Plug',
    body: 'You are not buying from a faceless corporation. You are dealing directly with Mukhtar. Expect honest advice, perfect gift recommendations, and VIP service.',
  },
];

export default function AboutPage() {
  return (
    <div className="bg-[#1a1a1a] text-[#F8F5F0] min-h-screen pt-28">
      {/* ───────── Hero ───────── */}
      <section className="relative isolate overflow-hidden pb-20 md:pb-28 px-6">
        <div
          aria-hidden="true"
          className="absolute inset-x-0 top-0 -z-10 h-[40rem] bg-[radial-gradient(ellipse_at_50%_0%,rgba(201,169,97,0.1),transparent_65%)]"
        />

        <div className="max-w-4xl mx-auto text-center">
          <p className="text-[10px] uppercase tracking-[0.4em] text-[#C9A961] font-bold mb-8">
            Behind The Brand
          </p>

          <h1 className="text-5xl md:text-7xl font-display font-light leading-tight">
            Nigeria&apos;s Most Trusted <br className="hidden md:block" />
            <em className="text-transparent bg-clip-text bg-gradient-to-r from-[#C9A961] to-[#E5C983]">Watch Plug</em>
          </h1>

          <p className="mx-auto mt-8 max-w-2xl text-sm leading-relaxed text-[#F8F5F0]/70 md:text-base font-light">
            Built on trust, style, and relentless hustle. Emkvy Timepieces was established to 
            plug Nigerians with high-quality, authentic watches without the stress, fake promises, 
            or ridiculous markups.
          </p>
        </div>
      </section>

      {/* ───────── Editorial ───────── */}
      <section className="border-t border-white/10 py-20 md:py-28 px-6 bg-[#242424]">
        <div className="max-w-6xl mx-auto grid grid-cols-1 gap-14 lg:grid-cols-12 lg:gap-20 items-center">
          <div className="lg:col-span-5">
            <p className="text-[10px] uppercase tracking-[0.4em] text-[#C9A961] font-bold mb-6">
              Meet Mukhtar Abbas
            </p>
            <blockquote className="text-3xl md:text-5xl font-display font-light leading-snug">
              &ldquo;Your time, your style. Delivering <em className="text-[#C9A961]">confidence</em> across Nigeria.&rdquo;
            </blockquote>
          </div>

          <div className="space-y-6 lg:col-span-7">
            <p className="text-lg leading-relaxed text-[#F8F5F0]/80 font-light">
              It started simply on TikTok (@emkvy_timepieace): real videos of real watches, honest 
              prices, and a promise of integrity. Mukhtar Abbas didn&apos;t just want to sell watches; 
              he wanted to change how Nigerians celebrate their milestones.
            </p>
            <p className="text-base leading-relaxed text-[#F8F5F0]/60 font-light">
              From fresh graduates treating themselves to their first real watch, to thoughtful sisters 
              buying gifts, to executives upgrading their wrist game—Emkvy has become the go-to destination. 
              Today, with hundreds of satisfied clients and a thriving WhatsApp community, the mission remains 
              the same: real watches, real delivery, and real people.
            </p>
            
            <div className="pt-6">
              <a 
                href="https://www.tiktok.com/@emkvy_timepieace" 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-sm text-[#E63946] hover:text-white font-bold tracking-wider uppercase transition-colors"
              >
                Watch Our Journey on TikTok →
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ───────── Pillars ───────── */}
      <section className="border-t border-white/10 py-20 md:py-28 px-6 bg-[#1a1a1a]">
        <div className="max-w-6xl mx-auto">
          <div className="mb-14 text-center md:mb-20">
            <p className="text-[10px] uppercase tracking-[0.4em] text-[#C9A961] font-bold mb-5">
              The Emkvy Guarantee
            </p>
            <h2 className="text-4xl md:text-5xl font-display font-light">
              Three Core <em className="text-[#C9A961]">Principles</em>
            </h2>
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-3 md:gap-8">
            {PILLARS.map((p) => (
              <article 
                key={p.n} 
                className="group relative bg-[#242424] h-full p-8 md:p-10 rounded-2xl border border-white/5 hover:border-[#C9A961]/50 transition-all duration-500 overflow-hidden"
              >
                <div className="absolute top-0 right-0 p-8 opacity-5 font-display text-8xl font-black italic text-white pointer-events-none group-hover:text-[#C9A961] transition-colors duration-500">
                  {p.n}
                </div>
                
                <span className="font-display text-4xl font-light italic text-[#C9A961]/50 transition-colors duration-500 group-hover:text-[#C9A961]">
                  {p.n}
                </span>
                <span
                  aria-hidden="true"
                  className="my-6 block h-px w-12 origin-left bg-[#C9A961]/40 transition-all duration-700 group-hover:w-full group-hover:bg-[#C9A961]"
                />
                <h3 className="text-xl font-display font-medium mb-4 relative z-10">{p.title}</h3>
                <p className="text-sm leading-relaxed text-[#F8F5F0]/60 relative z-10">{p.body}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ───────── Call to action ───────── */}
      <section className="relative isolate overflow-hidden py-24 text-center md:py-32 px-6 border-t border-white/10">
        <div
          aria-hidden="true"
          className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_50%_100%,rgba(201,169,97,0.1),transparent_60%)]"
        />

        <div className="max-w-2xl mx-auto">
          <div className="flex items-center justify-center gap-4 mb-8 opacity-50" aria-hidden="true">
            <span className="h-px w-12 bg-[#C9A961]"></span>
            <span className="text-[#C9A961]">◆</span>
            <span className="h-px w-12 bg-[#C9A961]"></span>
          </div>

          <h2 className="text-3xl md:text-5xl font-display font-light mb-10">
            Ready to upgrade your <em>Timepiece?</em>
          </h2>

          <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link 
              href="/collections" 
              className="w-full sm:w-auto bg-[#C9A961] hover:bg-white text-[#1a1a1a] px-10 py-4 rounded-full text-xs font-bold uppercase tracking-widest transition-colors text-center"
            >
              Shop Collection
            </Link>
            <a 
              href="https://wa.me/2349038238083"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto border border-[#E63946]/50 hover:border-[#E63946] hover:bg-[#E63946] text-[#F8F5F0] px-10 py-4 rounded-full text-xs font-bold uppercase tracking-widest transition-colors text-center"
            >
              Chat on WhatsApp
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}