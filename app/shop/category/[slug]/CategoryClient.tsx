"use client";

import { useState, useMemo } from "react";
import ProductCard from "@/components/shop/ProductCard";

interface Product {
  id: string;
  name: string;
  category: string;
  description: string;
  unit: string;
  priceKES: number;
  image: string;
  inStock: boolean;
  brand?: string;
  materialType?: string;
}

export default function CategoryClient({ products }: { products: Product[] }) {
  const [activeSubcat, setActiveSubcat] = useState<string>("All");

  const subcategories = useMemo(() => {
    const subs = new Set<string>();
    products.forEach((p) => {
      if (p.materialType) subs.add(p.materialType);
    });
    return ["All", ...Array.from(subs).sort()];
  }, [products]);

  const filteredProducts = useMemo(() => {
    if (activeSubcat === "All") return products;
    return products.filter((p) => p.materialType === activeSubcat);
  }, [products, activeSubcat]);

  return (
    <div>
      {/* Subcategories Row */}
      {subcategories.length > 1 && (
        <div className="mb-8">
          <div className="flex items-center gap-2 overflow-x-auto pb-4 scrollbar-hide">
            {subcategories.map((sub) => (
              <button
                key={sub}
                onClick={() => setActiveSubcat(sub)}
                className={`flex-shrink-0 px-4 py-2 rounded-full text-sm font-bold border transition-colors ${
                  activeSubcat === sub
                    ? "bg-ud-burgundy text-white border-ud-burgundy"
                    : "bg-white text-ud-dark/70 border-ud-dark/10 hover:border-ud-dark/30 hover:text-ud-dark"
                }`}
              >
                {sub}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Products Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {filteredProducts.length > 0 ? (
          filteredProducts.map((p) => (
            <ProductCard
              key={p.id}
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              product={p as any}
            />
          ))
        ) : (
          <div className="col-span-full py-12 text-center text-ud-dark/50">
            No products found for this subcategory.
          </div>
        )}
      </div>
    </div>
  );
}
