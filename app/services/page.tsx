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

// Administrators can publish new services without rebuilding the application.
export const dynamic = "force-dynamic";

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
  let servicesList: Array<typeof services.$inferSelect> = [];

  try {
    const dbServices = await db
      .select()
      .from(services)
      .where(eq(services.published, true))
      .orderBy(asc(services.sortOrder));
    
    // The CMS is the source of truth: every published service must be
    // discoverable from the public index, including the broader service
    // pillars and any future services added by an administrator.
    servicesList = dbServices;
  } catch (err) {
    console.error("Services page dynamic load failed:", err);
  }

  return (
    <>
      <SectionHero
        title="Our Services"
        subtitle="End-to-end building works, installations, and site development—supplied and built under one roof."
      />

      {servicesList.length > 0 && (
        <nav aria-label="Service sections" className="bg-white border-b border-ud-dark/10">
          <div className="max-w-content mx-auto px-6 flex gap-2 overflow-x-auto py-3">
            {servicesList.map((srv) => (
              <a key={srv.id} href={`#${srv.slug}`} className="whitespace-nowrap rounded-[4px] px-3 py-2 text-sm font-semibold text-ud-dark/70 hover:text-ud-burgundy">
                {srv.title}
              </a>
            ))}
          </div>
        </nav>
      )}

      <section className="bg-ud-light-gray py-16 md:py-24">
        <div className="max-w-content mx-auto px-6 space-y-16">
          {servicesList.length === 0 ? (
            <div className="max-w-xl mx-auto text-center py-16">
              <h2 className="text-2xl font-bold text-ud-dark mb-3">Our service catalogue is being updated</h2>
              <p className="text-sm text-ud-dark/60 leading-relaxed">Please contact us for current service availability and project enquiries.</p>
              <Link href="/contact" className="inline-flex mt-6 bg-ud-burgundy text-white text-sm font-bold px-5 py-3 rounded-[4px] hover:bg-ud-burgundy-hover transition-colors">Contact us</Link>
            </div>
          ) : servicesList.map((srv, idx) => {
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
                      href={`/services/${srv.slug}`}
                      className="inline-flex items-center gap-2 bg-ud-burgundy text-white text-xs font-bold px-5 py-3 rounded-[4px] hover:bg-ud-burgundy-hover transition-colors whitespace-nowrap"
                    >
                      View Service <LucideIcons.ArrowRight size={14} />
                    </Link>
                    <Link
                      href={`/services/${srv.slug}#materials`}
                      className="inline-flex items-center gap-2 border border-ud-dark/20 text-ud-dark/70 text-xs font-bold px-5 py-3 rounded-[4px] hover:border-ud-burgundy hover:text-ud-burgundy transition-colors whitespace-nowrap"
                    >
                      Shop Service Materials
                    </Link>
                    <Link
                      href={`/request-a-quote?projectType=${encodeURIComponent(srv.title)}`}
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
