import Link from "next/link";
import { FileText, Phone, Mail } from "lucide-react";
import SectionHero from "@/components/ui/SectionHero";
import QuoteForm from "@/components/sections/QuoteForm";
import { CONTACT_INFO } from "@/lib/constants";

export const metadata = {
  title: "Request a Quote — Ujenzi Dhabiti",
  description: "Tell us about your construction, civil works, or interior project and get a tailored quote from Ujenzi Dhabiti.",
};

export default function RequestQuotePage() {
  return (
    <>
      <SectionHero
        title="Request a Quote"
        subtitle="Tell us about your project — building, civil works, interiors, or architectural — and we'll prepare a tailored quote."
      />

      <section className="bg-ud-light-gray py-20 md:py-28">
        <div className="max-w-content mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-10 md:gap-16">
            <QuoteForm />

            <div className="space-y-8">
              <div>
                <div className="w-11 h-11 rounded-[4px] bg-ud-burgundy/10 flex items-center justify-center mb-4">
                  <FileText className="w-5 h-5 text-ud-burgundy" strokeWidth={1.75} />
                </div>
                <h3 className="text-xl font-bold text-ud-dark mb-3">How Quoting Works</h3>
                <ol className="space-y-3 text-sm text-ud-dark/70 leading-relaxed list-decimal list-inside">
                  <li>Share your project details using the form — include location, scope, and timeline.</li>
                  <li>Our team reviews your requirements and may arrange a site assessment.</li>
                  <li>You receive a clear, itemized quote with no hidden costs.</li>
                </ol>
              </div>

              <div className="bg-white rounded-[4px] p-6 shadow-sm">
                <h4 className="text-sm font-bold text-ud-dark mb-4">Prefer to talk to us directly?</h4>
                <ul className="space-y-3">
                  {CONTACT_INFO.phone.map((p) => (
                    <li key={p} className="flex items-center gap-3">
                      <Phone size={15} className="text-ud-burgundy flex-shrink-0" />
                      <a href={`tel:${p}`} className="text-sm text-ud-dark/70 hover:text-ud-burgundy transition-colors">{p}</a>
                    </li>
                  ))}
                  <li className="flex items-center gap-3">
                    <Mail size={15} className="text-ud-burgundy flex-shrink-0" />
                    <a href={`mailto:${CONTACT_INFO.emails.construction}`} className="text-sm text-ud-dark/70 hover:text-ud-burgundy transition-colors break-all">
                      {CONTACT_INFO.emails.construction}
                    </a>
                  </li>
                </ul>
                <Link href="/contact" className="inline-block mt-5 text-xs font-semibold text-ud-burgundy hover:underline">
                  See all contact options →
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
