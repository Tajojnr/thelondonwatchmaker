'use client';
import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

const TOTAL_FRAMES = 30;
const display = 'font-[family-name:var(--font-display)]';
const focusRing =
  'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#C9A050]';

const STATS = [
  { value: '150+', label: 'components inspected' },
  { value: 'On the spot', label: 'turnaround' },
  { value: 'Free', label: 'diagnostic with service' },
];

const WHATSAPP_URL =
  'https://wa.me/447892883885?text=Hello%20Jonathan%2C%20I%20would%20like%20to%20bring%20my%20watch%20to%20Hatton%20Garden%20for%20an%20on-the-spot%20diagnostic.';

export default function DiagnosticsVisualizer() {
  const containerRef = useRef(null);
  const zoomRef = useRef(null);
  const canvasRef = useRef(null);
  const progressRef = useRef(null);
  const framesRef = useRef([]);
  const [ready, setReady] = useState(false);

  // Load the frames (tries frame_001.webp, then frame_0001.webp)
  useEffect(() => {
    let cancelled = false;

    framesRef.current = Array.from({ length: TOTAL_FRAMES }, (_, i) => {
      const n = i + 1;
      const img = new window.Image();
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

  // Entrance: the copy settles in once, as the section nears the viewport
  useEffect(() => {
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const ctx = gsap.context(() => {
      const items = gsap.utils.toArray('[data-reveal]');
      if (reduceMotion) {
        gsap.set(items, { opacity: 1, y: 0 });
        return;
      }
      ScrollTrigger.create({
        trigger: containerRef.current,
        start: 'top 70%',
        once: true,
        onEnter: () =>
          gsap.fromTo(
            items,
            { y: 24 },
            { y: 0, opacity: 1, duration: 1.1, ease: 'power3.out', stagger: 0.12 }
          ),
      });
    }, containerRef);
    return () => ctx.revert();
  }, []);

  // Pinned frame scrub, slow settle zoom and progress line
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
      const dpr = window.devicePixelRatio || 1;
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

    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: containerRef.current,
        start: 'top top',
        end: '+=150%',
        pin: true,
        scrub: 0.6,
        onUpdate: (self) => {
          if (!reduceMotion) {
            currentFrame = Math.min(
              Math.round(self.progress * (TOTAL_FRAMES - 1)),
              TOTAL_FRAMES - 1
            );
            draw(currentFrame);
            // The image slowly settles as the inspection progresses
            gsap.set(zoomRef.current, { scale: 1.07 - 0.07 * self.progress });
          }
          gsap.set(progressRef.current, { scaleX: self.progress });
        },
      });
    }, containerRef);

    const handleResize = () => {
      sizeCanvas();
      draw(currentFrame);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      ctx.revert();
    };
  }, [ready]);

  return (
    <section
      ref={containerRef}
      aria-labelledby="inspection-heading"
      className="relative h-screen overflow-hidden bg-[#06100C] text-[#F7F4EE]"
    >
      <div ref={zoomRef} className="absolute inset-0 will-change-transform">
        <canvas ref={canvasRef} aria-hidden="true" className="h-full w-full" />
      </div>
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-[#06100C] via-[#06100C]/70 to-[#06100C]/10" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-[#06100C]/80 to-transparent" />

      <div className="relative z-10 mx-auto flex h-full w-full max-w-7xl items-center px-6 md:px-12">
        <div className="max-w-xl">
          <h2
            id="inspection-heading"
            data-reveal
            className={`${display} text-4xl font-medium leading-[1.05] tracking-tight text-balance opacity-0 md:text-6xl`}
          >
            Nothing is sent away, and nothing is hidden
          </h2>

          <p
            data-reveal
            className="mt-6 max-w-md text-base leading-relaxed text-[#F7F4EE]/75 opacity-0"
          >
            Jonathan opens your watch at the bench and examines every wheel, pinion, balance jewel
            and mainspring under the microscope while you watch. He then explains exactly what he
            finds, in person at 62 Hatton Garden.
          </p>

          <dl
            data-reveal
            className="mt-10 grid grid-cols-3 gap-6 border-t border-[#C9A050]/25 pt-6 opacity-0"
          >
            {STATS.map((s) => (
              <div key={s.value}>
                <dd className={`${display} text-xl font-medium text-[#C9A050] sm:text-2xl`}>
                  {s.value}
                </dd>
                <dt className="mt-1 text-sm text-[#F7F4EE]/65">{s.label}</dt>
              </div>
            ))}
          </dl>

          <div
            data-reveal
            className="mt-10 flex flex-col items-start gap-2 opacity-0 sm:flex-row sm:items-center sm:gap-8"
          >
            <Link
              href="/book"
              className={`group relative inline-flex min-h-12 items-center justify-center overflow-hidden bg-[#C9A050] px-7 text-sm font-medium text-[#06100C] transition-transform duration-300 before:absolute before:inset-0 before:origin-left before:scale-x-0 before:bg-[#F7F4EE] before:transition-transform before:duration-500 before:ease-[cubic-bezier(0.22,1,0.36,1)] hover:before:scale-x-100 active:scale-[0.98] motion-reduce:transition-none motion-reduce:before:transition-none ${focusRing}`}
            >
              <span className="relative">Book a bench inspection</span>
            </Link>

            <a
              href={WHATSAPP_URL}
              target="_blank"
              rel="noopener noreferrer"
              className={`group inline-flex min-h-12 items-center text-sm font-medium text-[#F7F4EE] ${focusRing}`}
            >
              <span className="relative border-b border-[#F7F4EE]/25 pb-1 after:absolute after:-bottom-px after:left-0 after:h-px after:w-full after:origin-left after:scale-x-0 after:bg-[#C9A050] after:transition-transform after:duration-500 after:ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:after:scale-x-100 motion-reduce:after:transition-none">
                Message us on WhatsApp
              </span>
            </a>
          </div>
        </div>
      </div>

      {/* Scroll progress, a single gold hairline */}
      <div aria-hidden="true" className="absolute inset-x-0 bottom-0 h-px bg-[#F7F4EE]/10">
        <div
          ref={progressRef}
          className="h-full origin-left bg-[#C9A050]"
          style={{ transform: 'scaleX(0)' }}
        />
      </div>
    </section>
  );
}