"use client";

import { useEffect, useRef } from "react";
import Button from "@/components/ui/Button";
import DotMatrix from "@/components/ui/DotMatrix";

export default function CTABanner() {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) el.classList.add("visible");
      },
      { threshold: 0.3 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <section ref={ref} className="section-fade relative bg-ud-burgundy py-20 overflow-hidden">
      <div className="absolute right-0 bottom-0 opacity-20">
        <DotMatrix cols={12} rows={8} color="#ffffff" />
      </div>
      <div className="relative max-w-content mx-auto px-6 text-center">
        <h2 className="text-3xl md:text-4xl font-bold text-ud-white mb-4">
          Ready to build something that lasts?
        </h2>
        <p className="text-white/70 font-light text-lg mb-10 max-w-lg mx-auto">
          Tell us about your project and let&apos;s get to work.
        </p>
        <Button href="/contact" variant="ghost" className="text-base px-8 py-4">
          Contact Us
        </Button>
      </div>
    </section>
  );
}
