"use client";
import React, { useState } from 'react';

const INITIAL_JOBS = [
  { id: 'LWM-7821', client: 'Alex M.', phone: '447000000000', watch: 'Rolex Submariner', status: 'BENCH' },
  { id: 'LWM-4902', client: 'Sarah K.', phone: '447000000000', watch: 'Cartier Tank', status: 'RECEIVED' },
];

export default function AdminPage() {
  const [jobs, setJobs] = useState(INITIAL_JOBS);

  const sendUpdate = (job, status) => {
    const text = `Hi ${job.client}, this is Jonathan from The London Watchmaker. Your ${job.watch} is now in the *${status}* phase. Track live here: thelondonwatchmaker.co.uk/track?id=${job.id}`;
    window.open(`https://wa.me/${job.phone}?text=${encodeURIComponent(text)}`);
  };

  return (
    <main className="pt-32 pb-20 bg-[#0C1E17] min-h-screen text-white">
      <div className="max-w-6xl mx-auto px-6">
        <header className="flex justify-between items-end mb-12">
          <div>
            <h1 className="text-4xl font-playfair">Workshop <span className="text-[#C9A050]">Control Room</span></h1>
            <p className="text-white/40 font-inter text-sm">Welcome back, Jonathan.</p>
          </div>
          <button className="btn-gold px-6 py-2 text-xs">+ New Job Card</button>
        </header>

        <div className="overflow-x-auto">
          <table className="w-full text-left font-inter border-collapse">
            <thead>
              <tr className="border-b border-white/10 text-[10px] uppercase tracking-[0.2em] text-[#C9A050]">
                <th className="pb-4 px-4">Ref</th>
                <th className="pb-4 px-4">Client</th>
                <th className="pb-4 px-4">Timepiece</th>
                <th className="pb-4 px-4">Status</th>
                <th className="pb-4 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {jobs.map((job) => (
                <tr key={job.id} className="border-b border-white/5 hover:bg-white/[0.02] transition-colors group">
                  <td className="py-6 px-4 font-mono text-sm">{job.id}</td>
                  <td className="py-6 px-4 font-bold">{job.client}</td>
                  <td className="py-6 px-4 text-white/60">{job.watch}</td>
                  <td className="py-6 px-4">
                    <span className="bg-[#C9A050]/10 text-[#C9A050] text-[10px] px-3 py-1 font-bold">
                      {job.status}
                    </span>
                  </td>
                  <td className="py-6 px-4 text-right">
                    <button 
                      onClick={() => sendUpdate(job, job.status)}
                      className="text-xs bg-[#25D366] text-white px-4 py-2 hover:opacity-80 transition-opacity"
                    >
                      Notify WhatsApp
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </main>
  );
}