'use client';

import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';

const INTERACTIVE = 'a, button, [role="button"], select, label, summary';
const TEXT_FIELD = 'input, textarea';

// Emkvy gold · #C9A961
const GOLD = '201, 169, 97';

export default function CustomCursor() {
  const dotRef = useRef(null);
  const ringRef = useRef(null);
  const [enabled, setEnabled] = useState(false);

  // Real mice only · respect reduced motion
  useEffect(() => {
    const fine = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (fine && !reduce) setEnabled(true);
  }, []);

  useEffect(() => {
    if (!enabled) return;

    const dot = dotRef.current;
    const ring = ringRef.current;
    const root = document.documentElement;
    root.classList.add('has-custom-cursor');

    gsap.set([dot, ring], { xPercent: -50, yPercent: -50, opacity: 0 });

    const dotX = gsap.quickTo(dot, 'x', { duration: 0.08, ease: 'power3.out' });
    const dotY = gsap.quickTo(dot, 'y', { duration: 0.08, ease: 'power3.out' });
    const ringX = gsap.quickTo(ring, 'x', { duration: 0.6, ease: 'power3.out' });
    const ringY = gsap.quickTo(ring, 'y', { duration: 0.6, ease: 'power3.out' });

    let visible = false;
    const show = () => {
      if (visible) return;
      visible = true;
      gsap.to([dot, ring], { opacity: 1, duration: 0.3 });
    };
    const hide = () => {
      visible = false;
      gsap.to([dot, ring], { opacity: 0, duration: 0.3 });
    };

    const onMove = (e) => {
      show();
      dotX(e.clientX);
      dotY(e.clientY);
      ringX(e.clientX);
      ringY(e.clientY);
    };

    // Single delegated listener — works across pages, modals, and admin
    const onOver = (e) => {
      const t = e.target;
      if (!(t instanceof Element)) return;

      if (t.closest(TEXT_FIELD)) {
        // Native text cursor inside form fields
        gsap.to([dot, ring], { opacity: 0, duration: 0.2 });
        return;
      }
      if (visible) gsap.to([dot, ring], { opacity: 1, duration: 0.2 });

      if (t.closest(INTERACTIVE)) {
        gsap.to(dot, { scale: 0.5, duration: 0.3 });
        gsap.to(ring, {
          scale: 1.8,
          borderColor: `rgba(${GOLD}, 0.95)`,
          backgroundColor: `rgba(${GOLD}, 0.1)`,
          duration: 0.4,
          ease: 'power3.out',
        });
      } else {
        gsap.to(dot, { scale: 1, duration: 0.3 });
        gsap.to(ring, {
          scale: 1,
          borderColor: `rgba(${GOLD}, 0.4)`,
          backgroundColor: `rgba(${GOLD}, 0)`,
          duration: 0.4,
          ease: 'power3.out',
        });
      }
    };

    const onDown = () => gsap.to(ring, { scale: 0.8, duration: 0.15 });
    const onUp = () => gsap.to(ring, { scale: 1, duration: 0.3 });

    window.addEventListener('mousemove', onMove, { passive: true });
    document.addEventListener('mouseover', onOver, { passive: true });
    document.addEventListener('mousedown', onDown);
    document.addEventListener('mouseup', onUp);
    document.documentElement.addEventListener('mouseleave', hide);

    return () => {
      window.removeEventListener('mousemove', onMove);
      document.removeEventListener('mouseover', onOver);
      document.removeEventListener('mousedown', onDown);
      document.removeEventListener('mouseup', onUp);
      document.documentElement.removeEventListener('mouseleave', hide);
      root.classList.remove('has-custom-cursor');
    };
  }, [enabled]);

  if (!enabled) return null;

  return (
    <>
      <div
        ref={ringRef}
        aria-hidden="true"
        className="pointer-events-none fixed left-0 top-0 z-[109] h-9 w-9 rounded-full border border-[#C9A961]/40"
      />
      <div
        ref={dotRef}
        aria-hidden="true"
        className="pointer-events-none fixed left-0 top-0 z-[110] h-1.5 w-1.5 rounded-full bg-[#C9A961]"
      />
    </>
  );
}