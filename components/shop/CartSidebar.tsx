"use client";

import { useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { X, ShoppingCart, Minus, Plus, Trash2 } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { whatsappLink } from "@/lib/constants";

export default function CartSidebar() {
  const { items, isOpen, closeCart, removeItem, updateQty, totalItems, subtotalKES, totalKES } = useCart();
  const router = useRouter();

  const waMessage = items.length
    ? `Hello Ujenzi Dhabiti, I'd like to order:\n${items
        .map((i) => `• ${i.name} ×${i.quantity} — KES ${(i.priceKES * i.quantity).toLocaleString()}`)
        .join("\n")}\n\nTotal: KES ${totalKES.toLocaleString()}`
    : "";

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
              <p className="text-sm text-ud-dark/50">Browse our house plans to get started.</p>
            </div>
          ) : (
            <ul className="space-y-4">
              {items.map((item) => {
                const isDigital = item.deliveryMode === "digital";
                return (
                <li key={item.lineId} className="flex gap-4 pb-4 border-b border-ud-dark/8">
                  <div className="relative w-16 h-16 rounded-[4px] overflow-hidden flex-shrink-0 bg-ud-light-gray">
                    <Image src={item.image} alt={item.name} fill className="object-cover" sizes="64px" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-sm font-semibold text-ud-dark leading-tight mb-1 truncate">{item.name}</h4>
                    {item.deliveryMode && (
                      <span className="inline-block text-[10px] font-bold uppercase tracking-wide bg-ud-burgundy/10 text-ud-burgundy px-1.5 py-0.5 rounded mb-1">
                        {isDigital ? "Digital download" : "Printed copy"}
                      </span>
                    )}
                    <p className="text-xs text-ud-dark/50 mb-2">KES {item.priceKES.toLocaleString()} {item.unit}</p>
                    {isDigital ? (
                      <span className="text-xs text-ud-dark/40">Qty 1</span>
                    ) : (
                      <div className="flex items-center gap-2">
                        <button onClick={() => updateQty(item.lineId, item.quantity - 1)} className="w-6 h-6 rounded border border-ud-dark/20 flex items-center justify-center text-ud-dark/60 hover:border-ud-burgundy hover:text-ud-burgundy transition-colors">
                          <Minus size={10} />
                        </button>
                        <span className="text-sm font-semibold text-ud-dark w-5 text-center">{item.quantity}</span>
                        <button onClick={() => updateQty(item.lineId, item.quantity + 1)} className="w-6 h-6 rounded border border-ud-dark/20 flex items-center justify-center text-ud-dark/60 hover:border-ud-burgundy hover:text-ud-burgundy transition-colors">
                          <Plus size={10} />
                        </button>
                      </div>
                    )}
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <span className="text-sm font-bold text-ud-dark">KES {(item.priceKES * item.quantity).toLocaleString()}</span>
                    <button onClick={() => removeItem(item.lineId)} className="text-ud-dark/30 hover:text-ud-burgundy transition-colors" aria-label="Remove">
                      <Trash2 size={14} />
                    </button>
                  </div>
                </li>
                );
              })}
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
              <div className="flex justify-between font-bold text-ud-dark pt-1 border-t border-ud-dark/10">
                <span>Total</span><span>KES {totalKES.toLocaleString()}</span>
              </div>
            </div>
            <button onClick={handleCheckout} className="w-full bg-ud-burgundy text-white text-sm font-bold py-3.5 rounded-[4px] hover:bg-ud-burgundy-hover transition-colors">
              Proceed to Checkout
            </button>
            <a
              href={whatsappLink(waMessage)}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 w-full border border-[#25D366] text-[#1c8c44] text-sm font-bold py-3 rounded-[4px] hover:bg-[#25D366] hover:text-white transition-colors"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51l-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.247-.694.247-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" /></svg>
              Order via WhatsApp
            </a>
            <p className="text-[11px] text-ud-dark/40 text-center">
              Digital plans are delivered by email. Printed copies are shipped to you.
            </p>
          </div>
        )}
      </aside>
    </>
  );
}
