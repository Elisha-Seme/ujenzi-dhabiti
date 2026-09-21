"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { PackageSearch, ArrowRight } from "lucide-react";
import SectionHero from "@/components/ui/SectionHero";

// Track-order landing page: enter an order number to open its live status page
// (/track/[orderId]). Linked from the Help Center's "Track Order" tile.
export default function TrackLandingPage() {
  const router = useRouter();
  const [orderId, setOrderId] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const id = orderId.trim();
    if (id) router.push(`/track/${encodeURIComponent(id)}`);
  };

  return (
    <>
      <SectionHero
        title="Track Your Order"
        subtitle="Enter your order number to see its current status — from confirmation to delivery."
      />

      <section className="bg-ud-light-gray py-20 md:py-28">
        <div className="max-w-xl mx-auto px-6">
          <form onSubmit={handleSubmit} className="bg-white rounded-[4px] p-8 md:p-10 shadow-sm border border-ud-dark/8">
            <div className="w-12 h-12 rounded-[4px] bg-ud-burgundy/10 flex items-center justify-center mb-5">
              <PackageSearch className="w-6 h-6 text-ud-burgundy" strokeWidth={1.75} />
            </div>
            <h2 className="text-lg font-bold text-ud-dark mb-2">Where is my order?</h2>
            <p className="text-sm text-ud-dark/55 mb-6 leading-relaxed">
              Enter the order number from your confirmation email (for example,{" "}
              <span className="font-semibold text-ud-dark">UD-ABC123</span>). For delivery and contact details, use the secure tracking link in that email.
            </p>

            <label htmlFor="order-id" className="block text-xs font-semibold text-ud-dark/60 uppercase tracking-wider mb-1.5">
              Order Number *
            </label>
            <input
              id="order-id"
              required
              value={orderId}
              onChange={(e) => setOrderId(e.target.value)}
              placeholder="e.g. UD-ABC123"
              className="w-full border border-ud-dark/20 rounded-[4px] px-4 py-2.5 text-sm text-ud-dark placeholder:text-ud-dark/30 focus:outline-none focus:border-ud-burgundy transition-colors mb-5"
            />

            <button
              type="submit"
              className="w-full flex items-center justify-center gap-2 bg-ud-burgundy text-white text-sm font-bold py-3 rounded-[4px] hover:bg-ud-burgundy-hover transition-colors"
            >
              Track Order <ArrowRight size={14} />
            </button>
          </form>
        </div>
      </section>
    </>
  );
}
