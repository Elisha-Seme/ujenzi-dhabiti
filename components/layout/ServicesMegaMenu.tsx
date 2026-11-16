"use client";

import { useCallback, useEffect, useId, useRef, useState, type KeyboardEvent, type PointerEvent as ReactPointerEvent } from "react";
import Link from "next/link";
import { AnimatePresence, motion, useReducedMotion, type Variants } from "motion/react";
import { ArrowRight, ChevronDown, ChevronRight, House, PackagePlus } from "lucide-react";
import { DUR, EASE_IN, EASE_OUT, STAGGER } from "@/lib/motion";
import ServiceIcon from "./ServiceIcon";
import { useServiceNavigation } from "./useServiceNavigation";

const CLOSE_DELAY_MS = 120;

// Desktop "Our Services" mega-menu: services on the left, a live preview of
// the hovered/focused service on the right (sub-services, plans, actions).
export default function ServicesMegaMenu({ pathname }: { pathname: string }) {
  const { services, loaded } = useServiceNavigation();
  const reduce = useReducedMotion() ?? false;
  const [open, setOpen] = useState(false);
  const [activeSlug, setActiveSlug] = useState<string | null>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const itemRefs = useRef<(HTMLAnchorElement | null)[]>([]);
  const closeTimer = useRef<number | null>(null);
  const focusFirstOnOpen = useRef(false);
  const panelId = useId();

  const currentSlug = pathname.startsWith("/services/") ? pathname.split("/")[2] : null;
  const active = services.find((s) => s.slug === activeSlug) ?? services.find((s) => s.slug === currentSlug) ?? services[0];

  const cancelClose = useCallback(() => {
    if (closeTimer.current !== null) {
      window.clearTimeout(closeTimer.current);
      closeTimer.current = null;
    }
  }, []);

  const close = useCallback((returnFocus = false) => {
    cancelClose();
    setOpen(false);
    setActiveSlug(null);
    if (returnFocus) triggerRef.current?.focus();
  }, [cancelClose]);

  useEffect(() => { close(); }, [pathname, close]);
  useEffect(() => cancelClose, [cancelClose]);

  // Keyboard open (ArrowDown on the trigger): move focus into the list once it renders.
  useEffect(() => {
    if (!open || !focusFirstOnOpen.current || services.length === 0) return;
    focusFirstOnOpen.current = false;
    const frame = window.requestAnimationFrame(() => itemRefs.current.find(Boolean)?.focus());
    return () => window.cancelAnimationFrame(frame);
  }, [open, services.length]);

  // Tap/click outside closes (touch devices never fire hover-out).
  useEffect(() => {
    if (!open) return;
    const onPointerDown = (event: PointerEvent) => {
      if (!wrapperRef.current?.contains(event.target as Node)) close();
    };
    document.addEventListener("pointerdown", onPointerDown);
    return () => document.removeEventListener("pointerdown", onPointerDown);
  }, [open, close]);

  const onPointerEnter = (event: ReactPointerEvent) => {
    if (event.pointerType !== "mouse") return;
    cancelClose();
    setOpen(true);
  };
  const onPointerLeave = (event: ReactPointerEvent) => {
    if (event.pointerType !== "mouse") return;
    cancelClose();
    closeTimer.current = window.setTimeout(() => close(), CLOSE_DELAY_MS);
  };

  const onKeyDown = (event: KeyboardEvent) => {
    if (event.key === "Escape" && open) {
      event.preventDefault();
      close(true);
      return;
    }
    if (event.key !== "ArrowDown" && event.key !== "ArrowUp") return;
    event.preventDefault();
    if (!open) {
      focusFirstOnOpen.current = true;
      setOpen(true);
      return;
    }
    const items = itemRefs.current.filter(Boolean) as HTMLAnchorElement[];
    if (items.length === 0) return;
    const index = items.indexOf(document.activeElement as HTMLAnchorElement);
    const next = event.key === "ArrowDown"
      ? (index + 1) % items.length
      : (index <= 0 ? items.length - 1 : index - 1);
    items[next]?.focus();
  };

  const list: Variants = {
    hidden: {},
    show: { transition: reduce ? {} : { staggerChildren: STAGGER, delayChildren: 0.04 } },
  };
  const row: Variants = {
    hidden: reduce ? { opacity: 0 } : { opacity: 0, x: -6 },
    show: { opacity: 1, x: 0, transition: { duration: DUR.standard, ease: EASE_OUT } },
  };

  const activeRoute = pathname.startsWith("/services");

  return (
    <div
      ref={wrapperRef}
      className="flex items-center gap-1"
      onPointerEnter={onPointerEnter}
      onPointerLeave={onPointerLeave}
      onKeyDown={onKeyDown}
      onBlur={(event) => { if (!event.currentTarget.contains(event.relatedTarget as Node | null)) close(); }}
    >
      <Link
        href="/services"
        aria-current={pathname === "/services" ? "page" : undefined}
        className={`text-[13px] font-semibold tracking-wide whitespace-nowrap transition-colors duration-200 ${activeRoute ? "text-ud-white border-b-2 border-ud-burgundy pb-0.5" : "text-white/80 hover:text-ud-white"}`}
      >
        Our Services
      </Link>
      <button
        ref={triggerRef}
        type="button"
        aria-label={open ? "Hide services menu" : "Show services menu"}
        aria-expanded={open}
        aria-controls={panelId}
        onClick={() => (open ? close() : setOpen(true))}
        className="p-1.5 -m-0.5 text-white/80 hover:text-white rounded-[4px] focus-visible:outline focus-visible:outline-2 focus-visible:outline-ud-burgundy"
      >
        <motion.span className="block" animate={{ rotate: open ? 180 : 0 }} transition={{ duration: reduce ? 0 : DUR.quick, ease: EASE_OUT }}>
          <ChevronDown size={15} />
        </motion.span>
      </button>

      <AnimatePresence>
        {open && (
          <div key="panel" className="fixed left-1/2 top-20 z-50 -translate-x-1/2" style={{ width: "min(820px, calc(100vw - 2rem))" }}>
            {/* Invisible bridge so the pointer can cross the header gap without closing the menu. */}
            <div aria-hidden className="absolute -top-8 left-0 right-0 h-8" />
            <motion.div
              id={panelId}
              role="region"
              aria-label="Our services"
              style={{ transformOrigin: "top center" }}
              initial={reduce ? { opacity: 0 } : { opacity: 0, y: 8, scale: 0.985 }}
              animate={{ opacity: 1, y: 0, scale: 1, transition: { duration: reduce ? DUR.quick : DUR.standard, ease: EASE_OUT } }}
              exit={reduce ? { opacity: 0, transition: { duration: DUR.quick } } : { opacity: 0, y: 4, scale: 0.99, transition: { duration: DUR.quick, ease: EASE_IN } }}
              className="relative mt-2 overflow-hidden rounded-[6px] border border-white/10 bg-[#16181c] shadow-[0_24px_60px_-12px_rgba(0,0,0,0.65)]"
            >
              {/* Ambient: a soft burgundy glow anchored to the preview side. */}
              <div aria-hidden className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full" style={{ background: "radial-gradient(circle, rgba(138,14,51,0.28), transparent 70%)" }} />

              <div className="relative grid grid-cols-[minmax(220px,260px)_1fr]">
                {/* Services list */}
                <div className="border-r border-white/[0.07] p-3">
                  <p className="px-3 pb-2 pt-1 text-[10px] font-bold uppercase tracking-[0.16em] text-white/40">Services</p>
                  {!loaded ? (
                    <ul aria-hidden className="space-y-1.5 px-1">
                      {Array.from({ length: 6 }, (_, i) => <li key={i} className="h-10 rounded-[4px] bg-white/[0.04]" />)}
                    </ul>
                  ) : services.length === 0 ? (
                    <p className="px-3 py-4 text-sm text-white/55">The service list is unavailable right now.</p>
                  ) : (
                    <motion.ul variants={list} initial="hidden" animate="show" className="space-y-0.5">
                      {services.map((service, index) => {
                        const isActive = active?.slug === service.slug;
                        return (
                          <motion.li key={service.slug} variants={row}>
                            <Link
                              ref={(el) => { itemRefs.current[index] = el; }}
                              href={`/services/${service.slug}`}
                              aria-current={currentSlug === service.slug ? "page" : undefined}
                              onPointerEnter={() => setActiveSlug(service.slug)}
                              onFocus={() => setActiveSlug(service.slug)}
                              onClick={() => close()}
                              className="relative flex items-center gap-3 rounded-[4px] px-3 py-2.5 outline-none focus-visible:ring-2 focus-visible:ring-ud-burgundy/70"
                            >
                              {isActive && (
                                <motion.span
                                  layoutId="services-menu-active"
                                  aria-hidden
                                  className="absolute inset-0 rounded-[4px] border-l-[3px] border-ud-burgundy bg-white/[0.06]"
                                  transition={{ duration: reduce ? 0 : DUR.standard, ease: EASE_OUT }}
                                />
                              )}
                              <span className={`relative flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-[4px] transition-colors duration-150 ${isActive ? "bg-ud-burgundy text-white" : "bg-white/[0.06] text-white/70"}`}>
                                <ServiceIcon name={service.iconName} size={16} />
                              </span>
                              <span className="relative min-w-0">
                                <span className={`block truncate text-sm font-semibold transition-colors duration-150 ${isActive ? "text-white" : "text-white/75"}`}>{service.title}</span>
                                <span className="block text-[11px] text-white/40">{service.subsectionCount > 0 ? `${service.subsectionCount} services` : "Overview"}</span>
                              </span>
                            </Link>
                          </motion.li>
                        );
                      })}
                    </motion.ul>
                  )}
                </div>

                {/* Preview of the active service (crossfades as you move down the list) */}
                <div className="grid min-h-[300px] p-6">
                  <AnimatePresence initial={false}>
                    {active && (
                      <motion.div
                        key={active.slug}
                        className="[grid-area:1/1] flex flex-col"
                        initial={{ opacity: 0, x: reduce ? 0 : 8 }}
                        animate={{ opacity: 1, x: 0, transition: { duration: DUR.standard, ease: EASE_OUT } }}
                        exit={{ opacity: 0, transition: { duration: DUR.quick, ease: EASE_IN } }}
                      >
                        <div className="flex items-start justify-between gap-4">
                          <div>
                            <h3 className="text-lg font-bold text-white">{active.title}</h3>
                            <p className="mt-1.5 max-w-md text-[13px] leading-relaxed text-white/55">{active.description}</p>
                          </div>
                          {active.hasPlans && (
                            <Link href="/shop/plans" onClick={() => close()} className="inline-flex flex-shrink-0 items-center gap-1.5 rounded-full border border-ud-burgundy/50 bg-ud-burgundy/15 px-2.5 py-1 text-[11px] font-semibold text-white/85 hover:bg-ud-burgundy/30">
                              <House size={12} aria-hidden /> House plans available
                            </Link>
                          )}
                        </div>

                        {active.subsections.length > 0 && (
                          <ul className="mt-5 grid grid-cols-2 gap-x-5 gap-y-1">
                            {active.subsections.map((sub) => (
                              <li key={sub.sectionId}>
                                <Link
                                  href={`/services/${active.slug}#${sub.sectionId}`}
                                  onClick={() => close()}
                                  className="group flex items-center gap-1.5 rounded-[4px] py-1.5 text-[13px] text-white/70 hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-ud-burgundy"
                                >
                                  <ChevronRight size={13} aria-hidden className="flex-shrink-0 text-ud-burgundy transition-transform duration-150 group-hover:translate-x-0.5" />
                                  <span className="truncate">{sub.title}</span>
                                </Link>
                              </li>
                            ))}
                          </ul>
                        )}
                        {active.subsectionCount > active.subsections.length && (
                          <Link href={`/services/${active.slug}`} onClick={() => close()} className="mt-2 self-start text-xs font-semibold text-white/45 hover:text-white">
                            + {active.subsectionCount - active.subsections.length} more
                          </Link>
                        )}

                        <div className="mt-auto pt-6">
                          <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-white/35">Build a package with</p>
                          <ul className="mt-2 flex flex-wrap gap-2">
                            {(active.packageParts ?? []).map((part) => (
                              <li key={part} className="rounded-full border border-white/10 bg-white/[0.04] px-2.5 py-1 text-[11px] font-medium text-white/65">{part}</li>
                            ))}
                          </ul>
                        </div>

                        <div className="flex flex-wrap gap-3 pt-4">
                          <Link
                            href={`/services/${active.slug}#package`}
                            onClick={() => close()}
                            className="inline-flex items-center gap-2 rounded-[4px] bg-ud-burgundy px-4 py-2.5 text-[13px] font-bold text-white transition-colors hover:bg-ud-burgundy-hover"
                          >
                            <PackagePlus size={15} aria-hidden /> Build your package
                          </Link>
                          <Link
                            href={`/services/${active.slug}`}
                            onClick={() => close()}
                            className="inline-flex items-center gap-2 rounded-[4px] border border-white/15 px-4 py-2.5 text-[13px] font-semibold text-white/80 transition-colors hover:border-white/35 hover:text-white"
                          >
                            View service <ArrowRight size={14} aria-hidden />
                          </Link>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>

              <div className="relative flex items-center justify-between gap-4 border-t border-white/[0.07] bg-black/20 px-6 py-3">
                <p className="text-xs text-white/40">Materials, labour and design — supplied and built under one roof.</p>
                <div className="flex items-center gap-5">
                  <Link href="/services" onClick={() => close()} className="text-xs font-semibold text-white/70 hover:text-white">All services</Link>
                  <Link href="/request-a-quote" onClick={() => close()} className="inline-flex items-center gap-1 text-xs font-semibold text-white hover:text-white/80">
                    Request a quote <ArrowRight size={12} aria-hidden />
                  </Link>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
