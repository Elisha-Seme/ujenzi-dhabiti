"use client";

import { useState, useMemo, useCallback, useRef, useEffect } from "react";
import { Search, Truck, ClipboardList, Lock, X, SlidersHorizontal } from "lucide-react";
import SectionHero from "@/components/ui/SectionHero";
import ProductCard from "@/components/shop/ProductCard";
import ShopFilters from "@/components/shop/ShopFilters";
import { PRODUCT_CATEGORIES, ProductCategory } from "@/lib/products";
import CTABanner from "@/components/sections/CTABanner";

type SortOption = "relevance" | "price-asc" | "price-desc" | "name";

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

const INFO_ITEMS = [
  { icon: <Truck size={28} className="text-ud-burgundy mx-auto mb-3" />, title: "Delivery Across East Africa", body: "We deliver to Kenya, Uganda, Tanzania, Rwanda, and beyond. Freight costs included in your quote." },
  { icon: <ClipboardList size={28} className="text-ud-burgundy mx-auto mb-3" />, title: "Pay & Receive", body: "Add items to cart, pay via M-Pesa or card, and sellers dispatch directly to your site." },
  { icon: <Lock size={28} className="text-ud-burgundy mx-auto mb-3" />, title: "Bulk Order Discounts", body: "Volume pricing available for orders above KES 500,000. Contact our procurement team for rates." },
];

function scoreProduct(product: ApiProduct, query: string): number {
  if (!query.trim()) return 1;
  const q = query.toLowerCase();
  let score = 0;
  if (product.name.toLowerCase().includes(q)) score += 4;
  if (product.category.toLowerCase().includes(q)) score += 3;
  if (product.specs) {
    if (Object.values(product.specs).join(" ").toLowerCase().includes(q)) score += 2;
  }
  if (product.description.toLowerCase().includes(q)) score += 1;
  if (product.sellerName.toLowerCase().includes(q)) score += 1;
  return score;
}

export default function ShopPage() {
  const [allProducts, setAllProducts] = useState<ApiProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState<ProductCategory | "All">("All");
  const [rawSearch, setRawSearch] = useState("");
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState<SortOption>("relevance");
  const [priceMin, setPriceMin] = useState("");
  const [priceMax, setPriceMax] = useState("");
  const [inStockOnly, setInStockOnly] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Fetch all products once on mount
  useEffect(() => {
    fetch("/api/products")
      .then((r) => r.json())
      .then((data) => setAllProducts(data.products ?? []))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const handleSearchChange = useCallback((v: string) => {
    setRawSearch(v);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => setSearch(v), 280);
  }, []);

  useEffect(() => () => { if (debounceRef.current) clearTimeout(debounceRef.current); }, []);

  const filtered = useMemo(() => {
    const minP = priceMin !== "" ? Number(priceMin) : null;
    const maxP = priceMax !== "" ? Number(priceMax) : null;

    let results = allProducts.filter((p) => {
      if (activeCategory !== "All" && p.category !== activeCategory) return false;
      if (inStockOnly && p.stock < 1) return false;
      if (minP !== null && p.priceKES < minP) return false;
      if (maxP !== null && p.priceKES > maxP) return false;
      if (search.trim()) {
        const q = search.toLowerCase();
        const specText = p.specs ? Object.values(p.specs).join(" ") : "";
        const haystack = `${p.name} ${p.category} ${p.description} ${specText} ${p.sellerName}`.toLowerCase();
        if (!haystack.includes(q)) return false;
      }
      return true;
    });

    if (search.trim() && sortBy === "relevance") {
      results = results
        .map((p) => ({ p, score: scoreProduct(p, search) }))
        .sort((a, b) => b.score - a.score)
        .map(({ p }) => p);
    } else {
      results = [...results].sort((a, b) => {
        if (sortBy === "price-asc") return a.priceKES - b.priceKES;
        if (sortBy === "price-desc") return b.priceKES - a.priceKES;
        if (sortBy === "name") return a.name.localeCompare(b.name);
        return 0;
      });
    }
    return results;
  }, [allProducts, activeCategory, search, sortBy, priceMin, priceMax, inStockOnly]);

  const counts = useMemo(() => {
    const c: Record<string, number> = { __total: allProducts.length };
    for (const cat of PRODUCT_CATEGORIES) {
      c[cat] = allProducts.filter((p) => p.category === cat).length;
    }
    return c;
  }, [allProducts]);

  const activeFilterCount = [
    activeCategory !== "All", priceMin !== "", priceMax !== "", inStockOnly,
  ].filter(Boolean).length;

  const clearAll = () => {
    setActiveCategory("All");
    setPriceMin(""); setPriceMax("");
    setInStockOnly(false);
    setRawSearch(""); setSearch("");
    setSortBy("relevance");
  };

  return (
    <>
      <SectionHero
        title="Materials & Equipment"
        subtitle="Construction materials, safety gear, and heavy equipment — sourced and supplied across East Africa."
      />

      <section className="bg-ud-light-gray min-h-screen py-14 md:py-20">
        <div className="max-w-content mx-auto px-6">

          {/* Search bar */}
          <div className="flex flex-col sm:flex-row gap-3 mb-5">
            <div className="relative flex-1">
              <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-ud-dark/35 pointer-events-none" />
              <input
                type="search"
                placeholder="Search by name, material, spec, or seller…"
                value={rawSearch}
                onChange={(e) => handleSearchChange(e.target.value)}
                className="w-full pl-10 pr-4 py-3 text-sm bg-white border border-ud-dark/15 rounded-[4px] focus:outline-none focus:border-ud-burgundy transition-colors shadow-sm"
              />
              {rawSearch && (
                <button onClick={() => { setRawSearch(""); setSearch(""); }} className="absolute right-3 top-1/2 -translate-y-1/2 text-ud-dark/30 hover:text-ud-dark transition-colors">
                  <X size={14} />
                </button>
              )}
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setShowFilters((v) => !v)}
                className={`flex items-center gap-2 px-4 py-3 text-xs font-semibold rounded-[4px] border transition-colors shadow-sm whitespace-nowrap ${
                  showFilters || activeFilterCount > 0
                    ? "bg-ud-burgundy text-white border-ud-burgundy"
                    : "bg-white text-ud-dark/70 border-ud-dark/20 hover:border-ud-burgundy hover:text-ud-burgundy"
                }`}
              >
                <SlidersHorizontal size={14} />
                Filters
                {activeFilterCount > 0 && (
                  <span className="w-4 h-4 rounded-full bg-white/25 text-white text-[10px] font-bold flex items-center justify-center">{activeFilterCount}</span>
                )}
              </button>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as SortOption)}
                className="flex-1 sm:flex-none bg-white border border-ud-dark/20 rounded-[4px] px-3 py-3 text-xs font-semibold text-ud-dark focus:outline-none focus:border-ud-burgundy transition-colors shadow-sm cursor-pointer"
              >
                <option value="relevance">Best match</option>
                <option value="price-asc">Price: Low → High</option>
                <option value="price-desc">Price: High → Low</option>
                <option value="name">Name A → Z</option>
              </select>
            </div>
          </div>

          {/* Filter panel */}
          {showFilters && (
            <div className="bg-white border border-ud-dark/10 rounded-[4px] shadow-sm p-5 mb-5 grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
              <div className="sm:col-span-2 lg:col-span-4">
                <ShopFilters active={activeCategory} onChange={setActiveCategory} counts={counts} />
              </div>
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-ud-dark/50 mb-1.5">Min Price (KES)</label>
                <input type="number" min="0" placeholder="e.g. 500" value={priceMin} onChange={(e) => setPriceMin(e.target.value)}
                  className="w-full border border-ud-dark/20 rounded-[4px] px-3 py-2 text-sm text-ud-dark focus:outline-none focus:border-ud-burgundy transition-colors" />
              </div>
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-ud-dark/50 mb-1.5">Max Price (KES)</label>
                <input type="number" min="0" placeholder="e.g. 50,000" value={priceMax} onChange={(e) => setPriceMax(e.target.value)}
                  className="w-full border border-ud-dark/20 rounded-[4px] px-3 py-2 text-sm text-ud-dark focus:outline-none focus:border-ud-burgundy transition-colors" />
              </div>
              <div className="flex items-end">
                <label className="flex items-center gap-2.5 cursor-pointer select-none">
                  <div onClick={() => setInStockOnly((v) => !v)} className={`w-10 h-5 rounded-full transition-colors relative ${inStockOnly ? "bg-ud-burgundy" : "bg-ud-dark/20"}`}>
                    <div className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-transform ${inStockOnly ? "translate-x-5" : "translate-x-0.5"}`} />
                  </div>
                  <span className="text-sm font-semibold text-ud-dark">In stock only</span>
                </label>
              </div>
              <div className="flex items-end">
                <button onClick={clearAll} className="text-xs font-semibold text-ud-burgundy hover:underline">Clear all filters</button>
              </div>
            </div>
          )}

          {/* Active filter chips */}
          {(activeCategory !== "All" || priceMin || priceMax || inStockOnly || search) && (
            <div className="flex flex-wrap gap-2 mb-5">
              {search && <Chip label={`"${search}"`} onRemove={() => { setRawSearch(""); setSearch(""); }} />}
              {activeCategory !== "All" && <Chip label={activeCategory} onRemove={() => setActiveCategory("All")} />}
              {(priceMin || priceMax) && (
                <Chip
                  label={priceMin && priceMax ? `KES ${Number(priceMin).toLocaleString()} – ${Number(priceMax).toLocaleString()}` : priceMin ? `From KES ${Number(priceMin).toLocaleString()}` : `Up to KES ${Number(priceMax).toLocaleString()}`}
                  onRemove={() => { setPriceMin(""); setPriceMax(""); }}
                />
              )}
              {inStockOnly && <Chip label="In stock" onRemove={() => setInStockOnly(false)} />}
            </div>
          )}

          {/* Result count */}
          <p className="text-xs text-ud-dark/40 font-semibold uppercase tracking-wide mb-6">
            {loading ? "Loading products…" : `${filtered.length} product${filtered.length !== 1 ? "s" : ""}${activeCategory !== "All" ? ` in ${activeCategory}` : ""}${search ? ` matching "${search}"` : ""}`}
          </p>

          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="bg-white rounded-[4px] h-80 animate-pulse" />
              ))}
            </div>
          ) : filtered.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
              {filtered.map((product) => (
                <ProductCard key={product.id} product={{
                  id: product.id,
                  name: product.name,
                  category: product.category as ProductCategory,
                  description: product.description,
                  priceKES: product.priceKES,
                  unit: product.unit,
                  inStock: product.stock > 0,
                  image: product.images[0] ?? "",
                  sellerId: product.sellerId,
                  sellerName: product.sellerName,
                  sellerVerified: product.sellerVerified,
                  sellerRating: product.sellerRating,
                  sellerReviewCount: product.sellerReviewCount,
                  specs: product.specs ?? undefined,
                }} />
              ))}
            </div>
          ) : (
            <div className="text-center py-20">
              <p className="text-ud-dark/40 font-light text-lg">No products found.</p>
              <p className="text-ud-dark/30 text-sm mt-1 mb-5">Try different keywords or clear your filters.</p>
              <button onClick={clearAll} className="text-sm font-semibold text-ud-burgundy hover:underline">Clear all filters</button>
            </div>
          )}

          <div className="mt-16 bg-white border border-ud-dark/10 rounded-[4px] p-8 grid md:grid-cols-3 gap-6 text-center">
            {INFO_ITEMS.map((item) => (
              <div key={item.title}>
                {item.icon}
                <h3 className="text-sm font-bold text-ud-dark mb-2">{item.title}</h3>
                <p className="text-xs text-ud-dark/55 leading-relaxed">{item.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <CTABanner />
    </>
  );
}

function Chip({ label, onRemove }: { label: string; onRemove: () => void }) {
  return (
    <span className="inline-flex items-center gap-1.5 bg-ud-burgundy/10 text-ud-burgundy text-xs font-semibold px-3 py-1.5 rounded-[4px]">
      {label}
      <button onClick={onRemove} className="hover:opacity-70 transition-opacity"><X size={11} /></button>
    </span>
  );
}
