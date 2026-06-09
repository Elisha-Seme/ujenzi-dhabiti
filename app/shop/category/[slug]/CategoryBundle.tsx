"use client";

import { useState, useMemo } from "react";
import { Package, Plus, Calculator, CheckCircle2 } from "lucide-react";
import { useCart } from "@/context/CartContext";

// Example bundle components for Gypsum
const BUNDLE_COMPONENTS = [
  { id: "gyp-board", name: "Gypsum Board 12.5mm", unit: "per board", price: 1100, qtyPerSqm: 1 / 2.88 }, // 1 board per 2.88sqm
  { id: "gyp-channel", name: "Metal Furring Channel", unit: "per length", price: 450, qtyPerSqm: 1.2 },
  { id: "pnt-putty", name: "Skim Coat Wall Putty (20kg)", unit: "per 20kg bag", price: 1200, qtyPerSqm: 1 / 12 },
  { id: "hwd-roofnails", name: "Gypsum Screws (25kg)", unit: "per 25kg bag", price: 3500, qtyPerSqm: 0.05 },
];

export default function CategoryBundle({ categoryName }: { categoryName: string }) {
  const { addItem } = useCart();
  const [area, setArea] = useState("");
  const [added, setAdded] = useState(false);

  const calc = useMemo(() => {
    const a = Number(area);
    if (!a || a <= 0) return null;

    const items = BUNDLE_COMPONENTS.map((c) => ({
      ...c,
      neededQty: Math.ceil(a * c.qtyPerSqm),
    }));

    const totalCost = items.reduce((sum, item) => sum + item.neededQty * item.price, 0);

    return { items, totalCost };
  }, [area]);

  // If not Gypsum, hide the bundle (as per our plan, we're doing Gypsum specifically)
  if (categoryName !== "Gypsum & Ceilings") {
    return null;
  }


  const handleAddBundle = () => {
    if (!calc) return;
    
    calc.items.forEach((item) => {
      addItem(
        {
          productId: item.id,
          kind: "material",
          name: item.name,
          unit: item.unit,
          priceKES: item.price,
          image: "https://images.unsplash.com/photo-1607400201889-565b1ee75f8e?w=700&q=70", // generic fallback
          sellerId: "",
          sellerName: "Ujenzi Dhabiti",
        },
        item.neededQty
      );
    });

    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  return (
    <div className="bg-white rounded-[4px] shadow-sm border border-ud-burgundy/20 overflow-hidden mb-12">
      <div className="bg-ud-burgundy/5 p-6 border-b border-ud-burgundy/10 flex items-start gap-4">
        <div className="w-12 h-12 bg-ud-burgundy text-white rounded-[4px] flex items-center justify-center flex-shrink-0">
          <Package className="w-6 h-6" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-ud-dark mb-1">Complete Gypsum Package (per sqm)</h2>
          <p className="text-sm text-ud-dark/60 max-w-2xl">
            Save time calculating! Enter your total ceiling area, and we will automatically bundle all the materials you need—boards, framing, putty, and screws—in the right quantities.
          </p>
        </div>
      </div>

      <div className="p-6 md:p-8 flex flex-col md:flex-row gap-8">
        {/* Left: Input */}
        <div className="flex-1">
          <label className="text-sm font-bold text-ud-dark mb-2 block">Ceiling Area (sqm)</label>
          <div className="flex items-center gap-3">
            <div className="relative max-w-[200px] w-full">
              <Calculator className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-ud-dark/40" />
              <input
                type="number"
                min="1"
                placeholder="e.g. 50"
                value={area}
                onChange={(e) => setArea(e.target.value)}
                className="w-full pl-9 pr-4 py-3 border border-ud-dark/20 rounded-[4px] font-bold text-ud-dark focus:outline-none focus:border-ud-burgundy"
              />
            </div>
            {calc && (
              <span className="text-sm font-bold text-green-700 bg-green-50 px-3 py-1.5 rounded-full border border-green-200 inline-flex items-center gap-1">
                <CheckCircle2 className="w-4 h-4" /> Calculated
              </span>
            )}
          </div>
        </div>

        {/* Right: Results */}
        {calc && (
          <div className="flex-1 bg-ud-light-gray rounded-[4px] p-5">
            <h3 className="text-sm font-bold text-ud-dark mb-3 border-b border-ud-dark/10 pb-2">Included Materials:</h3>
            <ul className="space-y-2 mb-4">
              {calc.items.map((item) => (
                <li key={item.id} className="text-sm flex justify-between">
                  <span className="text-ud-dark/70">{item.name}</span>
                  <span className="font-semibold text-ud-dark">
                    {item.neededQty} x {item.price.toLocaleString()}
                  </span>
                </li>
              ))}
            </ul>
            <div className="border-t border-ud-dark/10 pt-3 flex items-end justify-between mb-4">
              <span className="text-sm font-bold text-ud-dark/60">Total Estimated Cost</span>
              <span className="text-2xl font-bold text-ud-dark">
                KES {calc.totalCost.toLocaleString()}
              </span>
            </div>
            <button
              onClick={handleAddBundle}
              disabled={added}
              className={`w-full py-3 rounded-[4px] font-bold flex items-center justify-center gap-2 transition-colors ${
                added 
                  ? "bg-green-600 text-white" 
                  : "bg-ud-burgundy text-white hover:bg-ud-burgundy-hover"
              }`}
            >
              {added ? (
                <>
                  <CheckCircle2 className="w-5 h-5" /> Added to Cart!
                </>
              ) : (
                <>
                  <Plus className="w-5 h-5" /> Add Package to Cart
                </>
              )}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
