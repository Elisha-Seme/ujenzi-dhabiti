"use client";

import { useEffect, useRef } from "react";
import Button from "@/components/ui/Button";
import DotMatrix from "@/components/ui/DotMatrix";

export default function HeroSection() {
  const headingRef = useRef<HTMLHeadingElement>(null);
  const subRef = useRef<HTMLParagraphElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const els = [headingRef.current, subRef.current, ctaRef.current];
    els.forEach((el, i) => {
      if (!el) return;
      el.style.opacity = "0";
      el.style.transform = "translateY(30px)";
      setTimeout(() => {
        el.style.transition = "opacity 0.7s ease, transform 0.7s ease";
        el.style.opacity = "1";
        el.style.transform = "translateY(0)";
      }, 200 + i * 200);
    });
  }, []);

  return (
    <section className="relative min-h-screen flex items-center bg-ud-burgundy overflow-hidden">
      {/* Background image — architectural plan */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: "url('/architectural-plan.png')",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      />
      {/* Burgundy overlay so white text stays readable on the plan */}
      <div className="absolute inset-0 bg-ud-burgundy/85" />
      {/* Subtle dark vignette at the bottom for depth */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-ud-dark/40" />

      {/* Dot matrix decorative */}
      <div className="absolute top-24 right-0 md:right-8 opacity-25 hidden sm:block">
        <DotMatrix cols={16} rows={14} color="#ffffff" animate />
      </div>
      <div className="absolute bottom-0 left-0 opacity-10">
        <DotMatrix cols={8} rows={6} color="#ffffff" />
      </div>

      <div className="relative max-w-content mx-auto px-6 py-32 md:py-0">
        <div className="max-w-3xl">
          <div className="inline-block mb-6">
            <span className="text-xs font-bold uppercase tracking-[0.3em] text-white/60 border border-white/20 px-3 py-1.5 rounded-[4px]">
              CONNECTING AFRICA
            </span>
          </div>
          <h1
            ref={headingRef}
            className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-ud-white leading-tight mb-6"
          >
            Building Africa&apos;s Future,<br />
            <span className="text-white/80">One Project At</span> a Time.
          </h1>
          <p
            ref={subRef}
            className="text-lg md:text-xl text-white/70 font-light leading-relaxed mb-10 max-w-xl"
          >
            Ujenzi Dhabiti delivers roads, buildings, water systems, and logistics infrastructure across Africa — on time, built to last.
          </p>
          <div ref={ctaRef} className="flex flex-wrap gap-4">
            <Button href="/services" variant="ghost">
              Our Services
            </Button>
            <Button href="/contact" variant="primary">
              Get In Touch
            </Button>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-white/40">
        <span className="text-xs uppercase tracking-widest">Scroll</span>
        <div className="w-px h-10 bg-white/20 animate-pulse" />
      </div>
    </section>
  );
}
