"use client";

import { useState } from "react";
import { CheckCircle2, AlertCircle, Paperclip } from "lucide-react";
import Button from "@/components/ui/Button";
import { useCart } from "@/context/CartContext";
import { whatsappLink } from "@/lib/constants";

export const PROJECT_TYPES = [
  "Building Works — Residential",
  "Building Works — Commercial / Institutional",
  "Renovation & Remodeling",
  "Boundary Wall Construction",
  "Civil Works — Murram Road",
  "Civil Works — Cabro Paving",
  "Civil Works — Drainage",
  "Interior Design — Office Partitioning",
  "Interior Design — Glass & Aluminum",
  "Architectural Design & Consultancy",
  "House Plan (Digital / Printed)",
  "Other",
];

interface QuoteFormProps {
  /** Pre-select the project type (used when embedded on a specific service page). */
  defaultProjectType?: string;
  /** Compact heading copy for embedded use. */
  heading?: string;
}

export default function QuoteForm({ defaultProjectType = "", heading = "Request a Quote" }: QuoteFormProps) {
  const { items } = useCart();
  const [form, setForm] = useState({
    name: "",
    phone: "",
    whatsappPreferred: false,
    email: "",
    projectType: defaultProjectType,
    location: "",
    timeline: "",
    message: "",
  });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? (e.target as HTMLInputElement).checked : value,
    }));
  };

  // Auto-fill: summarise the current cart so the team sees what the visitor selected.
  const cartSummary =
    items.length > 0
      ? items.map((i) => `• ${i.name} ×${i.quantity}`).join("\n")
      : "";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const composedMessage = [
      `Project type: ${form.projectType || "Not specified"}`,
      `Location: ${form.location || "Not specified"}`,
      form.timeline ? `Timeline: ${form.timeline}` : "",
      form.whatsappPreferred ? "Preferred contact: WhatsApp" : "",
      "",
      form.message,
      cartSummary ? `\n--- Items in cart ---\n${cartSummary}` : "",
    ]
      .filter(Boolean)
      .join("\n");

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name,
          phone: form.phone,
          email: form.email,
          subject: `Quote Request — ${form.projectType || "General"}`,
          message: composedMessage,
        }),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error ?? "Failed to send request");
      }
      setSubmitted(true);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="bg-white rounded-[4px] p-10 shadow-sm border border-ud-dark/8 text-center">
        <div className="w-16 h-16 bg-ud-burgundy/10 rounded-full flex items-center justify-center mx-auto mb-4">
          <CheckCircle2 size={32} className="text-ud-burgundy" />
        </div>
        <h3 className="text-xl font-bold text-ud-dark mb-2">Request Received</h3>
        <p className="text-ud-dark/60 text-sm">Our team will prepare your quote and respond within 24 hours.</p>
      </div>
    );
  }

  const inputCls =
    "w-full border border-ud-dark/20 rounded-[4px] px-4 py-2.5 text-sm text-ud-dark placeholder:text-ud-dark/30 focus:outline-none focus:border-ud-burgundy transition-colors";
  const labelCls = "block text-xs font-semibold text-ud-dark/60 uppercase tracking-wider mb-1.5";

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-[4px] p-8 md:p-10 shadow-sm border border-ud-dark/8">
      <h3 className="text-xl font-bold text-ud-dark mb-7">{heading}</h3>

      <div className="grid sm:grid-cols-2 gap-5 mb-5">
        <div>
          <label className={labelCls}>Full Name *</label>
          <input required name="name" value={form.name} onChange={handleChange} placeholder="John Doe" className={inputCls} />
        </div>
        <div>
          <label className={labelCls}>Email *</label>
          <input required type="email" name="email" value={form.email} onChange={handleChange} placeholder="you@example.com" className={inputCls} />
        </div>
      </div>

      <div className="grid sm:grid-cols-2 gap-5 mb-5">
        <div>
          <label className={labelCls}>Phone *</label>
          <input required name="phone" value={form.phone} onChange={handleChange} placeholder="+254…" className={inputCls} />
        </div>
        <div>
          <label className={labelCls}>Location</label>
          <input name="location" value={form.location} onChange={handleChange} placeholder="e.g. Upper Hill, Nairobi" className={inputCls} />
        </div>
      </div>

      <div className="mb-5">
        <label className="flex items-center gap-2 cursor-pointer select-none">
          <input type="checkbox" name="whatsappPreferred" checked={form.whatsappPreferred} onChange={handleChange} className="accent-ud-burgundy w-4 h-4" />
          <span className="text-sm text-ud-dark/70">Reach me on this number via WhatsApp</span>
        </label>
      </div>

      <div className="grid sm:grid-cols-2 gap-5 mb-5">
        <div>
          <label className={labelCls}>Project Type *</label>
          <select required name="projectType" value={form.projectType} onChange={handleChange} className={`${inputCls} bg-white cursor-pointer`}>
            <option value="">Select a project type…</option>
            {PROJECT_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
          </select>
        </div>
        <div>
          <label className={labelCls}>Timeline</label>
          <input name="timeline" value={form.timeline} onChange={handleChange} placeholder="e.g. Start in 2 months" className={inputCls} />
        </div>
      </div>

      <div className="mb-5">
        <label className={labelCls}>Project Description *</label>
        <textarea required name="message" value={form.message} onChange={handleChange} rows={5} placeholder="Tell us about your project — scope, size, and any specific requirements…" className={`${inputCls} resize-none`} />
      </div>

      {cartSummary && (
        <div className="mb-5 bg-ud-light-gray rounded-[4px] p-3.5 text-xs text-ud-dark/70">
          <span className="font-bold text-ud-dark">Auto-filled from your cart:</span>
          <pre className="mt-1.5 whitespace-pre-wrap font-sans">{cartSummary}</pre>
        </div>
      )}

      {/* Drawings: the upload endpoint requires an account, so route attachments via WhatsApp/email. */}
      <a
        href={whatsappLink("Hello Ujenzi Dhabiti, I'd like to send drawings for a quote.")}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-2 text-xs font-semibold text-ud-burgundy hover:underline mb-6"
      >
        <Paperclip size={14} /> Have drawings? Send them to us on WhatsApp
      </a>

      {error && (
        <div className="flex items-start gap-2 bg-ud-burgundy/5 border border-ud-burgundy/30 rounded-[4px] p-3 mb-5 text-sm text-ud-burgundy">
          <AlertCircle size={16} className="flex-shrink-0 mt-0.5" />
          {error}
        </div>
      )}

      <Button type="submit" variant="primary" className="w-full py-3.5" loading={loading} disabled={loading}>
        {loading ? "Sending…" : "Submit Request"}
      </Button>
    </form>
  );
}
