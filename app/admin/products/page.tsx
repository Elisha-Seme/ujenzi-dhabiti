"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Plus,
  Pencil,
  Trash2,
  X,
  Upload,
  Loader2,
  ImageIcon,
  ToggleLeft,
  ToggleRight,
  AlertCircle,
  ExternalLink,
} from "lucide-react";
import { PRODUCT_CATEGORIES } from "@/lib/products";

// Use the same categories the shop filters by, so admin-created products
// always appear under a shop category.
const CATEGORIES: string[] = [...PRODUCT_CATEGORIES];

interface Product {
  id: string;
  name: string;
  category: string;
  description: string;
  priceKES: number;
  unit: string;
  stock: number;
  images: string[];
  brand?: string | null;
  materialType?: string | null;
  isActive: boolean;
}

const EMPTY_FORM = {
  name: "",
  category: CATEGORIES[0],
  description: "",
  priceKES: "",
  unit: "",
  stock: "0",
  images: [] as string[],
  brand: "",
  materialType: "",
  isActive: true,
};

function fmt(n: number) {
  return `KES ${n.toLocaleString("en-KE")}`;
}

export default function SellerProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState<Product | null>(null);
  const [form, setForm] = useState({ ...EMPTY_FORM });
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const load = () => {
    setLoading(true);
    fetch("/api/admin/products")
      .then((r) => r.json())
      .then(setProducts)
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const openAdd = () => {
    setEditing(null);
    setForm({ ...EMPTY_FORM });
    setError(null);
    setShowModal(true);
  };

  const openEdit = (p: Product) => {
    setEditing(p);
    setForm({
      name: p.name,
      category: p.category,
      description: p.description,
      priceKES: String(p.priceKES),
      unit: p.unit,
      stock: String(p.stock),
      images: [...p.images],
      brand: p.brand ?? "",
      materialType: p.materialType ?? "",
      isActive: p.isActive,
    });
    setError(null);
    setShowModal(true);
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingImage(true);
    try {
      const fd = new FormData();
      fd.append("file", file);
      fd.append("folder", "products");
      const res = await fetch("/api/upload", { method: "POST", body: fd });
      if (!res.ok) throw new Error((await res.json()).error ?? "Upload failed");
      const { url } = await res.json();
      setForm((f) => ({ ...f, images: [...f.images, url] }));
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Image upload failed");
    } finally {
      setUploadingImage(false);
      if (fileRef.current) fileRef.current.value = "";
    }
  };

  const removeImage = (idx: number) => {
    setForm((f) => ({ ...f, images: f.images.filter((_, i) => i !== idx) }));
  };

  const handleSave = async () => {
    if (!form.name || !form.category || !form.description || !form.priceKES || !form.unit) {
      setError("Please fill in all required fields.");
      return;
    }
    setSaving(true);
    setError(null);
    try {
      const payload = {
        name: form.name,
        category: form.category,
        description: form.description,
        priceKES: Number(form.priceKES),
        unit: form.unit,
        stock: Number(form.stock),
        images: form.images,
        brand: form.brand,
        materialType: form.materialType,
        isActive: form.isActive,
      };

      const res = await fetch(
        editing ? `/api/admin/products/${editing.id}` : "/api/admin/products",
        {
          method: editing ? "PUT" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }
      );
      if (!res.ok) throw new Error((await res.json()).error ?? "Save failed");
      setShowModal(false);
      load();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to save product");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this product? This cannot be undone.")) return;
    setDeleting(id);
    await fetch(`/api/admin/products/${id}`, { method: "DELETE" });
    setDeleting(null);
    load();
  };

  const toggleActive = async (p: Product) => {
    await fetch(`/api/admin/products/${p.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ isActive: !p.isActive }),
    });
    load();
  };

  return (
    <div className="p-6 md:p-8 max-w-5xl">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-ud-dark">Materials</h1>
          <p className="text-sm text-ud-dark/50 mt-0.5">{products.length} product{products.length !== 1 ? "s" : ""} in the shop</p>
        </div>
        <div className="flex items-center gap-2 flex-shrink-0">
          <Link href="/shop" target="_blank" className="inline-flex items-center gap-1.5 text-sm font-semibold text-ud-burgundy border border-ud-burgundy/30 px-3 py-2 rounded hover:bg-ud-burgundy/5 transition-colors whitespace-nowrap">
            <ExternalLink className="w-4 h-4" /> View shop
          </Link>
          <button
            onClick={openAdd}
            className="flex items-center gap-2 bg-ud-burgundy hover:bg-ud-burgundy-hover text-white px-4 py-2 rounded text-sm font-semibold transition-colors"
          >
            <Plus className="w-4 h-4" />
            Add Product
          </button>
        </div>
      </div>

      {/* Product list */}
      {loading ? (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="bg-white rounded-[4px] shadow-sm p-4 animate-pulse">
              <div className="w-full h-36 bg-ud-dark/10 rounded mb-3" />
              <div className="h-4 bg-ud-dark/10 rounded w-3/4 mb-2" />
              <div className="h-3 bg-ud-dark/10 rounded w-1/2" />
            </div>
          ))}
        </div>
      ) : products.length === 0 ? (
        <div className="bg-white rounded-[4px] shadow-sm p-12 text-center">
          <ImageIcon className="w-10 h-10 text-ud-dark/30 mx-auto mb-3" />
          <p className="font-semibold text-ud-dark/50">No products yet</p>
          <p className="text-sm text-ud-dark/40 mt-1 mb-4">Add your first product to the shop.</p>
          <button
            onClick={openAdd}
            className="inline-flex items-center gap-2 bg-ud-burgundy text-white px-4 py-2 rounded text-sm font-medium hover:bg-ud-burgundy-hover transition-colors"
          >
            <Plus className="w-4 h-4" />
            Add Product
          </button>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {products.map((p) => (
            <div key={p.id} className="bg-white rounded-[4px] shadow-sm overflow-hidden border border-ud-dark/8">
              <div className="relative w-full h-36 bg-ud-dark/5">
                {p.images[0] ? (
                  <Image src={p.images[0]} alt={p.name} fill className="object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <ImageIcon className="w-8 h-8 text-ud-dark/30" />
                  </div>
                )}
                {!p.isActive && (
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                    <span className="text-xs text-white font-semibold bg-black/50 px-2 py-1 rounded">Inactive</span>
                  </div>
                )}
              </div>
              <div className="p-4">
                <p className="font-semibold text-ud-dark text-sm leading-snug mb-0.5 line-clamp-2">{p.name}</p>
                <p className="text-xs text-ud-dark/40 mb-2">{p.category}</p>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm font-bold text-ud-burgundy">{fmt(p.priceKES)}</span>
                  <span className="text-xs text-ud-dark/40">Stock: {p.stock} {p.unit}</span>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => openEdit(p)}
                    className="flex-1 flex items-center justify-center gap-1.5 border border-ud-dark/20 hover:border-ud-burgundy text-ud-dark/60 hover:text-ud-burgundy py-1.5 rounded text-xs transition-colors"
                  >
                    <Pencil className="w-3.5 h-3.5" />
                    Edit
                  </button>
                  <Link
                    href={`/shop/${p.id}`}
                    target="_blank"
                    className="p-1.5 rounded border border-ud-dark/20 hover:border-ud-burgundy text-ud-dark/50 hover:text-ud-burgundy transition-colors"
                    title="View on site"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </Link>
                  <button
                    onClick={() => toggleActive(p)}
                    className="p-1.5 rounded border border-ud-dark/20 hover:border-ud-burgundy text-ud-dark/50 hover:text-ud-burgundy transition-colors"
                    title={p.isActive ? "Deactivate" : "Activate"}
                  >
                    {p.isActive ? <ToggleRight className="w-4 h-4 text-ud-burgundy" /> : <ToggleLeft className="w-4 h-4" />}
                  </button>
                  <button
                    onClick={() => handleDelete(p.id)}
                    disabled={deleting === p.id}
                    className="p-1.5 rounded border border-ud-dark/20 hover:border-red-400 text-ud-dark/50 hover:text-red-500 transition-colors"
                    title="Delete"
                  >
                    {deleting === p.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
          <div className="bg-white rounded-[4px] shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between px-6 py-4 border-b border-ud-dark/8">
              <h2 className="font-bold text-ud-dark">{editing ? "Edit Product" : "Add Product"}</h2>
              <button onClick={() => setShowModal(false)} className="text-ud-dark/40 hover:text-ud-dark/60 transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="px-6 py-5 space-y-4">
              {error && (
                <div className="flex items-start gap-2 bg-red-50 border border-red-200 rounded p-3 text-sm text-red-700">
                  <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                  {error}
                </div>
              )}

              {/* Name */}
              <div>
                <label className="block text-xs font-semibold text-ud-dark/60 mb-1">Product Name *</label>
                <input
                  value={form.name}
                  onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                  className="w-full border border-ud-dark/20 rounded px-3 py-2 text-sm focus:outline-none focus:border-ud-burgundy"
                  placeholder="e.g. OPC Cement 50kg Bag"
                />
              </div>

              {/* Category + Unit */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-ud-dark/60 mb-1">Category *</label>
                  <select
                    value={form.category}
                    onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))}
                    className="w-full border border-ud-dark/20 rounded px-3 py-2 text-sm focus:outline-none focus:border-ud-burgundy"
                  >
                    {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-ud-dark/60 mb-1">Unit *</label>
                  <input
                    value={form.unit}
                    onChange={(e) => setForm((f) => ({ ...f, unit: e.target.value }))}
                    className="w-full border border-ud-dark/20 rounded px-3 py-2 text-sm focus:outline-none focus:border-ud-burgundy"
                    placeholder="e.g. bag, piece, litre, kg"
                  />
                </div>
              </div>

              {/* Brand + Material Type */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-ud-dark/60 mb-1">Brand</label>
                  <input
                    value={form.brand}
                    onChange={(e) => setForm((f) => ({ ...f, brand: e.target.value }))}
                    className="w-full border border-ud-dark/20 rounded px-3 py-2 text-sm focus:outline-none focus:border-ud-burgundy"
                    placeholder="e.g. Bamburi, Crown"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-ud-dark/60 mb-1">Material Type</label>
                  <input
                    value={form.materialType}
                    onChange={(e) => setForm((f) => ({ ...f, materialType: e.target.value }))}
                    className="w-full border border-ud-dark/20 rounded px-3 py-2 text-sm focus:outline-none focus:border-ud-burgundy"
                    placeholder="e.g. Cement, Ceramic Tile"
                  />
                </div>
              </div>

              {/* Price + Stock */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-ud-dark/60 mb-1">Price (KES) *</label>
                  <input
                    type="number"
                    min="0"
                    value={form.priceKES}
                    onChange={(e) => setForm((f) => ({ ...f, priceKES: e.target.value }))}
                    className="w-full border border-ud-dark/20 rounded px-3 py-2 text-sm focus:outline-none focus:border-ud-burgundy"
                    placeholder="0"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-ud-dark/60 mb-1">Stock Quantity</label>
                  <input
                    type="number"
                    min="0"
                    value={form.stock}
                    onChange={(e) => setForm((f) => ({ ...f, stock: e.target.value }))}
                    className="w-full border border-ud-dark/20 rounded px-3 py-2 text-sm focus:outline-none focus:border-ud-burgundy"
                    placeholder="0"
                  />
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block text-xs font-semibold text-ud-dark/60 mb-1">Description *</label>
                <textarea
                  value={form.description}
                  onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
                  rows={3}
                  className="w-full border border-ud-dark/20 rounded px-3 py-2 text-sm focus:outline-none focus:border-ud-burgundy resize-none"
                  placeholder="Describe your product — grade, brand, specifications…"
                />
              </div>

              {/* Images */}
              <div>
                <label className="block text-xs font-semibold text-ud-dark/60 mb-2">Product Images</label>
                <div className="flex flex-wrap gap-2 mb-2">
                  {form.images.map((url, idx) => (
                    <div key={idx} className="relative w-20 h-20 rounded overflow-hidden border border-ud-dark/20">
                      <Image src={url} alt={`img-${idx}`} fill className="object-cover" />
                      <button
                        onClick={() => removeImage(idx)}
                        className="absolute top-0.5 right-0.5 bg-black/60 hover:bg-black text-white rounded-full p-0.5 transition-colors"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                  <button
                    onClick={() => fileRef.current?.click()}
                    disabled={uploadingImage}
                    className="w-20 h-20 border-2 border-dashed border-ud-dark/30 hover:border-ud-burgundy rounded flex flex-col items-center justify-center text-ud-dark/40 hover:text-ud-burgundy transition-colors text-xs gap-1"
                  >
                    {uploadingImage ? (
                      <Loader2 className="w-5 h-5 animate-spin" />
                    ) : (
                      <>
                        <Upload className="w-5 h-5" />
                        <span>Upload</span>
                      </>
                    )}
                  </button>
                  <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
                </div>
                <p className="text-xs text-ud-dark/40">JPEG, PNG, WEBP — max 8 MB each</p>
              </div>

              {/* Active toggle */}
              {editing && (
                <div className="flex items-center justify-between py-3 border-t border-ud-dark/8">
                  <div>
                    <p className="text-sm font-semibold text-ud-dark">Active Listing</p>
                    <p className="text-xs text-ud-dark/50">Inactive products won&apos;t appear in the shop</p>
                  </div>
                  <button
                    onClick={() => setForm((f) => ({ ...f, isActive: !f.isActive }))}
                    className="flex-shrink-0"
                  >
                    {form.isActive ? (
                      <ToggleRight className="w-8 h-8 text-ud-burgundy" />
                    ) : (
                      <ToggleLeft className="w-8 h-8 text-ud-dark/40" />
                    )}
                  </button>
                </div>
              )}
            </div>

            <div className="flex gap-3 px-6 py-4 border-t border-ud-dark/8">
              <button
                onClick={() => setShowModal(false)}
                className="flex-1 border border-ud-dark/20 hover:border-gray-400 text-ud-dark/60 py-2.5 rounded text-sm font-medium transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={saving}
                className="flex-1 bg-ud-burgundy hover:bg-ud-burgundy-hover text-white py-2.5 rounded text-sm font-semibold transition-colors flex items-center justify-center gap-2"
              >
                {saving && <Loader2 className="w-4 h-4 animate-spin" />}
                {saving ? "Saving…" : editing ? "Save Changes" : "Add Product"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
