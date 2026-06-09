"use client";

import { useEffect, useRef } from "react";
import Button from "@/components/ui/Button";
import DotMatrix from "@/components/ui/DotMatrix";
import { whatsappLink } from "@/lib/constants";

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
          Need materials for your project?
        </h2>
        <p className="text-white/70 font-light text-lg mb-10 max-w-lg mx-auto">
          Get a tailored quote, or send us your list on WhatsApp — we&apos;ll sort the rest.
        </p>
        <div className="flex flex-wrap items-center justify-center gap-4">
          <Button href="/request-a-quote" variant="ghost" className="text-base px-8 py-4">
            Request a Quote
          </Button>
          <a
            href={whatsappLink("Hello Ujenzi Dhabiti, I'd like to place an order / get a quote.")}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-white text-ud-burgundy text-base font-semibold px-8 py-4 rounded-[4px] hover:bg-white/90 transition-colors"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51l-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.247-.694.247-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" /></svg>
            WhatsApp Order
          </a>
        </div>
      </div>
    </section>
  );
}
