"use client";

import { useEffect, useState } from "react";
import { Download, Loader2, Mail } from "lucide-react";

interface Subscriber {
  email: string;
  createdAt: string;
}

export default function AdminNewsletterPage() {
  const [rows, setRows] = useState<Subscriber[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/admin/newsletter")
      .then((r) => r.json())
      .then((d) => setRows(Array.isArray(d) ? d : []))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="p-5 md:p-8 max-w-4xl">
      <div className="flex items-start justify-between gap-4 mb-6">
        <div>
          <h1 className="text-xl md:text-2xl font-bold text-ud-dark">Newsletter Subscribers</h1>
          <p className="text-sm text-ud-dark/50 mt-1">{loading ? "Loading…" : `${rows.length} subscriber${rows.length !== 1 ? "s" : ""}`}</p>
        </div>
        <a
          href="/api/admin/newsletter?format=csv"
          className="inline-flex items-center gap-2 bg-ud-burgundy text-white text-sm font-semibold px-4 py-2.5 rounded-[4px] hover:bg-ud-burgundy-hover transition-colors whitespace-nowrap"
        >
          <Download size={16} /> Export CSV
        </a>
      </div>

      <div className="bg-white rounded-[4px] border border-ud-dark/10 overflow-hidden">
        {loading ? (
          <div className="p-10 text-center text-ud-dark/40 text-sm flex items-center justify-center gap-2">
            <Loader2 size={16} className="animate-spin" /> Loading…
          </div>
        ) : rows.length === 0 ? (
          <div className="p-10 text-center text-ud-dark/40 text-sm">
            <Mail className="w-8 h-8 mx-auto mb-2 text-ud-dark/20" />
            No subscribers yet. They&apos;ll appear here as people sign up via the footer.
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-ud-dark/10 bg-ud-light-gray/60">
                <th className="text-left font-bold text-ud-dark/50 uppercase tracking-wider text-[11px] px-4 py-3">Email</th>
                <th className="text-left font-bold text-ud-dark/50 uppercase tracking-wider text-[11px] px-4 py-3">Subscribed</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => (
                <tr key={r.email} className="border-b border-ud-dark/5 last:border-0 hover:bg-ud-light-gray/40">
                  <td className="px-4 py-3 text-ud-dark/80">{r.email}</td>
                  <td className="px-4 py-3 text-ud-dark/50">{new Date(r.createdAt).toLocaleDateString("en-KE", { day: "numeric", month: "short", year: "numeric" })}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
