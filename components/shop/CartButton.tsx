"use client";

import { ShoppingCart } from "lucide-react";
import { useCart } from "@/context/CartContext";

export default function CartButton() {
  const { totalItems, openCart } = useCart();

  return (
    <button
      onClick={openCart}
      aria-label="Open cart"
      suppressHydrationWarning
      className="relative flex items-center gap-2 text-white/80 hover:text-white transition-colors"
    >
      <ShoppingCart size={20} strokeWidth={1.8} />
      <span className="text-xs font-semibold hidden xl:inline">Cart</span>
      {totalItems > 0 && (
        <span className="absolute -top-2 -right-2 min-w-[18px] h-[18px] text-[10px] font-bold bg-ud-white text-ud-burgundy rounded-full flex items-center justify-center px-1 leading-none">
          {totalItems}
        </span>
      )}
    </button>
  );
}
