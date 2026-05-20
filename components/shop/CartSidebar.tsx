"use client";

import { useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { X, ShoppingCart, Minus, Plus, Trash2 } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { PLATFORM_FEE_PERCENT } from "@/lib/products";

export default function CartSidebar() {
  const { items, isOpen, closeCart, removeItem, updateQty, totalItems, subtotalKES, platformFeeKES, totalKES } = useCart();
  const router = useRouter();

  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [isOpen]);

  const handleCheckout = () => {
    closeCart();
    router.push("/shop/checkout");
  };

  return (
    <>
      <div
        className={`fixed inset-0 z-40 bg-black/50 backdrop-blur-sm transition-opacity duration-300 ${isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}`}
        onClick={closeCart}
      />

      <aside className={`fixed top-0 right-0 bottom-0 z-50 w-full max-w-md bg-white flex flex-col transition-transform duration-300 ${isOpen ? "translate-x-0" : "translate-x-full"}`}>
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-ud-dark/10">
          <div>
            <h2 className="text-lg font-bold text-ud-dark">Your Cart</h2>
            <p className="text-xs text-ud-dark/50 mt-0.5">{totalItems} item{totalItems !== 1 ? "s" : ""}</p>
          </div>
          <button onClick={closeCart} className="w-8 h-8 flex items-center justify-center text-ud-dark/40 hover:text-ud-dark transition-colors" aria-label="Close cart">
            <X size={20} />
          </button>
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto px-6 py-4">
          {items.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center py-10">
              <div className="w-14 h-14 rounded-full bg-ud-light-gray flex items-center justify-center mb-4">
                <ShoppingCart size={24} className="text-ud-burgundy" strokeWidth={1.5} />
              </div>
              <h3 className="text-base font-bold text-ud-dark mb-1">Your cart is empty</h3>
              <p className="text-sm text-ud-dark/50">Browse the marketplace to add products.</p>
            </div>
          ) : (
            <ul className="space-y-4">
              {items.map((item) => (
                <li key={item.productId} className="flex gap-4 pb-4 border-b border-ud-dark/8">
                  <div className="relative w-16 h-16 rounded-[4px] overflow-hidden flex-shrink-0 bg-ud-light-gray">
                    <Image src={item.image} alt={item.name} fill className="object-cover" sizes="64px" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-sm font-semibold text-ud-dark leading-tight mb-0.5 truncate">{item.name}</h4>
                    <p className="text-[11px] text-ud-burgundy font-medium mb-1">by {item.sellerName}</p>
                    <p className="text-xs text-ud-dark/50 mb-2">KES {item.priceKES.toLocaleString()} {item.unit}</p>
                    <div className="flex items-center gap-2">
                      <button onClick={() => updateQty(item.productId, item.quantity - 1)} className="w-6 h-6 rounded border border-ud-dark/20 flex items-center justify-center text-ud-dark/60 hover:border-ud-burgundy hover:text-ud-burgundy transition-colors">
                        <Minus size={10} />
                      </button>
                      <span className="text-sm font-semibold text-ud-dark w-5 text-center">{item.quantity}</span>
                      <button onClick={() => updateQty(item.productId, item.quantity + 1)} className="w-6 h-6 rounded border border-ud-dark/20 flex items-center justify-center text-ud-dark/60 hover:border-ud-burgundy hover:text-ud-burgundy transition-colors">
                        <Plus size={10} />
                      </button>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <span className="text-sm font-bold text-ud-dark">KES {(item.priceKES * item.quantity).toLocaleString()}</span>
                    <button onClick={() => removeItem(item.productId)} className="text-ud-dark/30 hover:text-ud-burgundy transition-colors" aria-label="Remove">
                      <Trash2 size={14} />
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="border-t border-ud-dark/10 px-6 py-5 space-y-3">
            <div className="space-y-1.5 text-sm">
              <div className="flex justify-between text-ud-dark/60">
                <span>Subtotal</span><span>KES {subtotalKES.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-ud-dark/60">
                <span>Platform fee ({PLATFORM_FEE_PERCENT}%)</span><span>KES {platformFeeKES.toLocaleString()}</span>
              </div>
              <div className="flex justify-between font-bold text-ud-dark pt-1 border-t border-ud-dark/10">
                <span>Total</span><span>KES {totalKES.toLocaleString()}</span>
              </div>
            </div>
            <button onClick={handleCheckout} className="w-full bg-ud-burgundy text-white text-sm font-bold py-3.5 rounded-[4px] hover:bg-ud-burgundy-hover transition-colors">
              Proceed to Checkout
            </button>
            <p className="text-[11px] text-ud-dark/40 text-center">
              Sold & fulfilled by individual sellers. Ujenzi Dhabiti is the marketplace platform.
            </p>
          </div>
        )}
      </aside>
    </>
  );
}
