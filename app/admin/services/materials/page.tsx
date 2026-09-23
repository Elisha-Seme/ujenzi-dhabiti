"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";

type Service = { id: string; slug: string; title: string; materialProductIds: string[] };
type Product = { id: string; name: string; category: string; priceKES: number; isActive: boolean };

export default function ServiceMaterialsAdminPage() {
  const [services, setServices] = useState<Service[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedServiceId, setSelectedServiceId] = useState("");
  const [selectedProductIds, setSelectedProductIds] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("/api/admin/service-materials")
      .then(async (res) => {
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Could not load materials");
        return data as { services: Service[]; products: Product[] };
      })
      .then((data) => {
        setServices(data.services);
        setProducts(data.products);
        if (data.services.length) {
          setSelectedServiceId(data.services[0].id);
          setSelectedProductIds(data.services[0].materialProductIds);
        }
      })
      .catch((err) => setError(err instanceof Error ? err.message : "Could not load materials"))
      .finally(() => setLoading(false));
  }, []);

  const currentService = services.find((service) => service.id === selectedServiceId);
  const categories = useMemo(() => Array.from(new Set(products.map((product) => product.category))), [products]);

  function selectService(id: string) {
    const service = services.find((row) => row.id === id);
    setSelectedServiceId(id);
    setSelectedProductIds(service?.materialProductIds ?? []);
    setMessage("");
    setError("");
  }

  function toggleProduct(id: string) {
    setSelectedProductIds((ids) => ids.includes(id) ? ids.filter((item) => item !== id) : [...ids, id]);
    setMessage("");
  }

  async function save() {
    if (!currentService) return;
    setSaving(true);
    setError("");
    setMessage("");
    try {
      const response = await fetch("/api/admin/service-materials", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ serviceId: currentService.id, productIds: selectedProductIds }),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || "Could not save materials");
      setServices((rows) => rows.map((row) => row.id === currentService.id ? { ...row, materialProductIds: result.materialProductIds } : row));
      setMessage("Service materials saved. Check the public service page to review the selection.");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not save materials");
    } finally {
      setSaving(false);
    }
  }

  if (loading) return <p className="p-8 text-ud-dark/60">Loading services and products…</p>;
  return (
    <div className="p-5 md:p-8 max-w-5xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-ud-dark">Service Materials</h1>
        <p className="text-sm text-ud-dark/60 mt-2">Select real catalogue products for each service. No quantities or prices are fixed here; customers choose quantities and current shop prices apply.</p>
      </div>
      {error && <p role="alert" className="text-sm text-ud-burgundy">{error}</p>}
      {message && <p role="status" className="text-sm text-green-700">{message}</p>}
      {services.length === 0 ? (
        <p className="text-sm text-ud-dark/60">No services available. Add one in the <Link href="/admin/services" className="underline">Services Catalog</Link>.</p>
      ) : (
        <>
          <label className="block text-sm font-semibold text-ud-dark" htmlFor="service-material-parent">Service</label>
          <select id="service-material-parent" value={selectedServiceId} onChange={(event) => selectService(event.target.value)} className="w-full max-w-md border border-ud-dark/20 rounded-[4px] p-3 bg-white">
            {services.map((service) => <option key={service.id} value={service.id}>{service.title}</option>)}
          </select>
          <p className="text-sm text-ud-dark/60">{selectedProductIds.length} selected for {currentService?.title}. Only select products that genuinely belong to this service.</p>
          <div className="space-y-5">
            {categories.map((category) => (
              <fieldset key={category} className="border border-ud-dark/10 rounded-[4px] bg-white p-4">
                <legend className="px-2 font-semibold text-ud-dark">{category}</legend>
                <div className="grid sm:grid-cols-2 gap-2">
                  {products.filter((product) => product.category === category).map((product) => (
                    <label key={product.id} className="flex items-start gap-3 p-2 text-sm text-ud-dark/80">
                      <input type="checkbox" checked={selectedProductIds.includes(product.id)} onChange={() => toggleProduct(product.id)} className="mt-0.5 accent-ud-burgundy" />
                      <span>{product.name} <span className="text-ud-dark/50">— KES {product.priceKES.toLocaleString("en-KE")}{!product.isActive ? " (not currently published)" : ""}</span></span>
                    </label>
                  ))}
                </div>
              </fieldset>
            ))}
          </div>
          <div className="flex flex-wrap gap-3 items-center">
            <button type="button" onClick={save} disabled={saving} className="bg-ud-burgundy text-white px-5 py-3 rounded-[4px] text-sm font-semibold disabled:opacity-50">{saving ? "Saving…" : "Save service materials"}</button>
            {currentService && <Link href={`/services/${currentService.slug}#materials`} target="_blank" className="text-sm font-semibold text-ud-burgundy underline">Preview on site</Link>}
          </div>
        </>
      )}
    </div>
  );
}
