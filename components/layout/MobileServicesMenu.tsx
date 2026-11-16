"use client";

import { useState, type ReactNode } from "react";
import Link from "next/link";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { ChevronDown, PackagePlus } from "lucide-react";
import { DUR, EASE_IN, EASE_OUT } from "@/lib/motion";
import ServiceIcon from "./ServiceIcon";
import { useServiceNavigation } from "./useServiceNavigation";

function Collapse({ open, id, children }: { open: boolean; id: string; children: ReactNode }) {
  const reduce = useReducedMotion() ?? false;
  return (
    <AnimatePresence initial={false}>
      {open && (
        <motion.div
          id={id}
          key={id}
          className="overflow-hidden"
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: "auto", opacity: 1, transition: { duration: reduce ? 0 : DUR.standard, ease: EASE_OUT } }}
          exit={{ height: 0, opacity: 0, transition: { duration: reduce ? 0 : DUR.quick, ease: EASE_IN } }}
        >
          {children}
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function Chevron({ open }: { open: boolean }) {
  const reduce = useReducedMotion() ?? false;
  return (
    <motion.span className="block" animate={{ rotate: open ? 180 : 0 }} transition={{ duration: reduce ? 0 : DUR.quick, ease: EASE_OUT }}>
      <ChevronDown size={18} aria-hidden />
    </motion.span>
  );
}

// Drawer version of the Services menu: an accordion of services, each of
// which expands to its sub-services and a "Build your package" shortcut.
export default function MobileServicesMenu({ pathname, onNavigate }: { pathname: string; onNavigate: () => void }) {
  const { services, loaded } = useServiceNavigation();
  const [open, setOpen] = useState(false);
  const [expanded, setExpanded] = useState<string | null>(null);

  return (
    <div className="border-b border-white/10">
      <div className="flex items-center justify-between">
        <Link href="/services" onClick={onNavigate} className={`py-3 text-base font-semibold ${pathname.startsWith("/services") ? "text-white" : "text-white/70"}`}>
          Our Services
        </Link>
        <button
          type="button"
          aria-label={open ? "Hide services" : "Show services"}
          aria-expanded={open}
          aria-controls="mobile-service-menu"
          onClick={() => setOpen((value) => !value)}
          className="-mr-2 flex h-11 w-11 items-center justify-center text-white/80"
        >
          <Chevron open={open} />
        </button>
      </div>

      <Collapse open={open} id="mobile-service-menu">
        <div className="pb-3">
          {!loaded ? (
            <p className="py-2 text-sm text-white/50">Loading services…</p>
          ) : services.length === 0 ? (
            <p className="py-2 text-sm text-white/50">The service list is unavailable right now.</p>
          ) : (
            <ul className="space-y-0.5">
              {services.map((service) => {
                const isOpen = expanded === service.slug;
                const isCurrent = pathname === `/services/${service.slug}`;
                const panelId = `mobile-service-${service.slug}`;
                return (
                  <li key={service.slug} className="rounded-[4px] bg-white/[0.03]">
                    <div className="flex items-center">
                      <Link
                        href={`/services/${service.slug}`}
                        onClick={onNavigate}
                        aria-current={isCurrent ? "page" : undefined}
                        className={`flex min-h-11 flex-1 items-center gap-3 px-2 py-2 text-sm ${isCurrent ? "font-semibold text-white" : "text-white/75"}`}
                      >
                        <span className={`flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-[4px] ${isCurrent ? "bg-ud-burgundy text-white" : "bg-white/[0.06] text-white/70"}`}>
                          <ServiceIcon name={service.iconName} size={14} />
                        </span>
                        {service.title}
                      </Link>
                      {service.subsections.length > 0 && (
                        <button
                          type="button"
                          aria-label={isOpen ? `Hide ${service.title} services` : `Show ${service.title} services`}
                          aria-expanded={isOpen}
                          aria-controls={panelId}
                          onClick={() => setExpanded(isOpen ? null : service.slug)}
                          className="flex h-11 w-11 items-center justify-center text-white/60"
                        >
                          <Chevron open={isOpen} />
                        </button>
                      )}
                    </div>
                    <Collapse open={isOpen} id={panelId}>
                      <div className="border-l-2 border-ud-burgundy/60 ml-5 mb-2 pl-3">
                        {service.subsections.map((sub) => (
                          <Link
                            key={sub.sectionId}
                            href={`/services/${service.slug}#${sub.sectionId}`}
                            onClick={onNavigate}
                            className="block py-2 text-[13px] text-white/65 hover:text-white"
                          >
                            {sub.title}
                          </Link>
                        ))}
                        <Link
                          href={`/services/${service.slug}#package`}
                          onClick={onNavigate}
                          className="mt-1 inline-flex items-center gap-1.5 py-2 text-[13px] font-bold text-white"
                        >
                          <PackagePlus size={14} aria-hidden className="text-ud-burgundy" /> Build your package
                        </Link>
                      </div>
                    </Collapse>
                  </li>
                );
              })}
            </ul>
          )}
          <Link href="/services" onClick={onNavigate} className="mt-2 block py-2 text-sm font-semibold text-white">All services</Link>
        </div>
      </Collapse>
    </div>
  );
}
