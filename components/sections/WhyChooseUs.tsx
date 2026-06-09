"use client";

import { useEffect, useRef } from "react";
import { Layers, Truck, BadgeCheck, Tag } from "lucide-react";

const REASONS = [
  {
    icon: <Layers size={28} strokeWidth={1.5} />,
    title: "One-Stop Solution",
    body: "Materials and labour from a single team — buy your supplies and have us build, with no juggling separate contractors and suppliers.",
  },
  {
    icon: <Truck size={28} strokeWidth={1.5} />,
    title: "Reliable Delivery",
    body: "Dependable delivery across the region, with freight planned to your site and timelines you can build a schedule around.",
  },
  {
    icon: <BadgeCheck size={28} strokeWidth={1.5} />,
    title: "Quality Workmanship",
    body: "Quality materials and skilled crews held to high standards — work that lasts and finishes you can be proud of.",
  },
  {
    icon: <Tag size={28} strokeWidth={1.5} />,
    title: "Competitive Pricing",
    body: "Fair, transparent pricing with volume discounts on bulk orders — strong value without cutting corners.",
  },
];

export default function WhyChooseUs() {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) el.classList.add("visible"); },
      { threshold: 0.15 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <section ref={ref} className="section-fade bg-ud-dark py-20 md:py-28">
      <div className="max-w-content mx-auto px-6">
        <div className="text-center mb-14">
          <div className="text-xs font-bold uppercase tracking-[0.25em] text-ud-burgundy mb-3">Why Us</div>
          <h2 className="text-3xl md:text-4xl font-bold text-ud-white mb-4">Why Choose Ujenzi Dhabiti</h2>
          <p className="text-white/50 font-light max-w-xl mx-auto">
            One team for your materials and your build — reliable, quality, and fairly priced.
          </p>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {REASONS.map((reason, i) => (
            <div key={i} className="group">
              <div className="text-ud-burgundy mb-5">{reason.icon}</div>
              <h3 className="text-base font-bold text-ud-white mb-3">{reason.title}</h3>
              <p className="text-sm text-white/50 leading-relaxed">{reason.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
