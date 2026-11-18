// app/accessibility/page.js
import React from 'react';
import Link from 'next/link';

export const metadata = {
  title: 'Accessibility Statement | The London Watchmaker',
  description: 'Accessibility features for The London Watchmaker workshop at 62 Hatton Garden, London EC1N 8LR.',
};

export default function AccessibilityPage() {
  return (
    <main className="bg-[#06100C] text-[#F7F4EE] min-h-screen pt-32 pb-24 font-inter text-sm selection:bg-[#C9A050] selection:text-[#06100C]">
      <div className="max-w-4xl mx-auto px-6">
        
        <header className="border-b border-[#C9A050]/20 pb-8 mb-10">
          <span className="text-[11px] font-mono tracking-[0.25em] text-[#C9A050] uppercase block mb-2">
            Inclusive Workshop Access
          </span>
          <h1 className="text-4xl md:text-5xl font-playfair font-light">
            Accessibility <span className="italic text-[#C9A050]">Statement</span>
          </h1>
        </header>

        <div className="space-y-8 text-white/80 leading-relaxed font-light">
          <section className="bg-[#0C1E17] border border-white/10 p-8">
            <h2 className="text-xl font-playfair text-[#C9A050] mb-4">Physical Atelier Access (62 Hatton Garden)</h2>
            <ul className="space-y-3 font-mono text-xs">
              <li className="flex items-start gap-3">
                <span className="text-[#C9A050]">✓</span>
                <span><strong>Assistive Hearing Loop:</strong> Installed at the bench consultation counter for visitors with hearing aids (T-setting).</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-[#C9A050]">✓</span>
                <span><strong>Wheelchair-Accessible Entrance:</strong> Step-free street access into Colonial Buildings with elevator service to Unit 04.</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-[#C9A050]">✓</span>
                <span><strong>Wheelchair-Accessible Seating &amp; Restroom:</strong> Ground and workshop level facilities available on site.</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-[#C9A050]">✓</span>
                <span><strong>Safe &amp; Inclusive Space:</strong> LGBTQ+ friendly, transgender safe space, and proudly women-owned business.</span>
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-playfair text-white mb-3">Digital Accessibility (WCAG 2.1 AA)</h2>
            <p>
              We are committed to making our digital portal accessible to all users. Our website incorporates high-contrast typography, semantic ARIA markers, keyboard navigable menus, and lightweight GSAP performance optimizations for reduced-motion preferences.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-playfair text-white mb-3">Assistance &amp; Pre-Arrival Arrangements</h2>
            <p>
              If you require specific assistance prior to your visit, please contact Jonathan Santos directly via WhatsApp at <a href="https://wa.me/447892883885" className="text-[#25D366] underline">+44 7892 883885</a> or email us.
            </p>
          </section>
        </div>

        <div className="mt-12 pt-8 border-t border-white/10 flex justify-between items-center text-xs font-mono text-white/50">
          <span>Last Updated: 2025</span>
          <Link href="/" className="text-[#C9A050] hover:underline">← Return to Workshop Home</Link>
        </div>

      </div>
    </main>
  );
}