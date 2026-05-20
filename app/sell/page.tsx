"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { Globe, CreditCard, Activity, ShieldCheck, Check, BadgeCheck, CheckCircle2 } from "lucide-react";
import SectionHero from "@/components/ui/SectionHero";
import Button from "@/components/ui/Button";
import { SELLERS } from "@/lib/sellers";
import { PLATFORM_FEE_PERCENT, PRODUCT_CATEGORIES } from "@/lib/products";

const BENEFITS = [
  {
    icon: <Globe size={28} />,
    title: "Pan-African Buyer Base",
    body: "Access buyers in Kenya, Uganda, Tanzania, Rwanda, and beyond — all in one marketplace built for the construction industry.",
  },
  {
    icon: <CreditCard size={28} />,
    title: "Instant M-Pesa Payments",
    body: "Buyers pay via M-Pesa, card, or bank transfer. Funds are settled to your account within 2 business days of confirmed dispatch.",
  },
  {
    icon: <Activity size={28} />,
    title: "Your Own Storefront",
    body: "Get a dedicated seller page, ratings, and reviews. Build your reputation with every order you fulfil.",
  },
  {
    icon: <ShieldCheck size={28} />,
    title: "Buyer-Seller Protection",
    body: "Our escrow-style payment holds funds until delivery is confirmed. Both parties are protected from fraud and non-delivery.",
  },
];

const STEPS = [
  { n: "01", title: "Register", body: "Fill in your business details, upload your KRA PIN and business licence. Approval takes 1–3 business days." },
  { n: "02", title: "List Products", body: "Upload products with prices, specs, images, and lead times. No limit on listings." },
  { n: "03", title: "Receive Orders", body: "Get notified when a buyer places an order. Confirm and prepare for dispatch." },
  { n: "04", title: "Get Paid", body: "Buyer confirms receipt. Funds (minus the 3% platform fee) are released to your account." },
];

export default function SellPage() {
  const { data: session } = useSession();
  const [form, setForm] = useState({
    name: "", email: "", phone: "", business: "", county: "", message: "",
  });
  const [categories, setCategories] = useState<string[]>([]);
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const set = (k: string, v: string) => setForm((p) => ({ ...p, [k]: v }));

  // Pre-fill from session when logged in
  useEffect(() => {
    if (session?.user) {
      setForm((p) => ({
        ...p,
        name: p.name || session.user?.name || "",
        email: p.email || session.user?.email || "",
      }));
    }
  }, [session]);

  const toggleCategory = (cat: string) => {
    setCategories((prev) => (prev.includes(cat) ? prev.filter((c) => c !== cat) : [...prev, cat]));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError("");

    try {
      const res = await fetch("/api/sellers/apply", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, categories }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Failed to submit application.");
        return;
      }
      setSubmitted(true);
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <SectionHero
        title="Sell on Ujenzi Dhabiti"
        subtitle={`Reach thousands of construction buyers across Africa. We take ${PLATFORM_FEE_PERCENT}% — you keep the rest.`}
      />

      {/* Stats strip */}
      <section className="bg-ud-dark py-10">
        <div className="max-w-content mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          {[
            { value: "6", label: "Active sellers" },
            { value: "18+", label: "Products listed" },
            { value: "8", label: "Countries reached" },
            { value: `${PLATFORM_FEE_PERCENT}%`, label: "Platform fee only" },
          ].map((s) => (
            <div key={s.label}>
              <div className="text-2xl sm:text-3xl font-bold text-ud-white mb-1">{s.value}</div>
              <div className="text-[10px] sm:text-xs text-white/40 font-semibold uppercase tracking-widest">{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Benefits */}
      <section className="bg-ud-white py-20 md:py-28">
        <div className="max-w-content mx-auto px-6">
          <div className="text-center mb-14">
            <div className="text-xs font-bold uppercase tracking-[0.25em] text-ud-burgundy mb-3">Why Sell Here</div>
            <h2 className="text-3xl md:text-4xl font-bold text-ud-dark">Built for construction commerce</h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {BENEFITS.map((b, i) => (
              <div key={i}>
                <div className="text-ud-burgundy mb-4">{b.icon}</div>
                <h3 className="text-base font-bold text-ud-dark mb-2">{b.title}</h3>
                <p className="text-sm text-ud-dark/55 leading-relaxed">{b.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="bg-ud-light-gray py-20 md:py-28">
        <div className="max-w-content mx-auto px-6">
          <div className="text-center mb-14">
            <div className="text-xs font-bold uppercase tracking-[0.25em] text-ud-burgundy mb-3">Process</div>
            <h2 className="text-3xl md:text-4xl font-bold text-ud-dark">How selling works</h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {STEPS.map((s) => (
              <div key={s.n} className="bg-white rounded-[4px] p-7 shadow-sm border-t-[3px] border-ud-burgundy">
                <div className="text-3xl font-bold text-ud-burgundy/20 mb-4">{s.n}</div>
                <h3 className="text-base font-bold text-ud-dark mb-2">{s.title}</h3>
                <p className="text-sm text-ud-dark/55 leading-relaxed">{s.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Fee transparency */}
      <section className="bg-ud-dark py-16">
        <div className="max-w-content mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <div className="text-xs font-bold uppercase tracking-[0.25em] text-ud-burgundy mb-4">Transparent Pricing</div>
              <h2 className="text-2xl md:text-3xl font-bold text-ud-white mb-5">One fee. No surprises.</h2>
              <p className="text-white/60 font-light leading-relaxed mb-6">
                We charge a flat <strong className="text-white">{PLATFORM_FEE_PERCENT}% platform fee</strong> on every completed transaction. That&apos;s it. No listing fees, no monthly subscriptions, no hidden charges.
              </p>
              <ul className="space-y-2">
                {["Free to list", "Free seller profile", "No monthly fees", `${PLATFORM_FEE_PERCENT}% only on completed sales`, "Funds settled in 2 business days"].map((item) => (
                  <li key={item} className="flex items-center gap-2 text-sm text-white/70">
                    <Check size={14} className="text-ud-burgundy flex-shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            <div className="bg-white/5 border border-white/10 rounded-[4px] p-8">
              <div className="text-xs font-bold uppercase tracking-wider text-white/40 mb-4">Example sale</div>
              {[
                { label: "Sale price", value: "KES 10,000", highlight: false },
                { label: `Platform fee (${PLATFORM_FEE_PERCENT}%)`, value: "KES 300", highlight: false },
                { label: "You receive", value: "KES 9,700", highlight: true },
              ].map((row) => (
                <div key={row.label} className={`flex justify-between py-3 border-b border-white/10 last:border-0 ${row.highlight ? "text-white font-bold" : "text-white/60"}`}>
                  <span className="text-sm">{row.label}</span>
                  <span className="text-sm">{row.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Current sellers */}
      <section className="bg-ud-white py-16">
        <div className="max-w-content mx-auto px-6">
          <div className="text-center mb-10">
            <div className="text-xs font-bold uppercase tracking-[0.25em] text-ud-burgundy mb-3">Marketplace</div>
            <h2 className="text-2xl font-bold text-ud-dark">Join these sellers already selling here</h2>
          </div>
          <div className="flex flex-wrap justify-center gap-4">
            {SELLERS.map((s) => (
              <div key={s.id} className="flex items-center gap-3 bg-ud-light-gray rounded-[4px] px-5 py-3">
                <div className="w-8 h-8 rounded-full bg-ud-burgundy flex items-center justify-center flex-shrink-0">
                  <span className="text-xs font-bold text-white">{s.name[0]}</span>
                </div>
                <div>
                  <div className="text-sm font-semibold text-ud-dark">{s.name}</div>
                  <div className="text-[11px] text-ud-dark/50">{s.location}</div>
                </div>
                {s.verified && (
                  <BadgeCheck size={14} className="text-ud-burgundy flex-shrink-0" />
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Registration form */}
      <section className="bg-ud-light-gray py-20 md:py-28" id="register">
        <div className="max-w-content mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-12 items-start">
            <div>
              <div className="text-xs font-bold uppercase tracking-[0.25em] text-ud-burgundy mb-4">Apply Now</div>
              <h2 className="text-3xl font-bold text-ud-dark mb-4">Start selling today</h2>
              <p className="text-ud-dark/60 font-light leading-relaxed mb-6">
                Fill in your details. Our team reviews applications within 1–3 business days. Once approved, you can start listing immediately.
              </p>
              <div className="space-y-3">
                {["Valid KRA PIN certificate", "Business registration certificate", "At least one product category", "M-Pesa or bank account for settlements"].map((req) => (
                  <div key={req} className="flex items-start gap-2.5 text-sm text-ud-dark/70">
                    <Check size={14} className="text-ud-burgundy flex-shrink-0 mt-0.5" />
                    {req}
                  </div>
                ))}
              </div>
            </div>

            {submitted ? (
              <div className="bg-white rounded-[4px] shadow-sm p-10 text-center">
                <div className="w-14 h-14 bg-ud-burgundy/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle2 size={28} className="text-ud-burgundy" />
                </div>
                <h3 className="text-lg font-bold text-ud-dark mb-2">Application Submitted</h3>
                <p className="text-sm text-ud-dark/55 leading-relaxed">We&apos;ll review your application and get back to you at <strong>{form.email}</strong> within 3 business days.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="bg-white rounded-[4px] shadow-sm p-8 space-y-5">
                {error && (
                  <div className="bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded-[4px]">
                    {error}
                  </div>
                )}
                <div className="grid sm:grid-cols-2 gap-5">
                  {[
                    { k: "name", label: "Contact Name", placeholder: "Your name", required: true },
                    { k: "business", label: "Business Name", placeholder: "Registered business name", required: true },
                    { k: "email", label: "Email", placeholder: "business@example.com", required: true },
                    { k: "phone", label: "Phone", placeholder: "+254...", required: true },
                    { k: "county", label: "County / Region", placeholder: "e.g. Nairobi", required: false },
                  ].map((f) => (
                    <div key={f.k}>
                      <label className="block text-xs font-semibold text-ud-dark/60 uppercase tracking-wider mb-1.5">{f.label}{f.required && " *"}</label>
                      <input
                        required={f.required}
                        value={form[f.k as keyof typeof form]}
                        onChange={(e) => set(f.k, e.target.value)}
                        placeholder={f.placeholder}
                        className="w-full border border-ud-dark/20 rounded-[4px] px-4 py-2.5 text-sm text-ud-dark placeholder:text-ud-dark/30 focus:outline-none focus:border-ud-burgundy transition-colors"
                      />
                    </div>
                  ))}
                </div>

                {/* Multi-category select */}
                <div>
                  <label className="block text-xs font-semibold text-ud-dark/60 uppercase tracking-wider mb-2">Categories you sell</label>
                  <div className="flex flex-wrap gap-2">
                    {PRODUCT_CATEGORIES.map((cat) => {
                      const active = categories.includes(cat);
                      return (
                        <button
                          key={cat}
                          type="button"
                          onClick={() => toggleCategory(cat)}
                          className={`text-xs font-semibold px-3 py-2 rounded-[4px] border transition-colors ${
                            active
                              ? "bg-ud-burgundy border-ud-burgundy text-white"
                              : "border-ud-dark/20 text-ud-dark/70 hover:border-ud-burgundy"
                          }`}
                        >
                          {cat}
                        </button>
                      );
                    })}
                  </div>
                  {categories.length === 0 && (
                    <p className="text-xs text-ud-dark/40 mt-2">Select at least one category.</p>
                  )}
                </div>
                <div>
                  <label className="block text-xs font-semibold text-ud-dark/60 uppercase tracking-wider mb-1.5">Tell us about your business</label>
                  <textarea
                    value={form.message}
                    onChange={(e) => set("message", e.target.value)}
                    rows={3}
                    placeholder="What do you sell? Volume? Any questions?"
                    className="w-full border border-ud-dark/20 rounded-[4px] px-4 py-2.5 text-sm text-ud-dark placeholder:text-ud-dark/30 focus:outline-none focus:border-ud-burgundy transition-colors resize-none"
                  />
                </div>
                <Button type="submit" variant="primary" className="w-full py-3.5" disabled={submitting}>
                  {submitting ? "Submitting..." : "Submit Application"}
                </Button>
              </form>
            )}
          </div>
        </div>
      </section>
    </>
  );
}
