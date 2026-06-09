import Image from "next/image";
import Link from "next/link";
import { ArrowRight, MapPin } from "lucide-react";
import { PROJECTS } from "@/lib/constants";

// Projects teaser — a few completed builds with a link to the full portfolio.
export default function HomeProjects() {
  const featured = PROJECTS.slice(0, 3);

  return (
    <section className="bg-white py-16 md:py-24">
      <div className="max-w-content mx-auto px-6">
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-10">
          <div>
            <div className="text-xs font-bold uppercase tracking-[0.25em] text-ud-burgundy mb-3">What We&apos;ve Built</div>
            <h2 className="text-3xl md:text-4xl font-bold text-ud-dark">Projects We&apos;re Proud Of</h2>
          </div>
          <Link href="/what-we-built" className="inline-flex items-center gap-1.5 text-sm font-semibold text-ud-burgundy hover:underline whitespace-nowrap">
            View Projects <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {featured.map((p) => (
            <Link key={p.id} href="/what-we-built" className="group bg-ud-light-gray rounded-[4px] overflow-hidden border border-ud-dark/8 hover:shadow-md transition-shadow">
              <div className="relative h-48 overflow-hidden">
                <Image src={p.image} alt={p.name} fill className="object-cover group-hover:scale-105 transition-transform duration-500" sizes="(max-width: 640px) 100vw, 33vw" />
                <span className="absolute top-3 left-3 bg-ud-burgundy text-white text-[10px] font-bold uppercase tracking-wide px-2 py-1 rounded-[4px]">{p.category}</span>
              </div>
              <div className="p-5">
                <h3 className="text-base font-bold text-ud-dark leading-snug mb-1.5">{p.name}</h3>
                <p className="flex items-center gap-1.5 text-xs text-ud-dark/50 mb-2">
                  <MapPin className="w-3.5 h-3.5 text-ud-burgundy" /> {p.location}
                </p>
                <p className="text-sm text-ud-dark/60 leading-relaxed line-clamp-2">{p.description}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
