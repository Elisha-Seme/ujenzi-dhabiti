"use client";
import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
type Rate = { id: string; buildingType: string; finishLevel: string; ratePerSqM: number; labourPercent: number; wastagePercent: number; locationFactor: number; notes?: string | null };
export default function EstimatorPage() {
  const [rates, setRates] = useState<Rate[]>([]);
  const [rateId, setRateId] = useState("");
  const [area, setArea] = useState(100);
  useEffect(() => { fetch("/api/estimator-rates").then((r) => r.json()).then((rows) => { setRates(rows); setRateId(rows[0]?.id ?? ""); }); }, []);
  const rate = rates.find((item) => item.id === rateId);
  const estimate = useMemo(() => {
    if (!rate || area <= 0) return null;
    const base = area * rate.ratePerSqM * (rate.locationFactor / 100);
    const wastage = base * rate.wastagePercent / 100;
    const labour = base * rate.labourPercent / 100;
    return { base, wastage, labour, total: base + wastage + labour };
  }, [rate, area]);
  return <main className="max-w-3xl mx-auto px-6 py-20">
    <h1 className="text-3xl font-bold text-ud-dark">Build Cost Estimator</h1>
    <p className="mt-2 text-sm text-ud-dark/60">Indicative planning estimate only; request a formal site-specific quotation before committing funds.</p>
    <div className="mt-8 bg-white border rounded p-6 grid sm:grid-cols-2 gap-5">
      <label className="text-sm font-semibold">Building & finish<select value={rateId} onChange={(e) => setRateId(e.target.value)} className="mt-1 w-full border rounded px-3 py-2"><option value="">Select…</option>{rates.map((r) => <option key={r.id} value={r.id}>{r.buildingType} · {r.finishLevel}</option>)}</select></label>
      <label className="text-sm font-semibold">Floor area (m²)<input type="number" min="1" value={area} onChange={(e) => setArea(Number(e.target.value))} className="mt-1 w-full border rounded px-3 py-2" /></label>
    </div>
    {estimate && <section className="mt-6 border rounded overflow-hidden">
      {[["Materials/base", estimate.base], ["Wastage allowance", estimate.wastage], ["Labour allowance", estimate.labour], ["Indicative total", estimate.total]].map(([label, value]) => <div key={String(label)} className="flex justify-between border-b last:border-0 px-5 py-3"><span>{label}</span><strong>KES {Number(value).toLocaleString(undefined, { maximumFractionDigits: 0 })}</strong></div>)}
      <div className="p-5"><p className="text-xs text-ud-dark/50">{rate?.notes}</p><Link href={`/request-a-quote?request=estimator&product=${encodeURIComponent(`Estimate for ${area}m² ${rate?.buildingType}`)}`} className="mt-4 inline-block bg-ud-burgundy text-white px-4 py-2 rounded text-sm font-bold">Request formal quote</Link></div>
    </section>}
    {!rates.length && <p className="mt-6 text-sm text-ud-dark/50">Estimator rates are awaiting approval.</p>}
  </main>;
}
