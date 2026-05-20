"use client";

import { useEffect, useRef } from "react";

export default function MissionVision() {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) el.classList.add("visible");
      },
      { threshold: 0.2 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <section ref={ref} className="section-fade bg-ud-dark py-20 md:py-28">
      <div className="max-w-content mx-auto px-6">
        <div className="grid md:grid-cols-2 gap-12 md:gap-16">
          <div className="border-l-4 border-ud-burgundy pl-8">
            <div className="text-xs font-bold uppercase tracking-[0.25em] text-ud-burgundy mb-4">
              Our Mission
            </div>
            <p className="text-2xl md:text-3xl font-light text-ud-white leading-relaxed">
              To connect all economic sectors in Africa through infrastructural development.
            </p>
          </div>
          <div className="border-l-4 border-white/20 pl-8">
            <div className="text-xs font-bold uppercase tracking-[0.25em] text-white/40 mb-4">
              Our Vision
            </div>
            <p className="text-2xl md:text-3xl font-light text-white/70 leading-relaxed">
              To spread infrastructural development across Africa.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
