import Link from "next/link";
import Image from "next/image";
import { Building2, Construction, Sofa, PencilRuler, ArrowRight } from "lucide-react";
import SectionHero from "@/components/ui/SectionHero";
import CTABanner from "@/components/sections/CTABanner";

export const metadata = {
  title: "Our Services — Ujenzi Dhabiti",
  description: "Building works, civil works, interior design, and architectural services across Kenya and Africa.",
};

const PILLARS = [
  {
    label: "Building Works",
    href: "/services/building-works",
    icon: Building2,
    blurb: "Residential and commercial construction, renovation & remodeling, and boundary walls — from bungalows to mixed-use developments.",
    image: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&q=70&auto=format&fit=crop",
  },
  {
    label: "Civil Works",
    href: "/services/civil-works",
    icon: Construction,
    blurb: "Murram road construction, cabro paving, and road drainage systems engineered for Kenya's terrain and climate.",
    image: "https://images.unsplash.com/photo-1545558014-8692077e9b5c?w=800&q=70&auto=format&fit=crop",
  },
  {
    label: "Interior Design",
    href: "/services/interior-design",
    icon: Sofa,
    blurb: "Office partitioning and precision glass & aluminum works that transform and elevate any space.",
    image: "https://images.unsplash.com/photo-1497366754035-f200968a6e72?w=800&q=70&auto=format&fit=crop",
  },
  {
    label: "Architectural",
    href: "/services/architectural",
    icon: PencilRuler,
    blurb: "Architectural design and consultancy — turning your vision into buildable, permit-ready plans.",
    image: "https://images.unsplash.com/photo-1503387762-592deb58ef4e?w=800&q=70&auto=format&fit=crop",
  },
];

export default function ServicesPage() {
  return (
    <>
      <SectionHero
        title="Our Services"
        subtitle="End-to-end construction, civil, interior, and architectural services — delivered under one roof."
      />

      <section className="bg-ud-white py-20 md:py-28">
        <div className="max-w-content mx-auto px-6">
          <div className="grid sm:grid-cols-2 gap-6 md:gap-8">
            {PILLARS.map((pillar) => {
              const Icon = pillar.icon;
              return (
                <Link
                  key={pillar.label}
                  href={pillar.href}
                  className="group relative rounded-[4px] overflow-hidden shadow-sm hover:shadow-lg transition-shadow"
                >
                  <div className="relative h-56 md:h-64">
                    <Image src={pillar.image} alt={pillar.label} fill className="object-cover group-hover:scale-105 transition-transform duration-300" sizes="(max-width: 640px) 100vw, 50vw" />
                    <div className="absolute inset-0 bg-gradient-to-t from-ud-dark/90 via-ud-dark/55 to-ud-dark/25" />
                    <div className="absolute inset-0 p-7 flex flex-col justify-end">
                      <div className="w-11 h-11 rounded-[4px] bg-ud-burgundy flex items-center justify-center mb-4">
                        <Icon className="w-5 h-5 text-white" strokeWidth={1.75} />
                      </div>
                      <h2 className="text-xl md:text-2xl font-bold text-white mb-2">{pillar.label}</h2>
                      <p className="text-sm text-white/75 font-light leading-relaxed mb-3 max-w-md">{pillar.blurb}</p>
                      <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-white">
                        Explore <ArrowRight size={15} className="group-hover:translate-x-1 transition-transform" />
                      </span>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      <CTABanner />
    </>
  );
}
