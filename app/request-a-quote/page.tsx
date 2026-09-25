import { Phone, Mail } from "lucide-react";
import SectionHero from "@/components/ui/SectionHero";
import ServiceRequestForm from "@/components/sections/ServiceRequestForm";
import { CONTACT_INFO } from "@/lib/constants";
import { getPublishedServiceTitles } from "@/lib/services/public-options";

export const metadata = {
  title: "Request a Quote — Ujenzi Dhabiti",
  description: "Tell us about your construction, civil works, or interior project and get a tailored quote from Ujenzi Dhabiti.",
};

export const dynamic = "force-dynamic";

export default async function RequestQuotePage({ searchParams }: { searchParams: { product?: string; projectType?: string } }) {
  const product = searchParams?.product;
  const defaultDescription = product ? `Bulk quote for: ${product}` : "";
  const serviceOptions = await getPublishedServiceTitles();

  return (
    <>
      <SectionHero
        title="Request a Quote"
        subtitle="Tell us about your project — building, civil works, interiors, or materials — and we'll prepare a tailored quote."
      />

      <section className="bg-ud-light-gray py-16 md:py-24">
        <div className="max-w-3xl mx-auto px-6">
          <ServiceRequestForm serviceOptions={serviceOptions} defaultService={searchParams?.projectType ?? ""} defaultDescription={defaultDescription} />

          {/* Prefer to talk instead */}
          <div className="mt-8 bg-white rounded-[4px] p-6 shadow-sm border border-ud-dark/8 text-center">
            <h4 className="text-sm font-bold text-ud-dark mb-3">Prefer to talk to us directly?</h4>
            <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-2">
              {CONTACT_INFO.phone.map((p) => (
                <a key={p} href={`tel:${p}`} className="flex items-center gap-2 text-sm text-ud-dark/70 hover:text-ud-burgundy transition-colors">
                  <Phone size={14} className="text-ud-burgundy" /> {p}
                </a>
              ))}
              <a href={`mailto:${CONTACT_INFO.emails.construction}`} className="flex items-center gap-2 text-sm text-ud-dark/70 hover:text-ud-burgundy transition-colors break-all">
                <Mail size={14} className="text-ud-burgundy" /> {CONTACT_INFO.emails.construction}
              </a>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
