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
      if (active !== "All") return p.category === active;
      return matchesType(p.category, p.planType, typeParam);
    });
  }, [plans, active, typeParam]);

  const counts = useMemo(() => {
    const c: Record<string, number> = { All: plans.length };
    for (const cat of PLAN_CATEGORIES) c[cat] = plans.filter((p) => p.category === cat).length;
    return c;
  }, [plans]);

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

          {filtered.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {filtered.map((plan) => <PlanCard key={plan.id} plan={plan} />)}
            </div>
          ) : (
            <div className="text-center py-20">
              <p className="text-ud-dark/40 font-light text-lg">No plans in this category yet.</p>
              <button onClick={() => setActive("All")} className="mt-4 text-sm font-semibold text-ud-burgundy hover:underline">View all plans</button>
            </div>
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
