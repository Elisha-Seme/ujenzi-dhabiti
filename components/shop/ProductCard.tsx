"use client";

import Image from "next/image";
import Link from "next/link";
import { ShoppingCart } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { Product } from "@/lib/products";

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const { addItem } = useCart();

  const handleAdd = () => {
    addItem({
      productId: product.id,
      kind: "material",
      name: product.name,
      unit: product.unit,
      priceKES: product.priceKES,
      image: product.image,
      sellerId: "",
      sellerName: "Ujenzi Dhabiti",
    });
  };

  return (
    <div className="bg-white border border-ud-dark/8 rounded-[4px] overflow-hidden shadow-sm hover:-translate-y-1 hover:shadow-md transition-all duration-200 flex flex-col">
      <Link href={`/shop/${product.id}`} className="relative h-44 overflow-hidden block">
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

      <div className="p-5 flex flex-col flex-1">
        <Link href={`/shop/${product.id}`} className="block text-sm font-bold text-ud-dark mb-1.5 leading-snug hover:text-ud-burgundy transition-colors">{product.name}</Link>
        <p className="text-xs text-ud-dark/55 leading-relaxed mb-3 line-clamp-2">{product.description}</p>

        {product.specs && (
          <dl className="grid grid-cols-2 gap-x-3 gap-y-1 mb-4">
            {Object.entries(product.specs).slice(0, 4).map(([k, v]) => (
              <div key={k}>
                <dt className="text-xs uppercase tracking-wide text-ud-dark/35 font-semibold">{k}</dt>
                <dd className="text-xs text-ud-dark/70 font-medium">{v}</dd>
              </div>
            ))}
          </dl>
        )}

        <div className="flex items-end justify-between mt-auto pt-3 border-t border-ud-dark/8">
          <div>
            <div className="text-xs text-ud-dark/40 mb-0.5">{product.unit}</div>
            <div className="text-lg font-bold text-ud-dark">KES {product.priceKES.toLocaleString()}</div>
          </div>
          <button
            onClick={handleAdd}
            className="flex items-center gap-1.5 bg-ud-burgundy text-white text-xs font-bold px-4 py-2.5 rounded-[4px] hover:bg-ud-burgundy-hover transition-colors"
          >
            <ShoppingCart size={13} />
            Add to Cart
          </button>
        </div>
        <Link
          href={`/request-a-quote?product=${encodeURIComponent(product.name)}`}
          className="mt-2.5 block text-center text-[11px] font-semibold text-ud-burgundy/80 hover:text-ud-burgundy hover:underline"
        >
          Bulk order? Request a quote →
        </Link>
      </div>
    </div>
  );
}
