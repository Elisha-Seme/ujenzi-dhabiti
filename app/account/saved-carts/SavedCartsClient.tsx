"use client";

import { useState } from "react";
import Link from "next/link";
import { ShoppingBag, ShoppingCart, Trash2, ArrowRight, Plus } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { deleteSavedCart } from "./actions";

interface CartItem {
  productId: string;
  kind: "material" | "plan";
  name: string;
  unit: string;
  priceKES: number;
  image: string;
  sellerId: string;
  sellerName: string;
  quantity: number;
}

interface SavedCartType {
  id: string;
  name: string;
  savedAt: Date;
  items: CartItem[];
}

export default function SavedCartsClient({ initialCarts }: { initialCarts: SavedCartType[] }) {
  const { addItem } = useCart();
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const loadCart = (cart: SavedCartType) => {
    cart.items.forEach((item) => {
      addItem(
        {
          productId: item.productId,
          kind: item.kind,
          name: item.name,
          unit: item.unit,
          priceKES: item.priceKES,
          image: item.image,
          sellerId: item.sellerId,
          sellerName: item.sellerName,
        },
        item.quantity
      );
    });
    alert(`Loaded ${cart.name} into your cart.`);
  };

  const handleDelete = async (id: string) => {
    setDeletingId(id);
    const res = await deleteSavedCart(id);
    if (res.error) {
      alert(res.error);
    }
    setDeletingId(null);
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-ud-dark">Saved Carts</h1>
          <p className="text-sm text-ud-dark/50 mt-1">Save and reload material lists for your projects.</p>
        </div>
        <Link
          href="/shop"
          className="inline-flex items-center gap-2 bg-ud-burgundy text-white text-sm font-bold px-4 py-2.5 rounded-[4px] hover:bg-ud-burgundy-hover transition-colors"
        >
          <Plus className="w-4 h-4" /> New Cart
        </Link>
      </div>

      {initialCarts.length === 0 ? (
        <div className="bg-white rounded-[4px] shadow-sm p-12 text-center">
          <ShoppingBag className="w-10 h-10 text-ud-dark/30 mx-auto mb-3" />
          <p className="font-semibold text-ud-dark/50">No saved carts</p>
          <p className="text-sm text-ud-dark/40 mt-1 mb-5">Save a cart from the shop to quickly reorder materials.</p>
          <Link
            href="/shop"
            className="inline-flex items-center gap-2 bg-ud-burgundy text-white px-5 py-2.5 rounded text-sm font-semibold"
          >
            Browse Materials <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {initialCarts.map((cart) => {
            const total = cart.items.reduce((s, i) => s + i.priceKES * i.quantity, 0);
            return (
              <div key={cart.id} className="bg-white rounded-[4px] shadow-sm overflow-hidden">
                <div className="p-5 border-b border-ud-dark/8 flex flex-col sm:flex-row sm:items-center gap-4">
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-ud-dark text-base truncate">{cart.name}</h3>
                    <p className="text-xs text-ud-dark/40 mt-0.5">
                      {cart.items.length} item{cart.items.length !== 1 ? "s" : ""} · Saved {new Date(cart.savedAt).toLocaleDateString("en-KE")}
                    </p>
                  </div>
                  <div className="flex items-center gap-3 flex-shrink-0">
                    <span className="font-bold text-ud-dark text-sm">KES {total.toLocaleString()}</span>
                    <button
                      onClick={() => loadCart(cart)}
                      className="inline-flex items-center gap-1.5 bg-ud-burgundy text-white text-xs font-bold px-3 py-2 rounded-[4px] hover:bg-ud-burgundy-hover transition-colors"
                    >
                      <ShoppingCart className="w-3.5 h-3.5" /> Load Cart
                    </button>
                    <button 
                      onClick={() => handleDelete(cart.id)}
                      disabled={deletingId === cart.id}
                      className="text-ud-dark/30 hover:text-red-500 transition-colors disabled:opacity-50" 
                      aria-label="Delete saved cart"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                <div className="p-5 space-y-2">
                  {cart.items.map((item, idx) => (
                    <div key={idx} className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-ud-light-gray rounded flex items-center justify-center flex-shrink-0">
                        <ShoppingBag className="w-4 h-4 text-ud-burgundy" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-ud-dark truncate">{item.name}</p>
                        <p className="text-xs text-ud-dark/40">Qty: {item.quantity} {item.unit}</p>
                      </div>
                      <span className="text-sm font-semibold text-ud-dark">
                        KES {(item.priceKES * item.quantity).toLocaleString()}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
