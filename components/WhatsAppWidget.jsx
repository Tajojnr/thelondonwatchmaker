// components/WhatsAppWidget.jsx
'use client';
import { useEffect, useRef, useState } from 'react';

const NUMBER = '447892883885';
const PROMPTS = [
  { label: 'Book a bench visit', text: 'Hello Jonathan, I would like to book a bench visit at Hatton Garden.' },
  { label: 'Ask about a repair', text: 'Hello Jonathan, I have a question about a repair on my watch: ' },
  { label: 'Check a job status', text: 'Hello Jonathan, could you update me on job reference LWM-' },
];

const WA_PATH =
  'M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z';

export default function WhatsAppWidget() {
  const [visible, setVisible] = useState(false);
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const onScroll = () => {
      const show = window.scrollY > window.innerHeight * 0.6;
      setVisible(show);
      if (!show) setOpen(false);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    if (!open) return;
    const onKey = (e) => e.key === 'Escape' && setOpen(false);
    const onClick = (e) => ref.current && !ref.current.contains(e.target) && setOpen(false);
    window.addEventListener('keydown', onKey);
    document.addEventListener('mousedown', onClick);
    return () => {
      window.removeEventListener('keydown', onKey);
      document.removeEventListener('mousedown', onClick);
    };
  }, [open]);

  return (
    <div
      ref={ref}
      className={`fixed bottom-5 right-5 z-40 flex flex-col items-end gap-3 transition-all duration-500 md:bottom-8 md:right-8 ${
        visible ? 'translate-y-0 opacity-100' : 'pointer-events-none translate-y-4 opacity-0'
      }`}
    >
      {/* Panel */}
      <div
        role="dialog"
        aria-label="Message the workshop"
        className={`w-[290px] origin-bottom-right border border-[#C9A050]/20 bg-[#0C1E17]/95 shadow-2xl shadow-black/50 backdrop-blur-md transition-all duration-300 ${
          open ? 'scale-100 opacity-100' : 'pointer-events-none scale-95 opacity-0'
        }`}
      >
        <div className="border-b border-[#C9A050]/15 px-5 py-4">
          <p className="font-[family-name:var(--font-playfair)] text-lg text-[#F7F4EE]">Message the workshop</p>
          <p className="mt-1 text-[11px] leading-relaxed text-[#F7F4EE]/50">
            Jonathan replies during workshop hours, Mon–Fri 10:30–17:30.
          </p>
        </div>
        <ul>
          {PROMPTS.map((p) => (
            <li key={p.label}>
              <a
                href={`https://wa.me/${NUMBER}?text=${encodeURIComponent(p.text)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center justify-between border-b border-[#F7F4EE]/[0.06] px-5 py-3.5 text-[13px] text-[#F7F4EE]/80 transition-colors last:border-0 hover:bg-[#C9A050]/[0.06] hover:text-[#F7F4EE]"
              >
                {p.label}
                <span className="text-[#C9A050] transition-transform group-hover:translate-x-1">→</span>
              </a>
            </li>
          ))}
        </ul>
      </div>

      {/* Trigger */}
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-label={open ? 'Close WhatsApp panel' : 'Message on WhatsApp'}
        className="flex h-12 w-12 items-center justify-center rounded-full border border-[#C9A050]/40 bg-[#0C1E17]/90 text-[#F7F4EE] shadow-lg shadow-black/40 backdrop-blur-md transition-colors hover:border-[#25D366] hover:text-[#25D366]"
      >
        {open ? (
          <span className="text-lg leading-none">×</span>
        ) : (
          <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor" aria-hidden="true">
            <path d={WA_PATH} />
          </svg>
        )}
      </button>
    </div>
  );
}