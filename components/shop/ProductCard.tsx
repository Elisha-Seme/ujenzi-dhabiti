"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { ShoppingCart, Minus, Plus } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { Product } from "@/lib/products";

interface ProductCardProps {
  product: Product;
  dark?: boolean;  // true when rendered on a dark/blueprint background
  accentVariant?: 0 | 1 | 2; // 0=standard, 1=reddish, 2=elevated-dark
}

export default function ProductCard({ product, dark = false, accentVariant = 0 }: ProductCardProps) {
  const { addItem } = useCart();
  const [qty, setQty] = useState(1);

  const handleAdd = () => {
    addItem(
      { productId: product.id, kind: "material", name: product.name, unit: product.unit, priceKES: product.priceKES, image: product.image, sellerId: "", sellerName: "Ujenzi Dhabiti" },
      qty
    );
    setQty(1);
  };

  const cardBg = dark
    ? accentVariant === 1
      ? "bg-ud-burgundy/[0.10] border-ud-burgundy/30 hover:border-ud-burgundy/55"
      : accentVariant === 2
      ? "bg-white/[0.06] border-white/15 border-t-2 border-t-ud-burgundy/60 hover:border-white/25"
      : "bg-white/[0.04] border-white/10 hover:bg-white/[0.07]"
    : "bg-white border-ud-dark/8 shadow-sm hover:shadow-md";

  const titleCls   = dark ? "text-white hover:text-ud-burgundy"   : "text-ud-dark hover:text-ud-burgundy";
  const brandCls   = dark ? "text-white/40"   : "text-ud-dark/40";
  const descCls    = dark ? "text-white/50"   : "text-ud-dark/55";
  const dtCls      = dark ? "text-white/35"   : "text-ud-dark/35";
  const ddCls      = dark ? "text-white/65"   : "text-ud-dark/70";
  const dividerCls = dark ? "border-white/10" : "border-ud-dark/8";
  const unitCls    = dark ? "text-white/40"   : "text-ud-dark/40";
  const priceCls   = dark ? "text-white"      : "text-ud-dark";
  const qtyBorderCls = dark ? "border-white/20" : "border-ud-dark/20";
  const qtyTextCls   = dark ? "text-white/60 hover:text-ud-burgundy" : "text-ud-dark/60 hover:text-ud-burgundy";
  const qtyNumCls    = dark ? "text-white"    : "text-ud-dark";

  return (
    <div className={`relative overflow-hidden rounded-[4px] border hover:-translate-y-1 transition-all duration-200 flex flex-col ${cardBg}`}>
      {/* Reddish corner glow for accent variant */}
      {dark && accentVariant === 1 && (
        <div aria-hidden className="absolute -top-5 -right-5 w-20 h-20 rounded-full bg-ud-burgundy/30 blur-2xl pointer-events-none z-0" />
      )}

      <Link href={`/shop/${product.id}`} className="relative h-44 overflow-hidden block z-10">
        <Image src={product.image} alt={product.name} fill className="object-cover" sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw" />
        <div className="absolute inset-0 bg-ud-dark/25" />
        <span className="absolute top-3 left-3 bg-ud-dark/70 text-white text-xs font-bold uppercase tracking-wide px-2 py-1 rounded-[4px]">
          {product.category}
        </span>
        {!product.inStock && (
          <span className="absolute top-3 right-3 bg-ud-dark text-white/60 text-xs font-bold uppercase tracking-wide px-2 py-1 rounded-[4px]">
            Pre-order
          </span>
        )}
      </Link>

      <div className="p-5 flex flex-col flex-1 relative z-10">
        <Link href={`/shop/${product.id}`} className={`block text-sm font-bold mb-1.5 leading-snug transition-colors ${titleCls}`}>{product.name}</Link>
        {product.brand && <p className={`text-[11px] -mt-1 mb-1.5 ${brandCls}`}>{product.brand}</p>}
        <p className={`text-xs leading-relaxed mb-3 line-clamp-2 ${descCls}`}>{product.description}</p>

        {product.specs && (
          <dl className="grid grid-cols-2 gap-x-3 gap-y-1 mb-4">
            {Object.entries(product.specs).slice(0, 4).map(([k, v]) => (
              <div key={k}>
                <dt className={`text-xs uppercase tracking-wide font-semibold ${dtCls}`}>{k}</dt>
                <dd className={`text-xs font-medium ${ddCls}`}>{v}</dd>
              </div>
            ))}
          </dl>
        )}

        <div className={`mt-auto pt-3 border-t ${dividerCls}`}>
          <div className={`text-xs mb-0.5 ${unitCls}`}>{product.unit}</div>
          <div className={`text-lg font-bold mb-3 ${priceCls}`}>KES {product.priceKES.toLocaleString()}</div>

          <div className="flex items-center gap-2">
            <div className={`flex items-center border rounded-[4px] flex-shrink-0 ${qtyBorderCls}`}>
              <button onClick={() => setQty((q) => Math.max(1, q - 1))} className={`px-2 py-2 transition-colors ${qtyTextCls}`} aria-label="Decrease quantity"><Minus className="w-3.5 h-3.5" /></button>
              <span className={`w-7 text-center text-sm font-semibold ${qtyNumCls}`}>{qty}</span>
              <button onClick={() => setQty((q) => q + 1)} className={`px-2 py-2 transition-colors ${qtyTextCls}`} aria-label="Increase quantity"><Plus className="w-3.5 h-3.5" /></button>
            </div>
            <button
              onClick={handleAdd}
              className="flex-1 flex items-center justify-center gap-1.5 bg-ud-burgundy text-white text-xs font-bold py-2.5 rounded-[4px] hover:bg-ud-burgundy-hover transition-colors"
            >
              <ShoppingCart size={13} />
              Add to Cart
            </button>
          </div>

          <Link
            href={`/request-a-quote?product=${encodeURIComponent(product.name)}`}
            className="mt-2.5 block text-center text-[11px] font-semibold text-ud-burgundy/80 hover:text-ud-burgundy hover:underline"
          >
            Request Bulk Quote →
          </Link>
        </div>
      </div>
    </div>
  );
}
