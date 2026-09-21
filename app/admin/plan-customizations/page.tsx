"use client";

import { useEffect, useState } from "react";

type RequestRow = { id: string; planId: string | null; name: string; email: string; phone: string | null; request: string; status: string; createdAt: string };

export default function AdminPlanCustomizationPage() {
  const [rows, setRows] = useState<RequestRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const load = () => fetch("/api/admin/plan-customizations").then((r) => r.json()).then((data) => setRows(Array.isArray(data) ? data : [])).catch(() => setError("Could not load plan requests.")).finally(() => setLoading(false));
  useEffect(() => { load(); }, []);
  const updateStatus = async (id: string, status: string) => { await fetch("/api/admin/plan-customizations", { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id, status }) }); load(); };

  return (
    <div className="p-5 md:p-8 max-w-6xl">
      <h1 className="text-xl md:text-2xl font-bold text-ud-dark">Plan Customization Requests</h1>
      <p className="text-sm text-ud-dark/50 mt-1 mb-6">Review requested changes to stock house plans.</p>
      {error && <p className="text-sm text-ud-burgundy mb-4">{error}</p>}
      <div className="bg-white rounded-[4px] border border-ud-dark/10 overflow-x-auto">
        {loading ? <p className="p-8 text-sm text-ud-dark/50">Loading…</p> : rows.length === 0 ? <p className="p-8 text-sm text-ud-dark/50">No customization requests yet.</p> : (
          <table className="w-full text-sm">
            <thead><tr className="border-b border-ud-dark/10 text-left text-xs uppercase tracking-wider text-ud-dark/45"><th className="p-4">Requester</th><th className="p-4">Plan</th><th className="p-4">Request</th><th className="p-4">Status</th><th className="p-4">Action</th></tr></thead>
            <tbody>{rows.map((row) => <tr key={row.id} className="border-b border-ud-dark/5 align-top"><td className="p-4"><strong>{row.name}</strong><br /><span className="text-xs text-ud-dark/50">{row.email}{row.phone ? ` · ${row.phone}` : ""}</span></td><td className="p-4 text-xs text-ud-dark/55">{row.planId || "Custom / unspecified"}</td><td className="p-4 max-w-md whitespace-pre-line text-ud-dark/70">{row.request}</td><td className="p-4 capitalize">{row.status}</td><td className="p-4"><select value={row.status} onChange={(event) => updateStatus(row.id, event.target.value)} className="border border-ud-dark/20 rounded px-2 py-1 text-xs"><option value="pending">Pending</option><option value="responded">Responded</option><option value="declined">Declined</option></select></td></tr>)}</tbody>
          </table>
        )}
      </div>
    </div>
  );
}
