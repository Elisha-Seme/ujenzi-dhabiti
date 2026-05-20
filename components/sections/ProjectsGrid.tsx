"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { MapPin } from "lucide-react";
import { PROJECTS } from "@/lib/constants";
import Button from "@/components/ui/Button";

const CATEGORIES = ["All", "Roads", "Buildings", "Water", "Transport"];

interface ProjectsGridProps {
  preview?: boolean;
}

export default function ProjectsGrid({ preview = false }: ProjectsGridProps) {
  const [active, setActive] = useState("All");
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

  const filtered = active === "All" ? PROJECTS : PROJECTS.filter((p) => p.category === active);
  const displayed = preview ? filtered.slice(0, 3) : filtered;

  return (
    <section ref={ref} className="section-fade bg-ud-white py-20 md:py-28">
      <div className="max-w-content mx-auto px-6">
        {preview ? (
          <div className="text-center mb-14">
            <div className="text-xs font-bold uppercase tracking-[0.25em] text-ud-burgundy mb-3">Our Work</div>
            <h2 className="text-3xl md:text-4xl font-bold text-ud-dark mb-4">Featured Projects</h2>
            <p className="text-ud-dark/60 font-light max-w-xl mx-auto">
              From highways to water systems — projects that connect and serve communities across the continent.
            </p>
          </div>
        ) : (
          <div className="flex flex-wrap gap-2 mb-10">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setActive(cat)}
                className={`px-5 py-2 text-sm font-semibold rounded-[4px] border transition-colors duration-200 ${
                  active === cat
                    ? "bg-ud-burgundy text-white border-ud-burgundy"
                    : "bg-transparent text-ud-dark border-ud-dark/20 hover:border-ud-burgundy hover:text-ud-burgundy"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {displayed.map((project) => (
            <div key={project.id} className="bg-white rounded-[4px] shadow-sm overflow-hidden hover:-translate-y-1 hover:shadow-md transition-all duration-200 border border-ud-dark/8">
              <div className="relative h-48 overflow-hidden">
                <Image src={project.image} alt={project.name} fill className="object-cover" sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw" />
                <div className="absolute inset-0 bg-ud-dark/40" />
                <span className="absolute top-4 left-4 bg-ud-burgundy text-white text-xs font-bold uppercase tracking-wider px-2.5 py-1 rounded-[4px]">
                  {project.category}
                </span>
              </div>
              <div className="p-6">
                <h3 className="text-base font-bold text-ud-dark mb-1">{project.name}</h3>
                <div className="flex items-center gap-1.5 text-xs text-ud-dark/50 mb-3">
                  <MapPin size={12} />
                  {project.location}
                </div>
                <p className="text-sm text-ud-dark/60 leading-relaxed mb-4">{project.description}</p>
                <Button href="/projects" variant="secondary" className="text-xs px-4 py-2">
                  View Details
                </Button>
              </div>
            </div>
          ))}
        </div>

        {preview && (
          <div className="text-center mt-12">
            <Button href="/projects" variant="secondary">View All Projects</Button>
          </div>
        )}
      </div>
    </section>
  );
}
