import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { services, serviceSubsections, serviceMaterialPackages, products } from "@/lib/db/schema";
import { eq, asc, and, inArray } from "drizzle-orm";
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

  const packages = await db.select().from(serviceMaterialPackages)
    .where(and(eq(serviceMaterialPackages.serviceSlug, service.slug), eq(serviceMaterialPackages.published, true)))
    .orderBy(asc(serviceMaterialPackages.sortOrder));
  const productIds = Array.from(new Set(packages.flatMap((item) => item.productIds)));
  const packageProducts = productIds.length
    ? await db.select().from(products).where(inArray(products.id, productIds))
    : [];
  const servicePackages = packages.filter((item) => !item.subsectionId);

  const renderPackage = (item: typeof serviceMaterialPackages.$inferSelect) => (
    <aside key={item.id} className="mt-5 border border-ud-burgundy/20 bg-white rounded-[4px] p-5">
      <h3 className="font-bold text-ud-dark">{item.title}</h3>
      {item.description && <p className="mt-1 text-sm text-ud-dark/60">{item.description}</p>}
      {item.quantityGuidance && <p className="mt-2 text-xs text-ud-dark/50">{item.quantityGuidance}</p>}
      <div className="mt-3 flex flex-wrap gap-2">
        {packageProducts.filter((product) => item.productIds.includes(product.id)).map((product) => (
          <a key={product.id} href={`/shop/${product.id}`} className="border border-ud-dark/10 rounded px-3 py-2 text-xs font-semibold text-ud-burgundy hover:border-ud-burgundy">
            {product.name} · KES {product.priceKES.toLocaleString()}
          </a>
        ))}
      </div>
    </aside>
  );

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

      {servicePackages.length > 0 && (
        <section className="max-w-content mx-auto px-6 py-10">
          <h2 className="font-serif text-2xl font-bold text-ud-dark">Recommended Material Packages</h2>
          {servicePackages.map(renderPackage)}
        </section>
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
            {packages.filter((item) => item.subsectionId === sub.id).map(renderPackage)}
          </ServiceSection>
        );
      })}

      <ServiceEnquiry projectType={service.title} />
      <CTABanner />
    </>
  );
}

export const dynamic = "force-dynamic";
