"use client";

import { useState } from "react";
import { Percent, CheckCircle, ShieldAlert, FileText, ChevronRight } from "lucide-react";

export default function ContractorPricingPage() {
  const [businessName, setBusinessName] = useState("");
  const [ncaNumber, setNcaNumber] = useState("");
  const [volume, setVolume] = useState("");
  const [location, setLocation] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    // Simulate API request to register / submit contractor application
    setTimeout(() => {
      setSubmitted(true);
      setLoading(false);
    }, 1200);
  };

  return (
    <div className="space-y-8">
      {/* Hero Header */}
      <div className="bg-white rounded-[4px] border border-ud-dark/8 p-6 sm:p-8 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-1.5 bg-ud-burgundy/10 text-ud-burgundy text-xs font-bold uppercase tracking-wider px-2.5 py-1 rounded-[4px]">
            <Percent className="w-3.5 h-3.5" /> Trade Accounts
          </div>
          <h1 className="text-2xl font-bold text-ud-dark">Contractor &amp; Partner Pricing</h1>
          <p className="text-sm text-ud-dark/60 max-w-xl font-light leading-relaxed">
            Registered contractors, developers, and project managers qualify for exclusive trade discounts, bulk ordering terms, and priority site deliveries across East Africa.
          </p>
        </div>
        <a
          href="#apply"
          className="bg-ud-burgundy text-white text-sm font-bold px-6 py-3 rounded-[4px] hover:bg-ud-burgundy-hover transition-colors whitespace-nowrap"
        >
          Apply for Trade Rates
        </a>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Bulk Pricing Table */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-[4px] border border-ud-dark/8 p-6 shadow-sm">
            <h2 className="text-base font-bold text-ud-dark mb-4">Sample Bulk &amp; Trade Rates</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs sm:text-sm border-collapse">
                <thead>
                  <tr className="border-b border-ud-dark/10 text-ud-dark/50 font-semibold">
                    <th className="pb-3 font-semibold">Material</th>
                    <th className="pb-3 font-semibold text-right">Standard Rate</th>
                    <th className="pb-3 font-semibold text-right text-ud-burgundy">Contractor Rate</th>
                    <th className="pb-3 font-semibold text-right">Min. Volume</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-ud-dark/5">
                  {[
                    { name: "Portland Cement (50kg)", std: "KES 850", trade: "KES 805", min: "100 bags" },
                    { name: "Deformed Steel Bar Y12 (12m)", std: "KES 1,150", trade: "KES 1,070", min: "50 bars" },
                    { name: "Concrete Wall Block (200mm)", std: "KES 75", trade: "KES 67", min: "500 blocks" },
                    { name: "Cabro Paving Block 60mm", std: "KES 1,150 / m²", trade: "KES 1,060 / m²", min: "100 m²" },
                    { name: "Vinyl Silk Emulsion (20L)", std: "KES 6,500", trade: "KES 6,100", min: "10 tins" },
                  ].map((item) => (
                    <tr key={item.name} className="text-ud-dark/80">
                      <td className="py-3.5 font-medium">{item.name}</td>
                      <td className="py-3.5 text-right text-ud-dark/60">{item.std}</td>
                      <td className="py-3.5 text-right font-bold text-ud-burgundy">{item.trade}</td>
                      <td className="py-3.5 text-right font-semibold">{item.min}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="text-[11px] text-ud-dark/40 mt-3 italic">
              * Rates shown are illustrative indicators. Final custom project pricing is determined upon trade account verification.
            </p>
          </div>

          {/* Benefits Grid */}
          <div className="bg-white rounded-[4px] border border-ud-dark/8 p-6 shadow-sm">
            <h2 className="text-base font-bold text-ud-dark mb-4">Trade Account Perks</h2>
            <div className="grid sm:grid-cols-2 gap-4">
              {[
                { title: "Specialist Bulk Discounts", body: "Direct wholesale rates on key structural, tiling, gypsum, and finishing materials." },
                { title: "Credit Line & Payment Terms", body: "Eligible contractors can access credit limits up to 30 days post-delivery after verification." },
                { title: "Dedicated Account Manager", body: "Single point of contact for prompt bulk quotes, order tracking, and scheduling." },
                { title: "Priority Multi-Site Dispatch", body: "Guaranteed shipping slots and bulk logistics dispatch priority during peak hours." },
              ].map((benefit) => (
                <div key={benefit.title} className="border border-ud-dark/8 rounded-[4px] p-4 bg-ud-light-gray/30">
                  <h3 className="text-sm font-bold text-ud-dark mb-1 flex items-center gap-1.5">
                    <ChevronRight className="w-4 h-4 text-ud-burgundy" /> {benefit.title}
                  </h3>
                  <p className="text-xs text-ud-dark/60 leading-relaxed font-light">{benefit.body}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Application Sidebar */}
        <aside id="apply" className="space-y-6">
          <div className="bg-white rounded-[4px] border border-ud-dark/8 p-6 shadow-sm">
            <div className="flex items-center gap-2 mb-4">
              <FileText className="w-5 h-5 text-ud-burgundy" />
              <h2 className="text-base font-bold text-ud-dark">Request Trade Rates</h2>
            </div>
            
            {submitted ? (
              <div className="bg-green-50 border border-green-200 rounded-[4px] p-5 text-center space-y-3">
                <CheckCircle className="w-10 h-10 text-green-600 mx-auto" />
                <h3 className="text-sm font-bold text-green-800">Application Submitted</h3>
                <p className="text-xs text-green-700 leading-relaxed">
                  Thank you! Our wholesale trade desk will review your details and business registration. We will be in touch within 24 hours.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-ud-dark/50 mb-1">Company / Business Name *</label>
                  <input
                    required
                    type="text"
                    value={businessName}
                    onChange={(e) => setBusinessName(e.target.value)}
                    placeholder="e.g. Dhabiti Builders Ltd"
                    className="w-full border border-ud-dark/15 rounded-[4px] px-3.5 py-2 text-xs focus:outline-none focus:border-ud-burgundy"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-ud-dark/50 mb-1">NCA Registration / Company Reg No. *</label>
                  <input
                    required
                    type="text"
                    value={ncaNumber}
                    onChange={(e) => setNcaNumber(e.target.value)}
                    placeholder="e.g. NCA 4 / Reg No. PVT-..."
                    className="w-full border border-ud-dark/15 rounded-[4px] px-3.5 py-2 text-xs focus:outline-none focus:border-ud-burgundy"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-ud-dark/50 mb-1">Primary Operating Location *</label>
                  <input
                    required
                    type="text"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="e.g. Nairobi / Kiambu / Mombasa"
                    className="w-full border border-ud-dark/15 rounded-[4px] px-3.5 py-2 text-xs focus:outline-none focus:border-ud-burgundy"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-ud-dark/50 mb-1">Est. Monthly Order Volume (KES) *</label>
                  <select
                    required
                    value={volume}
                    onChange={(e) => setVolume(e.target.value)}
                    className="w-full border border-ud-dark/15 bg-white rounded-[4px] px-3.5 py-2 text-xs focus:outline-none focus:border-ud-burgundy cursor-pointer"
                  >
                    <option value="">Select volume range...</option>
                    <option value="under-500k">Under KES 500,000</option>
                    <option value="500k-2m">KES 500,000 – KES 2,000,000</option>
                    <option value="2m-10m">KES 2,000,000 – KES 10,000,000</option>
                    <option value="over-10m">Over KES 10,000,000</option>
                  </select>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-ud-burgundy text-white text-xs font-bold py-2.5 rounded-[4px] hover:bg-ud-burgundy-hover transition-colors flex items-center justify-center gap-1.5"
                >
                  {loading ? "Submitting..." : "Submit Application"}
                </button>
              </form>
            )}
          </div>

          <div className="bg-amber-50 border border-amber-200 rounded-[4px] p-5 flex gap-3">
            <ShieldAlert className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
            <div className="space-y-1">
              <h4 className="text-xs font-bold text-amber-800">Verification Required</h4>
              <p className="text-[11px] text-amber-700 leading-relaxed font-light">
                To prevent retail buyers from abusing wholesale pricing, all trade accounts require active business verification or an active NCA license before discounts are applied.
              </p>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
