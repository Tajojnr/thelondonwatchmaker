// app/book/page.js
"use client";
import React, { useState } from 'react';
import Link from 'next/link';
import { WORKSHOP_SERVICES } from '@/data/services';

const SERVICE_OPTIONS = WORKSHOP_SERVICES || [
  { id: "diagnostic", title: "Live Diagnostic & Timing", price: "Complimentary / £0", turnaround: "15–30 Mins" },
  { id: "movement", title: "Full Calibre Overhaul", price: "From £250", turnaround: "7–14 Days" },
  { id: "refurbishment", title: "Case & Bezel Refinishing", price: "From £120", turnaround: "3–5 Days" },
  { id: "waterproof", title: "Pressure Test & Gaskets", price: "From £40", turnaround: "Same Day" },
  { id: "authentication", title: "Authentication & Valuation", price: "£80", turnaround: "Same Day" },
  { id: "other", title: "Vintage / Custom Restoration", price: "On Inspection", turnaround: "Varies" },
];

const TIME_SLOTS = [
  "Morning (10:30 – 12:30)",
  "Early Afternoon (12:30 – 15:00)",
  "Late Afternoon (15:00 – 17:30)",
  "Express Walk-In (Today)",
];

const CONDITION_FLAGS = [
  "Running Fast / Slow",
  "Stopped Completely",
  "Water / Moisture Ingress",
  "Loose Rotor / Noise",
  "Aesthetic Scratch / Polish",
  "Battery Depleted",
];

export default function BookingPage() {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    brand: '',
    model: '',
    serviceId: 'diagnostic',
    timeSlot: TIME_SLOTS[0],
    preferredDate: '',
    conditions: [],
    notes: '',
  });

  const selectedService = SERVICE_OPTIONS.find(s => s.id === formData.serviceId) || SERVICE_OPTIONS[0];

  const toggleCondition = (flag) => {
    setFormData(prev => ({
      ...prev,
      conditions: prev.conditions.includes(flag)
        ? prev.conditions.filter(c => c !== flag)
        : [...prev.conditions, flag],
    }));
  };

  const handleWhatsAppSubmit = (e) => {
    e.preventDefault();
    const symptoms = formData.conditions.length > 0 ? formData.conditions.join(', ') : 'Standard inspection';
    const text = [
      `*NEW BENCH CONSULTATION REQUEST*`,
      `━━━━━━━━━━━━━━━━━━━━`,
      `👤 *Client:* ${formData.name || 'Client'}`,
      `📞 *Phone:* ${formData.phone}`,
      `📧 *Email:* ${formData.email || 'N/A'}`,
      `⌚ *Timepiece:* ${formData.brand} ${formData.model}`,
      `⚙️ *Operation:* ${selectedService.title}`,
      `⏱ *Turnaround Guide:* ${selectedService.turnaround || 'Standard'}`,
      `🔍 *Reported Issue:* ${symptoms}`,
      `📅 *Preferred Slot:* ${formData.preferredDate ? formData.preferredDate + ' — ' : ''}${formData.timeSlot}`,
      formData.notes ? `📝 *Notes:* ${formData.notes}` : '',
      `━━━━━━━━━━━━━━━━━━━━`,
      `_Submitted via The London Watchmaker Digital Desk_`,
    ].filter(Boolean).join('\n');

    window.open(`https://wa.me/447892883885?text=${encodeURIComponent(text)}`, '_blank');
  };

  return (
    <main className="bg-[#06100C] text-[#F7F4EE] min-h-screen pt-32 pb-24 selection:bg-[#C9A050] selection:text-[#06100C]">
      <div className="max-w-7xl mx-auto px-6">
        
        {/* Editorial Header */}
        <header className="border-b border-[#C9A050]/20 pb-12 mb-12">
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
            <div>
              <div className="flex items-center gap-3 mb-3">
                <span className="w-8 h-px bg-[#C9A050]" />
                <span className="text-[10px] font-inter uppercase tracking-[0.28em] text-[#C9A050] font-semibold">
                  Hatton Garden Atelier • Direct Bench Booking
                </span>
              </div>
              <h1 className="text-4xl sm:text-6xl lg:text-7xl font-playfair font-normal leading-[1.05]">
                Reserve <span className="italic text-[#C9A050]">Bench Time</span>
              </h1>
            </div>

            <p className="text-white/60 font-inter text-xs sm:text-sm max-w-md leading-relaxed">
              Every consultation is handled directly by Jonathan Santos. Timepieces are unsealed in front of you under our bench microscope with immediate Witschi timing analysis.
            </p>
          </div>
        </header>

        {/* Form & Technical Summary Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          
          {/* Left Column: Dossier Form (7 Cols) */}
          <div className="lg:col-span-7">
            <form onSubmit={handleWhatsAppSubmit} className="space-y-10">
              
              {/* Section 1: Client Information */}
              <div className="bg-[#0C1E17] border border-white/10 p-8 space-y-6">
                <div className="flex items-center justify-between border-b border-white/10 pb-3">
                  <span className="text-[10px] font-inter uppercase tracking-widest text-[#C9A050] font-bold">
                    01 • Client Information
                  </span>
                  <span className="text-[10px] font-inter text-white/40 uppercase">Confidential</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-[10px] font-inter uppercase tracking-widest text-white/50 mb-2">
                      Full Name *
                    </label>
                    <input
                      required
                      type="text"
                      placeholder="e.g. Lord Alexander Wright"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full bg-[#06100C] border border-white/10 p-3.5 text-xs font-inter text-white placeholder-white/20 focus:border-[#C9A050] focus:outline-none transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-inter uppercase tracking-widest text-white/50 mb-2">
                      Phone / WhatsApp *
                    </label>
                    <input
                      required
                      type="tel"
                      placeholder="e.g. +44 7892 883885"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full bg-[#06100C] border border-white/10 p-3.5 text-xs font-inter text-white placeholder-white/20 focus:border-[#C9A050] focus:outline-none transition-colors"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-inter uppercase tracking-widest text-white/50 mb-2">
                    Email Address (Optional)
                  </label>
                  <input
                    type="email"
                    placeholder="e.g. alexander@mayfair.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full bg-[#06100C] border border-white/10 p-3.5 text-xs font-inter text-white placeholder-white/20 focus:border-[#C9A050] focus:outline-none transition-colors"
                  />
                </div>
              </div>

              {/* Section 2: Timepiece Particulars */}
              <div className="bg-[#0C1E17] border border-white/10 p-8 space-y-6">
                <div className="flex items-center justify-between border-b border-white/10 pb-3">
                  <span className="text-[10px] font-inter uppercase tracking-widest text-[#C9A050] font-bold">
                    02 • Timepiece Dossier
                  </span>
                  <span className="text-[10px] font-inter text-white/40 uppercase">Haute Horlogerie</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-[10px] font-inter uppercase tracking-widest text-white/50 mb-2">
                      Watch Brand *
                    </label>
                    <input
                      required
                      type="text"
                      placeholder="e.g. Rolex, Patek Philippe, Cartier"
                      value={formData.brand}
                      onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
                      className="w-full bg-[#06100C] border border-white/10 p-3.5 text-xs font-inter text-white placeholder-white/20 focus:border-[#C9A050] focus:outline-none transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-inter uppercase tracking-widest text-white/50 mb-2">
                      Model / Reference (If known)
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Submariner 126610LN / Santos"
                      value={formData.model}
                      onChange={(e) => setFormData({ ...formData, model: e.target.value })}
                      className="w-full bg-[#06100C] border border-white/10 p-3.5 text-xs font-inter text-white placeholder-white/20 focus:border-[#C9A050] focus:outline-none transition-colors"
                    />
                  </div>
                </div>

                {/* Condition Pills */}
                <div>
                  <label className="block text-[10px] font-inter uppercase tracking-widest text-white/50 mb-3">
                    Observed Symptoms (Select all that apply)
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {CONDITION_FLAGS.map((flag) => {
                      const active = formData.conditions.includes(flag);
                      return (
                        <button
                          type="button"
                          key={flag}
                          onClick={() => toggleCondition(flag)}
                          className={`p-2.5 text-[10px] font-inter uppercase tracking-wider text-left border transition-all ${
                            active
                              ? 'bg-[#C9A050]/20 border-[#C9A050] text-[#C9A050] font-semibold'
                              : 'bg-[#06100C] border-white/5 text-white/60 hover:border-white/20'
                          }`}
                        >
                          <span className="mr-1.5">{active ? '✓' : '+'}</span>
                          <span>{flag}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Section 3: Desired Operation & Bench Window */}
              <div className="bg-[#0C1E17] border border-white/10 p-8 space-y-6">
                <div className="flex items-center justify-between border-b border-white/10 pb-3">
                  <span className="text-[10px] font-inter uppercase tracking-widest text-[#C9A050] font-bold">
                    03 • Operation &amp; Workshop Window
                  </span>
                  <span className="text-[10px] font-inter text-white/40 uppercase">Hatton Garden</span>
                </div>

                <div>
                  <label className="block text-[10px] font-inter uppercase tracking-widest text-white/50 mb-3">
                    Selected Operation
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {SERVICE_OPTIONS.map((srv) => {
                      const isSelected = formData.serviceId === srv.id;
                      return (
                        <button
                          type="button"
                          key={srv.id}
                          onClick={() => setFormData({ ...formData, serviceId: srv.id })}
                          className={`p-3.5 text-left border transition-all ${
                            isSelected
                              ? 'bg-[#06100C] border-[#C9A050] shadow-[0_0_15px_rgba(201,160,80,0.15)]'
                              : 'bg-[#06100C]/60 border-white/10 hover:border-white/30'
                          }`}
                        >
                          <div className="flex justify-between items-start mb-1">
                            <span className={`text-xs font-inter font-semibold ${isSelected ? 'text-[#C9A050]' : 'text-white'}`}>
                              {srv.title}
                            </span>
                            <span className="text-[10px] font-inter text-[#25D366] font-mono">
                              {srv.turnaround}
                            </span>
                          </div>
                          <span className="text-[10px] font-inter text-white/40 block">
                            {srv.price}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-2">
                  <div>
                    <label className="block text-[10px] font-inter uppercase tracking-widest text-white/50 mb-2">
                      Preferred Date
                    </label>
                    <input
                      type="date"
                      value={formData.preferredDate}
                      onChange={(e) => setFormData({ ...formData, preferredDate: e.target.value })}
                      className="w-full bg-[#06100C] border border-white/10 p-3.5 text-xs font-inter text-white focus:border-[#C9A050] focus:outline-none transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-inter uppercase tracking-widest text-white/50 mb-2">
                      Arrival Window
                    </label>
                    <select
                      value={formData.timeSlot}
                      onChange={(e) => setFormData({ ...formData, timeSlot: e.target.value })}
                      className="w-full bg-[#06100C] border border-white/10 p-3.5 text-xs font-inter text-white focus:border-[#C9A050] focus:outline-none transition-colors"
                    >
                      {TIME_SLOTS.map(slot => (
                        <option key={slot} value={slot} className="bg-[#06100C] text-white">
                          {slot}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-inter uppercase tracking-widest text-white/50 mb-2">
                    Additional Bench Instructions / Provenance Notes
                  </label>
                  <textarea
                    rows="3"
                    placeholder="Provide any relevant repair history, vintage patina requests, or specific timing requirements..."
                    value={formData.notes}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                    className="w-full bg-[#06100C] border border-white/10 p-3.5 text-xs font-inter text-white placeholder-white/20 focus:border-[#C9A050] focus:outline-none transition-colors resize-none"
                  />
                </div>
              </div>

              {/* Submit Action */}
              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full btn-gold !py-4 text-xs font-inter uppercase tracking-[0.22em] flex items-center justify-center gap-3 cursor-pointer"
                >
                  <span>Submit Bench Dossier via WhatsApp</span>
                  <span>→</span>
                </button>
                <p className="text-[10px] text-center text-white/40 font-inter mt-3 leading-relaxed">
                  Direct encrypted connection to Jonathan Santos. Fixed written quotations provided upon physical inspection.
                </p>
              </div>

            </form>
          </div>

          {/* Right Column: Atelier Protocol & Bailment Guarantee (5 Cols) */}
          <div className="lg:col-span-5 space-y-6">
            
            {/* Consultation Summary HUD */}
            <div className="bg-[#0C1E17] border border-[#C9A050]/40 p-8 space-y-6 relative overflow-hidden shadow-2xl">
              <div className="absolute top-0 right-0 w-32 h-32 bg-[#C9A050]/10 rounded-full filter blur-2xl pointer-events-none" />

              <div>
                <span className="text-[10px] font-inter uppercase tracking-[0.25em] text-[#C9A050] font-bold block mb-2">
                  Live Intake Summary
                </span>
                <h3 className="text-2xl font-playfair font-normal text-white">
                  {selectedService.title}
                </h3>
              </div>

              <div className="space-y-3 border-y border-white/10 py-5 text-xs font-inter">
                <div className="flex justify-between">
                  <span className="text-white/40">Watchmaker:</span>
                  <span className="text-white font-medium">Jonathan Santos (Master Watchmaker)</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-white/40">Atelier Location:</span>
                  <span className="text-white">Unit 04, 62 Hatton Garden</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-white/40">Expected Turnaround:</span>
                  <span className="text-[#25D366] font-mono font-semibold">{selectedService.turnaround}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-white/40">Guideline Investment:</span>
                  <span className="text-[#C9A050] font-playfair text-base font-bold">{selectedService.price}</span>
                </div>
              </div>

              {/* Bench Standards */}
              <div className="space-y-3">
                <span className="text-[10px] font-inter uppercase tracking-widest text-[#C9A050] font-bold block">
                  The London Watchmaker Guarantees
                </span>
                <ul className="space-y-2.5 text-xs text-white/70 font-inter">
                  <li className="flex items-start gap-2.5">
                    <span className="text-[#C9A050] font-bold">✓</span>
                    <span><strong>Live Bench Assessment:</strong> Unsealed directly before you under high-magnification microscope feed.</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <span className="text-[#C9A050] font-bold">✓</span>
                    <span><strong>COSC Witschi Timing:</strong> 5-position rate and amplitude acoustic graph report included.</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <span className="text-[#C9A050] font-bold">✓</span>
                    <span><strong>Radical Honesty:</strong> No unneeded part replacements; original patina and dial integrity preserved.</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <span className="text-[#C9A050] font-bold">✓</span>
                    <span><strong>Warranty:</strong> Up to 24 months mechanical coverage on complete overhauls.</span>
                  </li>
                </ul>
              </div>

              {/* Direct Workshop Access */}
              <div className="pt-4 border-t border-white/10 text-xs font-inter text-white/60">
                <p className="mb-2">
                  <strong className="text-white">Prefer to drop in without appointment?</strong>
                </p>
                <p className="text-[11px] leading-relaxed">
                  Walk-ins are welcome Monday – Friday, 10:30 AM – 5:30 PM at Colonial Buildings (Edelsteen), 62 Hatton Garden.
                </p>
              </div>

            </div>

            {/* Quick Contact Card */}
            <div className="bg-[#0C1E17] border border-white/10 p-6 flex items-center justify-between">
              <div>
                <span className="text-[10px] font-inter uppercase tracking-widest text-white/40 block">Direct Atelier Line</span>
                <span className="text-sm font-mono text-[#25D366] font-bold">+44 7892 883885</span>
              </div>
              <a
                href="https://wa.me/447892883885"
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 border border-[#25D366]/40 text-[#25D366] hover:bg-[#25D366]/10 text-xs font-inter uppercase tracking-wider transition-colors"
              >
                Chat Now
              </a>
            </div>

          </div>

        </div>

      </div>
    </main>
  );
}