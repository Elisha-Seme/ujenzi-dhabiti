"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowRight, Loader2, Package, ShoppingBag } from "lucide-react";

type OrderStatus = "pending" | "paid" | "processing" | "dispatched" | "delivered" | "cancelled" | "refunded";

interface AccountOrder {
  id: string;
  status: OrderStatus;
  paymentMethod: string;
  totalKES: number;
  platformFeeKES: number;
  createdAt: string;
  deliveryAddress: string;
  deliveryCity: string;
  items: { id: string; productName: string; sellerName: string; quantity: number; priceKES: number }[];
}

const STATUS_CLASS: Record<OrderStatus, string> = {
  pending: "bg-ud-dark/5 text-ud-dark/60",
  paid: "bg-ud-burgundy/10 text-ud-burgundy",
  processing: "bg-ud-burgundy/20 text-ud-burgundy",
  dispatched: "bg-ud-dark/10 text-ud-dark",
  delivered: "bg-ud-burgundy text-white",
  cancelled: "bg-ud-dark text-white",
  refunded: "bg-ud-dark text-white",
};

function fmt(n: number) {
  return `KES ${n.toLocaleString("en-KE")}`;
}

export default function AccountOrdersPage() {
  const [orders, setOrders] = useState<AccountOrder[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/account/orders")
      .then((r) => r.json())
      .then(setOrders)
      .finally(() => setLoading(false));
  }, []);

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-ud-dark">My Orders</h1>
        <p className="text-sm text-ud-dark/50 mt-1">Track your purchases and order history.</p>
      </div>

        {loading ? (
          <div className="bg-white rounded-[4px] shadow-sm p-8 text-center text-sm text-ud-dark/50">
            <Loader2 className="w-5 h-5 animate-spin mx-auto mb-2 text-ud-burgundy" />
            Loading orders...
          </div>
        ) : orders.length === 0 ? (
          <div className="bg-white rounded-[4px] shadow-sm p-12 text-center">
            <ShoppingBag className="w-10 h-10 text-ud-dark/30 mx-auto mb-3" />
            <p className="font-semibold text-ud-dark/50">No orders yet</p>
            <p className="text-sm text-ud-dark/40 mt-1 mb-5">Orders placed while signed in will appear here.</p>
            <Link href="/shop" className="inline-flex items-center gap-2 bg-ud-burgundy text-white px-5 py-2.5 rounded text-sm font-semibold">
              Browse House Plans
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => (
              <div key={order.id} className="bg-white rounded-[4px] shadow-sm overflow-hidden">
                <div className="p-5 border-b border-ud-dark/8 flex flex-col sm:flex-row sm:items-center gap-3">
                  <div className="flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-mono font-bold text-ud-dark">{order.id}</span>
                      <span className={`text-xs px-2 py-0.5 rounded-full font-medium capitalize ${STATUS_CLASS[order.status]}`}>{order.status}</span>
                    </div>
                    <p className="text-xs text-ud-dark/40 mt-1">
                      {new Date(order.createdAt).toLocaleDateString("en-KE")} - {order.deliveryAddress}, {order.deliveryCity}
                    </p>
                  </div>
                  <div className="sm:text-right">
                    <p className="font-bold text-ud-dark">{fmt(order.totalKES)}</p>
                    <p className="text-xs text-ud-dark/40 capitalize">{order.paymentMethod === "flutterwave" ? "Card" : order.paymentMethod}</p>
                  </div>
                </div>

                <div className="p-5 space-y-3">
                  {order.items.map((item) => (
                    <div key={item.id} className="flex items-center gap-3">
                      <div className="w-9 h-9 bg-ud-burgundy/10 rounded flex items-center justify-center flex-shrink-0">
                        <Package className="w-4 h-4 text-ud-burgundy" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-ud-dark truncate">{item.productName}</p>
                        <p className="text-xs text-ud-dark/40">{item.sellerName} - Qty {item.quantity}</p>
                      </div>
                      <span className="text-sm font-semibold text-ud-dark">{fmt(item.priceKES * item.quantity)}</span>
                    </div>
                  ))}
                </div>

                <div className="px-5 py-3 bg-gray-50 flex justify-end">
                  <Link href={`/track/${order.id}`} className="inline-flex items-center gap-2 text-xs font-semibold text-ud-burgundy hover:underline">
                    Track Order
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
    </div>
  );
}
