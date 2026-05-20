"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  CheckCircle2,
  Clock,
  Package,
  Truck,
  MapPin,
  Phone,
  Mail,
  ArrowLeft,
  AlertCircle,
  Loader2,
  Copy,
  Check,
} from "lucide-react";

type OrderStatus =
  | "pending"
  | "paid"
  | "processing"
  | "dispatched"
  | "delivered"
  | "cancelled"
  | "refunded";

interface OrderItem {
  id: string;
  productName: string;
  productImage: string | null;
  sellerName: string;
  priceKES: number;
  quantity: number;
  dispatched: boolean;
  dispatchedAt: string | null;
  trackingNumber: string | null;
}

interface Order {
  id: string;
  status: OrderStatus;
  paymentMethod: string;
  guestName: string | null;
  guestEmail: string | null;
  guestPhone: string | null;
  deliveryAddress: string;
  deliveryCity: string;
  deliveryCounty: string | null;
  subtotalKES: number;
  platformFeeKES: number;
  totalKES: number;
  trackingNumber: string | null;
  dispatchedAt: string | null;
  deliveredAt: string | null;
  createdAt: string;
  updatedAt: string;
}

const STATUS_STEPS: { key: OrderStatus; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
  { key: "pending", label: "Order Placed", icon: Clock },
  { key: "paid", label: "Payment Confirmed", icon: CheckCircle2 },
  { key: "processing", label: "Processing", icon: Package },
  { key: "dispatched", label: "Dispatched", icon: Truck },
  { key: "delivered", label: "Delivered", icon: MapPin },
];

const STATUS_ORDER: Record<OrderStatus, number> = {
  pending: 0,
  paid: 1,
  processing: 2,
  dispatched: 3,
  delivered: 4,
  cancelled: -1,
  refunded: -1,
};

const PAYMENT_LABELS: Record<string, string> = {
  mpesa: "M-Pesa",
  flutterwave: "Card (Flutterwave)",
  bank: "Bank Transfer",
};

function fmt(n: number) {
  return `KES ${n.toLocaleString("en-KE")}`;
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-KE", {
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function TrackOrderPage() {
  const { orderId } = useParams<{ orderId: string }>();
  const router = useRouter();

  const [order, setOrder] = useState<Order | null>(null);
  const [items, setItems] = useState<OrderItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!orderId) return;
    fetch(`/api/orders/${orderId}`)
      .then((r) => (r.ok ? r.json() : Promise.reject(r.status)))
      .then(({ order, items }) => {
        setOrder(order);
        setItems(items);
      })
      .catch((code) => {
        setError(code === 404 ? "Order not found. Please check the order ID." : "Something went wrong. Please try again.");
      })
      .finally(() => setLoading(false));
  }, [orderId]);

  const copyId = () => {
    navigator.clipboard.writeText(orderId as string);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-ud-light-gray flex items-center justify-center">
        <div className="flex flex-col items-center gap-3 text-ud-dark">
          <Loader2 className="w-8 h-8 animate-spin text-ud-burgundy" />
          <p className="text-sm">Loading order details…</p>
        </div>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="min-h-screen bg-ud-light-gray flex items-center justify-center px-4">
        <div className="bg-white rounded-[4px] shadow-md p-8 max-w-md w-full text-center">
          <AlertCircle className="w-12 h-12 text-ud-burgundy mx-auto mb-4" />
          <h1 className="text-xl font-semibold text-ud-dark mb-2">Order Not Found</h1>
          <p className="text-ud-dark/50 text-sm mb-6">{error}</p>
          <Link href="/shop" className="inline-block bg-ud-burgundy text-white px-6 py-2.5 rounded text-sm font-medium hover:bg-ud-burgundy-hover transition-colors">
            Back to Shop
          </Link>
        </div>
      </div>
    );
  }

  const currentStep = STATUS_ORDER[order.status];
  const isCancelled = order.status === "cancelled" || order.status === "refunded";

  return (
    <div className="min-h-screen bg-ud-light-gray">
      {/* Header */}
      <div className="bg-ud-dark text-white py-8 px-4">
        <div className="max-w-3xl mx-auto">
          <button
            onClick={() => router.push("/shop")}
            className="flex items-center gap-1.5 text-white/60 hover:text-white text-sm mb-4 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Shop
          </button>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div>
              <h1 className="text-2xl font-bold">Track Your Order</h1>
              <p className="text-white/60 text-sm mt-0.5">
                Placed on {formatDate(order.createdAt)}
              </p>
            </div>
            <button
              onClick={copyId}
              className="flex items-center gap-2 bg-white/10 hover:bg-white/20 border border-white/20 text-white px-4 py-2 rounded text-sm transition-colors w-fit"
            >
              {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              <span className="font-mono font-semibold">{orderId}</span>
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 py-8 space-y-6">

        {/* Status Timeline */}
        <div className="bg-white rounded-[4px] shadow-sm p-6">
          <h2 className="text-sm font-semibold text-ud-dark/50 uppercase tracking-wide mb-6">Order Status</h2>

          {isCancelled ? (
            <div className="flex items-center gap-3 p-4 bg-red-50 border border-red-200 rounded">
              <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
              <div>
                <p className="font-semibold text-red-700 capitalize">{order.status}</p>
                <p className="text-sm text-red-600">
                  {order.status === "refunded"
                    ? "This order has been refunded. Funds should reflect within 3–5 business days."
                    : "This order was cancelled. Contact us if you have questions."}
                </p>
              </div>
            </div>
          ) : (
            <div className="relative">
              {/* Connector line */}
              <div className="absolute left-5 top-5 bottom-5 w-0.5 bg-ud-dark/10" />

              <div className="space-y-6">
                {STATUS_STEPS.map((step, idx) => {
                  const done = currentStep >= idx;
                  const active = currentStep === idx;
                  const Icon = step.icon;

                  return (
                    <div key={step.key} className="flex items-start gap-4 relative">
                      <div
                        className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 z-10 border-2 transition-colors ${
                          done
                            ? "bg-ud-burgundy border-ud-burgundy text-white"
                            : "bg-white border-ud-dark/30 text-ud-dark/40"
                        }`}
                      >
                        <Icon className="w-4 h-4" />
                      </div>
                      <div className="pt-2">
                        <p className={`text-sm font-semibold ${done ? "text-ud-dark" : "text-ud-dark/40"}`}>
                          {step.label}
                          {active && (
                            <span className="ml-2 text-xs bg-ud-burgundy text-white px-2 py-0.5 rounded-full">
                              Current
                            </span>
                          )}
                        </p>
                        {step.key === "dispatched" && order.dispatchedAt && done && (
                          <p className="text-xs text-ud-dark/50 mt-0.5">{formatDate(order.dispatchedAt)}</p>
                        )}
                        {step.key === "delivered" && order.deliveredAt && done && (
                          <p className="text-xs text-ud-dark/50 mt-0.5">{formatDate(order.deliveredAt)}</p>
                        )}
                        {step.key === "paid" && done && order.paymentMethod && (
                          <p className="text-xs text-ud-dark/50 mt-0.5">
                            via {PAYMENT_LABELS[order.paymentMethod] ?? order.paymentMethod}
                          </p>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Tracking number */}
          {order.trackingNumber && (
            <div className="mt-6 pt-6 border-t border-ud-dark/8">
              <p className="text-sm text-ud-dark/50 mb-1">Courier Tracking Number</p>
              <p className="font-mono font-semibold text-ud-dark text-lg">{order.trackingNumber}</p>
              <p className="text-xs text-ud-dark/40 mt-1">
                Use this number to track your parcel on the courier&apos;s website.
              </p>
            </div>
          )}
        </div>

        {/* Order Items */}
        <div className="bg-white rounded-[4px] shadow-sm p-6">
          <h2 className="text-sm font-semibold text-ud-dark/50 uppercase tracking-wide mb-4">Items Ordered</h2>
          <div className="divide-y divide-gray-100">
            {items.map((item) => (
              <div key={item.id} className="py-4 flex gap-4">
                {item.productImage ? (
                  <img
                    src={item.productImage}
                    alt={item.productName}
                    className="w-14 h-14 object-cover rounded border border-ud-dark/8 flex-shrink-0"
                  />
                ) : (
                  <div className="w-14 h-14 bg-ud-dark/5 rounded flex items-center justify-center flex-shrink-0">
                    <Package className="w-6 h-6 text-ud-dark/40" />
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-ud-dark text-sm leading-snug">{item.productName}</p>
                  <p className="text-xs text-ud-dark/50 mt-0.5">Sold by {item.sellerName}</p>
                  <div className="flex items-center justify-between mt-2">
                    <span className="text-xs text-ud-dark/50">Qty: {item.quantity}</span>
                    <span className="text-sm font-semibold text-ud-dark">
                      {fmt(item.priceKES * item.quantity)}
                    </span>
                  </div>
                </div>
                {item.dispatched && (
                  <div className="flex-shrink-0 flex items-start">
                    <span className="text-xs bg-ud-burgundy text-white border border-green-200 px-2 py-0.5 rounded-full">
                      Dispatched
                    </span>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Totals */}
          <div className="mt-4 pt-4 border-t border-ud-dark/8 space-y-2">
            <div className="flex justify-between text-sm text-ud-dark/60">
              <span>Subtotal</span>
              <span>{fmt(order.subtotalKES)}</span>
            </div>
            <div className="flex justify-between text-sm text-ud-dark/60">
              <span>Platform fee</span>
              <span>{fmt(order.platformFeeKES)}</span>
            </div>
            <div className="flex justify-between text-base font-semibold text-ud-dark pt-2 border-t border-ud-dark/8">
              <span>Total Paid</span>
              <span>{fmt(order.totalKES)}</span>
            </div>
          </div>
        </div>

        {/* Delivery Details */}
        <div className="bg-white rounded-[4px] shadow-sm p-6">
          <h2 className="text-sm font-semibold text-ud-dark/50 uppercase tracking-wide mb-4">Delivery Details</h2>
          <div className="flex items-start gap-3">
            <MapPin className="w-4 h-4 text-ud-burgundy mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-sm text-ud-dark">{order.deliveryAddress}</p>
              <p className="text-sm text-ud-dark">
                {order.deliveryCity}
                {order.deliveryCounty ? `, ${order.deliveryCounty}` : ""}
              </p>
            </div>
          </div>
          {(order.guestName || order.guestPhone || order.guestEmail) && (
            <div className="mt-4 pt-4 border-t border-ud-dark/8 space-y-2">
              {order.guestName && (
                <p className="text-sm text-ud-dark/60">
                  <span className="font-medium text-ud-dark">{order.guestName}</span>
                </p>
              )}
              {order.guestPhone && (
                <div className="flex items-center gap-2 text-sm text-ud-dark/60">
                  <Phone className="w-3.5 h-3.5 text-ud-burgundy" />
                  {order.guestPhone}
                </div>
              )}
              {order.guestEmail && (
                <div className="flex items-center gap-2 text-sm text-ud-dark/60">
                  <Mail className="w-3.5 h-3.5 text-ud-burgundy" />
                  {order.guestEmail}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Help */}
        <div className="bg-ud-dark text-white rounded-[4px] p-6">
          <h2 className="font-semibold mb-1">Need Help?</h2>
          <p className="text-white/60 text-sm mb-4">
            Have questions about your order? Contact our support team.
          </p>
          <div className="flex flex-col sm:flex-row gap-3">
            <a
              href="tel:+254725403001"
              className="flex items-center gap-2 bg-white/10 hover:bg-white/20 border border-white/20 text-white px-4 py-2 rounded text-sm transition-colors"
            >
              <Phone className="w-4 h-4" />
              +254 725 403 001
            </a>
            <a
              href="mailto:ujenzi@ujenzidhabiti.co.ke"
              className="flex items-center gap-2 bg-white/10 hover:bg-white/20 border border-white/20 text-white px-4 py-2 rounded text-sm transition-colors"
            >
              <Mail className="w-4 h-4" />
              ujenzi@ujenzidhabiti.co.ke
            </a>
          </div>
          <p className="text-white/40 text-xs mt-4">
            Quote your order ID <span className="font-mono text-white/70">{orderId}</span> when contacting support.
          </p>
        </div>

      </div>
    </div>
  );
}
