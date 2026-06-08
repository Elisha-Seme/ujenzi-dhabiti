import QuoteForm from "@/components/sections/QuoteForm";

interface ServiceEnquiryProps {
  /** Pre-selected project type for this service page's quote form. */
  projectType?: string;
  title?: string;
  subtitle?: string;
}

// Service-enquiry block placed at the end of every service page (per the brief's
// request for a quote form "at the end of every service page").
export default function ServiceEnquiry({
  projectType,
  title = "Request a Service Quote",
  subtitle = "Tell us about your project and our team will prepare a tailored quote within 24 hours.",
}: ServiceEnquiryProps) {
  return (
    <section className="bg-ud-light-gray py-20 md:py-28">
      <div className="max-w-3xl mx-auto px-6">
        <div className="text-center mb-10">
          <h2 className="text-2xl md:text-3xl font-bold text-ud-dark mb-3">{title}</h2>
          <p className="text-sm md:text-base text-ud-dark/60 font-light max-w-xl mx-auto">{subtitle}</p>
        </div>
        <QuoteForm defaultProjectType={projectType} heading="Project Details" />
      </div>
    </section>
  );
}
