// components/Footer.jsx
import React from 'react';
import Link from 'next/link';
import Image from 'next/image';

const display = 'font-[family-name:var(--font-display)]';
const focusRing =
  'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#C9A050]';

const NAV_LINKS = [
  { href: '/services', label: 'Workshop Services Menu' },
  { href: '/book', label: 'Book Bench Appointment' },
  { href: '/track', label: 'Live Repair Job Tracker' },
  { href: '/reviews', label: '103 Google Reviews' },
  { href: '/terms', label: 'Terms of Repair & Bailment' },
  { href: '/privacy', label: 'UK GDPR & Privacy Policy' },
  { href: '/accessibility', label: 'Accessibility Statement' },
];

export default function Footer() {
  // Static year compliant with Next.js 16 Turbopack static prerendering
  const year = 2025;

  return (
    <footer className="border-t border-[#C9A050]/20 bg-[#030806] pb-12 pt-20 text-sm text-[#F7F4EE]">
      <div className="mx-auto max-w-7xl px-6 lg:px-12">
        {/* Main Footer Row */}
        <div className="grid grid-cols-1 gap-14 border-b border-white/10 pb-16 md:grid-cols-2 lg:grid-cols-12">
          {/* Column 1: Brand & Logo */}
          <div className="space-y-8 lg:col-span-5">
            <Link href="/" className={`group inline-block ${focusRing}`}>
              <div className="flex items-center gap-5">
                <Image
                  src="/logo.png"
                  alt="The London Watchmaker"
                  width={192}
                  height={192}
                  className="h-20 w-20 shrink-0 object-contain drop-shadow-[0_0_18px_rgba(201,160,80,0.25)] md:h-24 md:w-24"
                />
                <div>
                  <span
                    className={`${display} block text-2xl font-medium leading-tight tracking-[0.08em] text-[#F7F4EE] transition-colors duration-300 group-hover:text-[#C9A050] md:text-[1.75rem]`}
                  >
                    THE LONDON WATCHMAKER
                  </span>
                  <span className="mt-2 block text-xs font-medium uppercase tracking-[0.22em] text-[#D8B468]">
                    Hatton Garden • Jonathan Santos
                  </span>
                </div>
              </div>
            </Link>

            <p className="max-w-md text-[15px] leading-relaxed text-white/70">
              Independent master horological workshop specialising in on-the-spot diagnostics,
              complete calibre overhauls, hydrostatic testing, and precision case finishing.
            </p>

            <div className="flex flex-wrap items-center gap-3">
              <span className="inline-flex items-center gap-2 border border-[#C9A050]/40 bg-[#C9A050]/10 px-3.5 py-1.5 text-xs font-medium uppercase tracking-[0.14em] text-[#D8B468]">
                ★ 5.0 · 103 Google Reviews
              </span>
              <span className="inline-flex items-center gap-2 border border-white/15 bg-white/5 px-3.5 py-1.5 text-xs font-medium uppercase tracking-[0.14em] text-white/75">
                COSC Standards
              </span>
            </div>
          </div>

          {/* Column 2: Workshop Hours & Location */}
          <div className="space-y-5 lg:col-span-4">
            <h2 className="text-xs font-semibold uppercase tracking-[0.22em] text-[#D8B468]">
              Hatton Garden Atelier
            </h2>

            <address className="not-italic leading-relaxed text-white/80">
              <strong className="font-medium text-white">Unit 04, Colonial Buildings</strong>
              <br />
              62 Hatton Garden (Edelsteen)
              <br />
              London EC1N 8LR, United Kingdom
            </address>

            <dl className="max-w-sm space-y-2 pt-1 text-white/70">
              <div className="flex justify-between gap-4 border-b border-white/10 pb-2">
                <dt>Monday – Friday</dt>
                <dd className="font-medium tabular-nums text-white">10:30 AM – 5:30 PM</dd>
              </div>
              <div className="flex justify-between gap-4 pt-1">
                <dt>Saturday – Sunday</dt>
                <dd className="text-white/70">Closed (By Appointment)</dd>
              </div>
            </dl>

            <div className="pt-1">
              <a
                href="https://wa.me/447892883885"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="WhatsApp +44 7892 883885 (opens in a new tab)"
                className={`inline-flex items-center gap-2 font-medium text-[#25D366] transition-colors hover:text-[#25D366]/80 ${focusRing}`}
              >
                <span>WhatsApp: +44 7892 883885</span>
                <span aria-hidden="true">→</span>
              </a>
            </div>
          </div>

          {/* Column 3: Navigation & Legal */}
          <nav aria-label="Footer" className="space-y-5 lg:col-span-3">
            <h2 className="text-xs font-semibold uppercase tracking-[0.22em] text-[#D8B468]">
              Navigation &amp; Legal
            </h2>
            <ul className="space-y-3 text-white/70">
              {NAV_LINKS.map(({ href, label }) => (
                <li key={href}>
                  <Link
                    href={href}
                    className={`transition-colors hover:text-[#C9A050] motion-reduce:transition-none ${focusRing}`}
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        {/* Bottom Bar */}
        <div className="flex flex-col items-center justify-between gap-4 pt-8 text-xs text-white/60 md:flex-row">
          <ul className="flex flex-wrap items-center justify-center gap-x-4 gap-y-1 md:justify-start">
            <li>© {year} The London Watchmaker</li>
            <li aria-hidden="true">•</li>
            <li>Hearing Loop Equipped</li>
            <li aria-hidden="true">•</li>
            <li>Wheelchair Accessible</li>
            <li aria-hidden="true">•</li>
            <li>LGBTQ+ Safe Space</li>
          </ul>

          <p className="text-center md:text-right">62 Hatton Garden, London</p>
        </div>
      </div>
    </footer>
  );
}