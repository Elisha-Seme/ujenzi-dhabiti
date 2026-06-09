import Link from "next/link";
import Image from "next/image";
import * as LucideIcons from "lucide-react";
import SectionHero from "@/components/ui/SectionHero";
import CTABanner from "@/components/sections/CTABanner";
import { db } from "@/lib/db";
import { services } from "@/lib/db/schema";
import { asc, eq } from "drizzle-orm";

export const metadata = {
  title: "Our Services — Ujenzi Dhabiti",
  description: "Gypsum works, painting, tiling, cabro paving, and drainage installations under one roof.",
};

const SERVICES_STATIC = [
  {
    title: "Gypsum Works",
    slug: "gypsum-ceilings",
    quoteType: "Interior Design — Office Partitioning",
    description: "Professional drywall partitioning and suspended ceiling installations. We deliver smooth, paint-ready surfaces with excellent acoustic and thermal properties, perfect for dividing office spaces or creating modern residential ceilings.",
    includes: [
      "Drywall partitioning & sound-insulation",
      "Suspended ceiling installations (gypsum & board designs)",
      "Decorative cornices, moldings & bulkheads",
      "Metal framing and support structures"
    ],
    materials: [
      "Gypsum Board 12.5mm",
      "Metal Furring Channels & Studs",
      "Skim Coat Wall Putty",
      "Gypsum Screws & Joint Tapes"
    ],
    image: "https://images.unsplash.com/photo-1607400201889-565b1ee75f8e?w=800&q=70&auto=format&fit=crop",
    iconName: "Layout"
  },
  {
    title: "Painting & Finishes",
    slug: "paint-finishes",
    quoteType: "Painting & Finishes",
    description: "High-quality interior and exterior paint applications. Our team ensures thorough surface preparation, waterproofing, priming, and uniform coatings that withstand weathering while elevating architectural aesthetics.",
    includes: [
      "Interior wall and ceiling painting",
      "Exterior weather-proof protective coats",
      "Surface preparation, sanding & wall putty skim coating",
      "Undercoating & primer applications"
    ],
    materials: [
      "Vinyl Silk Emulsion Paint",
      "Wall Primers & Undercoats",
      "Skim Coat Wall Putty",
      "Application Rollers & Brush sets"
    ],
    image: "https://images.unsplash.com/photo-1589939705384-5185137a7f0f?w=800&q=70&auto=format&fit=crop",
    iconName: "PaintBucket"
  },
  {
    title: "Flooring & Tiling",
    slug: "flooring",
    quoteType: "Flooring Works",
    description: "Flawless tiling and floor finishes. We lay durable ceramic, rectified porcelain, or natural stone tiles for high-traffic environments, ensuring perfect level alignment and seamless grouting.",
    includes: [
      "Ceramic & porcelain floor tiling",
      "Bathroom & kitchen wall tiling",
      "Floor screeding and leveling preparation",
      "Grout application & joint sealing"
    ],
    materials: [
      "Ceramic Floor Tiles 600x600",
      "Porcelain Tiles 800x800",
      "High-bond Tile Adhesive",
      "Tile Spacers & Grouts"
    ],
    image: "https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=800&q=70&auto=format&fit=crop",
    iconName: "Grid"
  },
  {
    title: "Cabro & Paving Works",
    slug: "cabro-road-works",
    quoteType: "Civil Works — Cabro Paving",
    description: "Premium interlocking paving block works designed for driveways, yards, commercial parking spaces, and estate roads. Built on stable, well-compacted sub-bases to prevent sinking or shifts.",
    includes: [
      "Interlocking cabro block paving installation",
      "Concrete kerbstone and channel positioning",
      "Hardcore sub-base leveling and heavy compaction",
      "Sand bedding and joint dusting"
    ],
    materials: [
      "Cabro Paving Blocks (60mm / 80mm)",
      "Concrete Kerbstones",
      "Aggregates & Hardcore tippers",
      "Quarry Dust & Paving Sand"
    ],
    image: "https://images.unsplash.com/photo-1597844808175-0d5c4f7b3c8c?w=800&q=70&auto=format&fit=crop",
    iconName: "Hammer"
  },
  {
    title: "Drainage & Plumbing",
    slug: "plumbing",
    quoteType: "Plumbing & Drainage",
    description: "Complete water supply, sanitary sewer, and surface storm water drainage installations. We supply and lay quality pressure-rated piping systems and storage tanks for uninterrupted operations.",
    includes: [
      "Stormwater channel and drainage pipe layout",
      "Wastewater plumbing & sewage connection systems",
      "Clean water supply network installation",
      "Cold/Hot water storage tank mounting"
    ],
    materials: [
      "PPR Hot/Cold Pipes (20mm / 25mm)",
      "uPVC Soil Pipes (110mm)",
      "Water Storage Tanks (1000L - 10000L)",
      "Brass Valves & Pipe Fittings"
    ],
    image: "https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=800&q=70&auto=format&fit=crop",
    iconName: "Pipette"
  }
];

// Helper to resolve Lucide icon components dynamically
const DynamicIcon = ({ name, className, strokeWidth }: { name: string; className?: string; strokeWidth?: number }) => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const IconComponent = (LucideIcons as any)[name];
  if (!IconComponent) {
    return <LucideIcons.Layout className={className} strokeWidth={strokeWidth ?? 1.5} />;
  }
  return <IconComponent className={className} strokeWidth={strokeWidth ?? 1.5} />;
};

export default async function ServicesPage() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let servicesList: any[] = [];

  try {
    const dbServices = await db
      .select()
      .from(services)
      .where(eq(services.published, true))
      .orderBy(asc(services.sortOrder));
    
    // Core slugs displayed on the main services index
    const coreSlugs = ["gypsum-ceilings", "paint-finishes", "flooring", "cabro-road-works", "plumbing"];
    servicesList = dbServices.filter((s) => coreSlugs.includes(s.slug));
    
    if (servicesList.length === 0) {
      servicesList = SERVICES_STATIC;
    }
  } catch (err) {
    console.error("Services page dynamic load failed, falling back to static constants:", err);
    servicesList = SERVICES_STATIC;
  }

  return (
    <>
      <SectionHero
        title="Our Services"
        subtitle="End-to-end building works, installations, and site development—supplied and built under one roof."
      />

      <section className="bg-ud-light-gray py-16 md:py-24">
        <div className="max-w-content mx-auto px-6 space-y-16">
          {servicesList.map((srv, idx) => {
            const isEven = idx % 2 === 0;

            return (
              <div
                key={srv.title}
                id={srv.slug}
                className={`scroll-mt-24 flex flex-col lg:flex-row gap-8 lg:gap-12 bg-white border border-ud-dark/10 rounded-[4px] overflow-hidden p-6 md:p-8 ${
                  isEven ? "" : "lg:flex-row-reverse"
                }`}
              >
                {/* Service Image & Core Info */}
                <div className="flex-1">
                  <div className="relative aspect-[16/10] rounded-[4px] overflow-hidden mb-6 border border-ud-dark/10">
                    <Image
                      src={srv.image}
                      alt={srv.title}
                      fill
                      className="object-cover"
                      sizes="(max-width: 1024px) 100vw, 50vw"
                    />
                    <div className="absolute top-4 left-4 bg-ud-burgundy text-white p-2.5 rounded-[4px]">
                      <DynamicIcon name={srv.iconName} className="w-5 h-5" />
                    </div>
                  </div>

                  <h2 className="text-2xl md:text-3xl font-bold text-ud-dark mb-4">{srv.title}</h2>
                  <p className="text-sm text-ud-dark/70 leading-relaxed font-light mb-6">
                    {srv.description}
                  </p>

                  <div className="flex flex-wrap gap-4 mt-6">
                    <Link
                      href={`/shop/category/${srv.slug}`}
                      className="inline-flex items-center gap-2 bg-ud-burgundy text-white text-xs font-bold px-5 py-3 rounded-[4px] hover:bg-ud-burgundy-hover transition-colors whitespace-nowrap"
                    >
                      View Materials <LucideIcons.ArrowRight size={14} />
                    </Link>
                    <Link
                      href={`/request-a-quote?projectType=${encodeURIComponent(srv.quoteType)}`}
                      className="inline-flex items-center gap-2 border border-ud-burgundy text-ud-burgundy text-xs font-bold px-5 py-3 rounded-[4px] hover:bg-ud-burgundy hover:text-white transition-colors whitespace-nowrap"
                    >
                      Request Service Quote
                    </Link>
                  </div>
                </div>

                {/* Sub-services & Materials List */}
                <div className="flex-1 flex flex-col justify-between border-t lg:border-t-0 lg:border-l border-ud-dark/10 pt-6 lg:pt-0 lg:pl-10">
                  <div>
                    <h3 className="text-sm font-bold text-ud-dark uppercase tracking-wider mb-4">What We Do (Includes):</h3>
                    <ul className="space-y-3 mb-8">
                      {srv.includes.map((inc: string) => (
                        <li key={inc} className="flex items-start gap-3 text-sm text-ud-dark/70">
                          <LucideIcons.Check size={16} className="text-ud-burgundy flex-shrink-0 mt-0.5" />
                          <span>{inc}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="bg-ud-light-gray/60 border border-ud-dark/5 rounded-[4px] p-5">
                    <h3 className="text-xs font-bold text-ud-dark/50 uppercase tracking-wider mb-3">Key Materials We Use:</h3>
                    <ul className="grid sm:grid-cols-2 gap-x-4 gap-y-2">
                      {srv.materials.map((mat: string) => (
                        <li key={mat} className="text-xs font-semibold text-ud-dark/70 flex items-center gap-1.5">
                          <span className="w-1.5 h-1.5 rounded-full bg-ud-burgundy" />
                          {mat}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      <CTABanner />
    </>
  );
}
