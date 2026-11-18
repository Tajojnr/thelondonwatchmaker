// components/Hero.jsx
'use client';
import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

const TOTAL_FRAMES = 36;
const FRAME_DIR = '/frames/bench-hero';

// Pacing. Raise SCROLL_DISTANCE to slow the footage; lower it to speed it up.
const SCROLL_DISTANCE = '+=320%';
const HOLD_START = 0.04; // the opening frame holds briefly after the copy starts to lift
const HOLD_END = 0.08; // the final frame holds before the next section arrives
const COPY_FADE_END = 0.26; // by this point the copy has left and the footage has the stage

const HEADLINE = ['Master watchmaking,', 'at the bench', 'before your eyes.'];

const WHATSAPP_URL =
  'https://wa.me/447892883885?text=Hello%20Jonathan%2C%20I%20would%20like%20to%20bring%20my%20watch%20to%20Hatton%20Garden.';

const display = 'font-[family-name:var(--font-display)]';
const focusRing =
  'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#C9A050]';
const clamp01 = (n) => Math.min(Math.max(n, 0), 1);

export default function Hero() {
  const containerRef = useRef(null);
  const wrapRef = useRef(null);
  const canvasRef = useRef(null);
  const overlayRef = useRef(null);
  const contentRef = useRef(null);
  const cueLabelRef = useRef(null);
  const cueFillRef = useRef(null);
  const framesRef = useRef([]);
  const [ready, setReady] = useState(false);

  // Load frame 1 first so the hero can appear at once, then the rest in the background
  useEffect(() => {
    let cancelled = false;
    const frames = new Array(TOTAL_FRAMES);
    framesRef.current = frames;

    const make = (n) => {
      const img = new window.Image();
      img.decoding = 'async';
      img.onerror = () => {
        img.onerror = null;
        img.src = `${FRAME_DIR}/frame_${String(n).padStart(4, '0')}.webp`;
      };
      img.src = `${FRAME_DIR}/frame_${String(n).padStart(3, '0')}.webp`;
      return img;
    };

    const first = make(1);
    frames[0] = first;
    first.onload = () => {
      if (cancelled) return;
      for (let n = 2; n <= TOTAL_FRAMES; n++) frames[n - 1] = make(n);
      setReady(true);
    };

    return () => {
      cancelled = true;
    };
  }, []);

  // Entrance: the footage settles, the headline rises line by line from a mask, the rest follows
  useEffect(() => {
    if (!ready) return;
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const ctx = gsap.context(() => {
      const lines = gsap.utils.toArray('[data-line]');
      const rest = gsap.utils.toArray('[data-rise]');

      if (reduceMotion) {
        gsap.set(wrapRef.current, { opacity: 1 });
        // y: 0 clears the pixel offset GSAP parses from the inline translateY(110%)
        gsap.set(lines, { yPercent: 0, y: 0 });
        gsap.set(rest, { opacity: 1, y: 0 });
        return;
      }

      const tl = gsap.timeline();
      tl.to(wrapRef.current, { opacity: 1, duration: 1.6, ease: 'power2.out' }, 0)
        .fromTo(wrapRef.current, { scale: 1.08 }, { scale: 1, duration: 2.6, ease: 'power2.out' }, 0)
        .fromTo(
          lines,
          { yPercent: 110, y: 0 },
          { yPercent: 0, y: 0, duration: 1.3, ease: 'power4.out', stagger: 0.12 },
          0.35
        )
        .fromTo(
          rest,
          { y: 20 },
          { y: 0, opacity: 1, duration: 1, ease: 'power3.out', stagger: 0.12 },
          0.95
        );
    }, containerRef);

    return () => ctx.revert();
  }, [ready]);

  // Pinned scroll: copy lifts away, footage plays slowly with blended frames, then holds
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

    // pos is fractional: the frame below is drawn, then the next frame is faded over it.
    // Frames that have not arrived yet fall back to the nearest earlier one.
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

    const handleResize = () => {
      sizeCanvas();
      draw(currentPos);
    };
    window.addEventListener('resize', handleResize);

    // Reduced motion: a still hero, no pinning
    if (reduceMotion) {
      return () => window.removeEventListener('resize', handleResize);
    }

    const trigger = ScrollTrigger.create({
      trigger: containerRef.current,
      start: 'top top',
      end: SCROLL_DISTANCE,
      pin: true,
      scrub: 1,
      onUpdate: (self) => {
        const p = self.progress;
        const travel = clamp01((p - HOLD_START) / (1 - HOLD_START - HOLD_END));

        currentPos = travel * (TOTAL_FRAMES - 1);
        draw(currentPos);

        // A very slow push-in across the whole sequence
        gsap.set(canvas, { scale: 1 + 0.05 * travel });

        // The copy lifts away and the left shade lightens, so the footage gets the stage
        const fade = clamp01(p / COPY_FADE_END);
        if (contentRef.current) {
          gsap.set(contentRef.current, { autoAlpha: 1 - fade, y: -48 * fade });
          contentRef.current.style.pointerEvents = fade > 0.85 ? 'none' : '';
        }
        if (overlayRef.current) gsap.set(overlayRef.current, { opacity: 1 - 0.75 * fade });

        // The scroll cue becomes a progress line
        if (cueLabelRef.current) gsap.set(cueLabelRef.current, { opacity: 1 - clamp01(p / 0.04) });
        if (cueFillRef.current) gsap.set(cueFillRef.current, { scaleY: travel });
      },
    });

    return () => {
      window.removeEventListener('resize', handleResize);
      trigger.kill();
    };
  }, [ready]);

  return (
    <section
      ref={containerRef}
      aria-labelledby="hero-heading"
      className="relative h-[100svh] min-h-[640px] overflow-hidden bg-[#06100C] text-[#F7F4EE]"
    >
      {/* Footage. It fades in once the first frame is ready. */}
      <div ref={wrapRef} className="absolute inset-0 opacity-0 will-change-transform">
        <canvas ref={canvasRef} aria-hidden="true" className="h-full w-full will-change-transform" />
      </div>

      {/* Shading for legibility and a soft handover to the next section */}
      <div
        ref={overlayRef}
        className="pointer-events-none absolute inset-0 bg-gradient-to-r from-[#06100C] via-[#06100C]/75 to-[#06100C]/20"
      />
      <div className="pointer-events-none absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-[#06100C]/90 to-transparent" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-48 bg-gradient-to-t from-[#06100C] to-transparent" />

      {/* Copy */}
      <div
        ref={contentRef}
        className="relative z-10 mx-auto flex h-full max-w-7xl flex-col justify-end px-6 pb-16 pt-28 md:px-8 md:pb-20 lg:justify-center lg:px-12 lg:pb-0 lg:pt-32"
      >
        <div className="max-w-2xl">
          <h1
            id="hero-heading"
            className={`${display} text-[clamp(2.75rem,6vw,5.5rem)] font-medium leading-[1.02] tracking-tight`}
          >
            {HEADLINE.map((line) => (
              <span key={line} className="-mb-[0.12em] block overflow-hidden pb-[0.12em]">
                <span data-line className="block" style={{ transform: 'translateY(110%)' }}>
                  {line}
                </span>
              </span>
            ))}
          </h1>

          <p
            data-rise
            className="mt-8 max-w-md text-base leading-relaxed text-[#F7F4EE]/75 opacity-0 md:text-lg"
          >
            Independent watchmaker Jonathan Santos diagnoses your timepiece while you wait at 62
            Hatton Garden, completing many adjustments on the spot.
          </p>

          <div
            data-rise
            className="mt-10 flex flex-col items-start gap-2 opacity-0 sm:flex-row sm:items-center sm:gap-8"
          >
            <Link
              href="/book"
              className={`group relative inline-flex min-h-12 items-center justify-center overflow-hidden bg-[#C9A050] px-7 text-sm font-medium text-[#06100C] transition-transform duration-300 before:absolute before:inset-0 before:origin-left before:scale-x-0 before:bg-[#F7F4EE] before:transition-transform before:duration-500 hover:before:scale-x-100 active:scale-[0.98] motion-reduce:transition-none motion-reduce:before:transition-none before:ease-[cubic-bezier(0.22,1,0.36,1)] ${focusRing}`}
            >
              <span className="relative">Book a bench visit</span>
            </Link>

            <a
              href={WHATSAPP_URL}
              target="_blank"
              rel="noopener noreferrer"
              className={`group inline-flex min-h-12 items-center text-sm font-medium text-[#F7F4EE] ${focusRing}`}
            >
              <span className={`relative border-b border-[#F7F4EE]/25 pb-1 after:absolute after:-bottom-px after:left-0 after:h-px after:w-full after:origin-left after:scale-x-0 after:bg-[#C9A050] after:transition-transform after:duration-500 group-hover:after:scale-x-100 motion-reduce:after:transition-none after:ease-[cubic-bezier(0.22,1,0.36,1)]`}>
                WhatsApp +44 7892 883885
              </span>
            </a>
          </div>

          <div data-rise className="mt-4 opacity-0">
            <Link
              href="/reviews"
              className={`group inline-flex min-h-11 items-center text-sm text-[#F7F4EE]/65 transition-colors duration-300 hover:text-[#F7F4EE] motion-reduce:transition-none ${focusRing}`}
            >
              <span className={`relative after:absolute after:-bottom-1 after:left-0 after:h-px after:w-full after:origin-left after:scale-x-0 after:bg-[#C9A050] after:transition-transform after:duration-500 group-hover:after:scale-x-100 motion-reduce:after:transition-none after:ease-[cubic-bezier(0.22,1,0.36,1)]`}>
                Rated 5.0 from 103 Google reviews
              </span>
            </Link>
          </div>
        </div>
      </div>

      {/* Scroll cue: a label that fades on first scroll, and a line that fills as the footage plays */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute bottom-8 right-6 z-10 hidden flex-col items-center gap-3 md:flex lg:right-12"
      >
        <span
          ref={cueLabelRef}
          className="text-xs tracking-[0.2em] text-[#F7F4EE]/50 [writing-mode:vertical-rl]"
        >
          Scroll
        </span>
        <span className="relative h-16 w-px bg-[#F7F4EE]/15">
          <span
            ref={cueFillRef}
            className="absolute inset-0 origin-top bg-[#C9A050]"
            style={{ transform: 'scaleY(0)' }}
          />
        </span>
      </div>
    </section>
  );
}