"use client";

import { useState } from "react";
import { CheckCircle2, AlertCircle } from "lucide-react";
import Button from "@/components/ui/Button";

const SUBJECTS = [
  "Construction Inquiry (Building Works)",
  "Civil Works",
  "Interior Design Inquiry",
  "Architectural Inquiry",
  "House Plans / Shop Order",
  "General Inquiry",
];

export default function ContactForm() {
  const [form, setForm] = useState({ name: "", company: "", phone: "", email: "", subject: "", message: "" });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error ?? "Failed to send message");
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
        <h3 className="text-xl font-bold text-ud-dark mb-2">Message Sent</h3>
        <p className="text-ud-dark/60 text-sm">We&apos;ll be in touch within 24 hours.</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-[4px] p-8 md:p-10 shadow-sm border border-ud-dark/8">
      <h3 className="text-xl font-bold text-ud-dark mb-7">Send Us a Message</h3>
      <div className="grid sm:grid-cols-2 gap-5 mb-5">
        <div>
          <label className="block text-xs font-semibold text-ud-dark/60 uppercase tracking-wider mb-1.5">Full Name *</label>
          <input required name="name" value={form.name} onChange={handleChange} placeholder="John Doe" className="w-full border border-ud-dark/20 rounded-[4px] px-4 py-2.5 text-sm text-ud-dark placeholder:text-ud-dark/30 focus:outline-none focus:border-ud-burgundy transition-colors" />
        </div>
        <div>
          <label className="block text-xs font-semibold text-ud-dark/60 uppercase tracking-wider mb-1.5">Company</label>
          <input name="company" value={form.company} onChange={handleChange} placeholder="Your Company" className="w-full border border-ud-dark/20 rounded-[4px] px-4 py-2.5 text-sm text-ud-dark placeholder:text-ud-dark/30 focus:outline-none focus:border-ud-burgundy transition-colors" />
        </div>
      </div>
      <div className="grid sm:grid-cols-2 gap-5 mb-5">
        <div>
          <label className="block text-xs font-semibold text-ud-dark/60 uppercase tracking-wider mb-1.5">Phone</label>
          <input name="phone" value={form.phone} onChange={handleChange} placeholder="+254..." className="w-full border border-ud-dark/20 rounded-[4px] px-4 py-2.5 text-sm text-ud-dark placeholder:text-ud-dark/30 focus:outline-none focus:border-ud-burgundy transition-colors" />
        </div>
        <div>
          <label className="block text-xs font-semibold text-ud-dark/60 uppercase tracking-wider mb-1.5">Email *</label>
          <input required type="email" name="email" value={form.email} onChange={handleChange} placeholder="you@example.com" className="w-full border border-ud-dark/20 rounded-[4px] px-4 py-2.5 text-sm text-ud-dark placeholder:text-ud-dark/30 focus:outline-none focus:border-ud-burgundy transition-colors" />
        </div>
      </div>
      <div className="mb-5">
        <label className="block text-xs font-semibold text-ud-dark/60 uppercase tracking-wider mb-1.5">Subject</label>
        <select name="subject" value={form.subject} onChange={handleChange} className="w-full border border-ud-dark/20 rounded-[4px] px-4 py-2.5 text-sm text-ud-dark focus:outline-none focus:border-ud-burgundy transition-colors bg-white">
          <option value="">Select a subject...</option>
          {SUBJECTS.map((s) => <option key={s} value={s}>{s}</option>)}
        </select>
      </div>
      <div className="mb-7">
        <label className="block text-xs font-semibold text-ud-dark/60 uppercase tracking-wider mb-1.5">Message *</label>
        <textarea required name="message" value={form.message} onChange={handleChange} rows={5} placeholder="Tell us about your project..." className="w-full border border-ud-dark/20 rounded-[4px] px-4 py-2.5 text-sm text-ud-dark placeholder:text-ud-dark/30 focus:outline-none focus:border-ud-burgundy transition-colors resize-none" />
      </div>
      {error && (
        <div className="flex items-start gap-2 bg-ud-burgundy/5 border border-ud-burgundy/30 rounded-[4px] p-3 mb-5 text-sm text-ud-burgundy">
          <AlertCircle size={16} className="flex-shrink-0 mt-0.5" />
          {error}
        </div>
      )}
      <Button type="submit" variant="primary" className="w-full py-3.5" loading={loading} disabled={loading}>
        {loading ? "Sending…" : "Send Message"}
      </Button>
    </form>
  );
}
