"use client";

import { useState } from "react";
import { CheckCircle2, AlertCircle, Paperclip, X } from "lucide-react";
import Button from "@/components/ui/Button";
import PlacesAutocompleteInput from "@/components/ui/PlacesAutocompleteInput";
import { KENYA_COUNTIES } from "@/lib/kenya-counties";

// ─────────────────────────────────────────────────────────────────────────────
// Service Request Form — modelled on the client-approved reference
// (house-ofk.com/service-form): one scrolling form split into titled section
// cards, reworded for Ujenzi Dhabiti's construction services. Used on
// /request-a-quote, /contact, and embedded at the end of every service page.
// Submits through the existing /api/contact pipeline (email + quote record) —
// no new backend.
// ─────────────────────────────────────────────────────────────────────────────

export const SERVICE_OPTIONS = [
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
  "Construction Materials Supply",
];

const PROJECT_TYPES = [
  "Residential — Single Family",
  "Residential — Apartment / Flats",
  "Commercial — Office, Shop, Hotel",
  "Institutional — School, Church, Hospital",
  "Industrial / Warehousing",
  "Civil Works — Roads, Paving, Drainage",
  "Interior Renovation Only",
  "Other",
];

const SITE_OWNERSHIP = ["Yes", "No", "In the process"];

const SITE_ACCESS = [
  "Easily accessible (flat land, road access)",
  "Sloped / Hilly terrain",
  "Remote / Limited access",
];

const TIMELINES = ["Less than 1 month", "1–3 months", "3–6 months", "6 months +"];

const BUDGETS = [
  "Below KES 1M",
  "KES 1M – 3M",
  "KES 3M – 7M",
  "KES 7M – 15M",
  "Over KES 15M",
  "Not sure yet",
];

const MAX_FILES = 3;
const MAX_FILE_MB = 5;

interface Attachment {
  name: string;
  base64: string;
  type: string;
}

interface ServiceRequestFormProps {
  /** Pre-select a service (used when embedded on a specific service page). */
  defaultService?: string;
  /** Pre-fill the project description (e.g. from a "Request Bulk Quote" link). */
  defaultDescription?: string;
  /** Subject prefix so admin can tell quote requests from contact messages. */
  subjectPrefix?: string;
  /** Intro copy above the form. */
  intro?: string;
  requestKind?: string;
  sourcePlanId?: string;
  sourcePlanName?: string;
}

export default function ServiceRequestForm({
  defaultService = "",
  defaultDescription = "",
  subjectPrefix = "Quote Request",
  intro = "Fill in the details below and we will get back to you within 24 hours with a tailored quote for your project.",
  requestKind,
  sourcePlanId,
  sourcePlanName,
}: ServiceRequestFormProps) {
  // Pre-select the relevant service checkbox(es) for the page we're embedded on.
  // Match a service family by prefix (e.g. "Building Works" ticks both
  // "Building Works — Residential" and "— Commercial / Institutional"); if
  // nothing matches, surface the value in the "Other" field so it isn't lost.
  const matchedServices = defaultService
    ? SERVICE_OPTIONS.filter(
        (o) =>
          o === defaultService ||
          o.startsWith(defaultService) ||
          defaultService.startsWith(o.split(" — ")[0]),
      )
    : [];
  const hasMatch = matchedServices.length > 0;

  const [form, setForm] = useState({
    name: "",
    phone: "",
    email: "",
    projectLocation: "",
    otherService: defaultService && !hasMatch ? defaultService : "",
    projectName: "",
    description: defaultDescription,
    projectType: "",
    otherProjectType: "",
    ownSite: "",
    plotSize: "",
    siteLocation: "",
    siteAccess: "",
    county: "",
    startDate: "",
    timeline: "",
    budget: "",
    links: "",
    notes: "",
    confirmAccurate: false,
    agreeContact: false,
  });
  const [services, setServices] = useState<string[]>(matchedServices);
  const [attachments, setAttachments] = useState<Attachment[]>([]);
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [website, setWebsite] = useState("");

  const set = (k: keyof typeof form, v: string | boolean) =>
    setForm((p) => ({ ...p, [k]: v }));

  const toggleService = (s: string) =>
    setServices((prev) => (prev.includes(s) ? prev.filter((x) => x !== s) : [...prev, s]));

  const handleFiles = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []);
    e.target.value = "";
    for (const file of files) {
      if (attachments.length >= MAX_FILES) {
        setError(`You can attach up to ${MAX_FILES} files.`);
        return;
      }
      if (file.size > MAX_FILE_MB * 1024 * 1024) {
        setError(`Each file must be under ${MAX_FILE_MB}MB.`);
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setAttachments((prev) =>
          prev.length < MAX_FILES
            ? [...prev, { name: file.name, base64: reader.result as string, type: file.type }]
            : prev
        );
        setError(null);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (services.length === 0 && !form.otherService.trim()) {
      setError("Please select at least one service (or describe it under Other).");
      return;
    }
    setLoading(true);
    setError(null);

    const serviceList = [...services, form.otherService.trim() ? `Other: ${form.otherService.trim()}` : ""]
      .filter(Boolean)
      .join(", ");

    const composedMessage = [
      "── CLIENT INFORMATION ──",
      `Location of project: ${form.projectLocation || "Not specified"}`,
      `Services required: ${serviceList}`,
      "",
      "── PROJECT OVERVIEW ──",
      `Project name: ${form.projectName || "Not specified"}`,
      `Type of project: ${form.projectType === "Other" ? `Other — ${form.otherProjectType || "unspecified"}` : form.projectType || "Not specified"}`,
      `Description: ${form.description || "Not provided"}`,
      "",
      "── LOCATION INFORMATION ──",
      `Owns the land/site: ${form.ownSite || "Not specified"}`,
      `Plot size: ${form.plotSize || "Not specified"}`,
      `Site location: ${form.siteLocation || "Not specified"}`,
      `County: ${form.county || "Not specified"}`,
      `Site access & terrain: ${form.siteAccess || "Not specified"}`,
      "",
      "── TIMELINES & BUDGET ──",
      `Estimated start date: ${form.startDate || "Not specified"}`,
      `Timeline: ${form.timeline || "Not specified"}`,
      `Budget: ${form.budget || "Not specified"}`,
      form.links.trim() ? `\n── REFERENCE LINKS ──\n${form.links.trim()}` : "",
      form.notes.trim() ? `\n── ADDITIONAL NOTES ──\n${form.notes.trim()}` : "",
    ]
      .filter((l) => l !== "")
      .join("\n");

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name,
          phone: form.phone,
          email: form.email,
          subject: `${subjectPrefix} — ${services[0] ?? form.otherService.trim() ?? "General"}`,
          message: composedMessage,
          drawing: attachments[0] ?? null,
          attachments,
          requestKind,
          sourcePlanId,
          sourcePlanName,
          structured: { ...form, services, attachments: attachments.map(({ name, type }) => ({ name, type })) },
          website,
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
        <p className="text-ud-dark/60 text-sm max-w-sm mx-auto">
          Thank you — our team will review your project details and get back to you within 24 hours.
        </p>
      </div>
    );
  }

  const inputCls =
    "w-full border border-ud-dark/20 rounded-[4px] px-4 py-2.5 text-sm text-ud-dark placeholder:text-ud-dark/30 focus:outline-none focus:border-ud-burgundy transition-colors";
  const labelCls = "block text-xs font-semibold text-ud-dark/60 uppercase tracking-wider mb-1.5";

  const CheckPill = ({
    label,
    checked,
    onToggle,
    type = "checkbox",
  }: {
    label: string;
    checked: boolean;
    onToggle: () => void;
    type?: "checkbox" | "radio";
  }) => (
    <label className="flex items-start gap-2.5 cursor-pointer select-none py-1">
      <input
        type={type}
        checked={checked}
        onChange={onToggle}
        className="accent-ud-burgundy w-4 h-4 mt-0.5 flex-shrink-0"
      />
      <span className="text-sm text-ud-dark/75 leading-snug">{label}</span>
    </label>
  );

  const Section = ({ title, children }: { title: string; children: React.ReactNode }) => (
    <div className="bg-white rounded-[4px] p-6 md:p-8 shadow-sm border border-ud-dark/8">
      <h3 className="text-base md:text-lg font-bold text-ud-dark mb-5 pb-3 border-b border-ud-dark/8">
        {title}
      </h3>
      {children}
    </div>
  );

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <input
        type="text"
        name="website"
        tabIndex={-1}
        autoComplete="off"
        className="hidden"
        aria-hidden="true"
        value={website}
        onChange={(event) => setWebsite(event.target.value)}
      />
      <div className="bg-ud-dark rounded-[4px] p-6 md:p-7 text-center">
        <h2 className="text-lg md:text-xl font-bold text-white mb-2">Get in touch with us</h2>
        <p className="text-sm text-white/65 max-w-lg mx-auto leading-relaxed">{intro}</p>
      </div>

      {/* ── 1. Client Information & Requirements ─────────────────────────── */}
      <Section title="Client Information & Requirements">
        <div className="grid sm:grid-cols-3 gap-5 mb-5">
          <div>
            <label className={labelCls}>Name *</label>
            <input required value={form.name} onChange={(e) => set("name", e.target.value)} placeholder="Enter your name" className={inputCls} />
          </div>
          <div>
            <label className={labelCls}>Phone Number *</label>
            <input required type="tel" value={form.phone} onChange={(e) => set("phone", e.target.value)} placeholder="WhatsApp preferred" className={inputCls} />
          </div>
          <div>
            <label className={labelCls}>Email Address *</label>
            <input required type="email" value={form.email} onChange={(e) => set("email", e.target.value)} placeholder="Enter your email" className={inputCls} />
          </div>
        </div>

        <div className="mb-5">
          <label className={labelCls}>Location of Project</label>
          <PlacesAutocompleteInput
            value={form.projectLocation}
            onChange={(v) => set("projectLocation", v)}
            placeholder="County, town, estate"
            className={inputCls}
          />
        </div>

        <div>
          <label className={labelCls}>Which service do you require? *</label>
          <div className="grid sm:grid-cols-2 gap-x-6">
            {SERVICE_OPTIONS.map((s) => (
              <CheckPill key={s} label={s} checked={services.includes(s)} onToggle={() => toggleService(s)} />
            ))}
          </div>
          <div className="mt-3">
            <label className={labelCls}>Other</label>
            <input value={form.otherService} onChange={(e) => set("otherService", e.target.value)} placeholder="Describe any other service you need" className={inputCls} />
          </div>
        </div>
      </Section>

      {/* ── 2. Project Overview ──────────────────────────────────────────── */}
      <Section title="Project Overview">
        <div className="grid sm:grid-cols-2 gap-5 mb-5">
          <div>
            <label className={labelCls}>Project Name</label>
            <input value={form.projectName} onChange={(e) => set("projectName", e.target.value)} placeholder="e.g. Kamau Residence, Phase 1" className={inputCls} />
          </div>
          <div>
            <label className={labelCls}>Brief Description of Project *</label>
            <input required value={form.description} onChange={(e) => set("description", e.target.value)} placeholder="e.g. 3-bedroom bungalow in Kiambu" className={inputCls} />
          </div>
        </div>

        <label className={labelCls}>Type of Project</label>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-x-6">
          {PROJECT_TYPES.map((t) => (
            <CheckPill key={t} type="radio" label={t} checked={form.projectType === t} onToggle={() => set("projectType", t)} />
          ))}
        </div>
        {form.projectType === "Other" && (
          <div className="mt-3">
            <input value={form.otherProjectType} onChange={(e) => set("otherProjectType", e.target.value)} placeholder="Tell us more about your project type" className={inputCls} />
          </div>
        )}
      </Section>

      {/* ── 3. Location Information ──────────────────────────────────────── */}
      <Section title="Location Information">
        <label className={labelCls}>Do you already own the land/site?</label>
        <div className="flex flex-wrap gap-x-8 mb-5">
          {SITE_OWNERSHIP.map((o) => (
            <CheckPill key={o} type="radio" label={o} checked={form.ownSite === o} onToggle={() => set("ownSite", o)} />
          ))}
        </div>

        <div className="grid sm:grid-cols-3 gap-5 mb-5">
          <div>
            <label className={labelCls}>Plot Size (sqm or acres)</label>
            <input value={form.plotSize} onChange={(e) => set("plotSize", e.target.value)} placeholder="e.g. 50 × 100 ft or ¼ acre" className={inputCls} />
          </div>
          <div>
            <label className={labelCls}>Search Location</label>
            <PlacesAutocompleteInput
              value={form.siteLocation}
              onChange={(v) => set("siteLocation", v)}
              placeholder="Search for the site location…"
              className={inputCls}
            />
          </div>
          <div>
            <label className={labelCls}>County</label>
            <select value={form.county} onChange={(e) => set("county", e.target.value)} className={`${inputCls} bg-white cursor-pointer ${form.county ? "" : "text-ud-dark/40"}`}>
              <option value="">Select your county…</option>
              {KENYA_COUNTIES.map((c) => (
                <option key={c} value={c} className="text-ud-dark">{c}</option>
              ))}
            </select>
          </div>
        </div>

        <label className={labelCls}>Site Access & Terrain</label>
        <div className="grid sm:grid-cols-3 gap-x-6">
          {SITE_ACCESS.map((a) => (
            <CheckPill key={a} type="radio" label={a} checked={form.siteAccess === a} onToggle={() => set("siteAccess", a)} />
          ))}
        </div>
      </Section>

      {/* ── 4. Project Timelines & Budget ────────────────────────────────── */}
      <Section title="Project Timelines & Budget">
        <div className="grid sm:grid-cols-2 gap-5 mb-5">
          <div>
            <label className={labelCls}>Estimated Start Date</label>
            <input type="date" value={form.startDate} onChange={(e) => set("startDate", e.target.value)} className={`${inputCls} ${form.startDate ? "" : "text-ud-dark/40"}`} />
          </div>
          <div>
            <label className={labelCls}>Project Timeline</label>
            <div className="flex flex-wrap gap-x-6">
              {TIMELINES.map((t) => (
                <CheckPill key={t} type="radio" label={t} checked={form.timeline === t} onToggle={() => set("timeline", t)} />
              ))}
            </div>
          </div>
        </div>

        <label className={labelCls}>What is your budget for this project?</label>
        <div className="grid sm:grid-cols-3 gap-x-6">
          {BUDGETS.map((b) => (
            <CheckPill key={b} type="radio" label={b} checked={form.budget === b} onToggle={() => set("budget", b)} />
          ))}
        </div>
      </Section>

      {/* ── 5. Supporting Documents ──────────────────────────────────────── */}
      <Section title="Supporting Documents (Optional)">
        <p className="text-sm text-ud-dark/55 mb-4 leading-relaxed">
          To help us quote accurately, you can upload any of the following: site plan / title deed,
          existing drawings or sketches, survey map, BOQ, or reference photos.
        </p>

        {attachments.length < MAX_FILES && (
          <div className="border-2 border-dashed border-ud-dark/15 hover:border-ud-burgundy/50 rounded-[4px] p-6 text-center cursor-pointer transition-colors relative mb-4">
            <input
              type="file"
              accept=".pdf,image/*"
              multiple
              onChange={handleFiles}
              className="absolute inset-0 opacity-0 cursor-pointer"
              aria-label="Upload supporting documents"
            />
            <Paperclip className="w-5 h-5 text-ud-dark/40 mx-auto mb-2" />
            <p className="text-xs font-semibold text-ud-dark/60">Drop your files here, or click to select</p>
            <p className="text-[11px] text-ud-dark/40 mt-1">PDF, PNG or JPG — up to {MAX_FILES} files, max {MAX_FILE_MB}MB each</p>
          </div>
        )}

        {attachments.length > 0 && (
          <ul className="space-y-2 mb-4">
            {attachments.map((a, i) => (
              <li key={`${a.name}-${i}`} className="flex items-center justify-between border border-ud-dark/10 bg-ud-light-gray rounded-[4px] px-3 py-2 text-xs font-semibold">
                <span className="text-ud-dark/80 truncate max-w-[80%]">{a.name}</span>
                <button
                  type="button"
                  onClick={() => setAttachments((prev) => prev.filter((_, idx) => idx !== i))}
                  aria-label={`Remove ${a.name}`}
                  className="text-ud-burgundy hover:text-ud-burgundy-hover transition-colors p-1"
                >
                  <X size={14} />
                </button>
              </li>
            ))}
          </ul>
        )}

        <div>
          <label className={labelCls}>Links (Pinterest board, Google Drive, etc.)</label>
          <input value={form.links} onChange={(e) => set("links", e.target.value)} placeholder="Paste any reference links here" className={inputCls} />
        </div>
      </Section>

      {/* ── 6. Final Notes & Consent ─────────────────────────────────────── */}
      <Section title="Anything Else?">
        <div className="mb-5">
          <label className={labelCls}>Is there anything else you&apos;d like us to know about your project?</label>
          <textarea value={form.notes} onChange={(e) => set("notes", e.target.value)} rows={4} placeholder="Any other details, constraints, or questions…" className={`${inputCls} resize-none`} />
        </div>

        <div className="space-y-2.5">
          <label className="flex items-start gap-2.5 cursor-pointer select-none">
            <input required type="checkbox" checked={form.confirmAccurate} onChange={(e) => set("confirmAccurate", e.target.checked)} className="accent-ud-burgundy w-4 h-4 mt-0.5 flex-shrink-0" />
            <span className="text-sm text-ud-dark/70 leading-snug">I confirm that the information provided above is accurate to the best of my knowledge. *</span>
          </label>
          <label className="flex items-start gap-2.5 cursor-pointer select-none">
            <input required type="checkbox" checked={form.agreeContact} onChange={(e) => set("agreeContact", e.target.checked)} className="accent-ud-burgundy w-4 h-4 mt-0.5 flex-shrink-0" />
            <span className="text-sm text-ud-dark/70 leading-snug">I agree to be contacted by an Ujenzi Dhabiti representative regarding my project. *</span>
          </label>
        </div>
      </Section>

      {error && (
        <div className="flex items-start gap-2 bg-ud-burgundy/5 border border-ud-burgundy/30 rounded-[4px] p-3.5 text-sm text-ud-burgundy">
          <AlertCircle size={16} className="flex-shrink-0 mt-0.5" />
          {error}
        </div>
      )}

      <Button type="submit" variant="primary" className="w-full py-4" loading={loading} disabled={loading}>
        {loading ? "Sending…" : "Submit Request"}
      </Button>
    </form>
  );
}
