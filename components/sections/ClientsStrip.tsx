"use client";

import { useEffect, useRef } from "react";

const CLIENTS = [
  "Kenya National Highways Authority",
  "Rwanda Development Board",
  "East African Development Bank",
  "Tanzania Roads Agency",
  "Uganda National Roads Authority",
  "Mombasa Port Authority",
];

export default function ClientsStrip() {
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
    <section ref={ref} className="section-fade bg-ud-light-gray py-16">
      <div className="max-w-content mx-auto px-6">
        <p className="text-center text-xs font-bold uppercase tracking-[0.25em] text-ud-dark/40 mb-10">
          Trusted by leading organizations across Africa
        </p>
        <div className="flex flex-wrap justify-center items-center gap-4 md:gap-6">
          {CLIENTS.map((client) => (
            <div
              key={client}
              className="bg-white border border-ud-dark/10 rounded-[4px] px-5 py-3 text-xs font-semibold text-ud-dark/50 hover:text-ud-dark hover:border-ud-dark/30 transition-colors duration-200 text-center"
            >
              {client}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
