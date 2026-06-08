import Link from "next/link";
import { MapPin, Phone } from "lucide-react";
import {
  NAV_LINKS,
  CONTACT_INFO,
  EMAIL_DIRECTORY,
  SOCIAL_LINKS,
  SERVICE_PILLARS,
  whatsappLink,
} from "@/lib/constants";
import Logo from "@/components/layout/Logo";

function SocialIcon({ name }: { name: string }) {
  switch (name) {
    case "linkedin":
      return (
        <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
          <path d="M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6zM2 9h4v12H2z" />
          <circle cx="4" cy="4" r="2" />
        </svg>
      );
    case "facebook":
      return (
        <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
          <path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z" />
        </svg>
      );
    case "instagram":
      return (
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
          <path d="M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37z" />
          <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
        </svg>
      );
    case "twitter":
      return (
        <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.737-8.835L1.254 2.25H8.08l4.253 5.622 5.911-5.622zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
        </svg>
      );
    case "tiktok":
      return (
        <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
          <path d="M16.5 5.5a4.6 4.6 0 01-1-.1 4.7 4.7 0 01-2.8-2.6 4.5 4.5 0 01-.3-1.3H9.7v12.2a2.3 2.3 0 11-1.6-2.2V8.2a5.5 5.5 0 00-.7-.05A5.55 5.55 0 1013 13.7V8.6a7.3 7.3 0 003.5.9z" />
        </svg>
      );
    default:
      return null;
  }
}

export default function Footer() {
  return (
    <footer className="bg-ud-dark text-white">
      <div className="max-w-content mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand */}
          <div>
            <Link href="/" aria-label="Ujenzi Dhabiti Home" className="inline-block">
              <Logo variant="dark" className="h-11 w-auto" />
            </Link>
            <p className="mt-4 text-sm text-white/60 leading-relaxed max-w-xs">
              A construction and infrastructure company connecting Africa — a proud subsidiary of Ardhi Safi Limited.
            </p>
            <div className="mt-6">
              <h4 className="text-xs font-bold uppercase tracking-widest text-white/40 mb-3">Follow</h4>
              <div className="flex items-center gap-3">
                {SOCIAL_LINKS.map((social) => (
                  <a
                    key={social.label}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={social.label}
                    className="w-8 h-8 rounded-[4px] border border-white/20 flex items-center justify-center text-white/50 hover:text-white hover:border-white/60 hover:bg-ud-burgundy transition-colors duration-200"
                  >
                    <SocialIcon name={social.icon} />
                  </a>
                ))}
              </div>
            </div>
          </div>

          {/* Quick links */}
          <div>
            <h4 className="text-sm font-bold uppercase tracking-widest text-white/40 mb-5">Quick Links</h4>
            <ul className="space-y-2.5">
              {NAV_LINKS.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-sm text-white/70 hover:text-white transition-colors duration-200">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div>
            <h4 className="text-sm font-bold uppercase tracking-widest text-white/40 mb-5">Our Services</h4>
            <ul className="space-y-2.5">
              {SERVICE_PILLARS.map((service) => (
                <li key={service.label}>
                  <Link href={service.href} className="text-sm text-white/70 hover:text-white transition-colors duration-200">
                    {service.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-sm font-bold uppercase tracking-widest text-white/40 mb-5">Contact Us</h4>

            <div className="flex gap-3 mb-4">
              <MapPin size={16} className="flex-shrink-0 text-ud-burgundy mt-0.5" />
              <span className="text-sm text-white/60 leading-relaxed">
                {CONTACT_INFO.address}
              </span>
            </div>

            <div className="flex gap-3 mb-5">
              <Phone size={16} className="flex-shrink-0 text-ud-burgundy mt-0.5" />
              <span className="text-sm text-white/60 leading-relaxed">
                {CONTACT_INFO.phone.map((p, i) => (
                  <span key={p}>
                    <a href={`tel:${p}`} className="hover:text-white transition-colors">{p}</a>
                    {i < CONTACT_INFO.phone.length - 1 && <span className="text-white/30"> | </span>}
                  </span>
                ))}
              </span>
            </div>

            <div className="flex gap-3 mb-5">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" className="flex-shrink-0 text-ud-burgundy mt-0.5">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51l-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.247-.694.247-1.289.173-1.413-.074-.124-.272-.198-.57-.347M12.05 21.785h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.885-9.886 9.885" />
              </svg>
              <a href={whatsappLink()} target="_blank" rel="noopener noreferrer" className="text-sm text-white/60 hover:text-white transition-colors leading-relaxed">
                Chat on WhatsApp
              </a>
            </div>

            <ul className="space-y-2.5">
              {EMAIL_DIRECTORY.map((item) => (
                <li key={item.email}>
                  <span className="block text-[11px] uppercase tracking-wider text-white/35">{item.label}</span>
                  <a href={`mailto:${item.email}`} className="text-sm text-white/60 hover:text-white transition-colors break-all">
                    {item.email}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      <div className="bg-ud-burgundy">
        <div className="max-w-content mx-auto px-6 py-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <p className="text-xs text-white/80">© {new Date().getFullYear()} Ujenzi Dhabiti. All rights reserved.</p>
          <p className="text-xs text-white/60">{CONTACT_INFO.website}</p>
        </div>
      </div>
    </footer>
  );
}
