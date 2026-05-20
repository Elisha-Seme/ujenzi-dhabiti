"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { SERVICES } from "@/lib/constants";

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

  const services = preview ? SERVICES.slice(0, 6) : SERVICES;

  return (
    <section ref={ref} className="section-fade bg-ud-light-gray py-20 md:py-28">
      <div className="max-w-content mx-auto px-6">
        {preview && (
          <div className="text-center mb-14">
            <div className="text-xs font-bold uppercase tracking-[0.25em] text-ud-burgundy mb-3">What We Do</div>
            <h2 className="text-3xl md:text-4xl font-bold text-ud-dark mb-4">Our Services</h2>
            <p className="text-ud-dark/60 font-light max-w-xl mx-auto">
              End-to-end infrastructure development across Africa — from concept to commissioning.
            </p>
          </div>
        )}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service) => (
            <div key={service.id} className="bg-white border-t-[3px] border-ud-burgundy rounded-[4px] p-8 shadow-sm hover:-translate-y-1 hover:shadow-md transition-all duration-200 group">
              <div className="text-3xl mb-4">{service.icon}</div>
              <h3 className="text-lg font-bold text-ud-dark mb-3">{service.title}</h3>
              <p className="text-sm text-ud-dark/60 leading-relaxed mb-5">{service.description}</p>
              <Link
                href="/services"
                className="text-sm font-semibold text-ud-burgundy hover:text-ud-burgundy-hover inline-flex items-center gap-1 group-hover:gap-2 transition-all duration-200"
              >
                Learn More
                <ArrowRight size={14} />
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
