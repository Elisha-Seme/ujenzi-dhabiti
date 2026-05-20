"use client";

import { useEffect, useRef } from "react";
import { Globe, Users, Activity, BadgeCheck } from "lucide-react";

const REASONS = [
  {
    icon: <Globe size={28} strokeWidth={1.5} />,
    title: "Pan-African Reach",
    body: "Operating across 8 countries, we understand the regulatory landscape, terrain, and logistics of infrastructure delivery on the continent.",
  },
  {
    icon: <Users size={28} strokeWidth={1.5} />,
    title: "Experienced Team",
    body: "Over 500 engineers, project managers, and technicians with combined decades of field experience across every infrastructure discipline.",
  },
  {
    icon: <Activity size={28} strokeWidth={1.5} />,
    title: "End-to-End Delivery",
    body: "From feasibility studies to commissioning, we manage every phase in-house — reducing handoff risk and keeping projects coherent from start to finish.",
  },
  {
    icon: <BadgeCheck size={28} strokeWidth={1.5} />,
    title: "Quality Assurance",
    body: "Every project is subject to rigorous QA processes aligned with international construction standards, ensuring structures that outlast expectations.",
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
            We don&apos;t just build infrastructure. We build the arteries that economies depend on.
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
