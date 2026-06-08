"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { ArrowRight, Building2, Construction, Sofa, PencilRuler } from "lucide-react";
import { SERVICE_PILLARS } from "@/lib/constants";

const ICONS = [Building2, Construction, Sofa, PencilRuler];

interface ServicesGridProps {
  preview?: boolean;
}

export default function ServicesGrid({ preview = false }: ServicesGridProps) {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) el.classList.add("visible"); },
      { threshold: 0.1 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <section ref={ref} className="section-fade bg-ud-light-gray py-20 md:py-28">
      <div className="max-w-content mx-auto px-6">
        {preview && (
          <div className="text-center mb-14">
            <div className="text-xs font-bold uppercase tracking-[0.25em] text-ud-burgundy mb-3">What We Do</div>
            <h2 className="text-3xl md:text-4xl font-bold text-ud-dark mb-4">Our Services</h2>
            <p className="text-ud-dark/60 font-light max-w-xl mx-auto">
              Building works, civil works, interior design, and architectural services — delivered under one roof.
            </p>
          </div>
        )}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {SERVICE_PILLARS.map((pillar, i) => {
            const Icon = ICONS[i % ICONS.length];
            return (
              <Link
                key={pillar.label}
                href={pillar.href}
                className="bg-white border-t-[3px] border-ud-burgundy rounded-[4px] p-8 shadow-sm hover:-translate-y-1 hover:shadow-md transition-all duration-200 group flex flex-col"
              >
                <div className="w-11 h-11 rounded-[4px] bg-ud-burgundy/10 flex items-center justify-center mb-4">
                  <Icon className="w-5 h-5 text-ud-burgundy" strokeWidth={1.75} />
                </div>
                <h3 className="text-lg font-bold text-ud-dark mb-3">{pillar.label}</h3>
                <p className="text-sm text-ud-dark/60 leading-relaxed mb-5 flex-1">{pillar.blurb}</p>
                <span className="text-sm font-semibold text-ud-burgundy hover:text-ud-burgundy-hover inline-flex items-center gap-1 group-hover:gap-2 transition-all duration-200">
                  Learn More
                  <ArrowRight size={14} />
                </span>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
