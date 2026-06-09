"use client";

import { useEffect, useState, useRef } from "react";
import { Loader2, Check, Upload } from "lucide-react";

export default function AdminSettingsPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [form, setForm] = useState({
    phoneNumbers: "",
    customerServiceEmail: "",
    constructionEmail: "",
    interiorDesignEmail: "",
    architecturalEmail: "",
    address: "",
    whatsappNumber: "",
    motto: "",
    facebookUrl: "",
    instagramUrl: "",
    linkedinUrl: "",
    twitterUrl: "",
    tiktokUrl: "",
    
    // Hero & CTA Banner settings
    heroBadge: "",
    heroTitle: "",
    heroSubtitle: "",
    heroImage: "",
    ctaTitle: "",
    ctaSubtitle: "",
    
    // About Page copy
    vision: "",
    mission: "",
    storyTitle: "",
    storyParagraphs: "",
    commitmentParagraphs: "",
  });

  useEffect(() => {
    fetch("/api/admin/settings")
      .then((r) => {
        if (!r.ok) throw new Error("Failed to load settings");
        return r.json();
      })
      .then((data) => {
        setForm({
          phoneNumbers: Array.isArray(data.phoneNumbers) ? data.phoneNumbers.join(", ") : "",
          customerServiceEmail: data.customerServiceEmail ?? "",
          constructionEmail: data.constructionEmail ?? "",
          interiorDesignEmail: data.interiorDesignEmail ?? "",
          architecturalEmail: data.architecturalEmail ?? "",
          address: data.address ?? "",
          whatsappNumber: data.whatsappNumber ?? "",
          motto: data.motto ?? "",
          facebookUrl: data.facebookUrl ?? "",
          instagramUrl: data.instagramUrl ?? "",
          linkedinUrl: data.linkedinUrl ?? "",
          twitterUrl: data.twitterUrl ?? "",
          tiktokUrl: data.tiktokUrl ?? "",
          
          heroBadge: data.heroBadge ?? "",
          heroTitle: data.heroTitle ?? "",
          heroSubtitle: data.heroSubtitle ?? "",
          heroImage: data.heroImage ?? "",
          ctaTitle: data.ctaTitle ?? "",
          ctaSubtitle: data.ctaSubtitle ?? "",
          
          vision: data.vision ?? "",
          mission: data.mission ?? "",
          storyTitle: data.storyTitle ?? "",
          storyParagraphs: Array.isArray(data.storyParagraphs) ? data.storyParagraphs.join("\n\n") : "",
          commitmentParagraphs: Array.isArray(data.commitmentParagraphs) ? data.commitmentParagraphs.join("\n\n") : "",
        });
      })
      .catch((e: unknown) => setError(e instanceof Error ? e.message : "Failed to load settings"))
      .finally(() => setLoading(false));
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingImage(true);
    setError(null);
    try {
      const fd = new FormData();
      fd.append("file", file);
      fd.append("folder", "cms");
      const res = await fetch("/api/upload", { method: "POST", body: fd });
      if (!res.ok) throw new Error((await res.json()).error ?? "Upload failed");
      const { url } = await res.json();
      setForm((prev) => ({ ...prev, heroImage: url }));
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setUploadingImage(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    setSuccess(false);

    const payload = {
      ...form,
      phoneNumbers: form.phoneNumbers
        .split(",")
        .map((p) => p.trim())
        .filter(Boolean),
      storyParagraphs: form.storyParagraphs
        .split(/\n+/)
        .map((p) => p.trim())
        .filter(Boolean),
      commitmentParagraphs: form.commitmentParagraphs
        .split(/\n+/)
        .map((p) => p.trim())
        .filter(Boolean),
    };

    try {
      const res = await fetch("/api/admin/settings", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const d = await res.json().catch(() => ({}));
        throw new Error(d.error ?? "Failed to save settings");
      }

      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Failed to save settings");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="p-10 text-center text-ud-dark/40 text-sm flex items-center justify-center gap-2">
        <Loader2 size={16} className="animate-spin" /> Loading Settings…
      </div>
    );
  }

  return (
    <div className="p-5 md:p-8 max-w-4xl">
      <div className="mb-6">
        <h1 className="text-xl md:text-2xl font-bold text-ud-dark">System Settings</h1>
        <p className="text-sm text-ud-dark/50 mt-1">
          Configure website-wide banners, contact information, social links, and about page texts.
        </p>
      </div>

      {error && (
        <div className="bg-ud-burgundy/5 border border-ud-burgundy/30 rounded-[4px] p-3 mb-6 text-sm text-ud-burgundy">
          {error}
        </div>
      )}

      {success && (
        <div className="bg-emerald-50 border border-emerald-300 rounded-[4px] p-3 mb-6 text-sm text-emerald-700 flex items-center gap-2">
          <Check size={16} /> Settings saved successfully!
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-8 bg-white border border-ud-dark/10 p-6 rounded-[4px]">
        
        {/* Section: Homepage Hero */}
        <div>
          <h2 className="text-sm font-bold text-ud-dark uppercase tracking-wider border-b border-ud-dark/10 pb-2 mb-4">
            Homepage Hero Banner
          </h2>
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-ud-dark/60 uppercase tracking-wider mb-1.5">
                  Hero Badge *
                </label>
                <input
                  type="text"
                  name="heroBadge"
                  value={form.heroBadge}
                  onChange={handleChange}
                  required
                  className="w-full border border-ud-dark/20 rounded-[4px] px-3 py-2 text-sm text-ud-dark focus:outline-none focus:border-ud-burgundy transition-colors"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-ud-dark/60 uppercase tracking-wider mb-1.5">
                  Company Motto *
                </label>
                <input
                  type="text"
                  name="motto"
                  value={form.motto}
                  onChange={handleChange}
                  required
                  className="w-full border border-ud-dark/20 rounded-[4px] px-3 py-2 text-sm text-ud-dark focus:outline-none focus:border-ud-burgundy transition-colors"
                />
              </div>
            </div>
            <div>
              <label className="block text-xs font-semibold text-ud-dark/60 uppercase tracking-wider mb-1.5">
                Hero Main Title *
              </label>
              <input
                type="text"
                name="heroTitle"
                value={form.heroTitle}
                onChange={handleChange}
                required
                className="w-full border border-ud-dark/20 rounded-[4px] px-3 py-2 text-sm text-ud-dark focus:outline-none focus:border-ud-burgundy transition-colors"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-ud-dark/60 uppercase tracking-wider mb-1.5">
                Hero Subtitle *
              </label>
              <textarea
                name="heroSubtitle"
                value={form.heroSubtitle}
                onChange={handleChange}
                required
                rows={2}
                className="w-full border border-ud-dark/20 rounded-[4px] px-3 py-2 text-sm text-ud-dark focus:outline-none focus:border-ud-burgundy transition-colors resize-none"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-ud-dark/60 uppercase tracking-wider mb-1.5">
                Hero Background Image URL *
              </label>
              <input
                type="text"
                name="heroImage"
                value={form.heroImage}
                onChange={handleChange}
                required
                className="w-full border border-ud-dark/20 rounded-[4px] px-3 py-2 text-sm text-ud-dark focus:outline-none focus:border-ud-burgundy transition-colors"
              />
              <div className="mt-2 flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={uploadingImage}
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-ud-burgundy border border-ud-burgundy/30 px-3 py-1.5 rounded-[4px] hover:bg-ud-burgundy/5 transition-colors"
                >
                  {uploadingImage ? <Loader2 size={13} className="animate-spin" /> : <Upload size={13} />} Upload Photo
                </button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />
              </div>
              {form.heroImage && (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={form.heroImage} alt="Hero preview" className="mt-2 h-36 rounded-[4px] object-cover border border-ud-dark/10" />
              )}
            </div>
          </div>
        </div>

        {/* Section: CTA Banner */}
        <div>
          <h2 className="text-sm font-bold text-ud-dark uppercase tracking-wider border-b border-ud-dark/10 pb-2 mb-4">
            Call to Action Banner
          </h2>
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-ud-dark/60 uppercase tracking-wider mb-1.5">
                CTA Banner Title *
              </label>
              <input
                type="text"
                name="ctaTitle"
                value={form.ctaTitle}
                onChange={handleChange}
                required
                className="w-full border border-ud-dark/20 rounded-[4px] px-3 py-2 text-sm text-ud-dark focus:outline-none focus:border-ud-burgundy transition-colors"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-ud-dark/60 uppercase tracking-wider mb-1.5">
                CTA Banner Subtitle *
              </label>
              <textarea
                name="ctaSubtitle"
                value={form.ctaSubtitle}
                onChange={handleChange}
                required
                rows={2}
                className="w-full border border-ud-dark/20 rounded-[4px] px-3 py-2 text-sm text-ud-dark focus:outline-none focus:border-ud-burgundy transition-colors resize-none"
              />
            </div>
          </div>
        </div>

        {/* Section: Contact Details */}
        <div>
          <h2 className="text-sm font-bold text-ud-dark uppercase tracking-wider border-b border-ud-dark/10 pb-2 mb-4">
            Contact Channels
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <label className="block text-xs font-semibold text-ud-dark/60 uppercase tracking-wider mb-1.5">
                Phone Numbers (comma separated) *
              </label>
              <input
                type="text"
                name="phoneNumbers"
                value={form.phoneNumbers}
                onChange={handleChange}
                required
                className="w-full border border-ud-dark/20 rounded-[4px] px-3 py-2 text-sm text-ud-dark focus:outline-none focus:border-ud-burgundy transition-colors"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-ud-dark/60 uppercase tracking-wider mb-1.5">
                WhatsApp Number *
              </label>
              <input
                type="text"
                name="whatsappNumber"
                value={form.whatsappNumber}
                onChange={handleChange}
                required
                className="w-full border border-ud-dark/20 rounded-[4px] px-3 py-2 text-sm text-ud-dark focus:outline-none focus:border-ud-burgundy transition-colors"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-xs font-semibold text-ud-dark/60 uppercase tracking-wider mb-1.5">
                Physical Office Address *
              </label>
              <textarea
                name="address"
                value={form.address}
                onChange={handleChange}
                required
                rows={3}
                className="w-full border border-ud-dark/20 rounded-[4px] px-3 py-2 text-sm text-ud-dark focus:outline-none focus:border-ud-burgundy transition-colors resize-none"
              />
            </div>
          </div>
        </div>

        {/* Section: Email Directory */}
        <div>
          <h2 className="text-sm font-bold text-ud-dark uppercase tracking-wider border-b border-ud-dark/10 pb-2 mb-4">
            Email Directory
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-ud-dark/60 uppercase tracking-wider mb-1.5">
                Customer Service Email *
              </label>
              <input
                type="email"
                name="customerServiceEmail"
                value={form.customerServiceEmail}
                onChange={handleChange}
                required
                className="w-full border border-ud-dark/20 rounded-[4px] px-3 py-2 text-sm text-ud-dark focus:outline-none focus:border-ud-burgundy transition-colors"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-ud-dark/60 uppercase tracking-wider mb-1.5">
                Construction Email *
              </label>
              <input
                type="email"
                name="constructionEmail"
                value={form.constructionEmail}
                onChange={handleChange}
                required
                className="w-full border border-ud-dark/20 rounded-[4px] px-3 py-2 text-sm text-ud-dark focus:outline-none focus:border-ud-burgundy transition-colors"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-ud-dark/60 uppercase tracking-wider mb-1.5">
                Interior Design Email *
              </label>
              <input
                type="email"
                name="interiorDesignEmail"
                value={form.interiorDesignEmail}
                onChange={handleChange}
                required
                className="w-full border border-ud-dark/20 rounded-[4px] px-3 py-2 text-sm text-ud-dark focus:outline-none focus:border-ud-burgundy transition-colors"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-ud-dark/60 uppercase tracking-wider mb-1.5">
                Architectural Email *
              </label>
              <input
                type="email"
                name="architecturalEmail"
                value={form.architecturalEmail}
                onChange={handleChange}
                required
                className="w-full border border-ud-dark/20 rounded-[4px] px-3 py-2 text-sm text-ud-dark focus:outline-none focus:border-ud-burgundy transition-colors"
              />
            </div>
          </div>
        </div>

        {/* Section: About Page Copy */}
        <div>
          <h2 className="text-sm font-bold text-ud-dark uppercase tracking-wider border-b border-ud-dark/10 pb-2 mb-4">
            About Us Page Texts
          </h2>
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-ud-dark/60 uppercase tracking-wider mb-1.5">
                Vision Statement *
              </label>
              <textarea
                name="vision"
                value={form.vision}
                onChange={handleChange}
                required
                rows={3}
                className="w-full border border-ud-dark/20 rounded-[4px] px-3 py-2 text-sm text-ud-dark focus:outline-none focus:border-ud-burgundy transition-colors resize-none"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-ud-dark/60 uppercase tracking-wider mb-1.5">
                Mission Statement *
              </label>
              <textarea
                name="mission"
                value={form.mission}
                onChange={handleChange}
                required
                rows={3}
                className="w-full border border-ud-dark/20 rounded-[4px] px-3 py-2 text-sm text-ud-dark focus:outline-none focus:border-ud-burgundy transition-colors resize-none"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-ud-dark/60 uppercase tracking-wider mb-1.5">
                Our Story Title *
              </label>
              <input
                type="text"
                name="storyTitle"
                value={form.storyTitle}
                onChange={handleChange}
                required
                className="w-full border border-ud-dark/20 rounded-[4px] px-3 py-2 text-sm text-ud-dark focus:outline-none focus:border-ud-burgundy transition-colors"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-ud-dark/60 uppercase tracking-wider mb-1.5">
                Our Story Paragraphs (Separated by enters/newlines) *
              </label>
              <textarea
                name="storyParagraphs"
                value={form.storyParagraphs}
                onChange={handleChange}
                required
                rows={6}
                className="w-full border border-ud-dark/20 rounded-[4px] px-3 py-2 text-sm text-ud-dark focus:outline-none focus:border-ud-burgundy transition-colors"
                placeholder="Type your story. Hit enter/return to start a new paragraph."
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-ud-dark/60 uppercase tracking-wider mb-1.5">
                Our Commitment Paragraphs (Separated by enters/newlines) *
              </label>
              <textarea
                name="commitmentParagraphs"
                value={form.commitmentParagraphs}
                onChange={handleChange}
                required
                rows={4}
                className="w-full border border-ud-dark/20 rounded-[4px] px-3 py-2 text-sm text-ud-dark focus:outline-none focus:border-ud-burgundy transition-colors"
                placeholder="Type your commitment text. Hit enter/return to start a new paragraph."
              />
            </div>
          </div>
        </div>

        {/* Section: Social Profiles */}
        <div>
          <h2 className="text-sm font-bold text-ud-dark uppercase tracking-wider border-b border-ud-dark/10 pb-2 mb-4">
            Social Profiles
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-ud-dark/60 uppercase tracking-wider mb-1.5">
                Facebook URL
              </label>
              <input
                type="text"
                name="facebookUrl"
                value={form.facebookUrl}
                onChange={handleChange}
                className="w-full border border-ud-dark/20 rounded-[4px] px-3 py-2 text-sm text-ud-dark focus:outline-none focus:border-ud-burgundy transition-colors"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-ud-dark/60 uppercase tracking-wider mb-1.5">
                Instagram URL
              </label>
              <input
                type="text"
                name="instagramUrl"
                value={form.instagramUrl}
                onChange={handleChange}
                className="w-full border border-ud-dark/20 rounded-[4px] px-3 py-2 text-sm text-ud-dark focus:outline-none focus:border-ud-burgundy transition-colors"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-ud-dark/60 uppercase tracking-wider mb-1.5">
                LinkedIn URL
              </label>
              <input
                type="text"
                name="linkedinUrl"
                value={form.linkedinUrl}
                onChange={handleChange}
                className="w-full border border-ud-dark/20 rounded-[4px] px-3 py-2 text-sm text-ud-dark focus:outline-none focus:border-ud-burgundy transition-colors"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-ud-dark/60 uppercase tracking-wider mb-1.5">
                Twitter URL
              </label>
              <input
                type="text"
                name="twitterUrl"
                value={form.twitterUrl}
                onChange={handleChange}
                className="w-full border border-ud-dark/20 rounded-[4px] px-3 py-2 text-sm text-ud-dark focus:outline-none focus:border-ud-burgundy transition-colors"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-ud-dark/60 uppercase tracking-wider mb-1.5">
                TikTok URL
              </label>
              <input
                type="text"
                name="tiktokUrl"
                value={form.tiktokUrl}
                onChange={handleChange}
                className="w-full border border-ud-dark/20 rounded-[4px] px-3 py-2 text-sm text-ud-dark focus:outline-none focus:border-ud-burgundy transition-colors"
              />
            </div>
          </div>
        </div>

        <div className="pt-4 flex justify-end">
          <button
            type="submit"
            disabled={saving}
            className="w-full md:w-auto inline-flex items-center justify-center gap-2 bg-ud-burgundy text-white text-sm font-semibold px-6 py-2.5 rounded-[4px] hover:bg-ud-burgundy-hover transition-colors disabled:opacity-50"
          >
            {saving ? <Loader2 size={16} className="animate-spin" /> : <Check size={16} />} Save Changes
          </button>
        </div>
      </form>
    </div>
  );
}
