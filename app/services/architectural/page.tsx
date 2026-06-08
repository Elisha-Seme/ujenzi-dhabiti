import Link from "next/link";
import { PencilRuler } from "lucide-react";
import { db, architecturalServices } from "@/lib/db";
import { eq, asc, desc } from "drizzle-orm";
import SectionHero from "@/components/ui/SectionHero";
import CTABanner from "@/components/sections/CTABanner";
import ServiceEnquiry from "@/components/services/ServiceEnquiry";
import { CONTACT_INFO } from "@/lib/constants";

export const metadata = {
  title: "Architectural — Ujenzi Dhabiti",
  description: "Architectural design and consultancy services from Ujenzi Dhabiti.",
};

export const dynamic = "force-dynamic";

async function loadServices() {
  try {
    return await db
      .select()
      .from(architecturalServices)
      .where(eq(architecturalServices.published, true))
      .orderBy(asc(architecturalServices.sortOrder), desc(architecturalServices.createdAt));
  } catch {
    return [];
  }
}

export default async function ArchitecturalPage() {
  const services = await loadServices();

  return (
    <>
      <SectionHero
        title="Architectural"
        subtitle="Architectural design and consultancy — turning your vision into buildable, permit-ready plans."
      />

      {services.length === 0 ? (
        <section className="bg-ud-white py-24 md:py-32">
          <div className="max-w-content mx-auto px-6 text-center">
            <div className="w-16 h-16 rounded-[4px] bg-ud-burgundy/10 flex items-center justify-center mx-auto mb-6">
              <PencilRuler className="w-7 h-7 text-ud-burgundy" strokeWidth={1.5} />
            </div>
            <h2 className="text-2xl md:text-3xl font-bold text-ud-dark mb-3">Architectural Services — Details Coming Soon</h2>
            <p className="text-ud-dark/60 font-light leading-relaxed max-w-xl mx-auto mb-8">
              We&apos;re finalizing the details of our architectural design and consultancy offering. In the meantime, reach our architectural team directly for design enquiries, concept development, and plan preparation.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <a href={`mailto:${CONTACT_INFO.emails.architectural}`} className="inline-block bg-ud-burgundy text-white text-sm font-bold px-6 py-3 rounded-[4px] hover:bg-ud-burgundy-hover transition-colors">
                Email Our Architects
              </a>
              <Link href="/request-a-quote" className="inline-block border border-ud-burgundy text-ud-burgundy text-sm font-bold px-6 py-3 rounded-[4px] hover:bg-ud-burgundy hover:text-white transition-colors">
                Request a Quote
              </Link>
            </div>
          </div>
        </section>
      ) : (
        <section className="bg-ud-white py-20 md:py-28">
          <div className="max-w-content mx-auto px-6 space-y-16">
            {services.map((s, i) => (
              <div key={s.id} className={`grid md:grid-cols-2 gap-8 md:gap-12 items-center ${i % 2 === 1 ? "md:[&>*:first-child]:order-2" : ""}`}>
                {s.image ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={s.image} alt={s.title} className="rounded-[4px] w-full h-64 md:h-80 object-cover shadow-sm" />
                ) : (
                  <div className="rounded-[4px] w-full h-64 md:h-80 bg-ud-light-gray flex items-center justify-center">
                    <PencilRuler className="w-10 h-10 text-ud-dark/20" />
                  </div>
                )}
                <div>
                  <h2 className="text-2xl md:text-3xl font-bold text-ud-dark mb-3">{s.title}</h2>
                  {s.summary && <p className="text-ud-burgundy font-semibold mb-4">{s.summary}</p>}
                  <div className="text-ud-dark/70 font-light leading-relaxed whitespace-pre-line">{s.body}</div>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      <ServiceEnquiry projectType="Architectural Design & Consultancy" title="Start an Architectural Enquiry" />
      <CTABanner />
    </>
  );
}
