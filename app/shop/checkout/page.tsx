"use client";

import { useState, useRef, useEffect } from "react";
import React from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { CheckCircle2, Check, Smartphone, CreditCard, Building2, Loader2 } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { PLATFORM_FEE_PERCENT } from "@/lib/products";
import { PaymentMethod } from "@/lib/types";

type Step = "details" | "payment" | "confirm";

export default function CheckoutPage() {
  const { items, subtotalKES, platformFeeKES, totalKES, clearCart } = useCart();
  const router = useRouter();

  const [step, setStep] = useState<Step>("details");
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("mpesa");
  const [mpesaPolling, setMpesaPolling] = useState(false);
  const [checkoutRequestId, setCheckoutRequestId] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [orderId, setOrderId] = useState("");

  // Track the polling interval so we can clean it up on unmount or new attempts
  const pollIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const stopPolling = () => {
    if (pollIntervalRef.current) {
      clearInterval(pollIntervalRef.current);
      pollIntervalRef.current = null;
    }
  };
  // Cleanup on unmount
  useEffect(() => () => stopPolling(), []);

  const [form, setForm] = useState({
    name: "", email: "", phone: "",
    address: "", city: "", county: "",
    mpesaPhone: "",
  });
  const set = (k: string, v: string) => setForm((p) => ({ ...p, [k]: v }));

  // ─── Step 1: collect details, create order in DB ──────────────
  const handleDetailsSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          guestName: form.name,
          guestEmail: form.email,
          guestPhone: form.phone,
          deliveryAddress: form.address,
          deliveryCity: form.city,
          deliveryCounty: form.county,
          paymentMethod,
          items: items.map((i) => ({ productId: i.productId, quantity: i.quantity })),
        }),
      });

      const data = await res.json();
      if (!res.ok) { setError(data.error ?? "Failed to create order."); setLoading(false); return; }

      setOrderId(data.orderId);
      setStep("payment");
    } catch {
      setError("Something went wrong. Please try again.");
    }
    setLoading(false);
  };

  // ─── Step 2: payment ──────────────────────────────────────────
  const handlePayment = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (paymentMethod === "mpesa") {
      // Guard: ignore extra clicks while a push is in flight
      if (mpesaPolling) return;
      // Quick client-side phone check before hitting the API
      const cleaned = form.mpesaPhone.replace(/\D/g, "");
      if (cleaned.length < 9) {
        setError("Please enter a valid Kenyan phone number.");
        return;
      }

      setMpesaPolling(true);
      try {
        const res = await fetch("/api/payments/mpesa/initiate", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ orderId, phone: form.mpesaPhone }),
        });
        const data = await res.json();
        if (!res.ok) {
          setError(data.error ?? "Failed to send STK Push.");
          setMpesaPolling(false);
          return;
        }
        if (data.checkoutRequestId) setCheckoutRequestId(data.checkoutRequestId);
        pollOrderStatus(orderId);
      } catch {
        setError("Something went wrong. Please try again.");
        setMpesaPolling(false);
      }
      return;
    }

    if (paymentMethod === "card") {
      setLoading(true);
      try {
        const res = await fetch("/api/payments/flutterwave/initiate", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ orderId, customerPhone: form.phone }),
        });
        const data = await res.json();
        if (!res.ok) { setError(data.error ?? "Failed to initiate payment."); setLoading(false); return; }
        // Redirect to Flutterwave hosted page
        window.location.href = data.paymentLink;
      } catch {
        setError("Something went wrong. Please try again.");
        setLoading(false);
      }
      return;
    }

    if (paymentMethod === "bank") {
      // Bank transfer: order is already created, just move to confirm
      setStep("confirm");
      clearCart();
    }
  };

  // Poll Safaricom STK Query directly + our order status every 3s for up to 90s.
  const pollOrderStatus = (id: string) => {
    stopPolling();
    let attempts = 0;

    pollIntervalRef.current = setInterval(async () => {
      attempts++;
      try {
        // Ask Safaricom directly — this catches simulator confirmations instantly
        const queryRes = await fetch("/api/payments/mpesa/query", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ orderId: id }),
          cache: "no-store",
        });
        if (queryRes.ok) {
          const { status, reason } = await queryRes.json();
          if (status === "paid") {
            stopPolling();
            setMpesaPolling(false);
            clearCart();
            setStep("confirm");
            return;
          }
          if (status === "failed") {
            stopPolling();
            setMpesaPolling(false);
            setError(reason ?? "Payment was cancelled or failed. Please try again.");
            return;
          }
        }
      } catch {
        // network blip — keep polling
      }
      if (attempts >= 30) {
        stopPolling();
        setMpesaPolling(false);
        setError(
          "Payment not confirmed within 90 seconds. Check your order status at /track/" + id
        );
      }
    }, 3000);
  };

  if (items.length === 0 && step !== "confirm") {
    return (
      <div className="min-h-screen bg-ud-light-gray flex items-center justify-center px-6 pt-24">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-ud-dark mb-3">Your cart is empty</h2>
          <p className="text-ud-dark/50 mb-6">Add products from the marketplace first.</p>
          <button onClick={() => router.push("/shop")} className="bg-ud-burgundy text-white text-sm font-bold px-6 py-3 rounded-[4px] hover:bg-ud-burgundy-hover transition-colors">
            Go to Marketplace
          </button>
        </div>
      </div>
    );
  }

  if (step === "confirm") {
    return (
      <div className="min-h-screen bg-ud-light-gray flex items-center justify-center px-6 pt-24 pb-16">
        <div className="bg-white rounded-[4px] shadow-sm max-w-md w-full p-6 sm:p-10 text-center">
          <div className="w-16 h-16 bg-ud-burgundy/10 rounded-full flex items-center justify-center mx-auto mb-5">
            <CheckCircle2 size={30} className="text-ud-burgundy" />
          </div>
          <h2 className="text-xl font-bold text-ud-dark mb-2">
            {paymentMethod === "bank" ? "Order Received" : "Order Confirmed"}
          </h2>
          <p className="text-xs font-bold uppercase tracking-widest text-ud-burgundy mb-4">{orderId}</p>
          <p className="text-sm text-ud-dark/60 leading-relaxed mb-6">
            {paymentMethod === "bank"
              ? `Complete the bank transfer using the details below. Use your order ID as reference. Your order will be confirmed once payment reflects.`
              : `Your payment was received. Sellers have been notified and will dispatch within their stated lead times. A receipt has been sent to `}
            {paymentMethod !== "bank" && <strong>{form.email}</strong>}
          </p>
          <div className="bg-ud-light-gray rounded-[4px] p-4 text-left text-xs text-ud-dark/60 mb-6 space-y-1">
            <div className="flex justify-between"><span>Order ID</span><span className="font-bold text-ud-dark">{orderId}</span></div>
            <div className="flex justify-between"><span>Payment</span><span className="font-bold text-ud-dark capitalize">{paymentMethod === "mpesa" ? "M-Pesa" : paymentMethod === "card" ? "Card (Flutterwave)" : "Bank Transfer"}</span></div>
            <div className="flex justify-between"><span>Total</span><span className="font-bold text-ud-dark">KES {totalKES.toLocaleString()}</span></div>
          </div>
          <div className="flex flex-col sm:flex-row gap-3">
            <button onClick={() => router.push(`/track/${orderId}`)} className="flex-1 border border-ud-burgundy text-ud-burgundy text-sm font-bold py-3 rounded-[4px] hover:bg-ud-burgundy hover:text-white transition-colors">
              Track Order
            </button>
            <button onClick={() => router.push("/shop")} className="flex-1 bg-ud-burgundy text-white text-sm font-bold py-3 rounded-[4px] hover:bg-ud-burgundy-hover transition-colors">
              Continue Shopping
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-ud-light-gray pt-24 pb-16">
      <div className="max-w-content mx-auto px-6">
        {/* Steps */}
        <div className="flex items-center gap-2 mb-8">
          {(["details", "payment"] as Step[]).map((s, i) => (
            <div key={s} className="flex items-center gap-2">
              <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold border-2 transition-colors ${
                step === s ? "bg-ud-burgundy border-ud-burgundy text-white" :
                (step === "payment" && s === "details") ? "bg-ud-dark border-ud-dark text-white" :
                "bg-white border-ud-dark/20 text-ud-dark/40"
              }`}>
                {(step === "payment" && s === "details") ? <Check size={12} /> : i + 1}
              </div>
              <span className={`text-xs font-semibold capitalize ${step === s ? "text-ud-dark" : "text-ud-dark/40"}`}>{s}</span>
              {i < 1 && <div className="w-8 h-px bg-ud-dark/15 mx-1" />}
            </div>
          ))}
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded-[4px] mb-6">
            {error}
          </div>
        )}

        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">

            {/* ─── Step 1: Delivery Details ─────────────────────── */}
            {step === "details" && (
              <form onSubmit={handleDetailsSubmit} className="bg-white rounded-[4px] shadow-sm p-5 sm:p-8 space-y-5">
                <h2 className="text-lg font-bold text-ud-dark mb-6">Delivery Details</h2>
                <div className="grid sm:grid-cols-2 gap-5">
                  <Field label="Full Name" value={form.name} onChange={(v) => set("name", v)} required placeholder="John Doe" />
                  <Field label="Email" type="email" value={form.email} onChange={(v) => set("email", v)} required placeholder="you@example.com" />
                  <Field label="Phone" value={form.phone} onChange={(v) => set("phone", v)} required placeholder="+254..." />
                  <Field label="City" value={form.city} onChange={(v) => set("city", v)} required placeholder="Nairobi" />
                </div>
                <Field label="Delivery Address" value={form.address} onChange={(v) => set("address", v)} required placeholder="Street, estate or area" />
                <Field label="County" value={form.county} onChange={(v) => set("county", v)} placeholder="e.g. Nairobi, Mombasa" />

                <div>
                  <p className="text-xs font-semibold text-ud-dark/60 uppercase tracking-wider mb-3">Payment Method</p>
                  <div className="flex gap-2">
                    {([
                      { id: "mpesa", label: "M-Pesa", icon: <Smartphone size={18} /> },
                      { id: "card", label: "Card", icon: <CreditCard size={18} /> },
                      { id: "bank", label: "Bank", icon: <Building2 size={18} /> },
                    ] as { id: PaymentMethod; label: string; icon: React.ReactNode }[]).map((m) => (
                      <button key={m.id} type="button" onClick={() => setPaymentMethod(m.id)}
                        className={`flex-1 flex flex-col items-center gap-1 py-3 px-2 border-2 rounded-[4px] text-xs font-semibold transition-colors ${
                          paymentMethod === m.id ? "border-ud-burgundy bg-ud-burgundy/5 text-ud-burgundy" : "border-ud-dark/15 text-ud-dark/50 hover:border-ud-dark/30"
                        }`}>
                        {m.icon}{m.label}
                      </button>
                    ))}
                  </div>
                </div>

                <button type="submit" disabled={loading}
                  className="w-full flex items-center justify-center gap-2 bg-ud-burgundy text-white text-sm font-bold py-3.5 rounded-[4px] hover:bg-ud-burgundy-hover transition-colors disabled:opacity-60 mt-2">
                  {loading ? <Loader2 size={16} className="animate-spin" /> : "Continue to Payment"}
                </button>
              </form>
            )}

            {/* ─── Step 2: Payment ──────────────────────────────── */}
            {step === "payment" && (
              <form onSubmit={handlePayment} className="bg-white rounded-[4px] shadow-sm p-5 sm:p-8">
                <h2 className="text-lg font-bold text-ud-dark mb-6">Payment</h2>

                {/* M-Pesa */}
                {paymentMethod === "mpesa" && (
                  <div className="space-y-4">
                    <div className="bg-green-50 border border-green-200 rounded-[4px] p-4 text-sm text-green-800">
                      <strong>How it works:</strong> Enter your M-Pesa number. We&apos;ll send an STK push prompt to your phone. Enter your PIN to complete payment.
                    </div>
                    <Field label="M-Pesa Phone Number" value={form.mpesaPhone} onChange={(v) => set("mpesaPhone", v)} required placeholder="07XX XXX XXX" />
                    {mpesaPolling ? (
                      <div className="bg-ud-light-gray rounded-[4px] p-5 text-center space-y-3">
                        <div className="w-8 h-8 border-2 border-ud-burgundy border-t-transparent rounded-full animate-spin mx-auto" />
                        <p className="text-sm font-semibold text-ud-dark">STK Push sent to {form.mpesaPhone}</p>
                        <p className="text-xs text-ud-dark/50">Check your phone and enter your M-Pesa PIN — or use the Safaricom simulator below.</p>
                        {checkoutRequestId && (
                          <div className="bg-white border border-gray-200 rounded p-3 text-left mt-2">
                            <p className="text-xs text-gray-500 mb-1">CheckoutRequestID (paste into Safaricom simulator):</p>
                            <div className="flex items-center gap-2">
                              <code className="text-xs font-mono text-ud-dark break-all flex-1">{checkoutRequestId}</code>
                              <button
                                type="button"
                                onClick={() => navigator.clipboard.writeText(checkoutRequestId)}
                                className="text-xs text-ud-burgundy font-semibold flex-shrink-0 hover:underline"
                              >
                                Copy
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    ) : (
                      <button type="submit" className="w-full bg-ud-burgundy text-white text-sm font-bold py-3.5 rounded-[4px] hover:bg-ud-burgundy-hover transition-colors">
                        Send STK Push — KES {totalKES.toLocaleString()}
                      </button>
                    )}
                  </div>
                )}

                {/* Card via Flutterwave */}
                {paymentMethod === "card" && (
                  <div className="space-y-4">
                    <div className="bg-ud-burgundy/5 border border-blue-200 rounded-[4px] p-4 text-sm text-blue-800">
                      <strong>Secure card payment</strong> via Flutterwave. Accepts Visa, Mastercard, and local debit cards. You&apos;ll be redirected to a secure checkout page.
                    </div>
                    <button type="submit" disabled={loading}
                      className="w-full flex items-center justify-center gap-2 bg-ud-burgundy text-white text-sm font-bold py-3.5 rounded-[4px] hover:bg-ud-burgundy-hover transition-colors disabled:opacity-60">
                      {loading ? <Loader2 size={16} className="animate-spin" /> : `Pay KES ${totalKES.toLocaleString()} →`}
                    </button>
                    <p className="text-xs text-ud-dark/40 text-center">You will be redirected to Flutterwave&apos;s secure payment page.</p>
                  </div>
                )}

                {/* Bank Transfer */}
                {paymentMethod === "bank" && (
                  <div className="space-y-4">
                    <div className="bg-ud-light-gray rounded-[4px] p-5 text-sm space-y-2">
                      <p className="font-bold text-ud-dark mb-3">Bank Transfer Details</p>
                      {[
                        ["Bank", "Equity Bank Kenya"],
                        ["Account Name", "Ujenzi Dhabiti Marketplace Ltd"],
                        ["Account Number", "0123456789012"],
                        ["Branch", "Upperhill, Nairobi"],
                        ["Swift Code", "EQBLKENA"],
                        ["Reference", orderId],
                      ].map(([k, v]) => (
                        <div key={k} className="flex justify-between">
                          <span className="text-ud-dark/50">{k}</span>
                          <span className="font-semibold text-ud-dark">{v}</span>
                        </div>
                      ))}
                    </div>
                    <p className="text-xs text-ud-dark/50">Your order will be confirmed once payment reflects (1–2 business days). Use your order ID as the reference.</p>
                    <button type="submit" className="w-full bg-ud-burgundy text-white text-sm font-bold py-3.5 rounded-[4px] hover:bg-ud-burgundy-hover transition-colors">
                      I Have Made the Transfer
                    </button>
                  </div>
                )}

                <button type="button" onClick={() => setStep("details")} className="w-full mt-3 text-xs text-ud-dark/40 hover:text-ud-dark transition-colors">
                  ← Back to delivery details
                </button>
              </form>
            )}
          </div>

          {/* Order summary */}
          <div className="space-y-4">
            <div className="bg-white rounded-[4px] shadow-sm p-6">
              <h3 className="text-sm font-bold text-ud-dark mb-4">Order Summary</h3>
              <ul className="space-y-3 mb-4">
                {items.map((item) => (
                  <li key={item.productId} className="flex gap-3">
                    <div className="relative w-12 h-12 rounded-[4px] overflow-hidden flex-shrink-0">
                      <Image src={item.image} alt={item.name} fill className="object-cover" sizes="48px" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-semibold text-ud-dark truncate">{item.name}</p>
                      <p className="text-[11px] text-ud-dark/50">Qty: {item.quantity} × KES {item.priceKES.toLocaleString()}</p>
                      <p className="text-[11px] text-ud-burgundy">{item.sellerName}</p>
                    </div>
                    <span className="text-xs font-bold text-ud-dark flex-shrink-0">KES {(item.priceKES * item.quantity).toLocaleString()}</span>
                  </li>
                ))}
              </ul>
              <div className="border-t border-ud-dark/10 pt-3 space-y-1.5 text-xs">
                <div className="flex justify-between text-ud-dark/60"><span>Subtotal</span><span>KES {subtotalKES.toLocaleString()}</span></div>
                <div className="flex justify-between text-ud-dark/60"><span>Platform fee ({PLATFORM_FEE_PERCENT}%)</span><span>KES {platformFeeKES.toLocaleString()}</span></div>
                <div className="flex justify-between font-bold text-ud-dark text-sm pt-1 border-t border-ud-dark/10"><span>Total</span><span>KES {totalKES.toLocaleString()}</span></div>
              </div>
            </div>
            <div className="bg-ud-burgundy/5 border border-ud-burgundy/20 rounded-[4px] p-4 text-xs text-ud-dark/60 leading-relaxed">
              <strong className="text-ud-dark">Marketplace notice:</strong> Products are sold by independent sellers. Ujenzi Dhabiti facilitates the transaction and charges a {PLATFORM_FEE_PERCENT}% platform fee.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function Field({ label, value, onChange, required = false, placeholder = "", type = "text", maxLength }: {
  label: string; value: string; onChange: (v: string) => void;
  required?: boolean; placeholder?: string; type?: string; maxLength?: number;
}) {
  return (
    <div>
      <label className="block text-xs font-semibold text-ud-dark/60 uppercase tracking-wider mb-1.5">{label}{required && " *"}</label>
      <input required={required} type={type} value={value} placeholder={placeholder} maxLength={maxLength}
        onChange={(e) => onChange(e.target.value)}
        className="w-full border border-ud-dark/20 rounded-[4px] px-4 py-2.5 text-sm text-ud-dark placeholder:text-ud-dark/30 focus:outline-none focus:border-ud-burgundy transition-colors" />
    </div>
  );
}
