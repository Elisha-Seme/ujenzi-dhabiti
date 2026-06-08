"use client";

import {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
  ReactNode,
} from "react";
import { CartItem } from "@/lib/types";
import { PLATFORM_FEE_PERCENT } from "@/lib/products";

const CART_KEY = "ujenzi:cart:v2";

type NewCartItem = Omit<CartItem, "quantity" | "lineId">;

function makeLineId(productId: string, deliveryMode?: string): string {
  return `${productId}::${deliveryMode ?? "std"}`;
}

interface CartContextValue {
  items: CartItem[];
  isOpen: boolean;
  openCart: () => void;
  closeCart: () => void;
  addItem: (item: NewCartItem) => void;
  removeItem: (lineId: string) => void;
  updateQty: (lineId: string, qty: number) => void;
  clearCart: () => void;
  totalItems: number;
  subtotalKES: number;
  platformFeeKES: number;
  totalKES: number;
  hasPhysicalItems: boolean;
}

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(CART_KEY);
      if (stored) {
        const parsed = JSON.parse(stored) as CartItem[];
        // Only accept the v2 shape (must carry a lineId)
        if (Array.isArray(parsed) && parsed.every((i) => i && typeof i.lineId === "string")) {
          setItems(parsed);
        }
      }
    } catch {
      localStorage.removeItem(CART_KEY);
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    try {
      localStorage.setItem(CART_KEY, JSON.stringify(items));
    } catch {
      // Storage quota exceeded or disabled — silently fail
    }
  }, [items, hydrated]);

  const openCart = useCallback(() => setIsOpen(true), []);
  const closeCart = useCallback(() => setIsOpen(false), []);

  const addItem = useCallback((item: NewCartItem) => {
    const lineId = makeLineId(item.productId, item.deliveryMode);
    setItems((prev) => {
      const existing = prev.find((i) => i.lineId === lineId);
      if (existing) {
        // A digital plan can only be bought once — don't stack quantity.
        if (item.kind === "plan" && item.deliveryMode === "digital") return prev;
        return prev.map((i) => (i.lineId === lineId ? { ...i, quantity: i.quantity + 1 } : i));
      }
      return [...prev, { ...item, lineId, quantity: 1 }];
    });
    setIsOpen(true);
  }, []);

  const removeItem = useCallback((lineId: string) => {
    setItems((prev) => prev.filter((i) => i.lineId !== lineId));
  }, []);

  const updateQty = useCallback((lineId: string, qty: number) => {
    if (qty < 1) return;
    setItems((prev) =>
      prev.map((i) => {
        if (i.lineId !== lineId) return i;
        // Digital plans are single-copy
        if (i.kind === "plan" && i.deliveryMode === "digital") return i;
        return { ...i, quantity: qty };
      })
    );
  }, []);

  const clearCart = useCallback(() => setItems([]), []);

  const totalItems = items.reduce((acc, i) => acc + i.quantity, 0);
  const subtotalKES = items.reduce((acc, i) => acc + i.priceKES * i.quantity, 0);
  const platformFeeKES = Math.round(subtotalKES * PLATFORM_FEE_PERCENT / 100);
  const totalKES = subtotalKES + platformFeeKES;
  // Physical = materials, or printed plans. All-digital carts skip delivery details.
  const hasPhysicalItems = items.some((i) => i.kind === "material" || i.deliveryMode === "print");

  return (
    <CartContext.Provider
      value={{
        items,
        isOpen,
        openCart,
        closeCart,
        addItem,
        removeItem,
        updateQty,
        clearCart,
        totalItems,
        subtotalKES,
        platformFeeKES,
        totalKES,
        hasPhysicalItems,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart(): CartContextValue {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used inside CartProvider");
  return ctx;
}
