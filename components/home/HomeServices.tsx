import Link from "next/link";
import { ArrowRight, HardHat, Hammer, Layers, PaintRoller, Grid3x3, Waves } from "lucide-react";

// Services Snapshot — six headline services, each linking to its service page.
const SERVICES = [
  { name: "Construction", blurb: "Residential, commercial & institutional builds.", icon: HardHat, href: "/services" },
  { name: "Renovation", blurb: "Remodels, extensions & refurbishments.", icon: Hammer, href: "/services" },
  { name: "Gypsum Works", blurb: "Partitioning & suspended ceilings.", icon: Layers, href: "/services#gypsum-ceilings" },
  { name: "Painting", blurb: "Interior & exterior finishing.", icon: PaintRoller, href: "/services#paint-finishes" },
  { name: "Flooring", blurb: "Tiling, screeds & floor finishes.", icon: Grid3x3, href: "/services#flooring" },
  { name: "Cabro & Drainage", blurb: "Paving, access roads & drainage.", icon: Waves, href: "/services#cabro-road-works" },
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
          {SERVICES.map((s, i) => {
            const Icon = s.icon;
            // Three rotating card variants to break visual monotony
            const variant = i % 3;
            const cardCls =
              variant === 1
                ? // Reddish accent card — burgundy tint + corner glow
                  "group relative overflow-hidden rounded-[4px] border border-ud-burgundy/30 bg-ud-burgundy/[0.10] p-6 hover:-translate-y-1 hover:border-ud-burgundy/55 transition-all"
                : variant === 2
                ? // Elevated dark card — brighter border, top accent line
                  "group relative overflow-hidden rounded-[4px] border border-white/15 border-t-2 border-t-ud-burgundy/60 bg-white/[0.06] p-6 hover:-translate-y-1 hover:border-white/25 transition-all"
                : // Standard dark card (same palette as category cards)
                  "group relative overflow-hidden rounded-[4px] border border-white/10 bg-white/[0.04] p-6 hover:-translate-y-1 hover:bg-white/[0.07] transition-all";
            return (
              <Link key={s.name} href={s.href} className={cardCls}>
                {/* Reddish corner glow — only on accent variant */}
                {variant === 1 && (
                  <div aria-hidden className="absolute -top-6 -right-6 w-24 h-24 rounded-full bg-ud-burgundy/30 blur-2xl pointer-events-none" />
                )}
                <div className="w-11 h-11 rounded-[4px] bg-ud-burgundy/20 flex items-center justify-center mb-4">
                  <Icon className="w-5 h-5 text-ud-burgundy group-hover:text-white transition-colors" strokeWidth={1.75} />
                </div>
                <h3 className="text-base font-bold text-white mb-1.5">{s.name}</h3>
                <p className="text-sm text-white/55 leading-relaxed mb-4">{s.blurb}</p>
                <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-ud-burgundy group-hover:text-white transition-colors">
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
