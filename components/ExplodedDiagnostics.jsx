// components/ExplodedDiagnostics.jsx
"use client";
import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
  ScrollTrigger.config({ ignoreMobileResize: true });
}

const TOTAL_FRAMES = 30;

const DIAGNOSTIC_STEPS = [
  {
    id: 1,
    title: "Demagnetisation and vacuum seal test",
    desc: "Every watch is tested for magnetic interference and dry-tested in our vacuum chamber before it is opened.",
    note: "Checked before the watch is opened",
  },
  {
    id: 2,
    title: "Live movement inspection",
    desc: "The watch is opened at the counter, in front of you. We inspect the balance wheel, hairspring and escapement through an HD microscope.",
    note: "Live microscope feed",
  },
  {
    id: 3,
    title: "Witschi five-position timing",
    desc: "Amplitude, beat error and daily rate (seconds a day) are graphed in real time on Swiss digital acoustic sensors.",
    note: "Target: within ±2 seconds a day",
  },
  {
    id: 4,
    title: "An honest verdict and quote",
    desc: "A clear technical verdict from Jonathan, explained in person, with no obligation to go ahead.",
    note: "About 15 minutes in total",
  },
];

const display = 'font-[family-name:var(--font-display)]';
const wrap = 'mx-auto w-full max-w-7xl px-6 md:px-12';
const ease = 'ease-[cubic-bezier(0.22,1,0.36,1)]';

export default function ExplodedDiagnostics() {
  const containerRef = useRef(null);
  const zoomRef = useRef(null);
  const canvasRef = useRef(null);
  const trackRef = useRef(null);
  const framesRef = useRef([]);
  const lastIndexRef = useRef(0);
  const lastWidthRef = useRef(0);
  const [ready, setReady] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);

  // Load the WebP frames
  useEffect(() => {
    let cancelled = false;

    framesRef.current = Array.from({ length: TOTAL_FRAMES }, (_, i) => {
      const n = i + 1;
      const img = new Image();
      img.decoding = 'async';
      img.onerror = () => {
        img.onerror = null;
        img.src = `/frames/exploded-diagnostics/frame_${String(n).padStart(4, '0')}.webp`;
      };
      if (i === 0) {
        img.onload = () => {
          if (!cancelled) setReady(true);
        };
      }
      img.src = `/frames/exploded-diagnostics/frame_${String(n).padStart(3, '0')}.webp`;
      return img;
    });

    return () => {
      cancelled = true;
    };
  }, []);

  // Entrance reveal
  useEffect(() => {
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const ctx = gsap.context(() => {
      const items = gsap.utils.toArray('[data-reveal]');
      if (reduceMotion) {
        gsap.set(items, { opacity: 1 });
        return;
      }
      ScrollTrigger.create({
        trigger: containerRef.current,
        start: 'top 70%',
        once: true,
        onEnter: () =>
          gsap.fromTo(
            items,
            { y: 24, opacity: 0 },
            { y: 0, opacity: 1, duration: 1, ease: 'power3.out', stagger: 0.15 }
          ),
      });
    }, containerRef);
    return () => ctx.revert();
  }, []);

  // Canvas drawing, mobile stabilization, and scrub sync
  useEffect(() => {
    if (!ready || !canvasRef.current || !containerRef.current) return;

    const canvas = canvasRef.current;
    const drawCtx = canvas.getContext('2d');
    if (!drawCtx) return;

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let currentFrame = 0;
    let cssW = 0;
    let cssH = 0;

    const sizeCanvas = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      cssW = canvas.clientWidth || window.innerWidth;
      cssH = canvas.clientHeight || window.innerHeight;
      canvas.width = cssW * dpr;
      canvas.height = cssH * dpr;
      drawCtx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const draw = (index) => {
      for (let k = index; k >= 0; k--) {
        const img = framesRef.current[k];
        if (img && img.complete && img.naturalWidth) {
          const ratio = Math.max(cssW / img.naturalWidth, cssH / img.naturalHeight);
          const w = img.naturalWidth * ratio;
          const h = img.naturalHeight * ratio;
          drawCtx.clearRect(0, 0, cssW, cssH);
          drawCtx.drawImage(img, (cssW - w) / 2, (cssH - h) / 2, w, h);
          return;
        }
      }
    };

    sizeCanvas();
    draw(0);

    const trigger = ScrollTrigger.create({
      trigger: containerRef.current,
      start: 'top top',
      end: 'bottom bottom',
      scrub: 0.35,
      onUpdate: (self) => {
        if (!reduceMotion) {
          currentFrame = Math.min(
            Math.floor(self.progress * (TOTAL_FRAMES - 1)),
            TOTAL_FRAMES - 1
          );
          draw(currentFrame);
          if (zoomRef.current) {
            gsap.set(zoomRef.current, { scale: 1.05 - 0.05 * self.progress });
          }
        }

        if (trackRef.current) {
          gsap.set(trackRef.current, { scaleY: self.progress });
        }

        const stepIndex = Math.min(
          Math.floor(self.progress * DIAGNOSTIC_STEPS.length),
          DIAGNOSTIC_STEPS.length - 1
        );
        if (stepIndex !== lastIndexRef.current) {
          lastIndexRef.current = stepIndex;
          setActiveIndex(stepIndex);
        }
      },
    });

    const handleResize = () => {
      const width = window.innerWidth;
      // Prevent mobile address bar scroll triggers from resetting the canvas buffer
      if (Math.abs(width - lastWidthRef.current) > 20 || lastWidthRef.current === 0) {
        lastWidthRef.current = width;
        sizeCanvas();
        draw(currentFrame);
      }
    };

    lastWidthRef.current = window.innerWidth;
    window.addEventListener('resize', handleResize);

    const refreshTimer = setTimeout(() => {
      ScrollTrigger.refresh();
      draw(currentFrame);
    }, 250);

    return () => {
      clearTimeout(refreshTimer);
      trigger.kill();
      window.removeEventListener('resize', handleResize);
    };
  }, [ready]);

  return (
    <section
      ref={containerRef}
      aria-labelledby="diagnostics-heading"
      className="relative h-[280vh] border-t border-[#C9A050]/20 bg-[#06100C] text-[#F7F4EE] select-none"
    >
      <div className="sticky top-0 flex h-screen w-full flex-col justify-between overflow-hidden">
        {/* Canvas background layer */}
        <div ref={zoomRef} className="absolute inset-0 will-change-transform pointer-events-none">
          <canvas
            ref={canvasRef}
            aria-hidden="true"
            className="h-full w-full object-cover opacity-90"
          />
        </div>

        {/* Gradient vignette for text legibility */}
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#06100C] via-[#06100C]/40 to-[#06100C]/80" />

        {/* Heading */}
        <div data-reveal className={`relative z-20 pt-12 md:pt-16 opacity-0 ${wrap}`}>
          <p className="text-xs uppercase tracking-[0.25em] text-[#C9A050] font-medium mb-3">
            On-The-Spot Inspection
          </p>
          <h2
            id="diagnostics-heading"
            className={`${display} max-w-2xl text-4xl font-medium leading-[1.05] tracking-tight text-balance md:text-6xl`}
          >
            Diagnosed on the spot, in front of you
          </h2>
        </div>

        {/* Active step panel */}
        <div data-reveal className={`relative z-20 pb-10 opacity-0 md:pb-14 ${wrap}`}>
          <div className="grid items-end gap-10 lg:grid-cols-12 lg:gap-16">
            {/* Left step details */}
            <div aria-live="polite" className="grid lg:col-span-7">
              {DIAGNOSTIC_STEPS.map((s, i) => {
                const isActive = i === activeIndex;
                const state = isActive
                  ? 'translate-y-0 opacity-100 delay-100'
                  : i < activeIndex
                    ? '-translate-y-4 opacity-0 pointer-events-none'
                    : 'translate-y-4 opacity-0 pointer-events-none';
                return (
                  <div
                    key={s.id}
                    aria-hidden={!isActive}
                    className={`col-start-1 row-start-1 transition-all duration-500 ${ease} motion-reduce:transition-none ${state}`}
                  >
                    <p className="text-xs tracking-widest uppercase font-semibold text-[#C9A050]">
                      Phase {s.id} of {DIAGNOSTIC_STEPS.length}
                    </p>
                    <h3 className={`${display} mt-2 text-2xl md:text-4xl font-medium leading-[1.1] text-[#F7F4EE]`}>
                      {s.title}
                    </h3>
                    <p className="mt-3 max-w-xl text-sm md:text-base leading-relaxed text-[#F7F4EE]/80">
                      {s.desc}
                    </p>
                    <p className="mt-4 inline-block border-t border-[#C9A050]/30 pt-3 text-xs md:text-sm text-[#C9A050]/90">
                      {s.note}
                    </p>
                  </div>
                );
              })}
            </div>

            {/* Desktop progress list */}
            <ol className="relative hidden border-l border-[#F7F4EE]/15 lg:col-span-5 lg:block">
              <span
                ref={trackRef}
                aria-hidden="true"
                className="absolute -left-px top-0 h-full w-px origin-top bg-[#C9A050] transition-transform duration-75"
                style={{ transform: 'scaleY(0)' }}
              />
              {DIAGNOSTIC_STEPS.map((s, i) => (
                <li
                  key={s.id}
                  aria-current={i === activeIndex ? 'step' : undefined}
                  className={`flex gap-5 py-3 pl-6 text-sm transition-all duration-300 ${ease} motion-reduce:transition-none ${
                    i === activeIndex
                      ? 'translate-x-1 font-medium text-[#F7F4EE]'
                      : 'translate-x-0 text-[#F7F4EE]/40'
                  }`}
                >
                  <span className="tabular-nums font-mono text-[#C9A050]">0{s.id}</span>
                  <span>{s.title}</span>
                </li>
              ))}
            </ol>

            {/* Mobile progress indicator */}
            <div aria-hidden="true" className="flex gap-2 lg:hidden">
              {DIAGNOSTIC_STEPS.map((s, i) => (
                <div
                  key={s.id}
                  className={`h-0.5 flex-1 transition-colors duration-300 ${
                    i <= activeIndex ? 'bg-[#C9A050]' : 'bg-[#F7F4EE]/20'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}