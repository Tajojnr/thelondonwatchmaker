// components/IndependentAdvantage.jsx
"use client";
import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const TOTAL_FRAMES = 30;

// Pacing. Raise SCROLL_HEIGHT_VH to slow the frames further; lower it to speed them up.
const SCROLL_HEIGHT_VH = 520; // total height of the section (30 frames play across ~420vh of scrolling)
const HOLD_START = 0.1; // share of the scroll where the first frame is held, so the section lands before it moves
const HOLD_END = 0.1; // share held on the last frame, so the final point can be read

const STAGES = [
  {
    label: "Official brand centres",
    title: "Months of waiting",
    desc: "Watches are often sent to a central regional workshop and join a queue before they reach a bench. Quoted turnaround can run to several months.",
    stat: "12 to 26 weeks",
    statLabel: "typical brand service turnaround",
  },
  {
    label: "The independent bench",
    title: "Direct access to Jonathan",
    desc: "Your watch is opened and assessed under the microscope at Unit 04, with no middlemen and no waiting list.",
    stat: "15 minutes to 14 days",
    statLabel: "turnaround, depending on the work",
  },
  {
    label: "Collector integrity",
    title: "Your original parts stay with your watch",
    desc: "Replacing a dial, hands or bezel can erase a watch's collector value. We work to preserve its original parts and its provenance.",
    stat: "Original",
    statLabel: "dial, hands and bezel preserved",
  },
  {
    label: "Master regulation",
    title: "Timed in five positions",
    desc: "Every overhaul includes four-stage ultrasonic cleaning, Moebius synthetic lubrication and five-position digital acoustic timing on a Witschi.",
    stat: "±2 seconds a day",
    statLabel: "target rate",
  },
];

const display = 'font-[family-name:var(--font-display)]';
const wrap = 'mx-auto w-full max-w-7xl px-6 md:px-12';
const ease = 'ease-[cubic-bezier(0.22,1,0.36,1)]';
const clamp01 = (n) => Math.min(Math.max(n, 0), 1);

export default function IndependentAdvantage() {
  const containerRef = useRef(null);
  const canvasRef = useRef(null);
  const segmentRefs = useRef([]);
  const framesRef = useRef([]);
  const lastIndexRef = useRef(0);
  const [ready, setReady] = useState(false);
  const [stageIndex, setStageIndex] = useState(0);

  // Load the frames (tries frame_001.webp, then frame_0001.webp)
  useEffect(() => {
    let cancelled = false;

    framesRef.current = Array.from({ length: TOTAL_FRAMES }, (_, i) => {
      const n = i + 1;
      const img = new window.Image();
      img.decoding = 'async';
      img.onerror = () => {
        img.onerror = null;
        img.src = `/frames/morph-complication/frame_${String(n).padStart(4, '0')}.webp`;
      };
      if (i === 0) {
        img.onload = () => {
          if (!cancelled) setReady(true);
        };
      }
      img.src = `/frames/morph-complication/frame_${String(n).padStart(3, '0')}.webp`;
      return img;
    });

    return () => {
      cancelled = true;
    };
  }, []);

  // Entrance: the content waits, then settles in as the section arrives
  useEffect(() => {
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
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
      const st = ScrollTrigger.create({
        trigger: containerRef.current,
        start: 'top 45%',
        onEnter: play,
      });
      if (st.progress > 0) play();
    }, containerRef);
    return () => ctx.revert();
  }, []);

  // Frame scrub: a held start, slow blended frames, a held finish
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

    // pos is fractional: the frame below is drawn, then the next frame is faded over it,
    // so the footage glides between frames instead of stepping.
    const draw = (pos) => {
      const base = Math.min(Math.floor(pos), TOTAL_FRAMES - 1);
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
        // Remove the held start and finish, leaving the travelling part as 0 to 1
        const travel = clamp01((self.progress - HOLD_START) / (1 - HOLD_START - HOLD_END));

        if (!reduceMotion) {
          currentPos = travel * (TOTAL_FRAMES - 1);
          draw(currentPos);
        }

        // Each hairline segment fills as its own chapter plays
        segmentRefs.current.forEach((el, i) => {
          if (el) gsap.set(el, { scaleX: clamp01(travel * STAGES.length - i) });
        });

        const idx = Math.min(Math.floor(travel * STAGES.length), STAGES.length - 1);
        if (idx !== lastIndexRef.current) {
          lastIndexRef.current = idx;
          setStageIndex(idx);
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

  return (
    <section
      ref={containerRef}
      aria-labelledby="advantage-heading"
      style={{ height: `${SCROLL_HEIGHT_VH}vh` }}
      className="relative border-t border-[#C9A050]/20 bg-[#06100C] text-[#F7F4EE]"
    >
      <div className="sticky top-0 flex h-screen w-full flex-col justify-between overflow-hidden">
        <canvas ref={canvasRef} aria-hidden="true" className="absolute inset-0 h-full w-full" />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#06100C] via-[#06100C]/20 to-[#06100C]/80" />

        {/* Heading */}
        <div data-reveal className={`relative z-20 pt-12 opacity-0 ${wrap}`}>
          <h2
            id="advantage-heading"
            className={`${display} max-w-2xl text-4xl font-medium leading-[1.05] tracking-tight text-balance md:text-6xl`}
          >
            Why wait months for your watch?
          </h2>
        </div>

        {/* Chapters cross-fade in one cell, moving in the direction of travel */}
        <div data-reveal className={`relative z-20 pb-10 opacity-0 md:pb-14 ${wrap}`}>
          <div aria-live="polite" className="grid">
            {STAGES.map((s, i) => {
              const isActive = i === stageIndex;
              const state = isActive
                ? 'translate-y-0 opacity-100 delay-150'
                : i < stageIndex
                  ? '-translate-y-3 opacity-0 pointer-events-none'
                  : 'translate-y-3 opacity-0 pointer-events-none';
              return (
                <div
                  key={s.label}
                  aria-hidden={!isActive}
                  className={`col-start-1 row-start-1 grid items-end gap-8 transition-all duration-700 lg:grid-cols-12 lg:gap-16 ${ease} motion-reduce:transition-none ${state}`}
                >
                  <div className="lg:col-span-8">
                    <p className="text-sm text-[#C9A050]">{s.label}</p>
                    <h3 className={`${display} mt-3 text-3xl font-medium leading-[1.1] md:text-5xl`}>
                      {s.title}
                    </h3>
                    <p className="mt-4 max-w-xl text-base leading-relaxed text-[#F7F4EE]/75">
                      {s.desc}
                    </p>
                  </div>
                  <div className="border-t border-[#C9A050]/30 pt-5 lg:col-span-4 lg:border-l lg:border-t-0 lg:pl-10 lg:pt-0">
                    <p className={`${display} text-4xl font-medium text-[#C9A050] md:text-5xl`}>
                      {s.stat}
                    </p>
                    <p className="mt-2 text-sm text-[#F7F4EE]/65">{s.statLabel}</p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Progress: one hairline segment per chapter, each filling as it plays */}
          <div aria-hidden="true" className="mt-8 flex gap-2">
            {STAGES.map((s, i) => (
              <div key={s.label} className="h-px flex-1 bg-[#F7F4EE]/15">
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