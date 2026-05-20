"use client";

import { useEffect, useMemo, useState } from "react";
import { BadgeCheck, Check, Loader2, Search, ShieldAlert, X } from "lucide-react";

type SellerStatus = "pending" | "approved" | "rejected" | "suspended";

interface AdminSeller {
  id: string;
  businessName: string;
  tagline: string | null;
  description: string | null;
  location: string | null;
  phone: string | null;
  categories: string[];
  status: SellerStatus;
  verified: boolean;
  createdAt: string;
  userName: string;
  userEmail: string;
}

const STATUS_CLASS: Record<SellerStatus, string> = {
  pending: "bg-ud-burgundy/20 text-ud-burgundy",
  approved: "bg-ud-burgundy text-white",
  rejected: "bg-ud-dark text-white",
  suspended: "bg-ud-dark/5 text-ud-dark/60",
};

export default function AdminSellersPage() {
  const [sellers, setSellers] = useState<AdminSeller[]>([]);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState<string | null>(null);
  const [query, setQuery] = useState("");

  const load = () => {
    setLoading(true);
    fetch("/api/admin/sellers")
      .then((r) => r.json())
      .then(setSellers)
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const filtered = useMemo(() => {
    const q = query.toLowerCase();
    return sellers.filter((s) =>
      `${s.businessName} ${s.userEmail} ${s.location ?? ""} ${s.status}`.toLowerCase().includes(q)
    );
  }, [sellers, query]);

  const updateStatus = async (id: string, status: SellerStatus) => {
    setBusy(id);
    await fetch(`/api/admin/sellers/${id}/status`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status, verified: status === "approved" }),
    });
    setBusy(null);
    load();
  };

  return (
    <div className="p-6 md:p-8 max-w-6xl">
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-ud-dark">Seller Applications</h1>
          <p className="text-sm text-gray-500 mt-0.5">Approve, reject, or suspend marketplace sellers.</p>
        </div>
        <div className="relative sm:w-72">
          <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search sellers..."
            className="w-full pl-9 pr-3 py-2.5 bg-white border border-gray-200 rounded text-sm focus:outline-none focus:border-ud-burgundy"
          />
        </div>
      </div>

      {loading ? (
        <div className="bg-white rounded-[4px] shadow-sm p-8 text-center text-sm text-gray-500">
          <Loader2 className="w-5 h-5 animate-spin mx-auto mb-2 text-ud-burgundy" />
          Loading sellers...
        </div>
      ) : filtered.length === 0 ? (
        <div className="bg-white rounded-[4px] shadow-sm p-12 text-center">
          <ShieldAlert className="w-10 h-10 text-gray-300 mx-auto mb-3" />
          <p className="text-sm text-gray-500">No sellers found.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filtered.map((seller) => (
            <div key={seller.id} className="bg-white rounded-[4px] shadow-sm p-5">
              <div className="flex flex-col lg:flex-row lg:items-start gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2 mb-1">
                    <h2 className="font-bold text-ud-dark">{seller.businessName}</h2>
                    {seller.verified && <BadgeCheck className="w-4 h-4 text-ud-burgundy" />}
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium capitalize ${STATUS_CLASS[seller.status]}`}>
                      {seller.status}
                    </span>
                  </div>
                  <p className="text-sm text-gray-500">{seller.userName} - {seller.userEmail}</p>
                  <p className="text-sm text-gray-500">{seller.phone ?? "No phone"}{seller.location ? ` - ${seller.location}` : ""}</p>
                  {seller.description && <p className="text-sm text-ud-dark/60 mt-3 leading-relaxed">{seller.description}</p>}
                  <div className="flex flex-wrap gap-1.5 mt-3">
                    {seller.categories.map((cat) => (
                      <span key={cat} className="text-xs bg-ud-burgundy/10 text-ud-burgundy px-2 py-1 rounded">{cat}</span>
                    ))}
                  </div>
                </div>
                <div className="flex flex-wrap gap-2 lg:justify-end">
                  <button
                    onClick={() => updateStatus(seller.id, "approved")}
                    disabled={busy === seller.id}
                    className="inline-flex items-center gap-1.5 bg-ud-burgundy text-white px-3 py-2 rounded text-xs font-semibold disabled:opacity-60"
                  >
                    {busy === seller.id ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Check className="w-3.5 h-3.5" />}
                    Approve
                  </button>
                  <button
                    onClick={() => updateStatus(seller.id, "rejected")}
                    disabled={busy === seller.id}
                    className="inline-flex items-center gap-1.5 bg-red-600 text-white px-3 py-2 rounded text-xs font-semibold disabled:opacity-60"
                  >
                    <X className="w-3.5 h-3.5" />
                    Reject
                  </button>
                  <button
                    onClick={() => updateStatus(seller.id, "suspended")}
                    disabled={busy === seller.id}
                    className="inline-flex items-center gap-1.5 border border-gray-200 text-gray-600 px-3 py-2 rounded text-xs font-semibold disabled:opacity-60"
                  >
                    Suspend
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
