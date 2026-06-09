"use client";

import { useEffect, useState } from "react";
import { Truck } from "lucide-react";
import { DELIVERY_ZONES, type DeliveryZone } from "@/lib/delivery";

// Informational delivery estimate. Rates come from the admin-managed delivery
// table (with the static module as fallback). The real fee is confirmed on the
// invoice — it is NOT added to the amount charged at checkout.
export default function DeliveryEstimator({ className = "" }: { className?: string }) {
  const [zones, setZones] = useState<DeliveryZone[]>(DELIVERY_ZONES);
  const [county, setCounty] = useState("");

  useEffect(() => {
    fetch("/api/delivery-zones")
      .then((r) => r.json())
      .then((d: { zones?: DeliveryZone[] }) => { if (d.zones?.length) setZones(d.zones); })
      .catch(() => {});
  }, []);

  const zone = zones.find((z) => z.county === county);

  return (
    <div className={`bg-white border border-ud-dark/10 rounded-[4px] p-4 ${className}`}>
      <div className="flex items-center gap-2 mb-3">
        <Truck className="w-4 h-4 text-ud-burgundy" />
        <h3 className="text-sm font-bold text-ud-dark">Delivery Estimator</h3>
      </div>
      <label className="block text-xs font-semibold text-ud-dark/60 mb-1">Delivery county</label>
      <select
        value={county}
        onChange={(e) => setCounty(e.target.value)}
        className="w-full border border-ud-dark/20 rounded-[4px] px-3 py-2 text-sm bg-white focus:outline-none focus:border-ud-burgundy"
      >
        <option value="">Select your county…</option>
        {zones.map((z) => (
          <option key={z.county} value={z.county}>{z.county}</option>
        ))}
      </select>
      {zone && (
        <div className="mt-3 flex items-center justify-between text-sm">
          <span className="text-ud-dark/60">Estimated delivery</span>
          <span className="font-bold text-ud-dark">≈ KES {zone.feeKES.toLocaleString()}</span>
        </div>
      )}
      <p className="mt-2 text-[11px] text-ud-dark/40">Estimate only — the exact delivery cost is confirmed on your invoice.</p>
    </div>
  );
}
