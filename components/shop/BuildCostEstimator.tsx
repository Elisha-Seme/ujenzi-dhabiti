"use client";

import { Calculator } from "lucide-react";
import React from "react";

export interface BuildCostItem {
  id: string;
  name: string;
  unit: string;
  priceKES: number;
  coverageSqmPerUnit: number;
}

/**
 * Transparent material-only estimate based on the catalogue coverage value.
 * Labour, delivery, structure, wastage beyond the built-in allowance, and
 * other materials are intentionally excluded from the calculation.
 */
export default function BuildCostEstimator({ products }: { products: BuildCostItem[] }) {
  const [productId, setProductId] = React.useState("");
  const [area, setArea] = React.useState("");
  const product = products.find((item) => item.id === productId);
  const areaSqm = Math.max(0, Number(area) || 0);
  const quantity = product && areaSqm > 0 ? Math.ceil((areaSqm * 1.1) / product.coverageSqmPerUnit) : 0;
  const total = product ? quantity * product.priceKES : 0;

  return (
    <div className="bg-white border border-ud-dark/10 rounded-[4px] p-4">
      <div className="flex items-center gap-2 mb-1">
        <Calculator className="w-4 h-4 text-ud-burgundy" />
        <h3 className="text-sm font-bold text-ud-dark">Build-Cost Estimator</h3>
      </div>
      <p className="text-[11px] text-ud-dark/50 leading-relaxed mb-3">
        Estimate material cost for a measured area. Includes a 10% allowance for cuts and wastage.
      </p>

      <label className="block text-xs font-semibold text-ud-dark/60 mb-1" htmlFor="build-cost-material">Material</label>
      <select
        id="build-cost-material"
        value={productId}
        onChange={(event) => setProductId(event.target.value)}
        className="w-full border border-ud-dark/20 rounded-[4px] px-3 py-2 text-sm bg-white focus:outline-none focus:border-ud-burgundy mb-3"
      >
        <option value="">Select a coverage-based material…</option>
        {products.map((item) => <option key={item.id} value={item.id}>{item.name}</option>)}
      </select>

      <label className="block text-xs font-semibold text-ud-dark/60 mb-1" htmlFor="build-cost-area">Area (m²)</label>
      <input
        id="build-cost-area"
        type="number"
        min="0"
        step="0.1"
        value={area}
        onChange={(event) => setArea(event.target.value)}
        placeholder="e.g. 120"
        className="w-full border border-ud-dark/20 rounded-[4px] px-3 py-2 text-sm focus:outline-none focus:border-ud-burgundy"
      />

      {product && quantity > 0 && (
        <div className="mt-3 border-t border-ud-dark/10 pt-3 space-y-1 text-xs">
          <div className="flex justify-between text-ud-dark/60"><span>Estimated quantity</span><strong className="text-ud-dark">{quantity} {product.unit.replace(/^per /, "")}</strong></div>
          <div className="flex justify-between text-ud-dark/60"><span>Material estimate</span><strong className="text-ud-dark">KES {total.toLocaleString()}</strong></div>
        </div>
      )}
      <p className="text-[10px] text-ud-dark/40 leading-relaxed mt-3">Material-only estimate; confirm labour, delivery, specification, and final quantities with Ujenzi Dhabiti.</p>
    </div>
  );
}
