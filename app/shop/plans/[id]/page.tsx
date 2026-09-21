"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import { BedDouble, Bath, Layers, Maximize, Download, Truck, Check, ShoppingCart, ArrowLeft } from "lucide-react";
import { planPrice, DeliveryMode, type HousePlan } from "@/lib/house-plans";
import { useCart } from "@/context/CartContext";

export default function PlanDetailPage() {
  const params = useParams();
  const id = Array.isArray(params.id) ? params.id[0] : params.id;

  const { addItem, openCart } = useCart();
  const [mode, setMode] = useState<DeliveryMode>("digital");
  const [added, setAdded] = useState(false);
  const [plan, setPlan] = useState<HousePlan | undefined>(undefined);
  const [loading, setLoading] = useState(true);
  const [customOpen, setCustomOpen] = useState(false);
  const [customForm, setCustomForm] = useState({ name: "", email: "", phone: "", request: "" });
  const [customStatus, setCustomStatus] = useState("");
  const [customSubmitting, setCustomSubmitting] = useState(false);

  useEffect(() => {
    let active = true;
    fetch("/api/plans-catalogue")
      .then((r) => r.json())
      .then((d: { plans: HousePlan[] }) => {
        if (active) setPlan((d.plans ?? []).find((p) => p.id === id));
      })
      .catch(() => {})
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-ud-light-gray flex items-center justify-center px-6 pt-24">
        <p className="text-ud-dark/50 text-sm">Loading plan…</p>
      </div>
    );
  }

  if (!plan) {
    return (
      <div className="min-h-screen bg-ud-light-gray flex items-center justify-center px-6 pt-24">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-ud-dark mb-3">Plan not found</h2>
          <p className="text-ud-dark/50 mb-6">This house plan may have been moved or removed.</p>
          <Link href="/shop/plans" className="bg-ud-burgundy text-white text-sm font-bold px-6 py-3 rounded-[4px] hover:bg-ud-burgundy-hover transition-colors">
            Browse House Plans
          </Link>
        </div>
      </div>
    );
  }

  const price = planPrice(plan, mode);

  const handleAdd = () => {
    addItem({
      productId: plan.id,
      kind: "plan",
      name: plan.name,
      unit: mode === "digital" ? "digital download" : "printed copy",
      priceKES: price,
      image: plan.image,
      sellerId: "",
      sellerName: "Ujenzi Dhabiti",
      deliveryMode: mode,
    });
    setAdded(true);
    openCart();
    setTimeout(() => setAdded(false), 2000);
  };

  const submitCustomization = async (event: React.FormEvent) => {
    event.preventDefault();
    setCustomSubmitting(true);
    setCustomStatus("");
    try {
      const response = await fetch("/api/plan-customization", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...customForm, planId: plan.id }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Could not submit request");
      setCustomStatus("Request received. Our team will contact you to confirm the changes.");
      setCustomForm({ name: "", email: "", phone: "", request: "" });
    } catch (error) {
      setCustomStatus(error instanceof Error ? error.message : "Could not submit request");
    } finally {
      setCustomSubmitting(false);
    }
  };

  const specs = [
    plan.bedrooms !== undefined ? { icon: BedDouble, label: `${plan.bedrooms} Bedrooms` } : null,
    plan.bathrooms !== undefined ? { icon: Bath, label: `${plan.bathrooms} Bathrooms` } : null,
    { icon: Layers, label: `${plan.floors} ${plan.floors === 1 ? "Floor" : "Floors"}` },
    { icon: Maximize, label: `${plan.plinthAreaSqM} m² plinth` },
  ].filter(Boolean) as { icon: typeof BedDouble; label: string }[];

  return (
    <div className="min-h-screen bg-ud-light-gray pt-24 pb-16">
      <div className="max-w-content mx-auto px-6">
        <Link href="/shop/plans" className="inline-flex items-center gap-1.5 text-sm font-semibold text-ud-dark/60 hover:text-ud-burgundy transition-colors mb-6">
          <ArrowLeft size={15} /> All house plans
        </Link>

        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12">
          {/* Image */}
          <div className="relative h-72 md:h-[460px] rounded-[4px] overflow-hidden shadow-sm">
            <Image src={plan.image} alt={plan.name} fill className="object-cover" sizes="(max-width: 1024px) 100vw, 50vw" priority />
            <span className="absolute top-4 left-4 bg-ud-dark/75 text-white text-xs font-bold uppercase tracking-wide px-3 py-1.5 rounded-[4px]">
              {plan.category}
            </span>
          </div>

          {/* Details */}
          <div>
            <div className="text-xs font-bold uppercase tracking-[0.2em] text-ud-burgundy mb-2">{plan.planType}</div>
            <h1 className="text-2xl md:text-3xl font-bold text-ud-dark mb-4">{plan.name}</h1>
            <p className="text-ud-dark/65 font-light leading-relaxed mb-6">{plan.description}</p>

            <div className="grid grid-cols-2 gap-3 mb-7">
              {specs.map((s) => {
                const Icon = s.icon;
                return (
                  <div key={s.label} className="flex items-center gap-2.5 bg-white rounded-[4px] px-4 py-3 border border-ud-dark/8">
                    <Icon size={18} className="text-ud-burgundy flex-shrink-0" />
                    <span className="text-sm font-semibold text-ud-dark">{s.label}</span>
                  </div>
                );
              })}
            </div>

            {/* Delivery mode selector */}
            <div className="mb-6">
              <p className="text-xs font-bold uppercase tracking-wider text-ud-dark/50 mb-3">Choose Format</p>
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => setMode("digital")}
                  className={`text-left p-4 rounded-[4px] border-2 transition-colors ${mode === "digital" ? "border-ud-burgundy bg-ud-burgundy/5" : "border-ud-dark/15 hover:border-ud-dark/30"}`}
                >
                  <Download size={18} className={mode === "digital" ? "text-ud-burgundy mb-2" : "text-ud-dark/40 mb-2"} />
                  <div className="text-sm font-bold text-ud-dark">Digital Download</div>
                  <div className="text-xs text-ud-dark/50 mb-1.5">
                    {plan.downloadFile
                      ? `PDF · ${(plan.downloadSizeBytes ? plan.downloadSizeBytes / 1024 : 0).toFixed(0)} KB · instant after payment`
                      : "Instant PDF after payment"}
                  </div>
                  <div className="text-base font-bold text-ud-burgundy">KES {plan.priceDigitalKES.toLocaleString()}</div>
                </button>
                <button
                  onClick={() => setMode("print")}
                  className={`text-left p-4 rounded-[4px] border-2 transition-colors ${mode === "print" ? "border-ud-burgundy bg-ud-burgundy/5" : "border-ud-dark/15 hover:border-ud-dark/30"}`}
                >
                  <Truck size={18} className={mode === "print" ? "text-ud-burgundy mb-2" : "text-ud-dark/40 mb-2"} />
                  <div className="text-sm font-bold text-ud-dark">Printed Copy</div>
                  <div className="text-xs text-ud-dark/50 mb-1.5">Delivered to you</div>
                  <div className="text-base font-bold text-ud-burgundy">KES {plan.pricePrintKES.toLocaleString()}</div>
                </button>
              </div>
            </div>

            <button
              onClick={handleAdd}
              className="w-full flex items-center justify-center gap-2 bg-ud-burgundy text-white text-sm font-bold py-4 rounded-[4px] hover:bg-ud-burgundy-hover transition-colors"
            >
              {added ? <><Check size={16} /> Added to cart</> : <><ShoppingCart size={16} /> Add to Cart — KES {price.toLocaleString()}</>}
            </button>

            <div className="mt-5 space-y-2 text-xs text-ud-dark/55">
              <p className="flex items-start gap-2"><Check size={14} className="text-ud-burgundy flex-shrink-0 mt-0.5" />Architectural drawings ready for approval and construction.</p>
              <p className="flex items-start gap-2"><Check size={14} className="text-ud-burgundy flex-shrink-0 mt-0.5" />Need modifications? <button type="button" onClick={() => setCustomOpen((open) => !open)} className="text-ud-burgundy font-semibold hover:underline">Request a custom plan</button>.</p>
            </div>

            {customOpen && (
              <form onSubmit={submitCustomization} className="mt-6 border border-ud-burgundy/20 rounded-[4px] p-5 bg-ud-burgundy/[0.03] space-y-3">
                <h2 className="text-base font-bold text-ud-dark">Request changes to this plan</h2>
                <p className="text-xs text-ud-dark/55">Tell us what you want changed. This is a request for review, not an automatic design approval.</p>
                {(["name", "email", "phone"] as const).map((field) => (
                  <input key={field} required={field !== "phone"} type={field === "email" ? "email" : field === "phone" ? "tel" : "text"} placeholder={field === "name" ? "Full name" : field === "email" ? "Email address" : "Phone (optional)"} value={customForm[field]} onChange={(event) => setCustomForm((current) => ({ ...current, [field]: event.target.value }))} className="w-full border border-ud-dark/20 rounded-[4px] px-3 py-2 text-sm bg-white" />
                ))}
                <textarea required rows={4} placeholder="Describe the rooms, dimensions, layout, or other changes you need" value={customForm.request} onChange={(event) => setCustomForm((current) => ({ ...current, request: event.target.value }))} className="w-full border border-ud-dark/20 rounded-[4px] px-3 py-2 text-sm bg-white resize-none" />
                <button type="submit" disabled={customSubmitting} className="w-full bg-ud-burgundy text-white text-sm font-bold py-2.5 rounded-[4px] disabled:opacity-50">{customSubmitting ? "Sending…" : "Send customization request"}</button>
                {customStatus && <p className="text-xs text-ud-dark/65" role="status">{customStatus}</p>}
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
