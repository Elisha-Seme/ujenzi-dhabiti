import SectionHero from "@/components/ui/SectionHero";
import { SERVICES } from "@/lib/constants";
import CTABanner from "@/components/sections/CTABanner";

export default function ServicesPage() {
  return (
    <>
      <SectionHero
        title="Our Services"
        subtitle="End-to-end infrastructure development across Africa — from concept to commissioning."
      />

      <section className="bg-ud-white py-20 md:py-28">
        <div className="max-w-content mx-auto px-6">
          <div className="space-y-12">
            {SERVICES.map((service, i) => (
              <div
                key={service.id}
                className={`grid md:grid-cols-2 gap-10 items-start pb-12 ${
                  i < SERVICES.length - 1 ? "border-b border-ud-dark/10" : ""
                }`}
              >
                <div>
                  <div className="flex items-start gap-4 mb-5">
                    <span className="text-3xl sm:text-4xl flex-shrink-0 mt-1">{service.icon}</span>
                    <div className="min-w-0">
                      <div className="text-xs font-bold uppercase tracking-[0.2em] text-ud-burgundy mb-1">
                        0{service.id}
                      </div>
                      <h2 className="text-xl sm:text-2xl font-bold text-ud-dark">{service.title}</h2>
                    </div>
                  </div>
                  <p className="text-ud-dark/60 font-light leading-relaxed text-lg">
                    {service.description}
                  </p>
                </div>
                <div>
                  <div className="text-xs font-bold uppercase tracking-[0.2em] text-ud-dark/40 mb-4">
                    What&apos;s Included
                  </div>
                  <ul className="space-y-3">
                    {service.bullets.map((bullet) => (
                      <li key={bullet} className="flex items-start gap-3">
                        <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-ud-burgundy flex-shrink-0" />
                        <span className="text-sm text-ud-dark/70">{bullet}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <CTABanner />
    </>
  );
}
