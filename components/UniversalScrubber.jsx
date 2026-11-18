"use client";
import React, { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/dist/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
  ScrollTrigger.config({ ignoreMobileResize: true });
}

export default function UniversalScrubber({
  folder = "hero",
  frameCount = 35,
  opacity = "opacity-25",
  filter = "contrast(1.15) brightness(0.7)",
  start = "top bottom",
  end = "bottom top",
  className = "",
}) {
  const canvasRef = useRef(null);
  const containerRef = useRef(null);
  const lastWidthRef = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const context = canvas.getContext("2d");

    const currentFrame = (index) =>
      `/frames/${folder}/frame_${(index + 1).toString().padStart(3, "0")}.webp`;

    const images = [];
    const airplay = { frame: 0 };

    for (let i = 0; i < frameCount; i++) {
      const img = new Image();
      img.src = currentFrame(i);
      images.push(img);
    }

    const render = () => {
      const img = images[Math.min(airplay.frame, frameCount - 1)];
      if (img && img.complete && img.naturalWidth > 0) {
        context.clearRect(0, 0, canvas.width, canvas.height);
        const scale = Math.max(canvas.width / img.width, canvas.height / img.height);
        const x = canvas.width / 2 - (img.width / 2) * scale;
        const y = canvas.height / 2 - (img.height / 2) * scale;
        context.drawImage(img, x, y, img.width * scale, img.height * scale);
      }
    };

    // Draw first frame immediately when available
    images[0].onload = render;
    if (images[0].complete) render();

    const handleResize = () => {
      const width = window.innerWidth;
      // Only recalculate on true orientation/width change, not mobile address bar collapse
      if (Math.abs(width - lastWidthRef.current) > 20 || lastWidthRef.current === 0) {
        lastWidthRef.current = width;
        const dpr = Math.min(window.devicePixelRatio || 1, 2);
        canvas.width = window.innerWidth * dpr;
        canvas.height = window.innerHeight * dpr;
        render();
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);

    const st = ScrollTrigger.create({
      trigger: containerRef.current,
      start: start,
      end: end,
      scrub: 0.3,
      onUpdate: (self) => {
        airplay.frame = Math.round(self.progress * (frameCount - 1));
        render();
      },
    });

    // Refresh triggers after mount
    const timer = setTimeout(() => {
      ScrollTrigger.refresh();
      render();
    }, 200);

    return () => {
      clearTimeout(timer);
      window.removeEventListener("resize", handleResize);
      st.kill();
    };
  }, [folder, frameCount, start, end]);

  return (
    <div ref={containerRef} className={`absolute inset-0 z-0 pointer-events-none overflow-hidden ${className}`}>
      <canvas
        ref={canvasRef}
        className={`sticky top-0 w-full h-screen object-cover ${opacity}`}
        style={{ filter: filter }}
      />
    </div>
  );
}