// components/BrandsScrollGallery.jsx
"use client";
import { useEffect, useRef, useState } from 'react';
import NextImage from 'next/image';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const TOTAL_BACKDROP_FRAMES = 35;

// Pacing. Raise SCROLL_HEIGHT_VH to give each watch more time on screen.
const SCROLL_HEIGHT_VH = 640; // about 55vh of scrolling per watch
const HOLD_START = 0.06; // the first watch is held so the section lands before it moves
const HOLD_END = 0.06; // the last watch is held so it can be read

const WATCH_ITEMS = [
  { id: 1, name: "Rolex Submariner Date", ref: "126610LN", calibre: "Calibre 3235", service: "Full overhaul and pressure seal", image: "/watches/watch-1.png" },
  { id: 2, name: "Patek Philippe Nautilus", ref: "5711/1A", calibre: "Calibre 324 S C", service: "Micro-laser welding and polish", image: "/watches/watch-2.png" },
  { id: 3, name: "Audemars Piguet Royal Oak", ref: "15500ST", calibre: "Calibre 4302", service: "Bezel geometric lapping", image: "/watches/watch-3.png" },
  { id: 4, name: "Cartier Santos de Cartier", ref: "WSSA0029", calibre: "Calibre 1847 MC", service: "Regulation and demagnetisation", image: "/watches/watch-4.png" },
  { id: 5, name: "Omega Speedmaster Moonwatch", ref: "310.30.42", calibre: "Calibre 3861 Co-Axial", service: "Chronograph lever alignment", image: "/watches/watch-5.png" },
  { id: 6, name: "Rolex Cosmograph Daytona", ref: "116500LN", calibre: "Calibre 4130", service: "Vertical clutch service", image: "/watches/watch-6.png" },
  { id: 7, name: "Vacheron Constantin Overseas", ref: "4500V", calibre: "Calibre 5100", service: "Complete calibre wash", image: "/watches/watch-7.png" },
  { id: 8, name: "IWC Big Pilot 43", ref: "IW329301", calibre: "Calibre 82100", service: "Pellaton winding service", image: "/watches/watch-8.png" },
];

const display = 'font-[family-name:var(--font-display)]';
const wrap = 'mx-auto w-full max-w-7xl px-6 md:px-12';
const ease = 'ease-[cubic-bezier(0.22,1,0.36,1)]';
const clamp01 = (n) => Math.min(Math.max(n, 0), 1);

export default function BrandsScrollGallery() {
  const containerRef = useRef(null);
  const canvasRef = useRef(null);
  const floatRef = useRef(null);
  const segmentRefs = useRef([]);
  const framesRef = useRef([]);
  const lastIndexRef = useRef(0);
  const [ready, setReady] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);

  // Load the backdrop frames (tries frame_001.webp, then frame_0001.webp)
  useEffect(() => {
    let cancelled = false;

    framesRef.current = Array.from({ length: TOTAL_BACKDROP_FRAMES }, (_, i) => {
      const n = i + 1;
      const img = new window.Image();
      img.decoding = 'async';
      img.onerror = () => {
        img.onerror = null;
        img.src = `/frames/auction/frame_${String(n).padStart(4, '0')}.webp`;
      };
      if (i === 0) {
        img.onload = () => {
          if (!cancelled) setReady(true);
        };
      }
      img.src = `/frames/auction/frame_${String(n).padStart(3, '0')}.webp`;
      return img;
    });

    return () => {
      cancelled = true;
    };
  }, []);

  // Entrance, plus a slight pointer parallax on the watch (fine pointers only)
  useEffect(() => {
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
    const section = containerRef.current;

    const ctx = gsap.context(() => {
      const items = gsap.utils.toArray('[data-reveal]');
      if (reduceMotion) {
        gsap.set(items, { opacity: 1 });
        return;
      }
      let played = false;
      const play = () => {
        if (played) return;
        played = true;
        gsap.fromTo(
          items,
          { y: 24 },
          { y: 0, opacity: 1, duration: 1.2, ease: 'power3.out', stagger: 0.2 }
        );
      };
      const st = ScrollTrigger.create({ trigger: section, start: 'top 45%', onEnter: play });
      if (st.progress > 0) play();
    }, containerRef);

    let cleanupPointer = () => {};
    if (!reduceMotion && finePointer && floatRef.current && section) {
      const moveX = gsap.quickTo(floatRef.current, 'x', { duration: 0.9, ease: 'power3.out' });
      const moveY = gsap.quickTo(floatRef.current, 'y', { duration: 0.9, ease: 'power3.out' });
      const onMove = (e) => {
        const r = section.getBoundingClientRect();
        moveX(((e.clientX - r.left) / r.width - 0.5) * 18);
        moveY(((e.clientY - r.top) / r.height - 0.5) * 18);
      };
      const onLeave = () => {
        moveX(0);
        moveY(0);
      };
      section.addEventListener('pointermove', onMove);
      section.addEventListener('pointerleave', onLeave);
      cleanupPointer = () => {
        section.removeEventListener('pointermove', onMove);
        section.removeEventListener('pointerleave', onLeave);
      };
    }

    return () => {
      ctx.revert();
      cleanupPointer();
    };
  }, []);

  // Backdrop scrub: a held start, slow blended frames, a held finish
  useEffect(() => {
    if (!ready || !canvasRef.current || !containerRef.current) return;

    const canvas = canvasRef.current;
    const drawCtx = canvas.getContext('2d');
    if (!drawCtx) return;

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let currentPos = 0;
    let cssW = 0;
    let cssH = 0;

    const sizeCanvas = () => {
      const dpr = window.devicePixelRatio || 1;
      cssW = canvas.clientWidth || window.innerWidth;
      cssH = canvas.clientHeight || window.innerHeight;
      canvas.width = cssW * dpr;
      canvas.height = cssH * dpr;
      drawCtx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const loaded = (img) => img && img.complete && img.naturalWidth > 0;

    const paint = (img) => {
      const ratio = Math.max(cssW / img.naturalWidth, cssH / img.naturalHeight);
      const w = img.naturalWidth * ratio;
      const h = img.naturalHeight * ratio;
      drawCtx.drawImage(img, (cssW - w) / 2, (cssH - h) / 2, w, h);
    };

    // pos is fractional: the frame below is drawn, then the next frame is faded over it
    const draw = (pos) => {
      const base = Math.min(Math.floor(pos), TOTAL_BACKDROP_FRAMES - 1);
      const t = pos - base;

      let first = null;
      for (let k = base; k >= 0; k--) {
        if (loaded(framesRef.current[k])) {
          first = framesRef.current[k];
          break;
        }
      }
      if (!first) return;

      drawCtx.globalAlpha = 1;
      drawCtx.clearRect(0, 0, cssW, cssH);
      paint(first);

      const next = framesRef.current[base + 1];
      if (t > 0.02 && loaded(next)) {
        drawCtx.globalAlpha = t;
        paint(next);
        drawCtx.globalAlpha = 1;
      }
    };

    sizeCanvas();
    draw(0);

    const trigger = ScrollTrigger.create({
      trigger: containerRef.current,
      start: 'top top',
      end: 'bottom bottom',
      scrub: 1,
      onUpdate: (self) => {
        const travel = clamp01((self.progress - HOLD_START) / (1 - HOLD_START - HOLD_END));

        if (!reduceMotion) {
          currentPos = travel * (TOTAL_BACKDROP_FRAMES - 1);
          draw(currentPos);
        }

        // Each hairline segment fills while its own watch is on screen
        segmentRefs.current.forEach((el, i) => {
          if (el) gsap.set(el, { scaleX: clamp01(travel * WATCH_ITEMS.length - i) });
        });

        const idx = Math.min(Math.floor(travel * WATCH_ITEMS.length), WATCH_ITEMS.length - 1);
        if (idx !== lastIndexRef.current) {
          lastIndexRef.current = idx;
          setActiveIndex(idx);
        }
      },
    });

    const handleResize = () => {
      sizeCanvas();
      draw(currentPos);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      trigger.kill();
      window.removeEventListener('resize', handleResize);
    };
  }, [ready]);

  const directional = (i) =>
    i === activeIndex
      ? 'translate-y-0 opacity-100 delay-150'
      : i < activeIndex
        ? '-translate-y-3 opacity-0 pointer-events-none'
        : 'translate-y-3 opacity-0 pointer-events-none';

  return (
    <section
      ref={containerRef}
      aria-labelledby="calibres-heading"
      style={{ height: `${SCROLL_HEIGHT_VH}vh` }}
      className="relative border-t border-[#C9A050]/20 bg-[#06100C] text-[#F7F4EE]"
    >
      <div className="sticky top-0 flex h-screen w-full flex-col overflow-hidden">
        {/* Backdrop, dimmed so the text always wins */}
        <canvas ref={canvasRef} aria-hidden="true" className="absolute inset-0 h-full w-full opacity-50" />
        <div className="pointer-events-none absolute inset-0 bg-[#06100C]/70 md:bg-gradient-to-r md:from-[#06100C] md:via-[#06100C]/75 md:to-[#06100C]/30" />

        {/* Header */}
        <div data-reveal className={`relative z-20 pt-10 opacity-0 ${wrap}`}>
          <div className="flex items-end justify-between gap-6 border-b border-[#C9A050]/20 pb-4">
            <h2 id="calibres-heading" className={`${display} text-2xl font-medium sm:text-4xl`}>
              Calibres serviced at the bench
            </h2>
            <p className="text-sm tabular-nums text-[#F7F4EE]/65">
              {activeIndex + 1} of {WATCH_ITEMS.length}
            </p>
          </div>
        </div>

        {/* Stage: details and watches both move in the direction of travel */}
        <div
          data-reveal
          className={`relative z-20 grid flex-1 items-center gap-6 opacity-0 md:grid-cols-2 md:gap-16 ${wrap}`}
        >
          <div aria-live="polite" className="grid">
            {WATCH_ITEMS.map((w, i) => (
              <div
                key={w.id}
                aria-hidden={i !== activeIndex}
                className={`col-start-1 row-start-1 transition-all duration-700 ${ease} motion-reduce:transition-none ${directional(i)}`}
              >
                <h3 className={`${display} text-4xl font-medium leading-[1.05] md:text-6xl`}>
                  {w.name}
                </h3>
                <dl className="mt-6 max-w-md divide-y divide-[#C9A050]/15 border-y border-[#C9A050]/15 md:mt-8">
                  {[
                    ['Service', w.service],
                    ['Reference', w.ref],
                    ['Calibre', w.calibre],
                  ].map(([label, value]) => (
                    <div key={label} className="flex justify-between gap-6 py-3 text-base md:py-4">
                      <dt className="text-[#F7F4EE]/60">{label}</dt>
                      <dd className={`text-right ${label === 'Calibre' ? 'text-[#C9A050]' : ''}`}>
                        {value}
                      </dd>
                    </div>
                  ))}
                </dl>
              </div>
            ))}
          </div>

          <div className="relative order-first mx-auto h-56 w-56 sm:h-72 sm:w-72 md:order-none md:h-[26rem] md:w-[26rem]">
            <div className="absolute inset-0 rounded-full bg-[radial-gradient(circle,rgba(201,160,80,0.2),transparent_65%)]" />
            {/* The watch drifts a few pixels toward the pointer, like a jewel in a display case */}
            <div ref={floatRef} className="absolute inset-0 will-change-transform">
              {WATCH_ITEMS.map((watch, i) => (
                <NextImage
                  key={watch.id}
                  src={watch.image}
                  alt={watch.name}
                  aria-hidden={i !== activeIndex}
                  fill
                  sizes="(min-width: 768px) 416px, 288px"
                  className={`object-contain drop-shadow-[0_24px_40px_rgba(0,0,0,0.6)] transition-all duration-700 ${ease} motion-reduce:transition-none ${
                    i === activeIndex ? 'scale-100 opacity-100' : 'scale-95 opacity-0'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Progress: one hairline segment per watch, each filling while it is on screen */}
        <div aria-hidden="true" className={`relative z-20 pb-8 ${wrap}`}>
          <div className="flex gap-2">
            {WATCH_ITEMS.map((watch, i) => (
              <div key={watch.id} className="h-px flex-1 bg-[#F7F4EE]/15">
                <div
                  ref={(el) => (segmentRefs.current[i] = el)}
                  className="h-full origin-left bg-[#C9A050]"
                  style={{ transform: 'scaleX(0)' }}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}