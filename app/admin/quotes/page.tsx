"use client";

import { useEffect, useState } from "react";
import { ClipboardList, Loader2, Mail, Phone } from "lucide-react";

type Quote = {
  id: string; contactName: string | null; contactEmail: string | null; contactPhone: string | null;
  subject: string | null; projectType: string; description: string; status: "pending" | "responded" | "declined";
  submittedAt: string; attachments: { name: string }[];
};

export default function AdminQuotesPage() {
  const [quotes, setQuotes] = useState<Quote[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const load = () => fetch("/api/admin/quotes").then(async (response) => {
    if (!response.ok) throw new Error("Could not load enquiries.");
    return response.json();
  }).then(setQuotes).catch((cause) => setError(cause.message)).finally(() => setLoading(false));
  useEffect(() => { load(); }, []);
  const update = async (id: string, status: Quote["status"]) => {
    setError("");
    const response = await fetch("/api/admin/quotes", { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id, status }) });
    if (!response.ok) setError("Could not update the enquiry status.");
    else load();
  };

  return <div className="p-5 md:p-8 max-w-6xl">
    <h1 className="text-xl md:text-2xl font-bold text-ud-dark">Quotes & Enquiries</h1>
    <p className="text-sm text-ud-dark/50 mt-1 mb-6">All website quote and contact submissions, including guest enquiries.</p>
    {error && <p className="text-sm text-ud-burgundy mb-4">{error}</p>}
    {loading ? <div className="bg-white border border-ud-dark/10 rounded p-8 text-center text-sm text-ud-dark/50"><Loader2 className="w-5 h-5 animate-spin mx-auto mb-2 text-ud-burgundy" />Loading enquiries…</div>
      : quotes.length === 0 ? <div className="bg-white border border-ud-dark/10 rounded p-10 text-center"><ClipboardList className="w-10 h-10 text-ud-dark/30 mx-auto mb-3" /><p className="text-sm text-ud-dark/50">No enquiries yet.</p></div>
      : <div className="space-y-4">{quotes.map((quote) => <article key={quote.id} className="bg-white border border-ud-dark/10 rounded p-5">
        <div className="flex flex-col md:flex-row md:items-start gap-4">
          <div className="flex-1 min-w-0"><div className="flex flex-wrap gap-2 items-center"><strong className="text-ud-dark">{quote.subject || quote.projectType}</strong><span className="text-xs px-2 py-0.5 rounded-full bg-ud-dark/5 capitalize">{quote.status}</span></div>
            <p className="text-sm text-ud-dark/60 mt-1">{quote.contactName || "Guest"} · {new Date(quote.submittedAt).toLocaleString("en-KE")}</p>
            <div className="flex flex-wrap gap-x-4 gap-y-1 mt-2 text-sm"><a className="inline-flex items-center gap-1 text-ud-burgundy" href={`mailto:${quote.contactEmail}`}><Mail className="w-3.5 h-3.5" />{quote.contactEmail || "No email"}</a>{quote.contactPhone && <a className="inline-flex items-center gap-1 text-ud-burgundy" href={`tel:${quote.contactPhone}`}><Phone className="w-3.5 h-3.5" />{quote.contactPhone}</a>}</div>
            <p className="whitespace-pre-line text-sm text-ud-dark/70 mt-4">{quote.description}</p>{quote.attachments?.length > 0 && <p className="text-xs text-ud-dark/50 mt-3">Attachments submitted: {quote.attachments.map((file) => file.name).join(", ")}</p>}</div>
          <select aria-label={`Status for ${quote.id}`} value={quote.status} onChange={(event) => update(quote.id, event.target.value as Quote["status"])} className="border border-ud-dark/20 rounded px-2 py-2 text-sm"><option value="pending">Pending</option><option value="responded">Responded</option><option value="declined">Declined</option></select>
        </div></article>)}</div>}
  </div>;
}
