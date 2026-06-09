"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import ProductCard from "@/components/shop/ProductCard";
import { ProductCategory } from "@/lib/products";

interface ApiProduct {
  id: string;
  name: string;
  category: string;
  description: string;
  priceKES: number;
  unit: string;
  stock: number;
  images: string[];
  specs: Record<string, string> | null;
}

// The four products called out in the wireframe (cement, gypsum, paint, tiles).
const FEATURED_IDS = ["str-cement", "gyp-board", "pnt-emulsion", "flr-ceramic"];

// "Featured Products" — Add to Cart + bulk-order, on a light section.
export default function HomeProducts() {
  const [products, setProducts] = useState<ApiProduct[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/products")
      .then((r) => r.json())
      .then((data: { products?: ApiProduct[] }) => {
        const all = data.products ?? [];
        const featured = FEATURED_IDS.map((id) => all.find((p) => p.id === id)).filter(Boolean) as ApiProduct[];
        // Top up to 4 if any featured id is missing
        const extra = all.filter((p) => !FEATURED_IDS.includes(p.id));
        setProducts([...featured, ...extra].slice(0, 4));
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  return (
    <section className="py-16 md:py-24">
      <div className="max-w-content mx-auto px-6">
        <div className="flex items-end justify-between mb-10">
          <div>
            <div className="text-xs font-bold uppercase tracking-[0.25em] text-ud-burgundy mb-2">Shop</div>
            <h2 className="text-3xl md:text-4xl font-bold text-white">Featured Products</h2>
          </div>
          <Link href="/shop" className="hidden sm:inline-flex items-center gap-1.5 text-sm font-semibold text-ud-burgundy hover:underline whitespace-nowrap">
            Shop all <ArrowRight size={15} />
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="bg-white/[0.04] border border-white/10 rounded-[4px] overflow-hidden animate-pulse">
                <div className="h-44 bg-white/[0.06]" />
                <div className="p-5 space-y-3">
                  <div className="h-4 bg-white/10 rounded w-3/4" />
                  <div className="h-3 bg-white/10 rounded w-full" />
                  <div className="h-8 bg-ud-burgundy/20 rounded-[4px] w-full mt-3" />
                </div>
              </div>
            ))}
          </div>
        ) : products.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {products.map((p, i) => (
              <ProductCard
                key={p.id}
                dark
                accentVariant={(i % 3) as 0 | 1 | 2}
                product={{
                  id: p.id,
                  name: p.name,
                  category: p.category as ProductCategory,
                  description: p.description,
                  priceKES: p.priceKES,
                  unit: p.unit,
                  inStock: p.stock > 0,
                  image: p.images[0] ?? "",
                  specs: p.specs ?? undefined,
                }}
              />
            ))}
          </div>
        ) : (
          <p className="text-ud-dark/50 text-sm">Products are being added. Check back shortly.</p>
        )}

        <div className="mt-8 sm:hidden">
          <Link href="/shop" className="inline-flex items-center gap-1.5 text-sm font-semibold text-ud-burgundy hover:underline">
            Shop all <ArrowRight size={15} />
          </Link>
        </div>
      </div>
    </section>
  );
}
