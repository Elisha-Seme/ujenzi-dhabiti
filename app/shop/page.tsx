"use client";

import { useState, useMemo, useCallback, useRef, useEffect, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Search, X, Home, ArrowRight, SlidersHorizontal, ChevronDown } from "lucide-react";
import SectionHero from "@/components/ui/SectionHero";
import ProductCard from "@/components/shop/ProductCard";
import DeliveryEstimator from "@/components/shop/DeliveryEstimator";
import BulkCalculator from "@/components/shop/BulkCalculator";
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
  brand: string | null;
  materialType: string | null;
}

function ShopContent() {
  const searchParams = useSearchParams();
  const urlCat = searchParams.get("category");

  const [allProducts, setAllProducts] = useState<ApiProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState<ProductCategory | "All">("All");
  const [rawSearch, setRawSearch] = useState("");
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState<SortOption>("relevance");
  const [priceMin, setPriceMin] = useState("");
  const [priceMax, setPriceMax] = useState("");
  const [inStockOnly, setInStockOnly] = useState(false);
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
  const [showFiltersMobile, setShowFiltersMobile] = useState(false);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    fetch("/api/products")
      .then((r) => r.json())
      .then((data) => setAllProducts(data.products ?? []))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (urlCat && (PRODUCT_CATEGORIES as string[]).includes(urlCat)) {
      setActiveCategory(urlCat as ProductCategory);
    }
  }, [urlCat]);

  const handleSearchChange = useCallback((v: string) => {
    setRawSearch(v);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => setSearch(v), 250);
  }, []);
  useEffect(() => () => { if (debounceRef.current) clearTimeout(debounceRef.current); }, []);

  const brands = useMemo(
    () => Array.from(new Set(allProducts.map((p) => p.brand).filter(Boolean) as string[])).sort(),
    [allProducts]
  );
  const materialTypes = useMemo(
    () => Array.from(new Set(allProducts.map((p) => p.materialType).filter(Boolean) as string[])).sort(),
    [allProducts]
  );

  const counts = useMemo(() => {
    const c: Record<string, number> = { All: allProducts.length };
    for (const cat of PRODUCT_CATEGORIES) c[cat] = allProducts.filter((p) => p.category === cat).length;
    return c;
  }, [allProducts]);

  const filtered = useMemo(() => {
    const minP = priceMin !== "" ? Number(priceMin) : null;
    const maxP = priceMax !== "" ? Number(priceMax) : null;
    const q = search.trim().toLowerCase();

    let results = allProducts.filter((p) => {
      if (activeCategory !== "All" && p.category !== activeCategory) return false;
      if (inStockOnly && p.stock < 1) return false;
      if (minP !== null && p.priceKES < minP) return false;
      if (maxP !== null && p.priceKES > maxP) return false;
      if (selectedBrands.length && !(p.brand && selectedBrands.includes(p.brand))) return false;
      if (selectedTypes.length && !(p.materialType && selectedTypes.includes(p.materialType))) return false;
      if (q) {
        const specText = p.specs ? Object.values(p.specs).join(" ") : "";
        const haystack = `${p.name} ${p.category} ${p.description} ${specText} ${p.brand ?? ""} ${p.materialType ?? ""}`.toLowerCase();
        if (!haystack.includes(q)) return false;
      }
      return true;
    });

    results = [...results].sort((a, b) => {
      if (sortBy === "price-asc") return a.priceKES - b.priceKES;
      if (sortBy === "price-desc") return b.priceKES - a.priceKES;
      if (sortBy === "name") return a.name.localeCompare(b.name);
      return 0;
    });
    return results;
  }, [allProducts, activeCategory, search, sortBy, priceMin, priceMax, inStockOnly, selectedBrands, selectedTypes]);

  const toggle = (list: string[], setList: (v: string[]) => void, value: string) =>
    setList(list.includes(value) ? list.filter((v) => v !== value) : [...list, value]);

  const activeFilterCount =
    (activeCategory !== "All" ? 1 : 0) + (priceMin ? 1 : 0) + (priceMax ? 1 : 0) +
    (inStockOnly ? 1 : 0) + selectedBrands.length + selectedTypes.length;

  const clearAll = () => {
    setActiveCategory("All");
    setPriceMin(""); setPriceMax("");
    setInStockOnly(false);
    setSelectedBrands([]); setSelectedTypes([]);
    setRawSearch(""); setSearch("");
  };

  const bulkItems = useMemo(
    () => allProducts.map((p) => ({ id: p.id, name: p.name, unit: p.unit, priceKES: p.priceKES, image: p.images[0] ?? "" })),
    [allProducts]
  );

  return (
    <>
      <SectionHero
        title="Shop Materials"
        subtitle="Building materials, finishes, and site essentials — supplied across East Africa."
      />

      <section className="bg-ud-light-gray min-h-screen py-12 md:py-16">
        <div className="max-w-content mx-auto px-6">
          {/* House plans cross-link */}
          <Link href="/shop/plans" className="group flex items-center justify-between gap-4 bg-ud-dark rounded-[4px] p-5 mb-6 hover:bg-ud-burgundy transition-colors">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-[4px] bg-white/10 flex items-center justify-center flex-shrink-0">
                <Home size={18} className="text-white" />
              </div>
              <div>
                <p className="text-sm font-bold text-white">Looking for house plans?</p>
                <p className="text-xs text-white/60">Ready-to-build plans — digital download or printed copy.</p>
              </div>
            </div>
            <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-white whitespace-nowrap">
              Browse plans <ArrowRight size={15} className="group-hover:translate-x-1 transition-transform" />
            </span>
          </Link>

          {/* Search bar */}
          <div className="relative mb-5">
            <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-ud-dark/35 pointer-events-none" />
            <input
              type="search"
              placeholder="Search materials by name, brand, or type…"
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

          {/* Mobile filters toggle */}
          <button
            onClick={() => setShowFiltersMobile((v) => !v)}
            className="lg:hidden flex items-center gap-2 px-4 py-2.5 mb-4 text-xs font-semibold rounded-[4px] border bg-white text-ud-dark/70 border-ud-dark/20 shadow-sm"
          >
            <SlidersHorizontal size={14} /> Filters{activeFilterCount > 0 ? ` (${activeFilterCount})` : ""}
          </button>

          <div className="grid lg:grid-cols-[260px_1fr] gap-6 lg:gap-8 items-start">
            {/* ─── Filters sidebar ─── */}
            <aside className={`${showFiltersMobile ? "block" : "hidden"} lg:block space-y-5 lg:sticky lg:top-24`}>
              <div className="bg-white border border-ud-dark/10 rounded-[4px] p-5">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-bold text-ud-dark">Filters</h3>
                  {activeFilterCount > 0 && (
                    <button onClick={clearAll} className="text-xs font-semibold text-ud-burgundy hover:underline">Clear all</button>
                  )}
                </div>

                {/* Category */}
                <FilterGroup label="Category">
                  <ul className="space-y-1">
                    {(["All", ...PRODUCT_CATEGORIES] as (ProductCategory | "All")[]).map((cat) => (
                      <li key={cat}>
                        <button
                          onClick={() => setActiveCategory(cat)}
                          className={`w-full flex items-center justify-between text-left text-sm px-2 py-1.5 rounded-[4px] transition-colors ${activeCategory === cat ? "bg-ud-burgundy/10 text-ud-burgundy font-semibold" : "text-ud-dark/70 hover:bg-ud-light-gray"}`}
                        >
                          <span>{cat}</span>
                          <span className="text-xs opacity-60">{counts[cat] ?? 0}</span>
                        </button>
                      </li>
                    ))}
                  </ul>
                </FilterGroup>

                {/* Price */}
                <FilterGroup label="Price (KES)">
                  <div className="flex items-center gap-2">
                    <input type="number" min="0" placeholder="Min" value={priceMin} onChange={(e) => setPriceMin(e.target.value)} className="w-full border border-ud-dark/20 rounded-[4px] px-2.5 py-1.5 text-sm focus:outline-none focus:border-ud-burgundy" />
                    <span className="text-ud-dark/30">–</span>
                    <input type="number" min="0" placeholder="Max" value={priceMax} onChange={(e) => setPriceMax(e.target.value)} className="w-full border border-ud-dark/20 rounded-[4px] px-2.5 py-1.5 text-sm focus:outline-none focus:border-ud-burgundy" />
                  </div>
                </FilterGroup>

                {/* Brand */}
                {brands.length > 0 && (
                  <FilterGroup label="Brand">
                    <CheckList options={brands} selected={selectedBrands} onToggle={(v) => toggle(selectedBrands, setSelectedBrands, v)} />
                  </FilterGroup>
                )}

                {/* Material type */}
                {materialTypes.length > 0 && (
                  <FilterGroup label="Material Type">
                    <CheckList options={materialTypes} selected={selectedTypes} onToggle={(v) => toggle(selectedTypes, setSelectedTypes, v)} />
                  </FilterGroup>
                )}

                {/* In stock */}
                <label className="flex items-center gap-2.5 cursor-pointer select-none pt-1">
                  <div onClick={() => setInStockOnly((v) => !v)} className={`w-10 h-5 rounded-full transition-colors relative ${inStockOnly ? "bg-ud-burgundy" : "bg-ud-dark/20"}`}>
                    <div className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-transform ${inStockOnly ? "translate-x-5" : "translate-x-0.5"}`} />
                  </div>
                  <span className="text-sm font-semibold text-ud-dark">In stock only</span>
                </label>
              </div>

              {/* Smart Tools */}
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-ud-dark/40 mb-3 px-1">Smart Tools</h3>
                <div className="space-y-4">
                  <BulkCalculator products={bulkItems} />
                  <DeliveryEstimator />
                </div>
              </div>
            </aside>

            {/* ─── Product grid ─── */}
            <div>
              <div className="flex items-center justify-between mb-5">
                <p className="text-xs text-ud-dark/40 font-semibold uppercase tracking-wide">
                  {loading ? "Loading…" : `${filtered.length} product${filtered.length !== 1 ? "s" : ""}`}
                </p>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as SortOption)}
                  className="bg-white border border-ud-dark/20 rounded-[4px] px-3 py-2 text-xs font-semibold text-ud-dark focus:outline-none focus:border-ud-burgundy shadow-sm cursor-pointer"
                >
                  <option value="relevance">Best match</option>
                  <option value="price-asc">Price: Low → High</option>
                  <option value="price-desc">Price: High → Low</option>
                  <option value="name">Name A → Z</option>
                </select>
              </div>

              {loading ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
                  {[...Array(6)].map((_, i) => (
                    <div key={i} className="bg-white rounded-[4px] shadow-sm overflow-hidden animate-pulse">
                      <div className="h-44 bg-ud-dark/10" />
                      <div className="p-5 space-y-3">
                        <div className="h-4 bg-ud-dark/10 rounded w-3/4" />
                        <div className="h-3 bg-ud-dark/8 rounded w-full" />
                        <div className="h-8 bg-ud-burgundy/20 rounded-[4px] w-full mt-2" />
                      </div>
                    </div>
                  ))}
                </div>
              ) : filtered.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
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
                      sellerId: "",
                      specs: product.specs ?? undefined,
                      brand: product.brand ?? undefined,
                      materialType: product.materialType ?? undefined,
                    }} />
                  ))}
                </div>
              ) : (
                <div className="bg-white rounded-[4px] border border-ud-dark/10 text-center py-20">
                  <p className="text-ud-dark/40 font-light text-lg">No products found.</p>
                  <p className="text-ud-dark/30 text-sm mt-1 mb-5">Try different keywords or clear your filters.</p>
                  <button onClick={clearAll} className="text-sm font-semibold text-ud-burgundy hover:underline">Clear all filters</button>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      <CTABanner />
    </>
  );
}

function FilterGroup({ label, children, defaultOpen = false }: { label: string; children: React.ReactNode; defaultOpen?: boolean }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="border-t border-ud-dark/8 first:border-t-0">
      <button
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-center justify-between py-3.5 text-left group"
      >
        <span className="text-[11px] font-bold uppercase tracking-wider text-ud-dark/50 group-hover:text-ud-dark/70 transition-colors">{label}</span>
        <ChevronDown
          size={14}
          className={`text-ud-dark/40 transition-transform duration-200 ${open ? "rotate-180" : ""}`}
        />
      </button>
      {open && <div className="pb-3">{children}</div>}
    </div>
  );
}

function CheckList({ options, selected, onToggle }: { options: string[]; selected: string[]; onToggle: (v: string) => void }) {
  return (
    <div className="max-h-44 overflow-y-auto pr-1 space-y-1">
      {options.map((opt) => (
        <label key={opt} className="flex items-center gap-2 cursor-pointer text-sm text-ud-dark/70 hover:text-ud-dark">
          <input type="checkbox" checked={selected.includes(opt)} onChange={() => onToggle(opt)} className="accent-ud-burgundy w-3.5 h-3.5 flex-shrink-0" />
          <span className="truncate">{opt}</span>
        </label>
      ))}
    </div>
  );
}

export default function ShopPage() {
  return (
    <Suspense fallback={<SectionHero title="Shop Materials" subtitle="Loading the catalogue…" />}>
      <ShopContent />
    </Suspense>
  );
}
