import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import { and, eq } from "drizzle-orm";
import { ArrowRight } from "lucide-react";
import { db } from "@/lib/db";
import { services } from "@/lib/db/schema";
import SectionHero from "@/components/ui/SectionHero";
import CTABanner from "@/components/sections/CTABanner";
import { ServiceIntro, ServiceType, ServiceSection } from "@/components/services/ServicePrimitives";
import ServiceEnquiry from "@/components/services/ServiceEnquiry";
import { PackageProvider } from "@/components/services/package-context";
import PackageBuilder from "@/components/services/PackageBuilder";
import AddToPackageToggle from "@/components/services/AddToPackageToggle";
import { loadServicePackage, type ServicePackageData } from "@/lib/services/package-data";
import { expandPlanTypes, groupSubsections } from "@/lib/services/package-links";
import { formatKES } from "@/lib/services/package-math";
import type { SubsectionRow } from "@/lib/services/subsections-read";

/** A child sub-service (e.g. Bungalows) as a card: profile text, its house plans, Add to package. */
function ChildServiceCard({ child, serviceTitle, plans }: { child: SubsectionRow; serviceTitle: string; plans?: ServicePackageData["plansBySection"][string] }) {
  const [lead, ...rest] = child.body.split(/\n\s*\n/);
  return (
    <article id={child.sectionId} className="scroll-mt-36 flex flex-col rounded-[6px] border border-ud-dark/10 border-t-[3px] border-t-ud-burgundy bg-white p-6 shadow-sm">
      <h3 className="text-lg font-bold text-ud-dark">{child.title}</h3>
      <p className="mt-2 text-sm font-light leading-relaxed text-ud-dark/70">{lead}</p>
      {child.bullets.length > 0 && (
        <ul className="mt-3 space-y-1.5">
          {child.bullets.map((bullet) => (
            <li key={bullet} className="flex items-start gap-2 text-sm text-ud-dark/70">
              <span aria-hidden className="mt-2 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-ud-burgundy" />
              <span>{bullet}</span>
            </li>
          ))}
        </ul>
      )}
      {rest.map((paragraph, i) => <p key={i} className="mt-3 text-sm font-light leading-relaxed text-ud-dark/70">{paragraph}</p>)}

      {plans !== undefined && (
        <div className="mt-5 rounded-[4px] bg-ud-light-gray p-4">
          <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-ud-dark/50">House plans for {child.title}</p>
          {plans.length > 0 ? (
            <ul className="mt-2 divide-y divide-ud-dark/10">
              {plans.map((plan) => (
                <li key={plan.itemId} className="flex flex-wrap items-center justify-between gap-2 py-2.5">
                  <span className="min-w-0">
                    <Link href={plan.href} className="text-sm font-semibold text-ud-dark hover:text-ud-burgundy">{plan.name}</Link>
                    <span className="block text-xs text-ud-dark/50">from {formatKES(plan.fromKES)}</span>
                  </span>
                  <AddToPackageToggle itemId={plan.itemId} label={plan.name} compact />
                </li>
              ))}
            </ul>
          ) : (
            <p className="mt-2 text-sm text-ud-dark/60">
              No ready-made plan for this type yet.{" "}
              <Link href={`/request-a-quote?projectType=${encodeURIComponent(`${serviceTitle} — ${child.title}`)}`} className="font-semibold text-ud-burgundy hover:underline">Request a custom design</Link>
            </p>
          )}
        </div>
      )}

      <div className="mt-auto">
        <AddToPackageToggle itemId={`work:${child.id}`} label={child.title} />
      </div>
    </article>
  );
}

export async function generateMetadata({ params: paramsPromise }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const params = await paramsPromise;
  try {
    const [service] = await db.select({ title: services.title, description: services.description })
      .from(services)
      .where(and(eq(services.slug, params.slug), eq(services.published, true)))
      .limit(1);
    if (service) return { title: `${service.title} — Ujenzi Dhabiti`, description: service.description };
  } catch (err) {
    console.error("Service metadata load failed:", err);
  }
  return { title: "Service Not Found — Ujenzi Dhabiti" };
}

export default async function ServiceDetailPage({ params: paramsPromise }: { params: Promise<{ slug: string }> }) {
  const params = await paramsPromise;
  let data: ServicePackageData | null;
  try {
    data = await loadServicePackage(params.slug);
  } catch (err) {
    console.error("Service detail load failed:", err);
    return notFound();
  }
  if (!data) return notFound();

  const { service, subsections } = data;

  // Core catalogue services do not all have subsection rows yet. Keep their
  // dedicated pages useful by rendering the CMS description/includes instead
  // of returning a hero followed by an empty page.
  const sections: SubsectionRow[] = subsections.length > 0
    ? subsections
    : [{
        id: `${service.id}-overview`,
        serviceSlug: service.slug,
        sectionId: "overview",
        title: `${service.title} Services`,
        body: service.description,
        planType: null,
        parentSectionId: null,
        bullets: service.includes,
        labourRateKES: null,
        labourUnit: null,
        sortOrder: 0,
        createdAt: new Date(0),
        updatedAt: new Date(0),
      }];

  // Children (e.g. Bungalows under Residential) render as cards inside their parent.
  const grouped = groupSubsections(sections);
  const subnav = [{ label: "Build your package", href: "#package" }, ...grouped.map(({ row }) => ({ label: row.title, href: `#${row.sectionId}` }))];

  return (
    <PackageProvider
      config={{
        slug: service.slug,
        title: service.title,
        areaMode: data.areaMode,
        areaLabel: data.areaLabel,
        items: data.items,
        zones: data.zones,
        materialsAreSuggested: data.materialsAreSuggested,
      }}
    >
      <SectionHero title={service.title} subtitle={service.description} />

      <nav aria-label="Service pages" className="bg-white border-b border-ud-dark/10">
        <div className="max-w-content mx-auto px-6 flex gap-2 overflow-x-auto py-3">
          <Link href="/services" className="whitespace-nowrap rounded-[4px] px-3 py-2 text-sm font-semibold text-ud-dark/70 hover:text-ud-burgundy">All Services</Link>
          {data.allServices.map((row) => (
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

      {/* Sticky sub-nav */}
      <div className="sticky top-16 md:top-20 z-30 bg-ud-dark/95 backdrop-blur-sm border-b border-white/10">
        <div className="max-w-content mx-auto px-6 flex gap-1 overflow-x-auto">
          {subnav.map((item, index) => (
            <a
              key={item.href}
              href={item.href}
              className={`whitespace-nowrap text-xs md:text-sm font-semibold py-4 px-3 border-b-2 transition-colors ${index === 0 ? "text-white border-ud-burgundy" : "text-white/70 hover:text-white border-transparent hover:border-ud-burgundy"}`}
            >
              {item.label}
            </a>
          ))}
        </div>
      </div>

      <PackageBuilder />

      {grouped.map(({ row: sub, children }, idx) => (
        <ServiceSection key={sub.id} id={sub.sectionId} tone={idx % 2 === 0 ? "white" : "light"}>
          <ServiceIntro eyebrow={service.title} title={sub.title} paragraphs={[sub.body]} />
          <div className="grid grid-cols-1 gap-6 mt-8">
            <ServiceType
              title="Service Details & Key Highlights"
              bullets={sub.bullets}
              planType={children.length === 0 ? expandPlanTypes(sub.planType)[0] : undefined}
            />
          </div>
          {children.length === 0 ? (
            <AddToPackageToggle itemId={`work:${sub.id}`} label={sub.title} />
          ) : (
            <div className="mt-10 grid gap-5 md:grid-cols-2">
              {children.map((child) => (
                <ChildServiceCard key={child.id} child={child} serviceTitle={service.title} plans={data.plansBySection[child.sectionId]} />
              ))}
            </div>
          )}
        </ServiceSection>
      ))}

      {data.related.length > 0 && (
        <section aria-labelledby="related-heading" className="bg-white border-t border-ud-dark/10 py-14">
          <div className="max-w-content mx-auto px-6">
            <h2 id="related-heading" className="text-xl md:text-2xl font-bold text-ud-dark">Often combined with {service.title}</h2>
            <p className="mt-2 text-sm text-ud-dark/60">Each service has its own package builder. Request them together and we&apos;ll coordinate one project.</p>
            <ul className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {data.related.map((row) => (
                <li key={row.slug}>
                  <Link href={`/services/${row.slug}#package`} className="group flex h-full items-center justify-between gap-3 rounded-[6px] border border-ud-dark/10 bg-ud-light-gray/60 px-5 py-4 transition-colors hover:border-ud-burgundy/50 hover:bg-white">
                    <span className="text-sm font-bold text-ud-dark">{row.title}</span>
                    <ArrowRight size={16} aria-hidden className="text-ud-burgundy transition-transform duration-150 group-hover:translate-x-0.5" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}

      <ServiceEnquiry projectType={service.title} serviceOptions={data.allServices.map((row) => row.title)} />
      <CTABanner />
    </PackageProvider>
  );
}

export const dynamic = "force-dynamic";
