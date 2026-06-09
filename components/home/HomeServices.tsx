import Link from "next/link";
import { ArrowRight, HardHat, Hammer, Layers, PaintRoller, Grid3x3, Waves } from "lucide-react";

// Services Snapshot — six headline services, each linking to its service page.
const SERVICES = [
  { name: "Construction", blurb: "Residential, commercial & institutional builds.", icon: HardHat, href: "/services/building-works" },
  { name: "Renovation", blurb: "Remodels, extensions & refurbishments.", icon: Hammer, href: "/services/building-works" },
  { name: "Gypsum Works", blurb: "Partitioning & suspended ceilings.", icon: Layers, href: "/services/interior-design" },
  { name: "Painting", blurb: "Interior & exterior finishing.", icon: PaintRoller, href: "/services/building-works" },
  { name: "Flooring", blurb: "Tiling, screeds & floor finishes.", icon: Grid3x3, href: "/services/interior-design" },
  { name: "Cabro & Drainage", blurb: "Paving, access roads & drainage.", icon: Waves, href: "/services/civil-works" },
];

export default function HomeServices() {
  return (
    <section className="py-16 md:py-24">
      <div className="max-w-content mx-auto px-6">
        <div className="text-center mb-12">
          <div className="text-xs font-bold uppercase tracking-[0.25em] text-ud-burgundy mb-3">Our Services</div>
          <h2 className="text-3xl md:text-4xl font-bold text-white">From Materials to Finished Build</h2>
          <p className="text-white/55 font-light max-w-xl mx-auto mt-3">
            We don&apos;t just supply — we build. One team for your materials and your labour.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {SERVICES.map((s) => {
            const Icon = s.icon;
            return (
              <Link
                key={s.name}
                href={s.href}
                className="group bg-ud-light-gray border-t-2 border-ud-burgundy rounded-[4px] p-6 hover:shadow-md hover:-translate-y-1 transition-all"
              >
                <div className="w-11 h-11 rounded-[4px] bg-ud-burgundy/10 flex items-center justify-center mb-4">
                  <Icon className="w-5 h-5 text-ud-burgundy" strokeWidth={1.75} />
                </div>
                <h3 className="text-base font-bold text-ud-dark mb-1.5">{s.name}</h3>
                <p className="text-sm text-ud-dark/55 leading-relaxed mb-4">{s.blurb}</p>
                <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-ud-burgundy">
                  View Service <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </span>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
