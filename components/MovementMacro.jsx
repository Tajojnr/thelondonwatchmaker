// components/MovementMacro.jsx
"use client";
import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const TOTAL_FRAMES = 30;

// Pacing. Raise SCROLL_HEIGHT_VH to slow the frames further; lower it to speed them up.
const SCROLL_HEIGHT_VH = 480;
const HOLD_START = 0.1; // the first frame holds so the section lands before it moves
const HOLD_END = 0.1; // the last frame holds so the details can be read

// Each detail appears at this point (0 to 1) of the footage
const DETAILS = [
  { at: 0.15, label: "Cleaning", value: "Four-stage ultrasonic wash" },
  { at: 0.45, label: "Lubrication", value: "Six Moebius synthetic oils at 40x magnification" },
  { at: 0.75, label: "Regulation", value: "Five-position timing on a Witschi" },
];

const display = 'font-[family-name:var(--font-display)]';
const wrap = 'mx-auto w-full max-w-7xl px-6 md:px-12';
const ease = 'ease-[cubic-bezier(0.22,1,0.36,1)]';
const clamp01 = (n) => Math.min(Math.max(n, 0), 1);

export default function MovementMacro() {
  const containerRef = useRef(null);
  const zoomRef = useRef(null);
  const canvasRef = useRef(null);
  const progressRef = useRef(null);
  const framesRef = useRef([]);
  const lastCountRef = useRef(0);
  const [ready, setReady] = useState(false);
  const [revealed, setRevealed] = useState(0);

  // Load the frames (tries frame_001.webp, then frame_0001.webp)
  useEffect(() => {
    let cancelled = false;

    framesRef.current = Array.from({ length: TOTAL_FRAMES }, (_, i) => {
      const n = i + 1;
      const img = new window.Image();
      img.decoding = 'async';
      img.onerror = () => {
        img.onerror = null;
        img.src = `/frames/movement-macro/frame_${String(n).padStart(4, '0')}.webp`;
      };
      if (i === 0) {
        img.onload = () => {
          if (!cancelled) setReady(true);
        };
      }
      img.src = `/frames/movement-macro/frame_${String(n).padStart(3, '0')}.webp`;
      return img;
    });

    return () => {
      cancelled = true;
    };
  }, []);

  // Entrance: the heading and paragraph wait, then settle in as the section arrives
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

    // pos is fractional: the frame below is drawn, then the next frame is faded over it
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
        const travel = clamp01((self.progress - HOLD_START) / (1 - HOLD_START - HOLD_END));

        if (!reduceMotion) {
          currentPos = travel * (TOTAL_FRAMES - 1);
          draw(currentPos);
          // A very slow push-in, like a macro lens easing closer
          gsap.set(zoomRef.current, { scale: 1 + 0.05 * travel });
        }

        if (progressRef.current) gsap.set(progressRef.current, { scaleX: travel });

        const count = DETAILS.filter((d) => travel >= d.at).length;
        if (count !== lastCountRef.current) {
          lastCountRef.current = count;
          setRevealed(count);
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
      aria-labelledby="macro-heading"
      style={{ height: `${SCROLL_HEIGHT_VH}vh` }}
      className="relative border-t border-[#C9A050]/20 bg-[#06100C] text-[#F7F4EE]"
    >
      <div className="sticky top-0 flex h-screen w-full items-center overflow-hidden">
        <div ref={zoomRef} className="absolute inset-0 will-change-transform">
          <canvas ref={canvasRef} aria-hidden="true" className="h-full w-full" />
        </div>
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-[#06100C] via-[#06100C]/60 to-[#06100C]/10" />

        <div className={`relative z-20 ${wrap}`}>
          <div className="max-w-xl">
            <h2
              id="macro-heading"
              data-reveal
              className={`${display} text-4xl font-medium leading-[1.05] tracking-tight text-balance opacity-0 md:text-6xl`}
            >
              Every friction point, lubricated and timed
            </h2>

            <p
              data-reveal
              className="mt-6 max-w-md text-base leading-relaxed text-[#F7F4EE]/75 opacity-0"
            >
              A movement has more than 150 friction points. Each one is lubricated with the right
              Moebius oil under magnification, supporting healthy amplitude and a gear train that
              lasts.
            </p>

            {/* Details arrive one by one as the footage plays */}
            <dl className="mt-10 max-w-md divide-y divide-[#C9A050]/15 border-y border-[#C9A050]/15">
              {DETAILS.map((d, i) => (
                <div
                  key={d.label}
                  className={`flex justify-between gap-6 py-4 transition-all duration-700 ${ease} motion-reduce:transition-none ${
                    i < revealed ? 'translate-y-0 opacity-100' : 'translate-y-3 opacity-0'
                  }`}
                >
                  <dt className="text-base text-[#F7F4EE]/60">{d.label}</dt>
                  <dd className="text-right text-base">{d.value}</dd>
                </div>
              ))}
            </dl>
          </div>
        </div>

        {/* Progress, a single gold hairline */}
        <div aria-hidden="true" className="absolute inset-x-0 bottom-0 h-px bg-[#F7F4EE]/10">
          <div
            ref={progressRef}
            className="h-full origin-left bg-[#C9A050]"
            style={{ transform: 'scaleX(0)' }}
          />
        </div>
      </div>
    </section>
  );
}