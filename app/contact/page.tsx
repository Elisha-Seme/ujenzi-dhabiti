import { MapPin, Phone, Mail, Clock } from "lucide-react";
import SectionHero from "@/components/ui/SectionHero";
import ContactForm from "@/components/sections/ContactForm";
import { CONTACT_INFO } from "@/lib/constants";

const CONTACT_ITEMS = [
  {
    icon: <MapPin size={16} className="text-ud-burgundy" />,
    label: "Address",
    content: (
      <p className="text-sm text-ud-dark/70 leading-relaxed">
        {CONTACT_INFO.address}<br />{CONTACT_INFO.poBox}
      </p>
    ),
  },
  {
    icon: <Mail size={16} className="text-ud-burgundy" />,
    label: "Email",
    content: (
      <a href={`mailto:${CONTACT_INFO.email}`} className="text-sm text-ud-dark/70 hover:text-ud-burgundy transition-colors break-all">
        {CONTACT_INFO.email}
      </a>
    ),
  },
  {
    icon: <Clock size={16} className="text-ud-burgundy" />,
    label: "Office Hours",
    content: (
      <p className="text-sm text-ud-dark/70 leading-relaxed">
        Mon – Fri: 8:00 AM – 6:00 PM<br />Sat: 9:00 AM – 1:00 PM
      </p>
    ),
  },
];

export default function ContactPage() {
  return (
    <>
      <SectionHero title="Get In Touch" subtitle="Tell us about your project. We will get back to you within 24 hours." />

      <section className="bg-ud-light-gray py-20 md:py-28">
        <div className="max-w-content mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-10 md:gap-16">
            <ContactForm />

            <div className="space-y-8">
              <div>
                <h3 className="text-xl font-bold text-ud-dark mb-6">Contact Details</h3>
                <ul className="space-y-5">
                  {CONTACT_INFO.phone.map((p) => (
                    <li key={p} className="flex gap-4">
                      <div className="w-10 h-10 rounded-[4px] bg-ud-burgundy/10 flex items-center justify-center flex-shrink-0">
                        <Phone size={16} className="text-ud-burgundy" />
                      </div>
                      <div>
                        <div className="text-xs font-bold uppercase tracking-wider text-ud-dark/40 mb-1">Phone</div>
                        <a href={`tel:${p}`} className="text-sm text-ud-dark/70 hover:text-ud-burgundy transition-colors">{p}</a>
                      </div>
                    </li>
                  ))}
                  {CONTACT_ITEMS.map((item) => (
                    <li key={item.label} className="flex gap-4">
                      <div className="w-10 h-10 rounded-[4px] bg-ud-burgundy/10 flex items-center justify-center flex-shrink-0">
                        {item.icon}
                      </div>
                      <div>
                        <div className="text-xs font-bold uppercase tracking-wider text-ud-dark/40 mb-1">{item.label}</div>
                        {item.content}
                      </div>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h3 className="text-base font-bold text-ud-dark mb-4">Find Us</h3>
                <div className="rounded-[4px] overflow-hidden border border-ud-dark/10 h-64">
                  <iframe
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3988.8188853895!2d36.81!3d-1.29!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x182f10d664e3b6cb%3A0xb75ff78e5d0f4f6b!2sUpperhill%2C%20Nairobi!5e0!3m2!1sen!2ske!4v1700000000000!5m2!1sen!2ske"
                    width="100%"
                    height="100%"
                    style={{ border: 0 }}
                    allowFullScreen
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    title="Ujenzi Dhabiti Office Location"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
