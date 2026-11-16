"use client";

import { useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { ArrowUpRight, Hammer, House, Package, Ruler, Truck } from "lucide-react";
import { DUR, EASE_IN, EASE_OUT } from "@/lib/motion";
import { LABOUR_UNIT_LABEL } from "@/lib/services/labour";
import { formatKES, lineTotal, needsQuantity, type PackageGroup, type PackageItem } from "@/lib/services/package-math";
import { usePackage } from "./package-context";
import { AnimatedAmount, CheckMark, QtyStepper, SegmentedRadio } from "./package-ui";
import { MobileSummaryBar, SummaryContent } from "./PackageSummary";

const COLLAPSE_AFTER = 6;

const QTY_UNIT: Record<string, string> = { sqm: "m²", m: "metres", item: "items", each: "units" };

function rateText(item: PackageItem): string {
  if (item.kind === "plan" && item.options) return `Digital ${formatKES(item.options.digitalKES)} · Printed ${formatKES(item.options.printKES)}`;
  if (item.kind === "material") return item.rateKES !== null ? `${formatKES(item.rateKES)} ${item.detail?.split(" · ").pop() ?? ""}`.trim() : "";
  if (item.rateKES === null || !item.unit || item.unit === "each") return "Priced after site visit";
  return `${formatKES(item.rateKES)} ${LABOUR_UNIT_LABEL[item.unit]}`;
}

function PackageRow({ item }: { item: PackageItem }) {
  const pkg = usePackage();
  const reduce = useReducedMotion() ?? false;
  const sel = pkg.selection[item.id];
  const selected = Boolean(sel);
  const amount = selected ? lineTotal(item, sel) : null;
  const unpriced = item.kind === "labour" && item.rateKES === null;
  const inputId = `pkg-${item.id.replace(/[^a-z0-9-]/gi, "-")}`;
  const areaHint = selected && item.kind === "labour" && item.unit === "sqm" && pkg.areaSqm === 0;
  const fromArea = selected && item.kind === "material" && pkg.areaMode === "coverage" && item.coverageSqmPerUnit && pkg.areaSqm > 0;

  return (
    <li className={`rounded-[6px] border transition-colors duration-150 ${selected ? "border-ud-burgundy/45 bg-ud-burgundy/[0.035]" : "border-ud-dark/10 bg-white hover:border-ud-dark/25"}`}>
      <label htmlFor={inputId} className="flex cursor-pointer items-start gap-3 p-4">
        <input id={inputId} type="checkbox" className="peer sr-only" checked={selected} onChange={() => pkg.toggle(item.id)} />
        <CheckMark checked={selected} />
        <span className="min-w-0 flex-1">
          <span className="block text-sm font-semibold leading-snug text-ud-dark">{item.label}</span>
          <span className="mt-0.5 block text-xs text-ud-dark/55">
            {item.kind === "plan" && item.detail ? `${item.detail} · ` : item.kind === "labour" && item.detail ? `${item.detail} · ` : ""}
            {rateText(item)}
          </span>
        </span>
        <span className="flex-shrink-0 pl-2 text-right">
          {selected ? (
            amount !== null ? (
              <AnimatedAmount value={amount} className="text-sm font-bold text-ud-dark" />
            ) : (
              <span className="inline-block rounded-full bg-ud-dark/[0.06] px-2 py-0.5 text-[11px] font-semibold text-ud-dark/60">Site visit</span>
            )
          ) : unpriced ? null : item.kind === "plan" && item.options ? (
            <span className="text-xs text-ud-dark/45">from {formatKES(item.options.digitalKES)}</span>
          ) : null}
        </span>
      </label>

      <AnimatePresence initial={false}>
        {selected && (needsQuantity(item) || item.kind === "plan" || areaHint) && (
          <motion.div
            key="controls"
            className="overflow-hidden"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1, transition: { duration: reduce ? 0 : DUR.standard, ease: EASE_OUT } }}
            exit={{ height: 0, opacity: 0, transition: { duration: reduce ? 0 : DUR.quick, ease: EASE_IN } }}
          >
            <div className="flex flex-wrap items-center gap-x-4 gap-y-2 px-4 pb-4 pl-12">
              {item.kind === "plan" && item.options ? (
                <SegmentedRadio
                  label={`Format for ${item.label}`}
                  value={sel?.mode ?? "digital"}
                  onChange={(mode) => pkg.setMode(item.id, mode)}
                  layoutId={`fmt-${item.id}`}
                  options={[
                    { value: "digital", label: `Digital · ${formatKES(item.options.digitalKES)}` },
                    { value: "print", label: `Printed · ${formatKES(item.options.printKES)}` },
                  ]}
                />
              ) : needsQuantity(item) ? (
                <QtyStepper value={sel.qty} onChange={(qty) => pkg.setQty(item.id, qty)} unit={QTY_UNIT[item.unit ?? "each"] ?? ""} label={`Quantity for ${item.label}`} />
              ) : null}
              {areaHint && <span className="text-xs text-ud-burgundy">Enter your area above to size this line.</span>}
              {fromArea && <span className="text-xs text-ud-dark/50">Worked out from your area, +10% wastage</span>}
              {item.href && (
                <Link href={item.href} className="inline-flex items-center gap-1 text-xs font-semibold text-ud-burgundy hover:underline">
                  {item.kind === "plan" ? "View plan" : "View product"} <ArrowUpRight size={12} aria-hidden />
                </Link>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </li>
  );
}

/** One heading's lines inside a group card. Long lists collapse, never hiding a selected line. */
function SectionBlock({ heading, rows, collapsible }: { heading: string; rows: PackageItem[]; collapsible: boolean }) {
  const pkg = usePackage();
  const [expanded, setExpanded] = useState(false);
  const canCollapse = collapsible && rows.length > COLLAPSE_AFTER;
  const visible = expanded || !canCollapse ? rows : rows.filter((item, index) => index < COLLAPSE_AFTER || pkg.selection[item.id]);
  const picked = rows.filter((item) => pkg.selection[item.id]).length;
  return (
    <div className="mt-5 first:mt-4">
      {heading && (
        <p className="mb-2 flex items-baseline justify-between gap-3 text-[11px] font-bold uppercase tracking-[0.14em] text-ud-dark/45">
          <span>{heading}</span>
          {picked > 0 && <span className="normal-case tracking-normal text-ud-burgundy">{picked} selected</span>}
        </p>
      )}
      <ul className="space-y-2">
        {visible.map((item) => <PackageRow key={item.id} item={item} />)}
      </ul>
      {canCollapse && (
        <button type="button" aria-expanded={expanded} onClick={() => setExpanded((value) => !value)} className="mt-2 text-xs font-bold text-ud-burgundy hover:underline">
          {expanded ? "Show fewer" : `Show all ${rows.length}${heading ? ` in ${heading}` : ""}`}
        </button>
      )}
    </div>
  );
}

function GroupCard({ group, title, hint, icon }: { group: PackageGroup; title: string; hint: string; icon: React.ReactNode }) {
  const pkg = usePackage();
  const items = pkg.items.filter((item) => item.group === group);
  if (items.length === 0) return null;

  const selectedCount = items.filter((item) => pkg.selection[item.id]).length;
  // Lines are grouped by their heading (parent sub-service, add-on service,
  // plan type), in first-appearance order; ungrouped lines come first.
  const sections: [string, PackageItem[]][] = [];
  for (const item of items) {
    const key = item.section ?? "";
    const existing = sections.find(([heading]) => heading === key);
    if (existing) existing[1].push(item);
    else sections.push([key, [item]]);
  }
  sections.sort(([a], [b]) => (a === "" ? -1 : b === "" ? 1 : 0));
  // Design stays fully open so every plan and architectural add-on is visible.
  const collapsible = group !== "design";

  return (
    <section aria-labelledby={`pkg-group-${group}`} className="rounded-[8px] border border-ud-dark/10 bg-white p-5 shadow-sm md:p-6">
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-start gap-3">
          <span className="mt-0.5 flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-[6px] bg-ud-burgundy/10 text-ud-burgundy">{icon}</span>
          <div>
            <h3 id={`pkg-group-${group}`} className="text-base font-bold text-ud-dark">{title}</h3>
            <p className="mt-0.5 text-xs leading-relaxed text-ud-dark/55">{hint}</p>
          </div>
        </div>
        {selectedCount > 0 && (
          <div className="flex-shrink-0 text-right">
            {pkg.totals.pricedCount[group] > 0 ? (
              <AnimatedAmount value={pkg.totals.byGroup[group]} className="text-sm font-bold text-ud-dark" />
            ) : (
              <span className="text-xs font-semibold text-ud-dark/60">Priced after site visit</span>
            )}
            <p className="text-[11px] text-ud-dark/45">{selectedCount} selected</p>
          </div>
        )}
      </div>

      {sections.map(([heading, rows]) => (
        <SectionBlock key={heading || "all"} heading={heading} rows={rows} collapsible={collapsible} />
      ))}
    </section>
  );
}

function ProjectInputs() {
  const pkg = usePackage();
  return (
    <section aria-label="Project details" className="rounded-[8px] border border-ud-dark/10 bg-white p-5 shadow-sm md:p-6">
      <div className="grid gap-4 sm:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
        <div>
          <label htmlFor="pkg-area" className="mb-1.5 flex items-center gap-1.5 text-xs font-bold uppercase tracking-[0.12em] text-ud-dark/60">
            <Ruler size={13} aria-hidden /> {pkg.areaLabel}
          </label>
          <div className="flex">
            <input
              id="pkg-area"
              type="number"
              inputMode="decimal"
              min={0}
              placeholder="e.g. 120"
              value={pkg.areaRaw}
              onChange={(event) => pkg.setAreaRaw(event.target.value.slice(0, 12))}
              className="min-w-0 flex-1 rounded-l-[4px] border border-r-0 border-ud-dark/15 px-3 py-2.5 text-sm tabular-nums text-ud-dark outline-none focus:border-ud-burgundy"
            />
            <SegmentedRadio
              label="Area unit"
              value={pkg.areaUnit}
              onChange={pkg.setAreaUnit}
              className="rounded-l-none"
              options={[{ value: "sqm", label: "m²" }, { value: "sqft", label: "ft²" }]}
            />
          </div>
          <p className="mt-1.5 text-[11px] leading-relaxed text-ud-dark/50">
            {pkg.areaMode === "floor"
              ? "Floor area of the building. Material quantities are left for you to set."
              : "Surface to be worked on. Material quantities include a 10% wastage allowance."}
            {pkg.areaUnit === "sqft" && pkg.areaSqm > 0 && ` ≈ ${Math.round(pkg.areaSqm * 10) / 10} m²`}
          </p>
        </div>
        <div>
          <label htmlFor="pkg-county" className="mb-1.5 flex items-center gap-1.5 text-xs font-bold uppercase tracking-[0.12em] text-ud-dark/60">
            <Truck size={13} aria-hidden /> Site county
          </label>
          <select
            id="pkg-county"
            value={pkg.county ?? ""}
            onChange={(event) => pkg.setCounty(event.target.value || null)}
            className="w-full rounded-[4px] border border-ud-dark/15 bg-white px-3 py-2.5 text-sm text-ud-dark outline-none focus:border-ud-burgundy"
          >
            <option value="">Select county…</option>
            {pkg.zones.map((zone) => <option key={zone.county} value={zone.county}>{zone.county}</option>)}
          </select>
          <p className="mt-1.5 text-[11px] leading-relaxed text-ud-dark/50">Used for the delivery estimate on materials and printed plans.</p>
        </div>
      </div>
    </section>
  );
}

function DeliveryCard() {
  const pkg = usePackage();
  if (!pkg.items.some((item) => item.kind === "delivery")) return null;
  const { physicalSelected } = pkg.totals;
  return (
    <section aria-label="Delivery" className="flex items-start gap-3 rounded-[8px] border border-dashed border-ud-dark/20 bg-white/60 p-5">
      <span className="mt-0.5 flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-[6px] bg-ud-dark/[0.06] text-ud-dark/70"><Truck size={17} aria-hidden /></span>
      <div className="flex-1 text-sm">
        <p className="font-bold text-ud-dark">Delivery</p>
        <p className="mt-0.5 text-xs leading-relaxed text-ud-dark/55">
          {!physicalSelected
            ? "Added automatically when your package includes materials or a printed plan."
            : pkg.zone
              ? `To ${pkg.zone.county}: ${formatKES(pkg.zone.feeKES)}${pkg.zone.isConfigured ? "" : " (estimate — confirmed on your invoice)"}.`
              : "Choose your site county above to see the delivery estimate."}
        </p>
      </div>
    </section>
  );
}

export default function PackageBuilder() {
  const pkg = usePackage();
  return (
    <section id="package" className="scroll-mt-32 bg-ud-light-gray py-14 md:py-20" aria-labelledby="package-heading">
      <div className="mx-auto max-w-content px-6">
        <div className="max-w-2xl">
          <p className="mb-3 text-xs font-bold uppercase tracking-[0.25em] text-ud-burgundy">Build your package</p>
          <h2 id="package-heading" tabIndex={-1} className="text-2xl font-bold text-ud-dark outline-none md:text-3xl">Put together your {pkg.title} package</h2>
          <p className="mt-3 text-sm leading-relaxed text-ud-dark/65">
            Tick what you need and untick what you don&apos;t: our work, house plans, design services and materials. Your indicative total updates as you go, and you can send it to us as a quote request.
          </p>
        </div>

        <div className="mt-8 grid items-start gap-8 lg:grid-cols-[minmax(0,1fr)_360px]">
          <div className="space-y-5">
            <ProjectInputs />
            <GroupCard group="work" icon={<Hammer size={17} aria-hidden />} title="Work items" hint="Carried out by our team. Items without a published rate are measured and priced after a site visit." />
            <GroupCard group="design" icon={<House size={17} aria-hidden />} title="Design & house plans" hint="Ready-made plans as a digital download or printed copy, plus architectural design services. Pick as many as you need." />
            <GroupCard group="materials" icon={<Package size={17} aria-hidden />} title={pkg.materialsAreSuggested ? "Materials (suggested)" : "Materials"} hint={pkg.materialsAreSuggested ? "Catalogue materials typically used for this work. Adjust quantities to your site." : "Materials selected for this service. Adjust quantities to your site."} />
            <DeliveryCard />
          </div>
          <aside className="hidden rounded-[8px] bg-ud-dark p-6 shadow-[0_18px_40px_-18px_rgba(0,0,0,0.5)] lg:sticky lg:top-[9.5rem] lg:block" aria-label="Package summary">
            <SummaryContent />
          </aside>
        </div>
      </div>
      <MobileSummaryBar />
    </section>
  );
}
