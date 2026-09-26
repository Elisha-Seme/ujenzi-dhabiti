"use client";

import { Suspense, useMemo, useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import SectionHero from "@/components/ui/SectionHero";
import PlanCard from "@/components/shop/PlanCard";
import CTABanner from "@/components/sections/CTABanner";
import { PLAN_CATEGORIES, PlanCategory, type HousePlan } from "@/lib/house-plans";

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
  const typeParam = searchParams.get("type");

  const [active, setActive] = useState<PlanCategory | "All">("All");
  const [plans, setPlans] = useState<HousePlan[]>([]);
  const [compareIds, setCompareIds] = useState<string[]>([]);
  const [bedrooms, setBedrooms] = useState("all");
  const [maxArea, setMaxArea] = useState("all");
  const [maxBudget, setMaxBudget] = useState("all");
  const [planType, setPlanType] = useState("all");

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

  const filtered = useMemo(() => {
    return plans.filter((p) => {
      const categoryMatches = active !== "All" ? p.category === active : matchesType(p.category, p.planType, typeParam);
      const bedroomMatches = bedrooms === "all" || p.bedrooms === Number(bedrooms);
      const areaMatches = maxArea === "all" || p.plinthAreaSqM <= Number(maxArea);
      const budgetMatches = maxBudget === "all" || Math.min(p.priceDigitalKES, p.pricePrintKES) <= Number(maxBudget);
      const typeMatches = planType === "all" || p.planType === planType;
      return categoryMatches && bedroomMatches && areaMatches && budgetMatches && typeMatches;
    });
  }, [plans, active, bedrooms, maxArea, maxBudget, planType, typeParam]);

  const comparePlans = plans.filter((plan) => compareIds.includes(plan.id));
  const toggleCompare = (id: string) => {
    setCompareIds((current) => current.includes(id) ? current.filter((item) => item !== id) : current.length < 3 ? [...current, id] : current);
  };

  const counts = useMemo(() => {
    const c: Record<string, number> = { All: plans.length };
    for (const cat of PLAN_CATEGORIES) c[cat] = plans.filter((p) => p.category === cat).length;
    return c;
  }, [plans]);
  const bedroomOptions = useMemo(() => Array.from(new Set(plans.map((plan) => plan.bedrooms).filter((count): count is number => count !== undefined))).sort((a, b) => a - b), [plans]);
  const planTypeOptions = useMemo(() => Array.from(new Set(plans.map((plan) => plan.planType))).sort(), [plans]);
  const clearFilters = () => { setBedrooms("all"); setMaxArea("all"); setMaxBudget("all"); setPlanType("all"); };
  const hasDetailFilters = bedrooms !== "all" || maxArea !== "all" || maxBudget !== "all" || planType !== "all";

  return (
    <>
      <SectionHero
        title="House Plans"
        subtitle="Ready-to-build plans for every property type — buy as a digital download or a printed copy."
      />

      <section className="bg-ud-light-gray min-h-screen py-14 md:py-20">
        <div className="max-w-content mx-auto px-6">
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

          <div className="bg-white border border-ud-dark/10 rounded-[4px] p-4 md:p-5 mb-8" aria-label="Filter house plans">
            <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
              <div><h2 className="text-sm font-bold text-ud-dark">Refine plans</h2><p className="text-xs text-ud-dark/50 mt-0.5">Filter by the published plan details and starting price.</p></div>
              {hasDetailFilters && <button type="button" onClick={clearFilters} className="text-xs font-semibold text-ud-burgundy hover:underline">Clear filters</button>}
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
              <label className="text-xs font-semibold text-ud-dark/60">Bedrooms
                <select value={bedrooms} onChange={(event) => setBedrooms(event.target.value)} className="mt-1.5 w-full border border-ud-dark/20 rounded px-3 py-2 text-sm text-ud-dark bg-white"><option value="all">Any bedrooms</option>{bedroomOptions.map((count) => <option key={count} value={count}>{count} bedroom{count === 1 ? "" : "s"}</option>)}</select>
              </label>
              <label className="text-xs font-semibold text-ud-dark/60">Plan area
                <select value={maxArea} onChange={(event) => setMaxArea(event.target.value)} className="mt-1.5 w-full border border-ud-dark/20 rounded px-3 py-2 text-sm text-ud-dark bg-white"><option value="all">Any area</option><option value="100">Up to 100 m²</option><option value="200">Up to 200 m²</option><option value="500">Up to 500 m²</option><option value="1000">Up to 1,000 m²</option></select>
              </label>
              <label className="text-xs font-semibold text-ud-dark/60">Budget (from)
                <select value={maxBudget} onChange={(event) => setMaxBudget(event.target.value)} className="mt-1.5 w-full border border-ud-dark/20 rounded px-3 py-2 text-sm text-ud-dark bg-white"><option value="all">Any budget</option><option value="10000">Up to KES 10,000</option><option value="20000">Up to KES 20,000</option><option value="50000">Up to KES 50,000</option><option value="100000">Up to KES 100,000</option></select>
              </label>
              <label className="text-xs font-semibold text-ud-dark/60">Style / type
                <select value={planType} onChange={(event) => setPlanType(event.target.value)} className="mt-1.5 w-full border border-ud-dark/20 rounded px-3 py-2 text-sm text-ud-dark bg-white"><option value="all">Any style or type</option>{planTypeOptions.map((type) => <option key={type} value={type}>{type}</option>)}</select>
              </label>
            </div>
            <p className="text-[11px] text-ud-dark/45 mt-3">Plan area is the published plinth area, not a plot-size recommendation. Plot-size and architectural-style data will appear here once it is approved and added to the catalogue.</p>
          </div>

          {filtered.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {filtered.map((plan) => (
                <div key={plan.id} className="relative">
                  <PlanCard plan={plan} />
                  <label className="absolute top-3 right-3 z-10 flex items-center gap-1.5 bg-white/95 text-[11px] font-semibold text-ud-dark px-2 py-1.5 rounded shadow-sm cursor-pointer">
                    <input type="checkbox" checked={compareIds.includes(plan.id)} onChange={() => toggleCompare(plan.id)} className="accent-ud-burgundy" /> Compare
                  </label>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-20">
              <p className="text-ud-dark/40 font-light text-lg">No plans match these filters.</p>
              <button onClick={() => { setActive("All"); clearFilters(); }} className="mt-4 text-sm font-semibold text-ud-burgundy hover:underline">Clear filters and view all plans</button>
            </div>
          )}

          {comparePlans.length >= 2 && (
            <section className="mt-10 bg-white border border-ud-burgundy/25 rounded-[4px] p-5 md:p-6" aria-labelledby="compare-heading">
              <div className="flex items-center justify-between gap-4 mb-5">
                <div><h2 id="compare-heading" className="text-lg font-bold text-ud-dark">Compare selected plans</h2><p className="text-xs text-ud-dark/50 mt-1">Up to three plans can be compared side by side.</p></div>
                <button type="button" onClick={() => setCompareIds([])} className="text-xs font-semibold text-ud-burgundy hover:underline">Clear</button>
              </div>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {comparePlans.map((plan) => (
                  <div key={plan.id} className="border border-ud-dark/10 rounded-[4px] p-4">
                    <h3 className="font-bold text-ud-dark text-sm mb-3">{plan.name}</h3>
                    <dl className="space-y-2 text-xs text-ud-dark/60">
                      <div className="flex justify-between gap-3"><dt>Category</dt><dd className="font-semibold text-ud-dark">{plan.category}</dd></div>
                      <div className="flex justify-between gap-3"><dt>Bedrooms</dt><dd className="font-semibold text-ud-dark">{plan.bedrooms ?? "—"}</dd></div>
                      <div className="flex justify-between gap-3"><dt>Bathrooms</dt><dd className="font-semibold text-ud-dark">{plan.bathrooms ?? "—"}</dd></div>
                      <div className="flex justify-between gap-3"><dt>Floors</dt><dd className="font-semibold text-ud-dark">{plan.floors}</dd></div>
                      <div className="flex justify-between gap-3"><dt>Plinth area</dt><dd className="font-semibold text-ud-dark">{plan.plinthAreaSqM} m²</dd></div>
                      <div className="flex justify-between gap-3"><dt>Digital</dt><dd className="font-semibold text-ud-dark">KES {plan.priceDigitalKES.toLocaleString()}</dd></div>
                      <div className="flex justify-between gap-3"><dt>Print</dt><dd className="font-semibold text-ud-dark">KES {plan.pricePrintKES.toLocaleString()}</dd></div>
                    </dl>
                  </div>
                ))}
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
