import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, BadgeCheck, Star, Phone } from "lucide-react";
import { db, sellers, products as productsTable } from "@/lib/db";
import { ProductCategory } from "@/lib/products";
import { and, eq } from "drizzle-orm";
import ProductCard from "@/components/shop/ProductCard";

interface Props {
  params: { id: string };
}

function Stars({ rating, count }: { rating: number; count: number }) {
  return (
    <div className="flex items-center gap-1.5">
      <div className="flex gap-0.5">
        {[1, 2, 3, 4, 5].map((s) => (
          <Star
            key={s}
            size={14}
            className={s <= Math.round(rating) ? "text-ud-burgundy fill-ud-burgundy" : "text-ud-burgundy"}
          />
        ))}
      </div>
      <span className="text-sm font-bold text-ud-dark">{rating}</span>
      <span className="text-sm text-ud-dark/50">({count} reviews)</span>
    </div>
  );
}

export default async function SellerPage({ params }: Props) {
  const [seller] = await db
    .select()
    .from(sellers)
    .where(and(eq(sellers.id, params.id), eq(sellers.status, "approved")))
    .limit(1);

  if (!seller) notFound();

  const products = await db
    .select()
    .from(productsTable)
    .where(and(eq(productsTable.sellerId, seller.id), eq(productsTable.isActive, true)));

  const displayName = seller.businessName;
  const rating = seller.rating / 10;

  return (
    <>
      <div className="bg-ud-dark pt-24 pb-0">
        <div className="max-w-content mx-auto px-6 pb-8">
          <Link href="/shop" className="inline-flex items-center gap-1.5 text-white/50 hover:text-white text-xs font-semibold transition-colors mb-6">
            <ArrowLeft size={12} />
            Back to Marketplace
          </Link>
          <div className="flex flex-col sm:flex-row gap-6 items-start">
            <div className="w-20 h-20 rounded-[4px] bg-ud-burgundy flex items-center justify-center flex-shrink-0">
              <span className="text-3xl font-bold text-white">{displayName[0]}</span>
            </div>
            <div className="flex-1">
              <div className="flex flex-wrap items-center gap-3 mb-2">
                <h1 className="text-2xl font-bold text-white">{displayName}</h1>
                {seller.verified && (
                  <span className="inline-flex items-center gap-1 bg-ud-burgundy/20 text-ud-burgundy text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-[4px]">
                    <BadgeCheck size={10} />
                    Verified Seller
                  </span>
                )}
              </div>
              <p className="text-white/60 text-sm mb-3">{seller.tagline}</p>
              <Stars rating={rating} count={seller.reviewCount} />
            </div>
          </div>
        </div>

        <div className="border-t border-white/10">
          <div className="max-w-content mx-auto px-6 py-4 grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
            {[
              { label: "Location", value: seller.location },
              { label: "Member since", value: String(seller.joinedYear) },
              { label: "Total sales", value: seller.totalSales.toLocaleString() },
              { label: "Products listed", value: String(products.length) },
            ].map((s) => (
              <div key={s.label}>
                <div className="text-xs text-white/40 font-semibold uppercase tracking-wider mb-0.5">{s.label}</div>
                <div className="text-sm font-bold text-white">{s.value}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-ud-light-gray py-14">
        <div className="max-w-content mx-auto px-6">
          <div className="grid lg:grid-cols-4 gap-8">
            <aside className="lg:col-span-1 space-y-5">
              <div className="bg-white rounded-[4px] shadow-sm p-5">
                <h3 className="text-xs font-bold uppercase tracking-wider text-ud-dark/40 mb-3">About</h3>
                <p className="text-sm text-ud-dark/65 leading-relaxed">{seller.description}</p>
              </div>
              <div className="bg-white rounded-[4px] shadow-sm p-5">
                <h3 className="text-xs font-bold uppercase tracking-wider text-ud-dark/40 mb-3">Categories</h3>
                <div className="flex flex-wrap gap-1.5">
                  {seller.categories.map((c) => (
                    <span key={c} className="text-xs bg-ud-burgundy/10 text-ud-burgundy font-semibold px-2.5 py-1 rounded-[4px]">{c}</span>
                  ))}
                </div>
              </div>
              <div className="bg-white rounded-[4px] shadow-sm p-5">
                <h3 className="text-xs font-bold uppercase tracking-wider text-ud-dark/40 mb-3">Contact Seller</h3>
                <a href={`tel:${seller.phone}`} className="flex items-center gap-2 text-sm text-ud-dark/70 hover:text-ud-burgundy transition-colors">
                  <Phone size={14} />
                  {seller.phone}
                </a>
              </div>
            </aside>

            <div className="lg:col-span-3">
              <h2 className="text-lg font-bold text-ud-dark mb-5">
                Products by {displayName}
                <span className="ml-2 text-sm font-normal text-ud-dark/40">({products.length})</span>
              </h2>
              {products.length > 0 ? (
                <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-5">
                  {products.map((p) => (
                    <ProductCard
                      key={p.id}
                      product={{
                        id: p.id,
                        name: p.name,
                        category: p.category as ProductCategory,
                        description: p.description,
                        unit: p.unit,
                        priceKES: p.priceKES,
                        image: p.images[0] ?? "",
                        inStock: p.stock > 0,
                        sellerId: p.sellerId,
                        sellerName: displayName,
                        sellerVerified: seller.verified,
                        sellerRating: rating,
                        sellerReviewCount: seller.reviewCount,
                        specs: p.specs ?? undefined,
                      }}
                    />
                  ))}
                </div>
              ) : (
                <p className="text-ud-dark/40">This seller has no products listed yet.</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
