import ServiceRequestForm from "@/components/sections/ServiceRequestForm";

interface ServiceEnquiryProps {
  serviceOptions?: string[];
  /** Pre-selected service/project type for this service page's request form. */
  projectType?: string;
  title?: string;
  subtitle?: string;
}

// Service-enquiry block placed at the end of every service page (per the brief's
// request for the service-form format "at the end of every page of a service we
// provide"). Uses the shared sectioned Service Request Form.
export default function ServiceEnquiry({
  serviceOptions = [],
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
        <ServiceRequestForm serviceOptions={serviceOptions} defaultService={projectType} />
      </div>
    </section>
  );
}
