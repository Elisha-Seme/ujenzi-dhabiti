"use client";

import { Suspense, useEffect, useState, useRef } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { CheckCircle2, XCircle, Loader2, ArrowRight, ShoppingBag } from "lucide-react";

type State = "loading" | "success" | "failed" | "pending";

export default function CheckoutConfirmPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-ud-light-gray flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-ud-burgundy animate-spin" />
      </div>
    }>
      <ConfirmInner />
    </Suspense>
  );
}

function ConfirmInner() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const orderId = searchParams.get("orderId");
  const provider = searchParams.get("provider");
  const flwStatus = searchParams.get("status"); // Flutterwave appends this

  const [state, setState] = useState<State>("loading");
  const pollingRef = useRef(0);

  useEffect(() => {
    if (!orderId) {
      setState("failed");
      return;
    }

    // Flutterwave redirect includes ?status=successful|failed|cancelled
    if (provider === "flutterwave" && flwStatus && flwStatus !== "successful") {
      setState("failed");
      return;
    }

    // Poll the order until it flips to paid (webhook may arrive slightly after redirect)
    const MAX_ATTEMPTS = 20; // 20 × 2s = 40s max
    let attempts = 0;

    const poll = async () => {
      attempts++;
      try {
        const res = await fetch(`/api/orders/${orderId}`);
        if (!res.ok) throw new Error("not found");
        const { order } = await res.json();

        if (order.status === "paid" || order.status === "processing" || order.status === "dispatched" || order.status === "delivered") {
          clearInterval(pollingRef.current);
          setState("success");
          return;
        }
        if (order.status === "cancelled" || order.status === "refunded") {
          clearInterval(pollingRef.current);
          setState("failed");
          return;
        }
      } catch {
        // transient — keep polling
      }

      if (attempts >= MAX_ATTEMPTS) {
        clearInterval(pollingRef.current);
        // Status still pending after 40s — treat as uncertain, show pending UI
        setState("pending");
      }
    };

    pollingRef.current = window.setInterval(poll, 2000);
    poll(); // first check immediately

    return () => clearInterval(pollingRef.current);
  }, [orderId, provider, flwStatus]);

  if (state === "loading") {
    return (
      <div className="min-h-screen bg-ud-light-gray flex items-center justify-center px-4">
        <div className="bg-white rounded-[4px] shadow-md p-10 max-w-md w-full text-center">
          <div className="w-16 h-16 rounded-full bg-ud-burgundy/10 flex items-center justify-center mx-auto mb-4">
            <Loader2 className="w-8 h-8 text-ud-burgundy animate-spin" />
          </div>
          <h1 className="text-xl font-bold text-ud-dark mb-2">Verifying Payment</h1>
          <p className="text-gray-500 text-sm">
            Please wait while we confirm your payment…
          </p>
        </div>
      </div>
    );
  }

  if (state === "success") {
    return (
      <div className="min-h-screen bg-ud-light-gray flex items-center justify-center px-4">
        <div className="bg-white rounded-[4px] shadow-md p-10 max-w-md w-full text-center">
          <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
            <CheckCircle2 className="w-8 h-8 text-ud-burgundy" />
          </div>
          <h1 className="text-2xl font-bold text-ud-dark mb-2">Payment Confirmed!</h1>
          <p className="text-gray-500 text-sm mb-1">
            Thank you for your order. We&apos;ve sent a confirmation to your email.
          </p>
          {orderId && (
            <p className="text-xs text-gray-400 mb-8">
              Order ID: <span className="font-mono font-semibold text-gray-600">{orderId}</span>
            </p>
          )}
          <div className="flex flex-col gap-3">
            {orderId && (
              <button
                onClick={() => router.push(`/track/${orderId}`)}
                className="w-full flex items-center justify-center gap-2 bg-ud-burgundy hover:bg-ud-burgundy-hover text-white py-3 rounded text-sm font-semibold transition-colors"
              >
                Track Order
                <ArrowRight className="w-4 h-4" />
              </button>
            )}
            <Link
              href="/shop"
              className="w-full flex items-center justify-center gap-2 border border-gray-200 hover:border-ud-burgundy text-ud-dark hover:text-ud-burgundy py-3 rounded text-sm font-medium transition-colors"
            >
              <ShoppingBag className="w-4 h-4" />
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (state === "pending") {
    return (
      <div className="min-h-screen bg-ud-light-gray flex items-center justify-center px-4">
        <div className="bg-white rounded-[4px] shadow-md p-10 max-w-md w-full text-center">
          <div className="w-16 h-16 rounded-full bg-yellow-100 flex items-center justify-center mx-auto mb-4">
            <Loader2 className="w-8 h-8 text-ud-burgundy" />
          </div>
          <h1 className="text-xl font-bold text-ud-dark mb-2">Payment Processing</h1>
          <p className="text-gray-500 text-sm mb-4">
            Your payment is being processed. This may take a few minutes.
          </p>
          {orderId && (
            <p className="text-xs text-gray-400 mb-6">
              Order ID: <span className="font-mono font-semibold text-gray-600">{orderId}</span>
            </p>
          )}
          <p className="text-xs text-gray-400 mb-6">
            You can check the status of your order at any time using the link below.
            We&apos;ll also send you an email once payment is confirmed.
          </p>
          <div className="flex flex-col gap-3">
            {orderId && (
              <button
                onClick={() => router.push(`/track/${orderId}`)}
                className="w-full flex items-center justify-center gap-2 bg-ud-burgundy hover:bg-ud-burgundy-hover text-white py-3 rounded text-sm font-semibold transition-colors"
              >
                Check Order Status
                <ArrowRight className="w-4 h-4" />
              </button>
            )}
            <Link
              href="/shop"
              className="w-full flex items-center justify-center gap-2 border border-gray-200 hover:border-ud-burgundy text-ud-dark hover:text-ud-burgundy py-3 rounded text-sm font-medium transition-colors"
            >
              <ShoppingBag className="w-4 h-4" />
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // failed
  return (
    <div className="min-h-screen bg-ud-light-gray flex items-center justify-center px-4">
      <div className="bg-white rounded-[4px] shadow-md p-10 max-w-md w-full text-center">
        <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-4">
          <XCircle className="w-8 h-8 text-red-500" />
        </div>
        <h1 className="text-xl font-bold text-ud-dark mb-2">Payment Failed</h1>
        <p className="text-gray-500 text-sm mb-6">
          Your payment could not be completed. No money has been charged.
          Please try again or choose a different payment method.
        </p>
        <div className="flex flex-col gap-3">
          <Link
            href="/shop/checkout"
            className="w-full flex items-center justify-center gap-2 bg-ud-burgundy hover:bg-ud-burgundy-hover text-white py-3 rounded text-sm font-semibold transition-colors"
          >
            Try Again
          </Link>
          <Link
            href="/shop"
            className="w-full flex items-center justify-center gap-2 border border-gray-200 hover:border-ud-burgundy text-ud-dark hover:text-ud-burgundy py-3 rounded text-sm font-medium transition-colors"
          >
            <ShoppingBag className="w-4 h-4" />
            Back to Shop
          </Link>
        </div>
      </div>
    </div>
  );
}
