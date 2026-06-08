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
  sellerId: string;
  sellerName: string;
  sellerVerified: boolean;
  sellerRating: number;
  sellerReviewCount: number;
}

// "Materials & Equipment" — rendered on the dark blueprint backdrop that flows
// down from the hero. White product cards pop against the dark.
export default function HomeProducts() {
  const [products, setProducts] = useState<ApiProduct[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/products")
      .then((r) => r.json())
      .then((data) => setProducts((data.products ?? []).slice(0, 8)))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  return (
    <section className="relative py-16 md:py-20">
      <div className="max-w-content mx-auto px-6">
        <div className="flex items-end justify-between mb-8">
          <div>
            <div className="text-xs font-bold uppercase tracking-[0.25em] text-white/55 mb-2">Shop</div>
            <h2 className="text-2xl md:text-3xl font-bold text-white">Materials &amp; Equipment</h2>
          </div>
          <Link href="/shop" className="hidden sm:inline-flex items-center gap-1.5 text-sm font-semibold text-white hover:text-white/70 whitespace-nowrap transition-colors">
            Shop all <ArrowRight size={15} />
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="bg-white/90 rounded-[4px] shadow-sm overflow-hidden animate-pulse">
                <div className="h-44 bg-ud-dark/10" />
                <div className="p-5 space-y-3">
                  <div className="h-4 bg-ud-dark/10 rounded w-3/4" />
                  <div className="h-3 bg-ud-dark/10 rounded w-full" />
                  <div className="h-8 bg-ud-burgundy/20 rounded-[4px] w-full mt-3" />
                </div>
              </div>
            ))}
          </div>
        ) : products.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {products.map((p) => (
              <ProductCard key={p.id} product={{
                id: p.id,
                name: p.name,
                category: p.category as ProductCategory,
                description: p.description,
                priceKES: p.priceKES,
                unit: p.unit,
                inStock: p.stock > 0,
                image: p.images[0] ?? "",
                sellerId: p.sellerId,
                sellerName: p.sellerName,
                sellerVerified: p.sellerVerified,
                sellerRating: p.sellerRating,
                sellerReviewCount: p.sellerReviewCount,
                specs: p.specs ?? undefined,
              }} />
            ))}
          </div>
        ) : (
          <p className="text-white/60 text-sm">Products are being added. Check back shortly.</p>
        )}

        <div className="mt-8 sm:hidden">
          <Link href="/shop" className="inline-flex items-center gap-1.5 text-sm font-semibold text-white hover:text-white/70">
            Shop all <ArrowRight size={15} />
          </Link>
        </div>
      </div>
    </section>
  );
}
