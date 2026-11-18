// app/privacy/page.js
import React from 'react';
import Link from 'next/link';

export const metadata = {
  title: 'Privacy Policy | The London Watchmaker',
  description: 'UK GDPR compliance and data protection terms for The London Watchmaker.',
};

export default function PrivacyPage() {
  return (
    <main className="bg-[#06100C] text-[#F7F4EE] min-h-screen pt-32 pb-24 font-inter text-sm selection:bg-[#C9A050] selection:text-[#06100C]">
      <div className="max-w-4xl mx-auto px-6">
        
        <header className="border-b border-[#C9A050]/20 pb-8 mb-10">
          <span className="text-[11px] font-mono tracking-[0.25em] text-[#C9A050] uppercase block mb-2">
            UK Data Protection Act 2018
          </span>
          <h1 className="text-4xl md:text-5xl font-playfair font-light">
            Privacy &amp; <span className="italic text-[#C9A050]">Data Policy</span>
          </h1>
        </header>

        <div className="space-y-8 text-white/80 leading-relaxed font-light">
          <section>
            <h2 className="text-xl font-playfair text-white mb-3">1. Information We Collect</h2>
            <p>
              When booking bench time or submitting a timepiece for repair, we collect your name, contact phone number, email address, timepiece model, and serial number. This data is strictly used for job identification, bailment logging, and repair status notifications.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-playfair text-white mb-3">2. Timepiece Serial Number Security</h2>
            <p>
              Watch serial numbers recorded during inspection are held on secure, encrypted workshop logs to verify ownership, register warranty certificates, and confirm authentic provenance. We never share or sell client details or collection records to third parties.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-playfair text-white mb-3">3. WhatsApp Communications</h2>
            <p>
              Direct bench consultations initiated via WhatsApp adhere to end-to-end encryption. You may opt out of promotional workshop announcements at any time by replying "STOP".
            </p>
          </section>

          <section>
            <h2 className="text-xl font-playfair text-white mb-3">4. Your UK GDPR Rights</h2>
            <p>
              Under UK GDPR, you retain the right to request access to, rectification of, or permanent deletion of your customer record once your repair bailment warranty period has concluded.
            </p>
          </section>
        </div>

        <div className="mt-12 pt-8 border-t border-white/10 flex justify-between items-center text-xs font-mono text-white/50">
          <span>The London Watchmaker • Hatton Garden EC1N 8LR</span>
          <Link href="/" className="text-[#C9A050] hover:underline">← Workshop Home</Link>
        </div>

      </div>
    </main>
  );
}