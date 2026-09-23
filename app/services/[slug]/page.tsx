import { notFound } from "next/navigation";
import Link from "next/link";
import { db } from "@/lib/db";
import { services, serviceSubsections, products } from "@/lib/db/schema";
import { eq, asc, and, inArray } from "drizzle-orm";
import SectionHero from "@/components/ui/SectionHero";
import CTABanner from "@/components/sections/CTABanner";
import { ServiceIntro, ServiceType, ServiceSection, ServiceMaterialsBar } from "@/components/services/ServicePrimitives";
import ServiceEnquiry from "@/components/services/ServiceEnquiry";
import ProductCard from "@/components/shop/ProductCard";
import type { ProductCategory } from "@/lib/products";

export default async function ServiceDetailPage({ params }: { params: { slug: string } }) {
  let service: typeof services.$inferSelect | undefined;
  let publishedServices: (typeof services.$inferSelect)[] = [];
  try {
    publishedServices = await db
      .select()
      .from(services)
      .where(eq(services.published, true))
      .orderBy(asc(services.sortOrder));
    service = publishedServices.find((row) => row.slug === params.slug);
  } catch (err) {
    console.error("Service detail load failed:", err);
    return notFound();
  }

  if (!service) {
    return notFound();
  }

  let subsections: (typeof serviceSubsections.$inferSelect)[] = [];
  try {
    subsections = await db
      .select()
      .from(serviceSubsections)
      .where(eq(serviceSubsections.serviceSlug, service.slug))
      .orderBy(asc(serviceSubsections.sortOrder));
  } catch (err) {
    console.error("Service subsection load failed:", err);
  }

  let materialProducts: (typeof products.$inferSelect)[] = [];
  let materialLoadFailed = false;
  if (service.materialProductIds.length > 0) {
    try {
      materialProducts = await db.select().from(products)
        .where(and(inArray(products.id, service.materialProductIds), eq(products.isActive, true)));
      materialProducts.sort((a, b) => service!.materialProductIds.indexOf(a.id) - service!.materialProductIds.indexOf(b.id));
    } catch (err) {
      console.error("Service materials load failed:", err);
      materialLoadFailed = true;
    }
  }

  // Core catalogue services do not all have subsection rows yet. Keep their
  // dedicated pages useful by rendering the CMS description/includes instead
  // of returning a hero followed by an empty page.
  const sections = subsections.length > 0
    ? subsections
    : [{
        id: `${service.id}-overview`,
        sectionId: "overview",
        title: `${service.title} Services`,
        body: service.description,
        planType: null,
        bullets: service.includes,
      }];

  // Build the sub-navigation array
  const subnav = sections.map((sub) => ({
    label: sub.title,
    href: `#${sub.sectionId}`,
  }));

  return (
    <>
      <SectionHero
        title={service.title}
        subtitle={service.description}
      />

      <nav aria-label="Service pages" className="bg-white border-b border-ud-dark/10">
        <div className="max-w-content mx-auto px-6 flex gap-2 overflow-x-auto py-3">
          <Link href="/services" className="whitespace-nowrap rounded-[4px] px-3 py-2 text-sm font-semibold text-ud-dark/70 hover:text-ud-burgundy">All Services</Link>
          {publishedServices.map((row) => (
            <Link
              key={row.id}
              href={`/services/${row.slug}`}
              aria-current={row.slug === service.slug ? "page" : undefined}
              className={`whitespace-nowrap rounded-[4px] px-3 py-2 text-sm font-semibold ${row.slug === service.slug ? "bg-ud-burgundy text-white" : "text-ud-dark/70 hover:text-ud-burgundy"}`}
            >
              {row.title}
            </Link>
          ))}
        </div>
      </nav>

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
      {sections.map((sub, idx) => {
        const tone = idx % 2 === 0 ? "white" : "light";
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
              quoteType={`${service.quoteType} — ${sub.title}`}
              label={service.title}
              hasMaterials={materialProducts.length > 0}
            />
          </ServiceSection>
        );
      })}

      <section id="materials" className="bg-white py-16 md:py-24 scroll-mt-20">
        <div className="max-w-content mx-auto px-6">
          <h2 className="text-2xl md:text-3xl font-bold text-ud-dark">Shop Materials for {service.title}</h2>
          <p className="text-sm text-ud-dark/60 mt-3 mb-8 max-w-2xl">These are selected catalogue materials, not a complete project bill of quantities. Choose quantities for your site or request a tailored quote.</p>
          {materialProducts.length > 0 ? (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {materialProducts.map((product) => (
                <ProductCard key={product.id} product={{
                  id: product.id,
                  name: product.name,
                  category: product.category as ProductCategory,
                  description: product.description,
                  unit: product.unit,
                  priceKES: product.priceKES,
                  image: product.images[0] ?? "",
                  inStock: product.stock > 0,
                  specs: product.specs ?? undefined,
                  coverageSqmPerUnit: product.coverageSqmPerUnit ?? undefined,
                  brand: product.brand ?? undefined,
                  materialType: product.materialType ?? undefined,
                }} />
              ))}
            </div>
          ) : (
            <p className="text-sm text-ud-dark/60">{materialLoadFailed ? "Materials are temporarily unavailable. Please request a quote." : "A materials selection has not been published for this service yet. Please request a quote for a project-specific list."}</p>
          )}
        </div>
      </section>

      <ServiceEnquiry projectType={service.title} />
      <CTABanner />
    </>
  );
}

export const dynamic = "force-dynamic";
