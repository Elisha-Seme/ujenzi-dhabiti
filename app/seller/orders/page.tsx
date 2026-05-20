"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Truck,
  Package,
  CheckCircle2,
  Clock,
  MapPin,
  Phone,
  Loader2,
  ExternalLink,
  X,
  AlertCircle,
} from "lucide-react";

type OrderStatus = "pending" | "paid" | "processing" | "dispatched" | "delivered" | "cancelled" | "refunded";

interface OrderItem {
  id: string;
  productName: string;
  productImage: string | null;
  priceKES: number;
  quantity: number;
  dispatched: boolean;
  trackingNumber: string | null;
}

interface SellerOrder {
  id: string;
  status: OrderStatus;
  guestName: string | null;
  guestEmail: string | null;
  guestPhone: string | null;
  deliveryAddress: string;
  deliveryCity: string;
  deliveryCounty: string | null;
  createdAt: string;
  items: OrderItem[];
}

const STATUS_COLORS: Record<OrderStatus, string> = {
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

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-KE", {
    day: "numeric", month: "short", year: "numeric",
  });
}

export default function SellerOrdersPage() {
  const [orders, setOrders] = useState<SellerOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [dispatching, setDispatching] = useState<string | null>(null);
  const [trackModal, setTrackModal] = useState<SellerOrder | null>(null);
  const [trackingInput, setTrackingInput] = useState("");
  const [trackError, setTrackError] = useState<string | null>(null);

  const load = () => {
    setLoading(true);
    fetch("/api/seller/orders")
      .then((r) => r.json())
      .then(setOrders)
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const openDispatch = (order: SellerOrder) => {
    setTrackModal(order);
    setTrackingInput("");
    setTrackError(null);
  };

  const handleDispatch = async () => {
    if (!trackModal) return;
    setDispatching(trackModal.id);
    setTrackError(null);
    try {
      const res = await fetch(`/api/seller/orders/${trackModal.id}/dispatch`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ trackingNumber: trackingInput.trim() || null }),
      });
      if (!res.ok) throw new Error((await res.json()).error ?? "Failed to dispatch");
      setTrackModal(null);
      load();
    } catch (err: unknown) {
      setTrackError(err instanceof Error ? err.message : "Failed to mark as dispatched");
    } finally {
      setDispatching(null);
    }
  };

  const myItemsRevenue = (order: SellerOrder) =>
    order.items.reduce((sum, i) => sum + i.priceKES * i.quantity, 0);

  const canDispatch = (order: SellerOrder) =>
    (order.status === "paid" || order.status === "processing") &&
    order.items.some((i) => !i.dispatched);

  return (
    <div className="p-6 md:p-8 max-w-4xl">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-ud-dark">Orders</h1>
        <p className="text-sm text-ud-dark/50 mt-0.5">
          {orders.length} order{orders.length !== 1 ? "s" : ""} containing your products
        </p>
      </div>

      {loading ? (
        <div className="space-y-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="bg-white rounded-[4px] shadow-sm p-5 animate-pulse">
              <div className="h-4 bg-ud-dark/10 rounded w-1/3 mb-3" />
              <div className="h-3 bg-ud-dark/10 rounded w-2/3 mb-2" />
              <div className="h-3 bg-ud-dark/10 rounded w-1/2" />
            </div>
          ))}
        </div>
      ) : orders.length === 0 ? (
        <div className="bg-white rounded-[4px] shadow-sm p-12 text-center">
          <Package className="w-10 h-10 text-ud-dark/30 mx-auto mb-3" />
          <p className="font-semibold text-ud-dark/50">No orders yet</p>
          <p className="text-sm text-ud-dark/40 mt-1">Orders containing your products will appear here.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <div key={order.id} className="bg-white rounded-[4px] shadow-sm overflow-hidden">
              {/* Order header */}
              <div className="px-5 py-4 border-b border-ud-dark/8 flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-0">
                <div className="flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-mono font-semibold text-sm text-ud-dark">{order.id}</span>
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium capitalize ${STATUS_COLORS[order.status]}`}>
                      {order.status}
                    </span>
                  </div>
                  <p className="text-xs text-ud-dark/40 mt-0.5">{formatDate(order.createdAt)}</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-semibold text-ud-dark">{fmt(myItemsRevenue(order))}</span>
                  <Link
                    href={`/track/${order.id}`}
                    target="_blank"
                    className="p-1.5 text-ud-dark/40 hover:text-ud-burgundy transition-colors"
                    title="View tracking page"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </Link>
                </div>
              </div>

              {/* Items */}
              <div className="px-5 py-3 divide-y divide-gray-50">
                {order.items.map((item) => (
                  <div key={item.id} className="py-3 flex items-center gap-3">
                    <div className="w-10 h-10 bg-ud-dark/5 rounded flex items-center justify-center flex-shrink-0">
                      {item.productImage ? (
                        <img src={item.productImage} alt={item.productName} className="w-10 h-10 object-cover rounded" />
                      ) : (
                        <Package className="w-4 h-4 text-ud-dark/40" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-ud-dark truncate">{item.productName}</p>
                      <p className="text-xs text-ud-dark/40">
                        {item.quantity} × {fmt(item.priceKES)}
                      </p>
                    </div>
                    {item.dispatched ? (
                      <div className="flex items-center gap-1 text-xs text-ud-burgundy">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Dispatched</span>
                      </div>
                    ) : (
                      <div className="flex items-center gap-1 text-xs text-ud-dark/40">
                        <Clock className="w-3.5 h-3.5" />
                        <span>Pending</span>
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {/* Delivery info + action */}
              <div className="px-5 py-3 bg-gray-50 flex flex-col sm:flex-row sm:items-center gap-3">
                <div className="flex-1 space-y-1">
                  <div className="flex items-center gap-1.5 text-xs text-ud-dark/50">
                    <MapPin className="w-3.5 h-3.5 text-ud-burgundy flex-shrink-0" />
                    <span>{order.deliveryAddress}, {order.deliveryCity}{order.deliveryCounty ? `, ${order.deliveryCounty}` : ""}</span>
                  </div>
                  {(order.guestName || order.guestPhone) && (
                    <div className="flex items-center gap-3 text-xs text-ud-dark/50">
                      {order.guestName && <span>{order.guestName}</span>}
                      {order.guestPhone && (
                        <a href={`tel:${order.guestPhone}`} className="flex items-center gap-1 text-ud-burgundy hover:underline">
                          <Phone className="w-3 h-3" />
                          {order.guestPhone}
                        </a>
                      )}
                    </div>
                  )}
                </div>
                {canDispatch(order) && (
                  <button
                    onClick={() => openDispatch(order)}
                    className="flex items-center gap-2 bg-ud-burgundy hover:bg-ud-burgundy-hover text-white px-4 py-2 rounded text-xs font-semibold transition-colors flex-shrink-0"
                  >
                    <Truck className="w-3.5 h-3.5" />
                    Mark as Dispatched
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Dispatch modal */}
      {trackModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
          <div className="bg-white rounded-[4px] shadow-xl w-full max-w-md">
            <div className="flex items-center justify-between px-6 py-4 border-b border-ud-dark/8">
              <h2 className="font-bold text-ud-dark">Mark as Dispatched</h2>
              <button onClick={() => setTrackModal(null)} className="text-ud-dark/40 hover:text-ud-dark/60 transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="px-6 py-5">
              {trackError && (
                <div className="flex items-start gap-2 bg-red-50 border border-red-200 rounded p-3 text-sm text-red-700 mb-4">
                  <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                  {trackError}
                </div>
              )}
              <p className="text-sm text-ud-dark/60 mb-4">
                Order <span className="font-mono font-semibold">{trackModal.id}</span> will be marked as dispatched. Optionally add a courier tracking number.
              </p>
              <label className="block text-xs font-semibold text-ud-dark/60 mb-1">Courier Tracking Number (optional)</label>
              <input
                value={trackingInput}
                onChange={(e) => setTrackingInput(e.target.value)}
                placeholder="e.g. UM123456789KE"
                className="w-full border border-ud-dark/20 rounded px-3 py-2 text-sm focus:outline-none focus:border-ud-burgundy"
              />
              <p className="text-xs text-ud-dark/40 mt-1.5">This will be visible to the buyer on the tracking page.</p>
            </div>
            <div className="flex gap-3 px-6 py-4 border-t border-ud-dark/8">
              <button
                onClick={() => setTrackModal(null)}
                className="flex-1 border border-ud-dark/20 hover:border-gray-400 text-ud-dark/60 py-2.5 rounded text-sm font-medium transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleDispatch}
                disabled={!!dispatching}
                className="flex-1 bg-ud-burgundy hover:bg-ud-burgundy-hover text-white py-2.5 rounded text-sm font-semibold transition-colors flex items-center justify-center gap-2"
              >
                {dispatching ? <Loader2 className="w-4 h-4 animate-spin" /> : <Truck className="w-4 h-4" />}
                {dispatching ? "Saving…" : "Confirm Dispatch"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
