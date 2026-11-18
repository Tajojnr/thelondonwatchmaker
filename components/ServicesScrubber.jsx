// components/ServicesScrubber.jsx
"use client";
import React, { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
  ScrollTrigger.config({ ignoreMobileResize: true });
}

const FRAME_COUNT = 35;

export default function ServicesScrubber() {
  const containerRef = useRef(null);
  const canvasRef = useRef(null);
  const imagesRef = useRef([]);
  const lastWidthRef = useRef(0);
  const [loaded, setLoaded] = useState(false);

  // Preload all 35 frames from public/frames/hero/
  useEffect(() => {
    let cancelled = false;
    const images = [];

    for (let i = 0; i < FRAME_COUNT; i++) {
      const num = i + 1;
      const img = new Image();
      img.decoding = "async";

      // Fallback path check if 3-digit vs 4-digit
      img.onerror = () => {
        img.onerror = null;
        img.src = `/frames/hero/frame_${String(num).padStart(4, "0")}.webp`;
      };

      if (i === 0) {
        img.onload = () => {
          if (!cancelled) setLoaded(true);
        };
      }

      img.src = `/frames/hero/frame_${String(num).padStart(3, "0")}.webp`;
      images.push(img);
    }

    imagesRef.current = images;

    return () => {
      cancelled = true;
    };
  }, []);

  // Setup Canvas Sizing & GSAP ScrollTrigger
  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let currentFrame = 0;

    const sizeCanvas = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const w = window.innerWidth;
      const h = window.innerHeight;

      canvas.width = w * dpr;
      canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const draw = (index) => {
      const w = window.innerWidth;
      const h = window.innerHeight;

      // Draw the closest loaded frame to prevent black flash
      for (let k = index; k >= 0; k--) {
        const img = imagesRef.current[k];
        if (img && img.complete && img.naturalWidth > 0) {
          ctx.clearRect(0, 0, w, h);
          const scale = Math.max(w / img.naturalWidth, h / img.naturalHeight);
          const x = (w - img.naturalWidth * scale) / 2;
          const y = (h - img.naturalHeight * scale) / 2;
          ctx.drawImage(img, x, y, img.naturalWidth * scale, img.naturalHeight * scale);
          return;
        }
      }
    };

    sizeCanvas();
    draw(0);

    const st = ScrollTrigger.create({
      trigger: container.parentElement || container,
      start: "top bottom",
      end: "bottom top",
      scrub: 0.35,
      onUpdate: (self) => {
        currentFrame = Math.min(
          Math.floor(self.progress * (FRAME_COUNT - 1)),
          FRAME_COUNT - 1
        );
        draw(currentFrame);
      },
    });

    const handleResize = () => {
      const width = window.innerWidth;
      if (Math.abs(width - lastWidthRef.current) > 20 || lastWidthRef.current === 0) {
        lastWidthRef.current = width;
        sizeCanvas();
        draw(currentFrame);
      }
    };

    lastWidthRef.current = window.innerWidth;
    window.addEventListener("resize", handleResize);

    const refreshTimer = setTimeout(() => {
      ScrollTrigger.refresh();
      draw(currentFrame);
    }, 200);

    return () => {
      clearTimeout(refreshTimer);
      st.kill();
      window.removeEventListener("resize", handleResize);
    };
  }, [loaded]);

  return (
    <div
      ref={containerRef}
      className="pointer-events-none absolute inset-0 z-0 overflow-hidden"
      aria-hidden="true"
    >
      <canvas
        ref={canvasRef}
        className="sticky top-0 h-screen w-full object-cover opacity-45 mix-blend-luminosity transition-opacity duration-700 md:opacity-55"
        style={{
          filter: "contrast(1.2) brightness(0.85) sepia(0.12)",
        }}
      />
      {/* Horological Dark Vignette for Text Legibility */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#06100C] via-[#06100C]/70 to-[#06100C]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-transparent via-[#06100C]/50 to-[#06100C]" />
    </div>
  );
}