"use client";

import { useRef, useState, type ReactNode } from "react";
import Link from "next/link";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { ChevronDown, PackagePlus } from "lucide-react";
import { DUR, EASE_IN, EASE_OUT } from "@/lib/motion";
import ServiceIcon from "./ServiceIcon";
import { useServiceNavigation } from "./useServiceNavigation";

function Collapse({ open, id, children, onOpened }: { open: boolean; id: string; children: ReactNode; onOpened?: (el: HTMLElement) => void }) {
  const reduce = useReducedMotion() ?? false;
  const ref = useRef<HTMLDivElement>(null);
  return (
    <AnimatePresence initial={false}>
      {open && (
        <motion.div
          ref={ref}
          id={id}
          key={id}
          className="overflow-hidden"
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: "auto", opacity: 1, transition: { duration: reduce ? 0 : DUR.standard, ease: EASE_OUT } }}
          exit={{ height: 0, opacity: 0, transition: { duration: reduce ? 0 : DUR.quick, ease: EASE_IN } }}
          onAnimationComplete={() => { if (open && ref.current) onOpened?.(ref.current); }}
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
  const [openGroup, setOpenGroup] = useState<string | null>(null);
  const reduce = useReducedMotion() ?? false;
  // After a section opens, bring it into view inside the scrolling drawer.
  const revealInDrawer = (el: HTMLElement) => el.scrollIntoView({ block: "nearest", behavior: reduce ? "auto" : "smooth" });

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
                      {(service.groups ?? []).length > 0 && (
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
                    <Collapse open={isOpen} id={panelId} onOpened={revealInDrawer}>
                      <div className="border-l-2 border-ud-burgundy/60 ml-5 mb-2 pl-3">
                        {/* Primary action first, so long lists never push it out of reach. */}
                        <Link
                          href={`/services/${service.slug}#package`}
                          onClick={onNavigate}
                          className="inline-flex items-center gap-1.5 py-2 text-[13px] font-bold text-white"
                        >
                          <PackagePlus size={14} aria-hidden className="text-ud-burgundy" /> Build your package
                          <span className="font-normal text-white/40">· {service.subsectionCount} items</span>
                        </Link>
                        {service.groups.filter((g) => g.children.length === 0).map((g) => (
                          <Link key={g.sectionId} href={`/services/${service.slug}#${g.sectionId}`} onClick={onNavigate} className="block py-2 text-[13px] text-white/65 hover:text-white">
                            {g.title}
                          </Link>
                        ))}
                        {service.groups.filter((g) => g.children.length > 0).map((g) => {
                          const groupKey = `${service.slug}/${g.sectionId}`;
                          const groupOpen = openGroup === groupKey;
                          const groupPanel = `mobile-group-${service.slug}-${g.sectionId}`;
                          return (
                            <div key={g.sectionId}>
                              <button
                                type="button"
                                aria-expanded={groupOpen}
                                aria-controls={groupPanel}
                                onClick={() => setOpenGroup(groupOpen ? null : groupKey)}
                                className="flex min-h-11 w-full items-center justify-between gap-2 py-2 text-left text-[13px] font-semibold text-white/80"
                              >
                                <span>{g.title} <span className="font-normal text-white/40">· {g.children.length}</span></span>
                                <Chevron open={groupOpen} />
                              </button>
                              <Collapse open={groupOpen} id={groupPanel} onOpened={revealInDrawer}>
                                <div className="mb-1 border-l border-white/15 pl-3">
                                  <Link href={`/services/${service.slug}#${g.sectionId}`} onClick={onNavigate} className="block py-1.5 text-[12px] font-semibold text-white/50 hover:text-white">
                                    Overview
                                  </Link>
                                  {g.children.map((c) => (
                                    <Link key={c.sectionId} href={`/services/${service.slug}#${c.sectionId}`} onClick={onNavigate} className="block py-1.5 text-[13px] text-white/65 hover:text-white">
                                      {c.title}
                                    </Link>
                                  ))}
                                </div>
                              </Collapse>
                            </div>
                          );
                        })}
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
