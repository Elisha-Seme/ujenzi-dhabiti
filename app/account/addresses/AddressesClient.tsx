"use client";

import { useState } from "react";
import { MapPin, Plus, Trash2, CheckCircle } from "lucide-react";
import { createAddress, deleteAddress, setDefaultAddress } from "./actions";

interface Address {
  id: string;
  label: string;
  fullName: string;
  phone: string;
  address: string;
  city: string;
  county: string | null;
  isDefault: boolean;
}

export default function AddressesClient({ initialAddresses }: { initialAddresses: Address[] }) {
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ label: "", fullName: "", phone: "", address: "", city: "", county: "" });
  const [isSaving, setIsSaving] = useState(false);
  const [loadingId, setLoadingId] = useState<string | null>(null);

  const handleSave = async () => {
    if (!form.fullName || !form.address || !form.city) return;
    setIsSaving(true);
    const res = await createAddress({
      ...form,
      isDefault: initialAddresses.length === 0,
    });
    setIsSaving(false);
    if (res.success) {
      setForm({ label: "", fullName: "", phone: "", address: "", city: "", county: "" });
      setShowForm(false);
    } else {
      alert(res.error);
    }
  };

  const handleSetDefault = async (id: string) => {
    setLoadingId(id);
    const res = await setDefaultAddress(id);
    if (res.error) alert(res.error);
    setLoadingId(null);
  };

  const handleDelete = async (id: string) => {
    setLoadingId(id);
    const res = await deleteAddress(id);
    if (res.error) alert(res.error);
    setLoadingId(null);
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-ud-dark">Address Book</h1>
          <p className="text-sm text-ud-dark/50 mt-1">Save delivery addresses for faster checkout.</p>
        </div>
        <button
          onClick={() => setShowForm((v) => !v)}
          className="inline-flex items-center gap-2 bg-ud-burgundy text-white text-sm font-bold px-4 py-2.5 rounded-[4px] hover:bg-ud-burgundy-hover transition-colors"
        >
          <Plus className="w-4 h-4" /> Add Address
        </button>
      </div>

      {showForm && (
        <div className="bg-white rounded-[4px] shadow-sm p-6 mb-6 border border-ud-burgundy/20">
          <h3 className="font-bold text-ud-dark mb-4">New Delivery Address</h3>
          <div className="grid sm:grid-cols-2 gap-4 mb-4">
            {[
              { key: "label", label: "Label (e.g. Home, Site)", placeholder: "Home" },
              { key: "fullName", label: "Full Name", placeholder: "John Kamau" },
              { key: "phone", label: "Phone", placeholder: "+254 7XX XXX XXX" },
              { key: "address", label: "Street / Plot Address", placeholder: "House No. 12, Main Street" },
              { key: "city", label: "Town / City", placeholder: "Nairobi" },
              { key: "county", label: "County", placeholder: "Nairobi" },
            ].map(({ key, label, placeholder }) => (
              <div key={key}>
                <label className="text-xs font-bold text-ud-dark/60 mb-1 block">{label}</label>
                <input
                  value={form[key as keyof typeof form]}
                  onChange={(e) => setForm((f) => ({ ...f, [key]: e.target.value }))}
                  placeholder={placeholder}
                  className="w-full border border-ud-dark/20 rounded-[4px] px-3 py-2 text-sm text-ud-dark focus:outline-none focus:border-ud-burgundy"
                />
              </div>
            ))}
          </div>
          <div className="flex gap-3">
            <button
              onClick={handleSave}
              disabled={isSaving}
              className="bg-ud-burgundy text-white text-sm font-bold px-5 py-2.5 rounded-[4px] hover:bg-ud-burgundy-hover transition-colors disabled:opacity-50"
            >
              {isSaving ? "Saving..." : "Save Address"}
            </button>
            <button
              onClick={() => setShowForm(false)}
              className="border border-ud-dark/20 text-ud-dark/60 text-sm font-semibold px-5 py-2.5 rounded-[4px] hover:border-ud-dark/40 transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      <div className="grid sm:grid-cols-2 gap-4">
        {initialAddresses.map((addr) => (
          <div key={addr.id} className={`bg-white rounded-[4px] shadow-sm p-5 relative border-t-[3px] ${addr.isDefault ? "border-ud-burgundy" : "border-transparent"}`}>
            {addr.isDefault && (
              <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-ud-burgundy mb-2">
                <CheckCircle className="w-3 h-3" /> Default
              </span>
            )}
            <div className="flex items-start justify-between gap-2 mb-3">
              <div>
                <p className="text-sm font-bold text-ud-dark">{addr.label}</p>
                <p className="text-sm text-ud-dark/70">{addr.fullName}</p>
                <p className="text-xs text-ud-dark/50">{addr.phone}</p>
              </div>
              <MapPin className="w-4 h-4 text-ud-burgundy mt-0.5 flex-shrink-0" />
            </div>
            <p className="text-sm text-ud-dark/70">{addr.address}</p>
            <p className="text-sm text-ud-dark/70">{addr.city}{addr.county ? `, ${addr.county}` : ""}</p>
            <div className="flex items-center gap-3 mt-4 pt-4 border-t border-ud-dark/8">
              {!addr.isDefault && (
                <button
                  onClick={() => handleSetDefault(addr.id)}
                  disabled={loadingId === addr.id}
                  className="text-xs font-semibold text-ud-burgundy hover:underline disabled:opacity-50"
                >
                  Set as Default
                </button>
              )}
              <button
                onClick={() => handleDelete(addr.id)}
                disabled={loadingId === addr.id}
                className="text-ud-dark/30 hover:text-red-500 transition-colors ml-auto disabled:opacity-50"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {initialAddresses.length === 0 && (
        <div className="bg-white rounded-[4px] shadow-sm p-12 text-center">
          <MapPin className="w-10 h-10 text-ud-dark/30 mx-auto mb-3" />
          <p className="font-semibold text-ud-dark/50">No saved addresses</p>
          <p className="text-sm text-ud-dark/40 mt-1 mb-5">Add a delivery address for faster checkout.</p>
          <button
            onClick={() => setShowForm(true)}
            className="inline-flex items-center gap-2 bg-ud-burgundy text-white px-5 py-2.5 rounded text-sm font-semibold"
          >
            <Plus className="w-4 h-4" /> Add Address
          </button>
        </div>
      )}
    </div>
  );
}
