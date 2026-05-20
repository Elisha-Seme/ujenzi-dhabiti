"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Package,
  ShoppingBag,
  TrendingUp,
  Clock,
  ArrowRight,
  AlertCircle,
  BadgeCheck,
} from "lucide-react";

interface Stats {
  activeProducts: number;
  totalRevenue: number;
  totalItemsSold: number;
  pendingOrders: number;
  sellerName: string;
  status: string;
  verified: boolean;
}

function fmt(n: number) {
  return `KES ${n.toLocaleString("en-KE")}`;
}

export default function SellerDashboard() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/seller/stats")
      .then((r) => r.json())
      .then(setStats)
      .finally(() => setLoading(false));
  }, []);

  const cards = [
    {
      label: "Active Products",
      value: loading ? "—" : stats?.activeProducts ?? 0,
      icon: Package,
      href: "/seller/products",
      color: "text-ud-burgundy",
    },
    {
      label: "Total Revenue",
      value: loading ? "—" : fmt(stats?.totalRevenue ?? 0),
      icon: TrendingUp,
      href: null,
      color: "text-ud-burgundy",
    },
    {
      label: "Items Sold",
      value: loading ? "—" : stats?.totalItemsSold ?? 0,
      icon: ShoppingBag,
      href: "/seller/orders",
      color: "text-ud-dark",
    },
    {
      label: "Pending Orders",
      value: loading ? "—" : stats?.pendingOrders ?? 0,
      icon: Clock,
      href: "/seller/orders",
      color: "text-ud-burgundy",
    },
  ];

  return (
    <div className="p-6 md:p-8 max-w-5xl">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-1">
          <h1 className="text-2xl font-bold text-ud-dark">
            {loading ? "Dashboard" : `Welcome, ${stats?.sellerName ?? "Seller"}`}
          </h1>
          {stats?.verified && (
            <BadgeCheck className="w-5 h-5 text-ud-burgundy" aria-label="Verified Seller" />
          )}
        </div>
        <p className="text-ud-dark/50 text-sm">Here&apos;s how your store is performing.</p>
      </div>

      {/* Pending approval banner */}
      {stats && stats.status !== "approved" && (
        <div className="flex items-start gap-3 bg-ud-burgundy/5 border border-ud-burgundy/20 rounded-[4px] p-4 mb-6">
          <AlertCircle className="w-5 h-5 text-ud-burgundy flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-semibold text-ud-dark">Account Under Review</p>
            <p className="text-sm text-ud-dark/70 mt-0.5">
              Your seller account is currently <strong>{stats.status}</strong>. You&apos;ll be able to list products once approved by our team.
            </p>
          </div>
        </div>
      )}

      {/* Stat cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {cards.map((card) => {
          const Icon = card.icon;
          const inner = (
            <div className="bg-white rounded-[4px] shadow-sm p-5 border-t-2 border-ud-burgundy hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between mb-3">
                <p className="text-xs font-semibold text-ud-dark/50 uppercase tracking-wide">{card.label}</p>
                <Icon className={`w-4 h-4 ${card.color}`} />
              </div>
              <p className={`text-2xl font-bold ${card.color}`}>{card.value}</p>
              {card.href && (
                <p className="text-xs text-ud-burgundy mt-2 flex items-center gap-1">
                  View all <ArrowRight className="w-3 h-3" />
                </p>
              )}
            </div>
          );
          return card.href ? (
            <Link key={card.label} href={card.href}>{inner}</Link>
          ) : (
            <div key={card.label}>{inner}</div>
          );
        })}
      </div>

      {/* Quick actions */}
      <div className="grid sm:grid-cols-2 gap-4">
        <div className="bg-white rounded-[4px] shadow-sm p-6">
          <h2 className="font-semibold text-ud-dark mb-1">Add a Product</h2>
          <p className="text-sm text-ud-dark/50 mb-4">
            List a new product to start selling on the marketplace.
          </p>
          <Link
            href="/seller/products"
            className="inline-flex items-center gap-2 bg-ud-burgundy hover:bg-ud-burgundy-hover text-white px-4 py-2 rounded text-sm font-medium transition-colors"
          >
            <Package className="w-4 h-4" />
            Manage Products
          </Link>
        </div>

        <div className="bg-white rounded-[4px] shadow-sm p-6">
          <h2 className="font-semibold text-ud-dark mb-1">Fulfil Orders</h2>
          <p className="text-sm text-ud-dark/50 mb-4">
            Mark orders as dispatched and add courier tracking numbers.
          </p>
          <Link
            href="/seller/orders"
            className="inline-flex items-center gap-2 border border-ud-burgundy text-ud-burgundy hover:bg-ud-burgundy hover:text-white px-4 py-2 rounded text-sm font-medium transition-colors"
          >
            <ShoppingBag className="w-4 h-4" />
            View Orders
          </Link>
        </div>
      </div>
    </div>
  );
}
