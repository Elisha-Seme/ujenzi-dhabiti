"use client";

import { useEffect, useState } from "react";

type QuoteRow = {
  id: string;
  projectType: string;
  requestKind: string;
  sourcePlanName?: string | null;
  contactName?: string | null;
  contactEmail?: string | null;
  contactPhone?: string | null;
  description: string;
  status: "pending" | "responded" | "declined";
  notificationStatus: string;
  submittedAt: string;
};

export default function AdminQuotesPage() {
  const [rows, setRows] = useState<QuoteRow[]>([]);
  const [error, setError] = useState("");

  const load = () => fetch("/api/admin/quotes")
    .then((response) => response.ok ? response.json() : Promise.reject(new Error("Unable to load requests")))
    .then(setRows)
    .catch((reason) => setError(reason.message));

  useEffect(() => {
    void load();
  }, []);

  const setStatus = async (id: string, status: QuoteRow["status"]) => {
    const response = await fetch(`/api/admin/quotes/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    if (response.ok) load();
    else setError("Unable to update request");
  };

  return (
    <div className="p-6 md:p-10">
      <h1 className="text-2xl font-bold text-ud-dark">Quote & Contact Requests</h1>
      <p className="text-sm text-ud-dark/50 mt-1 mb-8">Review guest and account submissions, including plan-modification requests.</p>
      {error && <p className="mb-4 text-sm text-red-700">{error}</p>}
      <div className="space-y-4">
        {rows.map((row) => (
          <article key={row.id} className="bg-white border border-ud-dark/10 rounded-[4px] p-5">
            <div className="flex flex-wrap justify-between gap-3">
              <div>
                <p className="font-mono text-xs text-ud-dark/45">{row.id}</p>
                <h2 className="font-bold text-ud-dark">{row.projectType}</h2>
                <p className="text-xs text-ud-burgundy">{row.requestKind}{row.sourcePlanName ? ` · ${row.sourcePlanName}` : ""}</p>
              </div>
              <select value={row.status} onChange={(event) => setStatus(row.id, event.target.value as QuoteRow["status"])} className="h-10 border rounded px-3 text-sm">
                <option value="pending">Pending</option>
                <option value="responded">Responded</option>
                <option value="declined">Declined</option>
              </select>
            </div>
            <p className="mt-3 text-sm text-ud-dark/70 whitespace-pre-line">{row.description}</p>
            <div className="mt-4 text-xs text-ud-dark/50">
              {row.contactName} · <a href={`mailto:${row.contactEmail}`} className="text-ud-burgundy">{row.contactEmail}</a>
              {row.contactPhone ? ` · ${row.contactPhone}` : ""} · Notification: {row.notificationStatus}
            </div>
          </article>
        ))}
        {!error && rows.length === 0 && <p className="text-sm text-ud-dark/50">No requests found.</p>}
      </div>
    </div>
  );
}
