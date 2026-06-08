"use client";

import { ProductCategory, PRODUCT_CATEGORIES } from "@/lib/products";

interface ShopFiltersProps {
  active: ProductCategory | "All";
  onChange: (cat: ProductCategory | "All") => void;
  counts: Record<string, number>;
}

export default function ShopFilters({ active, onChange, counts }: ShopFiltersProps) {
  const all: (ProductCategory | "All")[] = ["All", ...PRODUCT_CATEGORIES];

  return (
    <div className="flex flex-wrap gap-2">
      {all.map((cat) => {
        const count = cat === "All" ? counts.__total : (counts[cat] ?? 0);
        return (
          <button
            key={cat}
            onClick={() => onChange(cat)}
            className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold rounded-[4px] border transition-colors duration-150 ${
              active === cat
                ? "bg-ud-burgundy text-white border-ud-burgundy"
                : "bg-ud-light-gray text-ud-dark/70 border-transparent hover:border-ud-burgundy hover:text-ud-burgundy"
            }`}
          >
            {cat}
            <span
              className={`text-[10px] font-bold rounded px-1 py-0.5 leading-none ${
                active === cat ? "bg-white/20 text-white" : "bg-ud-dark/10 text-ud-dark/50"
              }`}
            >
              {count}
            </span>
          </button>
        );
      })}
    </div>
  );
}
