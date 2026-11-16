"use client";

import { useEffect, useState, type FormEvent } from "react";
import Link from "next/link";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { CheckCircle2, ClipboardList, Loader2, Send, ShoppingCart, X } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { DUR, EASE_IN, EASE_OUT } from "@/lib/motion";
import { formatKES, formatQuoteMessage, lineTotal, totalIsUnconfirmed, type PackageGroup, type PackageTotals } from "@/lib/services/package-math";

/** The indicative total, or "To be confirmed" while nothing selected has a price. */
function TotalAmount({ totals, className, live = false }: { totals: PackageTotals; className: string; live?: boolean }) {
  if (totalIsUnconfirmed(totals)) return <span className={className} aria-live={live ? "polite" : undefined}>To be confirmed</span>;
  return <AnimatedAmount value={totals.total} live={live} className={className} />;
}
import { usePackage } from "./package-context";
import { AnimatedAmount } from "./package-ui";

const GROUP_LABEL: Record<PackageGroup, string> = {
  work: "Work items",
  design: "Design & plans",
  materials: "Materials",
  delivery: "Delivery",
};

type SendState = { status: "idle" | "sending" | "sent" } | { status: "error"; message: string };

function QuoteForm({ onCancel }: { onCancel: () => void }) {
  const pkg = usePackage();
  const [form, setForm] = useState({ name: "", email: "", phone: "", notes: "", consent: false });
  const [state, setState] = useState<SendState>({ status: "idle" });

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    if (!form.consent) {
      setState({ status: "error", message: "Please confirm we may contact you about this quote." });
      return;
    }
    setState({ status: "sending" });
    const message = formatQuoteMessage({
      serviceTitle: pkg.title,
      areaSqm: pkg.areaSqm,
      areaLabel: pkg.areaLabel,
      county: pkg.county,
      items: pkg.items,
      selection: pkg.selection,
      deliveryFeeKES: pkg.zone?.feeKES ?? null,
      notes: form.notes,
    });
    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: form.name, email: form.email, phone: form.phone, subject: `Package quote — ${pkg.title}`, message }),
      });
      const data = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(typeof data.error === "string" ? data.error : "We couldn't send your request. Please try again.");
      setState({ status: "sent" });
    } catch (err) {
      setState({ status: "error", message: err instanceof Error ? err.message : "We couldn't send your request. Please try again." });
    }
  };

  if (state.status === "sent") {
    return (
      <div role="status" className="rounded-[4px] border border-emerald-400/30 bg-emerald-400/10 p-4 text-sm text-white">
        <p className="flex items-center gap-2 font-bold"><CheckCircle2 size={16} aria-hidden className="text-emerald-300" /> Quote request sent</p>
        <p className="mt-1 text-white/70">Thank you, {form.name.split(" ")[0] || "there"}. Our team will review your package and get back to you within 24 hours.</p>
      </div>
    );
  }

  const field = "w-full rounded-[4px] border border-white/15 bg-white/[0.06] px-3 py-2.5 text-sm text-white placeholder:text-white/35 outline-none focus:border-ud-burgundy focus:bg-white/[0.09]";
  return (
    <form onSubmit={submit} className="space-y-3" noValidate>
      <div>
        <label htmlFor="pkg-name" className="mb-1 block text-xs font-semibold text-white/70">Full name *</label>
        <input id="pkg-name" required autoComplete="name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className={field} />
      </div>
      <div>
        <label htmlFor="pkg-email" className="mb-1 block text-xs font-semibold text-white/70">Email *</label>
        <input id="pkg-email" type="email" required autoComplete="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className={field} />
      </div>
      <div>
        <label htmlFor="pkg-phone" className="mb-1 block text-xs font-semibold text-white/70">Phone</label>
        <input id="pkg-phone" type="tel" autoComplete="tel" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} className={field} />
      </div>
      <div>
        <label htmlFor="pkg-notes" className="mb-1 block text-xs font-semibold text-white/70">Notes for our team</label>
        <textarea id="pkg-notes" rows={3} value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} className={`${field} resize-none`} placeholder="Site location, timeline, anything we should know" />
      </div>
      <label className="flex items-start gap-2.5 text-xs text-white/70">
        <input type="checkbox" checked={form.consent} onChange={(e) => setForm({ ...form, consent: e.target.checked })} className="mt-0.5 h-4 w-4 accent-[#8a0e33]" />
        I agree to be contacted by Ujenzi Dhabiti about this quote. *
      </label>
      {state.status === "error" && <p role="alert" className="text-xs font-semibold text-red-300">{state.message}</p>}
      <div className="flex gap-2 pt-1">
        <button type="submit" disabled={state.status === "sending"} className="inline-flex flex-1 items-center justify-center gap-2 rounded-[4px] bg-ud-burgundy px-4 py-3 text-sm font-bold text-white transition-colors hover:bg-ud-burgundy-hover disabled:opacity-60">
          {state.status === "sending" ? <Loader2 size={15} className="animate-spin" aria-hidden /> : <Send size={15} aria-hidden />}
          {state.status === "sending" ? "Sending…" : "Send request"}
        </button>
        <button type="button" onClick={onCancel} className="rounded-[4px] border border-white/15 px-4 py-3 text-sm font-semibold text-white/75 hover:border-white/35 hover:text-white">Back</button>
      </div>
    </form>
  );
}

/** Totals + actions. Used in the desktop sticky card and the mobile sheet. */
export function SummaryContent() {
  const pkg = usePackage();
  const { addItem } = useCart();
  const reduce = useReducedMotion() ?? false;
  const [quoting, setQuoting] = useState(false);
  const [addedCount, setAddedCount] = useState<number | null>(null);
  const { totals } = pkg;

  const cartLines = pkg.items.filter((item) => pkg.selection[item.id] && (item.kind === "material" || item.kind === "plan") && item.cart);
  const groupsShown = (["work", "design", "materials"] as PackageGroup[]).filter((group) => pkg.items.some((item) => item.group === group && pkg.selection[item.id]));

  useEffect(() => { setAddedCount(null); }, [pkg.selection]);

  const addToCart = () => {
    for (const item of cartLines) {
      const sel = pkg.selection[item.id];
      const price = lineTotal(item, { ...sel, qty: 1 });
      if (!item.cart || price === null) continue;
      if (item.kind === "plan") {
        const mode = sel.mode === "print" ? "print" : "digital";
        addItem({ productId: item.cart.productId, kind: "plan", name: item.cart.name, unit: mode === "digital" ? "digital download" : "printed copy", priceKES: price, image: item.cart.image, sellerId: "", sellerName: "Ujenzi Dhabiti", deliveryMode: mode });
      } else {
        addItem({ productId: item.cart.productId, kind: "material", name: item.cart.name, unit: item.cart.unit, priceKES: item.rateKES ?? 0, image: item.cart.image, sellerId: "", sellerName: "Ujenzi Dhabiti" }, sel.qty);
      }
    }
    setAddedCount(cartLines.length);
  };

  return (
    <div className="text-white">
      <div className="flex items-baseline justify-between gap-3">
        <h3 className="text-base font-bold">Your package</h3>
        <span className="text-xs text-white/50">{totals.selectedCount} {totals.selectedCount === 1 ? "item" : "items"}</span>
      </div>

      {totals.selectedCount === 0 ? (
        <p className="mt-4 text-sm leading-relaxed text-white/55">Tick the work, plans and materials you need. Your indicative total builds up here.</p>
      ) : (
        <dl className="mt-4 space-y-2 text-sm">
          {groupsShown.map((group) => (
            <div key={group} className="flex items-center justify-between gap-3">
              <dt className="text-white/65">{GROUP_LABEL[group]}</dt>
              <dd>
                {totals.pricedCount[group] > 0
                  ? <AnimatedAmount value={totals.byGroup[group]} className="font-semibold" />
                  : <span className="text-xs text-white/55">Site visit</span>}
              </dd>
            </div>
          ))}
          {totals.physicalSelected && pkg.items.some((item) => item.kind === "delivery") && (
            <div className="flex items-center justify-between gap-3">
              <dt className="text-white/65">Delivery{pkg.county ? ` · ${pkg.county}` : ""}</dt>
              <dd className="text-right">
                {pkg.zone ? (
                  <span className="font-semibold">{formatKES(pkg.zone.feeKES)}{!pkg.zone.isConfigured && <span className="ml-1 text-[11px] font-normal text-white/45">(estimate)</span>}</span>
                ) : (
                  <span className="text-xs text-white/50">Choose your county</span>
                )}
              </dd>
            </div>
          )}
        </dl>
      )}

      <div className="mt-4 border-t border-white/10 pt-4">
        <div className="flex items-end justify-between gap-3">
          <span className="text-xs font-bold uppercase tracking-[0.14em] text-white/50">Indicative total</span>
          <TotalAmount totals={totals} live className={totalIsUnconfirmed(totals) ? "text-base font-bold" : "text-2xl font-bold"} />
        </div>
        {totals.unpricedCount > 0 && (
          <p className="mt-2 text-xs text-white/55">
            + {totals.unpricedCount} {totals.unpricedCount === 1 ? "item" : "items"} priced after site visit
          </p>
        )}
      </div>

      <div className="mt-5">
        <AnimatePresence mode="wait" initial={false}>
          {quoting ? (
            <motion.div key="form" initial={{ opacity: 0, y: reduce ? 0 : 6 }} animate={{ opacity: 1, y: 0, transition: { duration: DUR.standard, ease: EASE_OUT } }} exit={{ opacity: 0, transition: { duration: DUR.quick, ease: EASE_IN } }}>
              <QuoteForm onCancel={() => setQuoting(false)} />
            </motion.div>
          ) : (
            <motion.div key="actions" className="space-y-2.5" initial={{ opacity: 0 }} animate={{ opacity: 1, transition: { duration: DUR.quick } }} exit={{ opacity: 0, transition: { duration: 0.1 } }}>
              <button
                type="button"
                disabled={totals.selectedCount === 0}
                onClick={() => setQuoting(true)}
                className="flex w-full items-center justify-center gap-2 rounded-[4px] bg-ud-burgundy px-4 py-3 text-sm font-bold text-white transition-colors hover:bg-ud-burgundy-hover disabled:cursor-not-allowed disabled:opacity-40"
              >
                <ClipboardList size={16} aria-hidden /> Send as quote request
              </button>
              <button
                type="button"
                disabled={cartLines.length === 0}
                onClick={addToCart}
                className="flex w-full items-center justify-center gap-2 rounded-[4px] border border-white/20 px-4 py-3 text-sm font-semibold text-white/85 transition-colors hover:border-white/40 hover:text-white disabled:cursor-not-allowed disabled:opacity-40"
              >
                <ShoppingCart size={16} aria-hidden /> Add materials &amp; plans to cart
              </button>
              {addedCount !== null && (
                <p role="status" className="flex items-center justify-between gap-2 text-xs text-emerald-300">
                  <span className="flex items-center gap-1.5"><CheckCircle2 size={13} aria-hidden /> {addedCount} {addedCount === 1 ? "line" : "lines"} added to your cart</span>
                  <Link href="/shop/checkout" className="font-semibold text-white underline-offset-2 hover:underline">Checkout</Link>
                </p>
              )}
              {totals.selectedCount > 0 && (
                <button type="button" onClick={pkg.clear} className="w-full pt-1 text-center text-xs font-semibold text-white/45 hover:text-white/80">Clear selection</button>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <p className="mt-4 text-[11px] leading-relaxed text-white/40">
        Indicative only. Labour, quantities and delivery are confirmed after a site assessment. Cart checkout covers materials and plans; labour is quoted separately.
      </p>
    </div>
  );
}

/** Mobile: sticky total bar that opens the summary as a bottom sheet. */
export function MobileSummaryBar() {
  const { totals } = usePackage();
  const reduce = useReducedMotion() ?? false;
  const [open, setOpen] = useState(false);
  const barVisible = totals.selectedCount > 0 && !open;

  // Lets the floating WhatsApp button lift itself above the bar instead of covering it.
  useEffect(() => {
    if (!barVisible) return;
    document.documentElement.dataset.packageBar = "on";
    return () => { delete document.documentElement.dataset.packageBar; };
  }, [barVisible]);

  useEffect(() => {
    if (!open) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (event: KeyboardEvent) => { if (event.key === "Escape") setOpen(false); };
    window.addEventListener("keydown", onKey);
    return () => { document.body.style.overflow = previous; window.removeEventListener("keydown", onKey); };
  }, [open]);

  return (
    <>
      <AnimatePresence>
        {barVisible && (
          <motion.div
            key="bar"
            initial={{ y: reduce ? 0 : 80, opacity: 0 }}
            animate={{ y: 0, opacity: 1, transition: { duration: DUR.standard, ease: EASE_OUT } }}
            exit={{ y: reduce ? 0 : 80, opacity: 0, transition: { duration: DUR.quick, ease: EASE_IN } }}
            className="fixed inset-x-0 bottom-0 z-40 border-t border-white/10 bg-ud-dark/95 px-4 pb-[calc(env(safe-area-inset-bottom)+0.75rem)] pt-3 backdrop-blur lg:hidden"
          >
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-[11px] uppercase tracking-[0.12em] text-white/50">{totals.selectedCount} {totals.selectedCount === 1 ? "item" : "items"} · indicative</p>
                <TotalAmount totals={totals} className="text-lg font-bold text-white" />
              </div>
              <button type="button" onClick={() => setOpen(true)} className="rounded-[4px] bg-ud-burgundy px-5 py-3 text-sm font-bold text-white">Review package</button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {open && (
          <div key="sheet" className="fixed inset-0 z-50 lg:hidden" role="dialog" aria-modal="true" aria-label="Your package">
            <motion.div className="absolute inset-0 bg-black/55" onClick={() => setOpen(false)} initial={{ opacity: 0 }} animate={{ opacity: 1, transition: { duration: DUR.standard } }} exit={{ opacity: 0, transition: { duration: DUR.quick } }} />
            <motion.div
              className="absolute inset-x-0 bottom-0 max-h-[88dvh] overflow-y-auto rounded-t-[12px] bg-ud-dark px-5 pb-[calc(env(safe-area-inset-bottom)+1.25rem)] pt-3"
              initial={{ y: reduce ? 0 : "100%" }}
              animate={{ y: 0, transition: { duration: reduce ? 0 : DUR.slow, ease: EASE_OUT } }}
              exit={{ y: reduce ? 0 : "100%", transition: { duration: reduce ? 0 : DUR.standard, ease: EASE_IN } }}
            >
              <div className="mx-auto mb-3 h-1 w-10 rounded-full bg-white/20" aria-hidden />
              <button type="button" onClick={() => setOpen(false)} aria-label="Close package summary" className="absolute right-3 top-3 flex h-10 w-10 items-center justify-center text-white/60 hover:text-white">
                <X size={18} aria-hidden />
              </button>
              <SummaryContent />
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
