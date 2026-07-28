"use client";

import { Suspense, useMemo, useState, useEffect } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import SectionHero from "@/components/ui/SectionHero";
import PlanCard from "@/components/shop/PlanCard";
import CTABanner from "@/components/sections/CTABanner";
import { PLAN_CATEGORIES, PlanCategory, type HousePlan } from "@/lib/house-plans";
import { GitCompareArrows, X } from "lucide-react";

export default function PlansPage() {
  return (
    <Suspense fallback={<PlansFallback />}>
      <PlansContent />
    </Suspense>
  );
}

function PlansFallback() {
  return (
    <>
      <SectionHero title="House Plans" subtitle="Ready-to-build plans — buy as a digital download or a printed copy." />
      <div className="bg-ud-light-gray py-20 text-center text-sm text-ud-dark/50">Loading plans…</div>
    </>
  );
}

function matchesType(category: PlanCategory, planType: string, raw: string | null): boolean {
  if (!raw) return true;
  const q = raw.toLowerCase();
  return category.toLowerCase().includes(q) || q.includes(category.toLowerCase()) || planType.toLowerCase().includes(q);
}

function PlansContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const typeParam = searchParams.get("type");

  const categoryParam = searchParams.get("category");
  const initialCategory = PLAN_CATEGORIES.find((value) => value === categoryParam) ?? "All";
  const [active, setActive] = useState<PlanCategory | "All">(initialCategory);
  const [plans, setPlans] = useState<HousePlan[]>([]);
  const [bedrooms, setBedrooms] = useState(searchParams.get("bedrooms") ?? "all");
  const [floors, setFloors] = useState(searchParams.get("storeys") ?? "all");
  const [maxPrice, setMaxPrice] = useState(searchParams.get("maxPrice") ?? "");
  const [maxArea, setMaxArea] = useState(searchParams.get("maxArea") ?? "");
  const [plotWidth, setPlotWidth] = useState(searchParams.get("plotWidth") ?? "");
  const [plotDepth, setPlotDepth] = useState(searchParams.get("plotDepth") ?? "");
  const [style, setStyle] = useState(searchParams.get("style") ?? "all");
  const [selected, setSelected] = useState<string[]>([]);

  useEffect(() => {
    fetch("/api/plans-catalogue")
      .then((r) => r.json())
      .then((d: { plans: HousePlan[] }) => setPlans(d.plans ?? []))
      .catch(() => {});
  }, []);

  // Pre-select the category implied by an incoming ?type= link.
  useEffect(() => {
    if (!typeParam) return;
    const match = PLAN_CATEGORIES.find(
      (c) => c.toLowerCase().includes(typeParam.toLowerCase()) || typeParam.toLowerCase().includes(c.toLowerCase())
    );
    setActive(match ?? "All");
  }, [typeParam]);

  useEffect(() => {
    const params = new URLSearchParams(searchParams.toString());
    const sync = (key: string, value: string, empty = "all") => {
      if (!value || value === empty) params.delete(key);
      else params.set(key, value);
    };
    sync("category", active, "All");
    sync("bedrooms", bedrooms);
    sync("storeys", floors);
    sync("maxPrice", maxPrice, "");
    sync("maxArea", maxArea, "");
    sync("plotWidth", plotWidth, "");
    sync("plotDepth", plotDepth, "");
    sync("style", style);
    const next = params.toString();
    if (next !== searchParams.toString()) {
      router.replace(next ? `${pathname}?${next}` : pathname, { scroll: false });
    }
  }, [active, bedrooms, floors, maxPrice, maxArea, plotWidth, plotDepth, style, pathname, router, searchParams]);

  const styles = useMemo(
    () => Array.from(new Set(plans.map((plan) => plan.architecturalStyle).filter((value): value is string => !!value))).sort(),
    [plans]
  );

  const filtered = useMemo(() => {
    return plans.filter((p) => {
      if (active !== "All" && p.category !== active) return false;
      if (!matchesType(p.category, p.planType, typeParam)) return false;
      if (bedrooms !== "all" && p.bedrooms !== Number(bedrooms)) return false;
      if (floors !== "all" && p.floors !== Number(floors)) return false;
      if (maxPrice && p.priceDigitalKES > Number(maxPrice)) return false;
      if (maxArea && p.plinthAreaSqM > Number(maxArea)) return false;
      if (plotWidth && (!p.plotWidthM || p.plotWidthM > Number(plotWidth))) return false;
      if (plotDepth && (!p.plotDepthM || p.plotDepthM > Number(plotDepth))) return false;
      if (style !== "all" && p.architecturalStyle !== style) return false;
      return true;
    });
  }, [plans, active, typeParam, bedrooms, floors, maxPrice, maxArea, plotWidth, plotDepth, style]);

  const counts = useMemo(() => {
    const c: Record<string, number> = { All: plans.length };
    for (const cat of PLAN_CATEGORIES) c[cat] = plans.filter((p) => p.category === cat).length;
    return c;
  }, [plans]);

  const comparedPlans = selected
    .map((id) => plans.find((plan) => plan.id === id))
    .filter((plan): plan is HousePlan => !!plan);

  const toggleCompare = (id: string) => {
    setSelected((current) =>
      current.includes(id)
        ? current.filter((value) => value !== id)
        : current.length < 3
          ? [...current, id]
          : current
    );
  };

  return (
    <>
      <SectionHero
        title="House Plans"
        subtitle="Ready-to-build plans for every property type — buy as a digital download or a printed copy."
      />

      <section className="bg-ud-light-gray min-h-screen py-14 md:py-20">
        <div className="max-w-content mx-auto px-6">
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3 bg-white border border-ud-dark/10 rounded-[4px] p-4 mb-6">
            <label className="text-xs font-bold text-ud-dark/55">
              Bedrooms
              <select value={bedrooms} onChange={(e) => setBedrooms(e.target.value)} className="mt-1 block w-full border border-ud-dark/15 rounded-[4px] px-3 py-2 text-sm font-normal text-ud-dark">
                <option value="all">Any bedrooms</option>
                {[1, 2, 3, 4, 5].map((value) => <option key={value} value={value}>{value} bedroom{value === 1 ? "" : "s"}</option>)}
              </select>
            </label>
            <label className="text-xs font-bold text-ud-dark/55">
              Storeys
              <select value={floors} onChange={(e) => setFloors(e.target.value)} className="mt-1 block w-full border border-ud-dark/15 rounded-[4px] px-3 py-2 text-sm font-normal text-ud-dark">
                <option value="all">Any number</option>
                {[1, 2, 3, 4, 5, 6].map((value) => <option key={value} value={value}>{value} {value === 1 ? "storey" : "storeys"}</option>)}
              </select>
            </label>
            <label className="text-xs font-bold text-ud-dark/55">
              Maximum digital price
              <input type="number" min="0" value={maxPrice} onChange={(e) => setMaxPrice(e.target.value)} placeholder="Any budget" className="mt-1 block w-full border border-ud-dark/15 rounded-[4px] px-3 py-2 text-sm font-normal text-ud-dark" />
            </label>
            <label className="text-xs font-bold text-ud-dark/55">
              Maximum floor area (m²)
              <input type="number" min="0" value={maxArea} onChange={(e) => setMaxArea(e.target.value)} placeholder="Any size" className="mt-1 block w-full border border-ud-dark/15 rounded-[4px] px-3 py-2 text-sm font-normal text-ud-dark" />
            </label>
            <label className="text-xs font-bold text-ud-dark/55">
              Available plot width (m)
              <input type="number" min="0" value={plotWidth} onChange={(e) => setPlotWidth(e.target.value)} placeholder="Any width" className="mt-1 block w-full border border-ud-dark/15 rounded-[4px] px-3 py-2 text-sm font-normal text-ud-dark" />
            </label>
            <label className="text-xs font-bold text-ud-dark/55">
              Available plot depth (m)
              <input type="number" min="0" value={plotDepth} onChange={(e) => setPlotDepth(e.target.value)} placeholder="Any depth" className="mt-1 block w-full border border-ud-dark/15 rounded-[4px] px-3 py-2 text-sm font-normal text-ud-dark" />
            </label>
            <label className="text-xs font-bold text-ud-dark/55">
              Architectural style
              <select value={style} onChange={(e) => setStyle(e.target.value)} className="mt-1 block w-full border border-ud-dark/15 rounded-[4px] px-3 py-2 text-sm font-normal text-ud-dark">
                <option value="all">Any style</option>
                {styles.map((value) => <option key={value} value={value}>{value}</option>)}
              </select>
            </label>
            <button
              type="button"
              onClick={() => {
                setActive("All");
                setBedrooms("all");
                setFloors("all");
                setMaxPrice("");
                setMaxArea("");
                setPlotWidth("");
                setPlotDepth("");
                setStyle("all");
              }}
              className="self-end border border-ud-dark/15 rounded-[4px] px-3 py-2 text-sm font-semibold text-ud-burgundy hover:border-ud-burgundy"
            >
              Reset filters
            </button>
          </div>

          {/* Category filter */}
          <div className="flex flex-wrap gap-2 mb-8">
            {(["All", ...PLAN_CATEGORIES] as (PlanCategory | "All")[]).map((cat) => (
              <button
                key={cat}
                onClick={() => setActive(cat)}
                className={`px-4 py-2 text-xs font-semibold rounded-[4px] border transition-colors ${
                  active === cat
                    ? "bg-ud-burgundy text-white border-ud-burgundy"
                    : "bg-white text-ud-dark/60 border-ud-dark/15 hover:border-ud-burgundy hover:text-ud-burgundy"
                }`}
              >
                {cat} <span className="opacity-60">({counts[cat] ?? 0})</span>
              </button>
            ))}
          </div>

          {filtered.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {filtered.map((plan) => (
                <div key={plan.id} className="relative">
                  <PlanCard plan={plan} />
                  <button
                    type="button"
                    onClick={() => toggleCompare(plan.id)}
                    aria-pressed={selected.includes(plan.id)}
                    className={`absolute top-3 right-3 z-10 inline-flex items-center gap-1.5 text-xs font-bold px-2.5 py-1.5 rounded-[4px] shadow-sm transition-colors ${
                      selected.includes(plan.id)
                        ? "bg-ud-burgundy text-white"
                        : "bg-white/95 text-ud-dark hover:text-ud-burgundy"
                    }`}
                  >
                    <GitCompareArrows size={13} />
                    {selected.includes(plan.id) ? "Selected" : "Compare"}
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-20">
              <p className="text-ud-dark/40 font-light text-lg">No plans in this category yet.</p>
              <button onClick={() => setActive("All")} className="mt-4 text-sm font-semibold text-ud-burgundy hover:underline">View all plans</button>
            </div>
          )}

          {comparedPlans.length > 0 && (
            <section className="mt-10 bg-white border border-ud-dark/10 rounded-[4px] overflow-hidden">
              <div className="flex items-center justify-between gap-4 p-5 border-b border-ud-dark/10">
                <div>
                  <h2 className="font-bold text-ud-dark">Compare house plans</h2>
                  <p className="text-xs text-ud-dark/50 mt-1">Select up to three plans. Add at least two for a useful comparison.</p>
                </div>
                <button type="button" onClick={() => setSelected([])} className="inline-flex items-center gap-1 text-xs font-semibold text-ud-burgundy hover:underline">
                  <X size={13} /> Clear
                </button>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full min-w-[680px] text-sm">
                  <thead>
                    <tr className="bg-ud-light-gray text-left">
                      <th className="p-3 text-xs uppercase tracking-wider text-ud-dark/45">Feature</th>
                      {comparedPlans.map((plan) => <th key={plan.id} className="p-3 text-ud-dark">{plan.name}</th>)}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-ud-dark/8">
                    {[
                      ["Type", (p: HousePlan) => p.planType],
                      ["Bedrooms", (p: HousePlan) => p.bedrooms ?? "Not specified"],
                      ["Bathrooms", (p: HousePlan) => p.bathrooms ?? "Not specified"],
                      ["Storeys", (p: HousePlan) => p.floors],
                      ["Floor area", (p: HousePlan) => `${p.plinthAreaSqM} m²`],
                      ["Minimum plot", (p: HousePlan) => p.plotWidthM && p.plotDepthM ? `${p.plotWidthM} × ${p.plotDepthM} m` : "Not specified"],
                      ["Style", (p: HousePlan) => p.architecturalStyle ?? "Not specified"],
                      ["Digital price", (p: HousePlan) => `KES ${p.priceDigitalKES.toLocaleString()}`],
                      ["Printed price", (p: HousePlan) => `KES ${p.pricePrintKES.toLocaleString()}`],
                    ].map(([label, value]) => (
                      <tr key={String(label)}>
                        <th className="p-3 text-left text-xs font-bold text-ud-dark/50">{String(label)}</th>
                        {comparedPlans.map((plan) => <td key={plan.id} className="p-3 text-ud-dark/70">{(value as (p: HousePlan) => React.ReactNode)(plan)}</td>)}
                      </tr>
                    ))}
                    <tr>
                      <th className="p-3" />
                      {comparedPlans.map((plan) => (
                        <td key={plan.id} className="p-3">
                          <a href={`/shop/plans/${plan.id}`} className="text-xs font-bold text-ud-burgundy hover:underline">View this plan →</a>
                          <a href={`/request-a-quote?request=plan-modification&planId=${encodeURIComponent(plan.id)}&plan=${encodeURIComponent(plan.name)}`} className="mt-2 block text-xs font-bold text-ud-burgundy hover:underline">Request changes →</a>
                        </td>
                      ))}
                    </tr>
                  </tbody>
                </table>
              </div>
            </section>
          )}

          <div className="mt-12 bg-white border border-ud-dark/10 rounded-[4px] p-6 text-sm text-ud-dark/60 leading-relaxed">
            <strong className="text-ud-dark">Digital or printed?</strong> Every plan is available as an instant digital download (PDF) or a professionally printed copy delivered to you. Choose your format on each plan&apos;s page. Need changes or a custom design?{" "}
            <a href="/request-a-quote" className="text-ud-burgundy font-semibold hover:underline">Request a custom plan</a>.
          </div>
        </div>
      </section>

      <CTABanner />
    </>
  );
}
