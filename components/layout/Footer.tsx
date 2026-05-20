import Link from "next/link";
import Image from "next/image";
import { MapPin, Phone, Mail } from "lucide-react";
import { NAV_LINKS, CONTACT_INFO, SERVICES } from "@/lib/constants";

function LinkedInIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
      <path d="M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6zM2 9h4v12H2z"/>
      <circle cx="4" cy="4" r="2"/>
    </svg>
  );
}

function XIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.737-8.835L1.254 2.25H8.08l4.253 5.622 5.911-5.622zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
    </svg>
  );
}

function FacebookIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
      <path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z"/>
    </svg>
  );
}

export default function Footer() {
  return (
    <footer className="bg-ud-dark text-white">
      <div className="max-w-content mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand */}
          <div>
            <Link href="/">
              <Image src="/logo-horizontal-dark.jpg" alt="Ujenzi Dhabiti" width={200} height={67} className="h-12 w-auto object-contain" />
            </Link>
            <p className="mt-4 text-sm text-white/60 leading-relaxed max-w-xs">
              Infrastructure development company based in Nairobi, Kenya — connecting Africa through quality construction and reliable logistics.
            </p>
            <div className="flex items-center gap-4 mt-6">
              {[
                { label: "LinkedIn", icon: <LinkedInIcon /> },
                { label: "Twitter/X", icon: <XIcon /> },
                { label: "Facebook", icon: <FacebookIcon /> },
              ].map((social) => (
                <a
                  key={social.label}
                  href="#"
                  aria-label={social.label}
                  className="w-8 h-8 rounded-[4px] border border-white/20 flex items-center justify-center text-white/50 hover:text-white hover:border-white/60 transition-colors duration-200"
                >
                  {social.icon}
                </a>
              ))}
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
              {SERVICES.map((service) => (
                <li key={service.id}>
                  <Link href="/services" className="text-sm text-white/70 hover:text-white transition-colors duration-200">
                    {service.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-sm font-bold uppercase tracking-widest text-white/40 mb-5">Contact</h4>
            <ul className="space-y-3">
              <li className="flex gap-3">
                <MapPin size={16} className="flex-shrink-0 text-ud-burgundy mt-0.5" />
                <span className="text-sm text-white/60 leading-relaxed">
                  {CONTACT_INFO.address}<br />{CONTACT_INFO.poBox}
                </span>
              </li>
              {CONTACT_INFO.phone.map((p) => (
                <li key={p} className="flex gap-3">
                  <Phone size={16} className="flex-shrink-0 text-ud-burgundy" />
                  <a href={`tel:${p}`} className="text-sm text-white/60 hover:text-white transition-colors">{p}</a>
                </li>
              ))}
              <li className="flex gap-3">
                <Mail size={16} className="flex-shrink-0 text-ud-burgundy" />
                <a href={`mailto:${CONTACT_INFO.email}`} className="text-sm text-white/60 hover:text-white transition-colors break-all">
                  {CONTACT_INFO.email}
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <div className="bg-ud-burgundy">
        <div className="max-w-content mx-auto px-6 py-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <div className="flex items-center gap-3">
            <Image src="/logo-stacked-dark.jpg" alt="Ujenzi Dhabiti" width={32} height={32} className="h-8 w-8 object-contain rounded-sm" />
            <p className="text-xs text-white/80">© 2025 Ujenzi Dhabiti. All rights reserved.</p>
          </div>
          <p className="text-xs text-white/60">{CONTACT_INFO.website}</p>
        </div>
      </div>
    </footer>
  );
}
