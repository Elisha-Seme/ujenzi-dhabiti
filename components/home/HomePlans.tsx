import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

// House-plan property types — tease the categories and route to the shop.
const PLAN_TYPES = [
  { label: "Bungalows", image: "https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=600&q=70&auto=format&fit=crop" },
  { label: "Townhouses", image: "https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=600&q=70&auto=format&fit=crop" },
  { label: "Maisonettes", image: "https://images.unsplash.com/photo-1572120360610-d971b9d7767c?w=600&q=70&auto=format&fit=crop" },
  { label: "Villas", image: "https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=600&q=70&auto=format&fit=crop" },
  { label: "Apartments", image: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=600&q=70&auto=format&fit=crop" },
  { label: "Commercial", image: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=600&q=70&auto=format&fit=crop" },
];

// "Build With Us — House Plans" on the dark blueprint backdrop continuing from above.
export default function HomePlans() {
  return (
    <section className="relative py-16 md:py-20">
      <div className="max-w-content mx-auto px-6">
        <div className="flex items-end justify-between mb-8">
          <div>
            <div className="text-xs font-bold uppercase tracking-[0.25em] text-white/55 mb-2">Build With Us</div>
            <h2 className="text-2xl md:text-3xl font-bold text-white">House Plans</h2>
            <p className="text-sm text-white/65 mt-1.5 max-w-lg">
              Ready-to-build plans for every property type — available as digital downloads or printed copies.
            </p>
          </div>
          <Link href="/shop/plans" className="hidden sm:inline-flex items-center gap-1.5 text-sm font-semibold text-white hover:text-white/70 whitespace-nowrap transition-colors">
            Browse all plans <ArrowRight size={15} />
          </Link>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-5">
          {PLAN_TYPES.map((type) => (
            <Link
              key={type.label}
              href={`/shop/plans?type=${encodeURIComponent(type.label)}`}
              className="group relative h-40 md:h-52 rounded-[4px] overflow-hidden shadow-lg ring-1 ring-white/10"
            >
              <Image src={type.image} alt={type.label} fill className="object-cover group-hover:scale-105 transition-transform duration-300" sizes="(max-width: 768px) 50vw, 33vw" />
              <div className="absolute inset-0 bg-gradient-to-t from-ud-dark/90 via-ud-dark/35 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-4 flex items-center justify-between">
                <span className="text-white font-bold text-sm md:text-base">{type.label}</span>
                <ArrowRight size={16} className="text-white/80 group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
