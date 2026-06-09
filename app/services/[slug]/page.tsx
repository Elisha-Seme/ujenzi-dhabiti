import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { services, serviceSubsections } from "@/lib/db/schema";
import { eq, asc } from "drizzle-orm";
import SectionHero from "@/components/ui/SectionHero";
import CTABanner from "@/components/sections/CTABanner";
import { ServiceIntro, ServiceType, ServiceSection, ServiceMaterialsBar } from "@/components/services/ServicePrimitives";
import ServiceEnquiry from "@/components/services/ServiceEnquiry";

export default async function ServiceDetailPage({ params }: { params: { slug: string } }) {
  const [service] = await db
    .select()
    .from(services)
    .where(eq(services.slug, params.slug));

  if (!service) {
    return notFound();
  }

  const subsections = await db
    .select()
    .from(serviceSubsections)
    .where(eq(serviceSubsections.serviceSlug, service.slug))
    .orderBy(asc(serviceSubsections.sortOrder));

  // Build the sub-navigation array
  const subnav = subsections.map((sub) => ({
    label: sub.sectionId
      .replace(/-/g, " ")
      .replace(/\b\w/g, (c) => c.toUpperCase()),
    href: `#${sub.sectionId}`,
  }));

  // Determine shop category fallback for the materials bar
  const getShopCategory = (slug: string) => {
    switch (slug) {
      case "building-works": return "Structural Materials";
      case "civil-works": return "Cabro & Road Works";
      case "interior-design": return "Gypsum & Ceilings";
      case "architectural": return "Hardware";
      default: return "Structural Materials";
    }
  };

  return (
    <>
      <SectionHero
        title={service.title}
        subtitle={service.description}
      />

      {/* Sticky Sub-nav */}
      {subnav.length > 0 && (
        <div className="sticky top-16 md:top-20 z-30 bg-ud-dark/95 backdrop-blur-sm border-b border-white/10">
          <div className="max-w-content mx-auto px-6 flex gap-1 overflow-x-auto">
            {subnav.map((item) => (
              <a
                key={item.href}
                href={item.href}
                className="whitespace-nowrap text-xs md:text-sm font-semibold text-white/70 hover:text-white py-4 px-3 border-b-2 border-transparent hover:border-ud-burgundy transition-colors"
              >
                {item.label}
              </a>
            ))}
          </div>
        </div>
      )}

      {/* Render subsections dynamically */}
      {subsections.map((sub, idx) => {
        const tone = idx % 2 === 0 ? "white" : "light";
        const materialsCategory = getShopCategory(service.slug);
        
        return (
          <ServiceSection key={sub.id} id={sub.sectionId} tone={tone}>
            <ServiceIntro
              eyebrow={service.title}
              title={sub.title}
              paragraphs={[sub.body]}
            />

            <div className="grid grid-cols-1 gap-6 mt-8">
              <ServiceType
                title="Service Details & Key Highlights"
                bullets={sub.bullets}
                planType={sub.planType ?? undefined}
              />
            </div>

            <ServiceMaterialsBar
              category={materialsCategory}
              quoteType={`${service.quoteType} — ${sub.title}`}
              label={`${service.title} Materials`}
            />
          </ServiceSection>
        );
      })}

      <ServiceEnquiry projectType={`${service.quoteType} — General`} />
      <CTABanner />
    </>
  );
}

// Generate static params for the four main services
export async function generateStaticParams() {
  return [
    { slug: "building-works" },
    { slug: "civil-works" },
    { slug: "interior-design" },
    { slug: "architectural" },
  ];
}
export const dynamic = "force-dynamic";
