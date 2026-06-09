"use client";

import { useState } from "react";
import Link from "next/link";
import { Calculator, ShoppingCart, Check } from "lucide-react";
import { useCart } from "@/context/CartContext";

export interface BulkItem {
  id: string;
  name: string;
  unit: string;
  priceKES: number;
  image: string;
}

// Quick bulk-order estimate: pick a product, enter a quantity, see the total —
// then add it to the cart or request a volume quote.
export default function BulkCalculator({ products }: { products: BulkItem[] }) {
  const { addItem } = useCart();
  const [id, setId] = useState("");
  const [qty, setQty] = useState("");
  const [added, setAdded] = useState(false);

  const p = products.find((x) => x.id === id);
  const n = Math.max(0, Math.floor(Number(qty) || 0));
  const total = p && n > 0 ? p.priceKES * n : 0;

  const add = () => {
    if (!p || n < 1) return;
    addItem({ productId: p.id, kind: "material", name: p.name, unit: p.unit, priceKES: p.priceKES, image: p.image, sellerId: "", sellerName: "Ujenzi Dhabiti" }, n);
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  };

  return (
    <div className="bg-white border border-ud-dark/10 rounded-[4px] p-4">
      <div className="flex items-center gap-2 mb-3">
        <Calculator className="w-4 h-4 text-ud-burgundy" />
        <h3 className="text-sm font-bold text-ud-dark">Bulk Calculator</h3>
      </div>

      <label className="block text-xs font-semibold text-ud-dark/60 mb-1">Product</label>
      <select value={id} onChange={(e) => setId(e.target.value)} className="w-full border border-ud-dark/20 rounded-[4px] px-3 py-2 text-sm bg-white focus:outline-none focus:border-ud-burgundy mb-3">
        <option value="">Select a product…</option>
        {products.map((x) => <option key={x.id} value={x.id}>{x.name}</option>)}
      </select>

      <label className="block text-xs font-semibold text-ud-dark/60 mb-1">Quantity {p ? `(${p.unit.replace(/^per /, "")})` : ""}</label>
      <input type="number" min="0" value={qty} onChange={(e) => setQty(e.target.value)} placeholder="e.g. 250" className="w-full border border-ud-dark/20 rounded-[4px] px-3 py-2 text-sm focus:outline-none focus:border-ud-burgundy" />

      {p && n > 0 && (
        <>
          <div className="mt-3 flex items-center justify-between text-sm">
            <span className="text-ud-dark/60">{n} × KES {p.priceKES.toLocaleString()}</span>
            <span className="font-bold text-ud-dark">KES {total.toLocaleString()}</span>
          </div>
          <button onClick={add} className="mt-3 w-full flex items-center justify-center gap-1.5 bg-ud-burgundy text-white text-xs font-bold py-2.5 rounded-[4px] hover:bg-ud-burgundy-hover transition-colors">
            {added ? <><Check className="w-4 h-4" /> Added</> : <><ShoppingCart className="w-4 h-4" /> Add {n} to cart</>}
          </button>
          <Link href={`/request-a-quote?product=${encodeURIComponent(p.name)}`} className="mt-2 block text-center text-[11px] font-semibold text-ud-burgundy/80 hover:text-ud-burgundy hover:underline">
            Request a volume quote →
          </Link>
        </>
      )}
    </div>
  );
}
