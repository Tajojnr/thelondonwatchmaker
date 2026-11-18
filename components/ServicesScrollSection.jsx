// components/ServicesScrollSection.jsx
'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

// Footage. Confirm this folder exists in /public/frames (the hero uses /frames/bench-hero).
const FRAME_DIR = '/frames/hero';
const TOTAL_FRAMES = 35;

// Pacing. Raise VH_PER_SERVICE to give each service more time on screen.
const VH_PER_SERVICE = 100;
const HOLD_START = 0.08; // the first service is held so the section lands before it moves
const HOLD_END = 0.08; // the last service is held so it can be read

const display = 'font-[family-name:var(--font-display)]';
const wrap = 'mx-auto w-full max-w-7xl px-6 md:px-12';
const ease = 'ease-[cubic-bezier(0.22,1,0.36,1)]';
const clamp01 = (n) => Math.min(Math.max(n, 0), 1);

export default function ServicesScrollSection({ services = [] }) {
  const containerRef = useRef(null);
  const canvasRef = useRef(null);
  const segmentRefs = useRef([]);
  const framesRef = useRef([]);
  const lastIndexRef = useRef(0);
  const [ready, setReady] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const serviceCount = services.length;

  // Load the frames (tries frame_001.webp, then frame_0001.webp)
  useEffect(() => {
    let cancelled = false;

    framesRef.current = Array.from({ length: TOTAL_FRAMES }, (_, i) => {
      const n = i + 1;
      const img = new window.Image();
      img.decoding = 'async';
      img.onerror = () => {
        img.onerror = null;
        img.src = `${FRAME_DIR}/frame_${String(n).padStart(4, '0')}.webp`;
      };
      if (i === 0) {
        img.onload = () => {
          if (!cancelled) setReady(true);
        };
      }
      img.src = `${FRAME_DIR}/frame_${String(n).padStart(3, '0')}.webp`;
      return img;
    });

    return () => {
      cancelled = true;
    };
  }, []);

  // Entrance: the heading and the first service wait, then settle in as the section arrives
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
    if (!ready || !canvasRef.current || !containerRef.current || serviceCount === 0) return;

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

    const draw = (pos) => {
      const base = Math.min(Math.floor(pos), TOTAL_FRAMES - 1);
      const blend = pos - base;
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
      if (blend > 0.02 && loaded(next)) {
        drawCtx.globalAlpha = blend;
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
        }

        segmentRefs.current.forEach((el, i) => {
          if (el) gsap.set(el, { scaleX: clamp01(travel * serviceCount - i) });
        });

        const index = Math.min(Math.floor(travel * serviceCount), serviceCount - 1);
        if (index !== lastIndexRef.current) {
          lastIndexRef.current = index;
          setActiveIndex(index);
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
  }, [ready, serviceCount]);

  return (
    <section
      ref={containerRef}
      id="services"
      aria-labelledby="services-heading"
      style={{ height: `${Math.max(serviceCount, 1) * VH_PER_SERVICE}vh` }}
      className="relative border-t border-[#C9A050]/20 bg-[#06100C] text-[#F7F4EE]"
    >
      <div className="sticky top-0 flex h-[100svh] w-full flex-col overflow-hidden">
        <div
          aria-hidden="true"
          className={`absolute inset-0 bg-cover bg-center transition-opacity duration-500 ${
            ready ? 'opacity-0' : 'opacity-100'
          }`}
          style={{ backgroundImage: `url('${FRAME_DIR}/frame_001.webp')` }}
        />
        <canvas
          ref={canvasRef}
          aria-hidden="true"
          className={`absolute inset-0 h-full w-full transition-opacity duration-500 ${
            ready ? 'opacity-70' : 'opacity-0'
          }`}
        />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#06100C]/75 via-[#06100C]/30 to-[#06100C]/70" />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-[#06100C]/70 via-[#06100C]/35 to-[#06100C]/10" />

        {/* Heading. The top padding clears the fixed navbar. */}
        <div data-reveal className={`relative z-20 w-full pt-24 opacity-0 sm:pt-28 ${wrap}`}>
          <div className="flex flex-col gap-2 border-b border-[#C9A050]/20 pb-3 lg:flex-row lg:items-end lg:justify-between lg:gap-8">
            <h2
              id="services-heading"
              className={`${display} text-3xl font-medium leading-[1.05] tracking-tight text-balance sm:text-4xl lg:text-6xl`}
            >
              Services and prices
            </h2>
            <p className="hidden max-w-lg text-sm leading-relaxed text-[#F7F4EE]/70 sm:block md:text-base">
              Every repair is backed by our workshop guarantee and regulated on Swiss digital
              timegraphers.
            </p>
          </div>
        </div>

        {serviceCount > 0 ? (
          <div
            data-reveal
            className={`relative z-20 flex flex-1 flex-col justify-center py-3 opacity-0 ${wrap}`}
          >
            {/* Services cross-fade in one cell, moving in the direction of travel */}
            <div aria-live="polite" className="grid">
              {services.map((srv, i) => {
                const isActive = i === activeIndex;
                const features = (srv.features || srv.highlights || []).slice(0, 3);
                const category = srv.badge || srv.category;
                const price = srv.priceDisplay || srv.price || 'On inspection';
                const state = isActive
                  ? 'translate-y-0 opacity-100 delay-150'
                  : i < activeIndex
                    ? '-translate-y-3 opacity-0 pointer-events-none'
                    : 'translate-y-3 opacity-0 pointer-events-none';

                return (
                  <article
                    key={srv.id}
                    aria-hidden={!isActive}
                    className={`col-start-1 row-start-1 transition-all duration-700 ${ease} motion-reduce:transition-none ${state}`}
                  >
                    <div className="grid gap-3 sm:grid-cols-12 sm:items-end sm:gap-x-6 lg:gap-x-14">
                      <div className="sm:col-span-8 sm:col-start-1 sm:row-start-1">
                        {category && <p className="mb-2 text-sm text-[#C9A050]">{category}</p>}
                        <h3
                          className={`${display} max-w-4xl text-3xl font-medium leading-[1.05] sm:text-4xl lg:text-6xl`}
                        >
                          {srv.title}
                        </h3>
                        <p className="mt-4 line-clamp-4 max-w-2xl text-sm leading-relaxed text-[#F7F4EE]/75 sm:line-clamp-none sm:text-base lg:text-lg">
                          {srv.description}
                        </p>
                      </div>

                      <div className="border-t border-[#C9A050]/25 pt-3 sm:col-span-4 sm:col-start-9 sm:row-start-1 sm:border-l sm:border-t-0 sm:pl-5 sm:pt-0 lg:pl-8">
                        <p className={`${display} text-2xl font-medium text-[#C9A050] md:text-3xl`}>
                          {price}
                        </p>
                        {srv.turnaround && (
                          <p className="mt-2 text-sm text-[#F7F4EE]/65">{srv.turnaround}</p>
                        )}
                        <Link
                          href={`/book?service=${srv.id}`}
                          tabIndex={isActive ? 0 : -1}
                          className="mt-3 inline-flex min-h-11 items-center text-sm font-medium text-[#C9A050] underline decoration-[#C9A050]/40 underline-offset-4 transition-colors hover:text-[#E4C37D] hover:decoration-[#E4C37D] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#C9A050] motion-reduce:transition-none"
                        >
                          Book this service
                        </Link>
                      </div>

                      {/* Features need room, so they appear from tablet width up */}
                      {features.length > 0 && (
                        <ul className="hidden max-w-2xl divide-y divide-[#C9A050]/15 border-y border-[#C9A050]/15 text-sm leading-relaxed text-[#F7F4EE]/70 sm:col-span-8 sm:col-start-1 sm:row-start-2 sm:grid sm:grid-cols-2 sm:gap-x-6">
                          {features.map((feature, featureIndex) => (
                            <li key={`${srv.id}-${featureIndex}`} className="py-1.5">
                              {feature}
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  </article>
                );
              })}
            </div>
          </div>
        ) : (
          <p className={`relative z-20 flex-1 py-12 text-[#F7F4EE]/70 ${wrap}`}>
            Please contact the workshop for service information.
          </p>
        )}

        {/* Progress: one hairline segment per service, each filling while it is on screen */}
        <div aria-hidden="true" className={`relative z-20 pb-5 ${wrap}`}>
          <div className="mb-2 flex items-center justify-between text-xs tabular-nums text-[#F7F4EE]/55">
            <span>Workshop services</span>
            <span>
              {String(Math.min(activeIndex + 1, Math.max(serviceCount, 1))).padStart(2, '0')} /{' '}
              {String(Math.max(serviceCount, 1)).padStart(2, '0')}
            </span>
          </div>
          <div className="flex gap-2">
            {Array.from({ length: Math.max(serviceCount, 1) }, (_, i) => (
              <div key={i} className="h-px flex-1 bg-[#F7F4EE]/15">
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