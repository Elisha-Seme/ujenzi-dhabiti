import { MapPin, Phone, Mail, Clock } from "lucide-react";
import SectionHero from "@/components/ui/SectionHero";
import ContactForm from "@/components/sections/ContactForm";
import { CONTACT_INFO, EMAIL_DIRECTORY } from "@/lib/constants";

const CONTACT_ITEMS = [
  {
    icon: <MapPin size={16} className="text-ud-burgundy" />,
    label: "Location",
    content: (
      <p className="text-sm text-ud-dark/70 leading-relaxed">
        {CONTACT_INFO.address}
      </p>
    ),
  },
  {
    icon: <Mail size={16} className="text-ud-burgundy" />,
    label: "Emails",
    content: (
      <ul className="space-y-2">
        {EMAIL_DIRECTORY.map((item) => (
          <li key={item.email}>
            <span className="block text-[11px] uppercase tracking-wider text-ud-dark/40">{item.label}</span>
            <a href={`mailto:${item.email}`} className="text-sm text-ud-dark/70 hover:text-ud-burgundy transition-colors break-all">
              {item.email}
            </a>
          </li>
        ))}
      </ul>
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
                {/* Red pin on Manga House, Kiambere Rd, Upper Hill */}
                <div className="rounded-[4px] overflow-hidden border-2 border-ud-burgundy h-72 shadow-sm">
                  <iframe
                    src="https://maps.google.com/maps?q=Manga+House,+Kiambere+Road,+Upper+Hill,+Nairobi,+Kenya&output=embed&z=17&markers=color:red%7CManga+House,+Kiambere+Road,+Upper+Hill,+Nairobi"
                    width="100%"
                    height="100%"
                    style={{ border: 0 }}
                    allowFullScreen
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    title="Ujenzi Dhabiti — B2-06, Manga House, Kiambere Rd, Upper Hill, Nairobi"
                  />
                </div>
                <p className="text-xs text-ud-dark/50 mt-2 flex items-center gap-1">
                  <span className="inline-block w-2 h-2 rounded-full bg-ud-burgundy flex-shrink-0" />
                  B2-06, Manga House, Kiambere Rd, Upper Hill, Nairobi
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
