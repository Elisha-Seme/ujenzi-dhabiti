"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { CheckCircle2, ExternalLink, Loader2, Package, Search, Smartphone } from "lucide-react";

type OrderStatus = "pending" | "paid" | "processing" | "dispatched" | "delivered" | "cancelled" | "refunded";

interface AdminOrderItem {
  id: string;
  productName: string;
  sellerName: string;
  priceKES: number;
  quantity: number;
  dispatched: boolean;
}

interface AdminOrder {
  id: string;
  status: OrderStatus;
  paymentMethod: string;
  customerName: string | null;
  customerEmail: string | null;
  guestPhone: string | null;
  deliveryAddress: string;
  deliveryCity: string;
  deliveryCounty: string | null;
  subtotalKES: number;
  platformFeeKES: number;
  totalKES: number;
  createdAt: string;
  items: AdminOrderItem[];
}

const STATUS_CLASS: Record<OrderStatus, string> = {
  pending: "bg-gray-100 text-gray-600",
  paid: "bg-blue-50 text-blue-700",
  processing: "bg-yellow-50 text-yellow-700",
  dispatched: "bg-purple-50 text-purple-700",
  delivered: "bg-green-50 text-green-700",
  cancelled: "bg-red-50 text-red-700",
  refunded: "bg-red-50 text-red-700",
};

const STATUSES: OrderStatus[] = ["pending", "paid", "processing", "dispatched", "delivered", "cancelled", "refunded"];

function fmt(n: number) {
  return `KES ${n.toLocaleString("en-KE")}`;
}

function date(s: string) {
  return new Date(s).toLocaleDateString("en-KE", { day: "numeric", month: "short", year: "numeric" });
}

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<AdminOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState<string | null>(null);
  const [query, setQuery] = useState("");

  const load = () => {
    setLoading(true);
    fetch("/api/admin/orders")
      .then((r) => r.json())
      .then(setOrders)
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const filtered = useMemo(() => {
    const q = query.toLowerCase();
    return orders.filter((o) =>
      `${o.id} ${o.customerName ?? ""} ${o.customerEmail ?? ""} ${o.status} ${o.paymentMethod}`.toLowerCase().includes(q)
    );
  }, [orders, query]);

  const updateStatus = async (id: string, status: OrderStatus) => {
    setBusy(id);
    await fetch(`/api/admin/orders/${id}/status`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    setBusy(null);
    load();
  };

  const simulateMpesa = async (id: string) => {
    setBusy(id + "-sim");
    const res = await fetch("/api/dev/simulate-mpesa", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ orderId: id }),
    });
    const data = await res.json();
    if (!res.ok) alert(data.error ?? "Simulation failed");
    setBusy(null);
    load();
  };

  return (
    <div className="p-6 md:p-8 max-w-6xl">
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-ud-dark">Orders</h1>
          <p className="text-sm text-gray-500 mt-0.5">Confirm bank payments and manage order status.</p>
        </div>
        <div className="relative sm:w-80">
          <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search orders..."
            className="w-full pl-9 pr-3 py-2.5 bg-white border border-gray-200 rounded text-sm focus:outline-none focus:border-ud-burgundy"
          />
        </div>
      </div>

      {loading ? (
        <div className="bg-white rounded-md shadow-sm p-8 text-center text-sm text-gray-500">
          <Loader2 className="w-5 h-5 animate-spin mx-auto mb-2 text-ud-burgundy" />
          Loading orders...
        </div>
      ) : filtered.length === 0 ? (
        <div className="bg-white rounded-md shadow-sm p-12 text-center">
          <Package className="w-10 h-10 text-gray-300 mx-auto mb-3" />
          <p className="text-sm text-gray-500">No orders found.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filtered.map((order) => (
            <div key={order.id} className="bg-white rounded-md shadow-sm overflow-hidden">
              <div className="p-5 border-b border-gray-100 flex flex-col lg:flex-row lg:items-start gap-4">
                <div className="flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-mono font-bold text-ud-dark">{order.id}</span>
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium capitalize ${STATUS_CLASS[order.status]}`}>{order.status}</span>
                    <span className="text-xs bg-ud-burgundy/10 text-ud-burgundy px-2 py-0.5 rounded-full capitalize">
                      {order.paymentMethod === "flutterwave" ? "Card" : order.paymentMethod}
                    </span>
                  </div>
                  <p className="text-sm text-gray-500 mt-1">{order.customerName ?? "Guest"} - {order.customerEmail ?? "No email"}</p>
                  <p className="text-xs text-gray-400 mt-0.5">{date(order.createdAt)} - {order.deliveryAddress}, {order.deliveryCity}</p>
                </div>
                <div className="text-left lg:text-right">
                  <p className="text-lg font-bold text-ud-dark">{fmt(order.totalKES)}</p>
                  <p className="text-xs text-gray-400">Platform fee: {fmt(order.platformFeeKES)}</p>
                </div>
              </div>

              <div className="p-5 grid lg:grid-cols-[1fr_220px] gap-5">
                <div className="space-y-2">
                  {order.items.map((item) => (
                    <div key={item.id} className="flex items-center justify-between gap-3 text-sm">
                      <div className="min-w-0">
                        <p className="font-medium text-ud-dark truncate">{item.productName}</p>
                        <p className="text-xs text-gray-400">{item.sellerName} - Qty {item.quantity}</p>
                      </div>
                      <span className="font-semibold text-ud-dark flex-shrink-0">{fmt(item.priceKES * item.quantity)}</span>
                    </div>
                  ))}
                </div>

                <div className="space-y-2">
                  {order.paymentMethod === "bank" && order.status === "pending" && (
                    <button
                      onClick={() => updateStatus(order.id, "paid")}
                      disabled={!!busy}
                      className="w-full inline-flex items-center justify-center gap-2 bg-green-600 text-white py-2.5 rounded text-xs font-semibold disabled:opacity-60"
                    >
                      {busy === order.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle2 className="w-4 h-4" />}
                      Confirm Bank Payment
                    </button>
                  )}
                  {order.paymentMethod === "mpesa" && order.status === "pending" && process.env.NODE_ENV !== "production" && (
                    <button
                      onClick={() => simulateMpesa(order.id)}
                      disabled={!!busy}
                      className="w-full inline-flex items-center justify-center gap-2 bg-green-600 text-white py-2.5 rounded text-xs font-semibold disabled:opacity-60"
                    >
                      {busy === order.id + "-sim" ? <Loader2 className="w-4 h-4 animate-spin" /> : <Smartphone className="w-4 h-4" />}
                      Simulate M-Pesa Paid
                    </button>
                  )}
                  <select
                    value={order.status}
                    onChange={(e) => updateStatus(order.id, e.target.value as OrderStatus)}
                    disabled={busy === order.id}
                    className="w-full border border-gray-200 rounded px-3 py-2 text-xs font-semibold capitalize focus:outline-none focus:border-ud-burgundy"
                  >
                    {STATUSES.map((status) => <option key={status} value={status}>{status}</option>)}
                  </select>
                  <Link
                    href={`/track/${order.id}`}
                    target="_blank"
                    className="w-full inline-flex items-center justify-center gap-2 border border-gray-200 text-gray-600 hover:text-ud-burgundy hover:border-ud-burgundy py-2 rounded text-xs font-semibold transition-colors"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                    Tracking Page
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
