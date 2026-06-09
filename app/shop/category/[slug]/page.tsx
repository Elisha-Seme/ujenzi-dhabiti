import { notFound } from "next/navigation";
import { db, products } from "@/lib/db";
import { eq } from "drizzle-orm";
import Link from "next/link";
import { ArrowLeft, Home } from "lucide-react";
import CategoryBundle from "./CategoryBundle";
import CategoryClient from "./CategoryClient";

// A map to convert slugs to our formal category names
const SLUG_MAP: Record<string, string> = {
  "structural-materials": "Structural Materials",
  "gypsum-ceilings": "Gypsum & Ceilings",
  "paint-finishes": "Paint & Finishes",
  "flooring": "Flooring",
  "plumbing": "Plumbing",
  "electrical": "Electrical",
  "cabro-road-works": "Cabro & Road Works",
  "hardware": "Hardware",
};

// Map of category names to banner background images
const BANNER_MAP: Record<string, string> = {
  "Structural Materials": "https://images.unsplash.com/photo-1541888087425-ce81dfc46928?w=1600&q=80",
  "Gypsum & Ceilings": "https://images.unsplash.com/photo-1607400201889-565b1ee75f8e?w=1600&q=80",
  "Paint & Finishes": "https://images.unsplash.com/photo-1589939705384-5185137a7f0f?w=1600&q=80",
  "Flooring": "https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=1600&q=80",
  "Plumbing": "https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=1600&q=80",
  "Electrical": "https://images.unsplash.com/photo-1565608087341-404b25492fee?w=1600&q=80",
  "Cabro & Road Works": "https://images.unsplash.com/photo-1597844808175-0d5c4f7b3c8c?w=1600&q=80",
  "Hardware": "https://images.unsplash.com/photo-1530124566582-a618bc2615dc?w=1600&q=80",
};

export default async function CategoryPage({ params }: { params: { slug: string } }) {
  const categoryName = SLUG_MAP[params.slug];
  
  if (!categoryName) {
    notFound();
  }

  // Fetch products for this specific category
  const categoryProducts = await db
    .select()
    .from(products)
    .where(eq(products.category, categoryName));

  const bgImage = BANNER_MAP[categoryName] || "https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=1600&q=80";

  return (
    <div className="min-h-screen bg-ud-light-gray">
      {/* Header Banner */}
      <div className="relative h-[280px] md:h-[360px] bg-ud-dark flex items-center justify-center overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center opacity-40 mix-blend-overlay"
          style={{ backgroundImage: `url('${bgImage}')` }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-ud-dark/80 to-transparent" />
        
        <div className="relative z-10 text-center px-6 mt-16">
          <h1 className="text-3xl md:text-5xl font-bold text-white mb-4 drop-shadow-md">
            {categoryName}
          </h1>
          <div className="flex items-center justify-center gap-2 text-sm text-white/80 font-semibold">
            <Link href="/" className="hover:text-white transition-colors flex items-center gap-1">
              <Home className="w-3.5 h-3.5" /> Home
            </Link>
            <span>/</span>
            <Link href="/shop" className="hover:text-white transition-colors">Shop</Link>
            <span>/</span>
            <span className="text-ud-yellow">{categoryName}</span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="mb-8">
          <Link href="/shop" className="inline-flex items-center gap-2 text-sm font-bold text-ud-dark/60 hover:text-ud-burgundy transition-colors">
            <ArrowLeft className="w-4 h-4" /> Back to Full Shop
          </Link>
        </div>

        {/* Bundle Section */}
        <CategoryBundle categoryName={categoryName} />

        {/* Products & Subcategories */}
        <div className="mt-8">
          <h2 className="text-2xl font-bold text-ud-dark mb-6">Browse Materials</h2>
          {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
          <CategoryClient products={categoryProducts as any} />
        </div>
      </div>
    </div>
  );
}
