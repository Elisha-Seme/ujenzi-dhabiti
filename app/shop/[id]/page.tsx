"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import {
  ShoppingCart, Calculator, Loader2, ArrowLeft, FileText, Check, Minus, Plus, Truck,
} from "lucide-react";
import { useCart } from "@/context/CartContext";
import { whatsappLink } from "@/lib/constants";

interface ApiProduct {
  id: string;
  name: string;
  category: string;
  description: string;
  priceKES: number;
  unit: string;
  stock: number;
  images: string[];
  specs: Record<string, string> | null;
  coverageSqmPerUnit: number | null;
}

function fmt(n: number) {
  return `KES ${n.toLocaleString("en-KE")}`;
}

export default function ProductDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { addItem } = useCart();

  const [product, setProduct] = useState<ApiProduct | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [activeImg, setActiveImg] = useState(0);
  const [qty, setQty] = useState(1);
  const [tab, setTab] = useState<"description" | "specs" | "usage">("description");
  const [added, setAdded] = useState(false);

  // Calculator state
  const [area, setArea] = useState("");

  useEffect(() => {
    if (!id) return;
    fetch(`/api/products/${id}`)
      .then((r) => (r.ok ? r.json() : Promise.reject(r.status)))
      .then(setProduct)
      .catch(() => setNotFound(true))
      .finally(() => setLoading(false));
  }, [id]);

  const calc = useMemo(() => {
    if (!product?.coverageSqmPerUnit || !area) return null;
    const a = Number(area);
    if (!a || a <= 0) return null;
    const units = Math.ceil(a / product.coverageSqmPerUnit);
    return { units, cost: units * product.priceKES };
  }, [area, product]);

  if (loading) {
    return (
      <div className="min-h-screen bg-ud-light-gray flex items-center justify-center">
        <Loader2 className="w-7 h-7 animate-spin text-ud-burgundy" />
      </div>
    );
  }

  if (notFound || !product) {
    return (
      <div className="min-h-screen bg-ud-light-gray flex items-center justify-center px-6 pt-24">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-ud-dark mb-3">Product not found</h2>
          <Link href="/shop" className="text-sm font-semibold text-ud-burgundy hover:underline">← Back to shop</Link>
        </div>
      </div>
    );
  }

  const images = product.images.length ? product.images : [""];
  const inStock = product.stock > 0;

  const add = (quantity: number) => {
    addItem(
      { productId: product.id, kind: "material", name: product.name, unit: product.unit, priceKES: product.priceKES, image: images[0], sellerId: "", sellerName: "Ujenzi Dhabiti" },
      quantity
    );
    setAdded(true);
    setTimeout(() => setAdded(false), 1600);
  };

  const waMessage = `Hello Ujenzi Dhabiti, I'd like to order: ${product.name} (${fmt(product.priceKES)} ${product.unit}).`;

  return (
    <div className="min-h-screen bg-ud-light-gray pt-24 pb-16">
      <div className="max-w-content mx-auto px-6">
        <Link href="/shop" className="inline-flex items-center gap-1.5 text-sm text-ud-dark/50 hover:text-ud-burgundy mb-6 transition-colors">
          <ArrowLeft className="w-4 h-4" /> Back to shop
        </Link>

        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12">
          {/* Gallery */}
          <div>
            <div className="relative aspect-[4/3] rounded-[4px] overflow-hidden bg-white border border-ud-dark/8">
              {images[activeImg] ? (
                <Image src={images[activeImg]} alt={product.name} fill className="object-cover" sizes="(max-width: 1024px) 100vw, 50vw" priority />
              ) : null}
              <span className="absolute top-3 left-3 bg-ud-dark/70 text-white text-xs font-bold uppercase tracking-wide px-2 py-1 rounded-[4px]">{product.category}</span>
            </div>
            {images.length > 1 && (
              <div className="flex gap-2 mt-3">
                {images.map((img, i) => (
                  <button key={i} onClick={() => setActiveImg(i)} className={`relative w-16 h-16 rounded-[4px] overflow-hidden border-2 transition-colors ${i === activeImg ? "border-ud-burgundy" : "border-ud-dark/10"}`}>
                    <Image src={img} alt={`${product.name} ${i + 1}`} fill className="object-cover" sizes="64px" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Info */}
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-ud-dark leading-tight">{product.name}</h1>
            <div className="mt-3 flex items-baseline gap-2">
              <span className="text-3xl font-bold text-ud-burgundy">{fmt(product.priceKES)}</span>
              <span className="text-sm text-ud-dark/50">{product.unit}</span>
            </div>
            <p className="mt-1 text-xs font-semibold uppercase tracking-wide">
              {inStock ? <span className="text-green-600">In stock</span> : <span className="text-ud-dark/40">Available on pre-order</span>}
            </p>

            <p className="mt-4 text-sm text-ud-dark/70 leading-relaxed">{product.description}</p>

            {/* Quantity + add */}
            <div className="mt-6 flex items-center gap-3">
              <div className="flex items-center border border-ud-dark/20 rounded-[4px]">
                <button onClick={() => setQty((q) => Math.max(1, q - 1))} className="px-3 py-2.5 text-ud-dark/60 hover:text-ud-burgundy transition-colors"><Minus className="w-4 h-4" /></button>
                <input value={qty} onChange={(e) => setQty(Math.max(1, Number(e.target.value) || 1))} className="w-12 text-center text-sm font-semibold text-ud-dark focus:outline-none" />
                <button onClick={() => setQty((q) => q + 1)} className="px-3 py-2.5 text-ud-dark/60 hover:text-ud-burgundy transition-colors"><Plus className="w-4 h-4" /></button>
              </div>
              <button onClick={() => add(qty)} className="flex-1 flex items-center justify-center gap-2 bg-ud-burgundy text-white text-sm font-bold py-3 rounded-[4px] hover:bg-ud-burgundy-hover transition-colors">
                {added ? <><Check className="w-4 h-4" /> Added</> : <><ShoppingCart className="w-4 h-4" /> Add to Cart</>}
              </button>
            </div>

            {/* Secondary actions */}
            <div className="mt-3 grid grid-cols-2 gap-3">
              <a href={whatsappLink(waMessage)} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-2 border border-[#25D366] text-[#1c8c44] text-sm font-semibold py-2.5 rounded-[4px] hover:bg-[#25D366] hover:text-white transition-colors">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51l-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.247-.694.247-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" /></svg>
                WhatsApp Order
              </a>
              <Link href={`/request-a-quote?product=${encodeURIComponent(product.name)}`} className="flex items-center justify-center gap-2 border border-ud-burgundy text-ud-burgundy text-sm font-semibold py-2.5 rounded-[4px] hover:bg-ud-burgundy hover:text-white transition-colors">
                <FileText className="w-4 h-4" /> Request Bulk Quote
              </Link>
            </div>

            {/* Material calculator */}
            {product.coverageSqmPerUnit ? (
              <div className="mt-6 bg-white border border-ud-dark/10 rounded-[4px] p-5">
                <div className="flex items-center gap-2 mb-3">
                  <Calculator className="w-4 h-4 text-ud-burgundy" />
                  <h3 className="text-sm font-bold text-ud-dark">Material Calculator</h3>
                </div>
                <p className="text-xs text-ud-dark/50 mb-3">Enter your area and we&apos;ll work out how much you need.</p>
                <div className="flex items-end gap-3">
                  <div className="flex-1">
                    <label className="block text-xs font-semibold text-ud-dark/60 mb-1">Area (m²)</label>
                    <input type="number" min="0" value={area} onChange={(e) => setArea(e.target.value)} placeholder="e.g. 45" className="w-full border border-ud-dark/20 rounded-[4px] px-3 py-2 text-sm focus:outline-none focus:border-ud-burgundy" />
                  </div>
                  {calc && (
                    <div className="text-right">
                      <p className="text-xs text-ud-dark/50">You need</p>
                      <p className="text-lg font-bold text-ud-dark leading-tight">{calc.units} <span className="text-xs font-normal text-ud-dark/50">{product.unit.replace(/^per /, "")}</span></p>
                    </div>
                  )}
                </div>
                {calc && (
                  <div className="mt-3 flex items-center justify-between pt-3 border-t border-ud-dark/8">
                    <span className="text-sm text-ud-dark/60">Estimated cost: <strong className="text-ud-dark">{fmt(calc.cost)}</strong></span>
                    <button onClick={() => add(calc.units)} className="text-xs font-bold text-ud-burgundy hover:underline">Add {calc.units} to cart →</button>
                  </div>
                )}
                <p className="mt-2 text-[11px] text-ud-dark/40">Estimate only — allow ~10% extra for cuts and wastage.</p>
              </div>
            ) : null}

            <p className="mt-5 flex items-center gap-2 text-xs text-ud-dark/50">
              <Truck className="w-3.5 h-3.5 text-ud-burgundy" /> Delivery across East Africa — costs confirmed at checkout or on your quote.
            </p>
          </div>
        </div>

        {/* Tabs */}
        <div className="mt-12 bg-white border border-ud-dark/10 rounded-[4px]">
          <div className="flex border-b border-ud-dark/10">
            {([["description", "Description"], ["specs", "Specifications"], ["usage", "Usage"]] as const).map(([key, label]) => (
              <button key={key} onClick={() => setTab(key)} className={`px-5 py-3 text-sm font-semibold transition-colors ${tab === key ? "text-ud-burgundy border-b-2 border-ud-burgundy" : "text-ud-dark/50 hover:text-ud-dark"}`}>
                {label}
              </button>
            ))}
          </div>
          <div className="p-5 text-sm text-ud-dark/70 leading-relaxed">
            {tab === "description" && <p>{product.description}</p>}
            {tab === "specs" && (
              product.specs && Object.keys(product.specs).length ? (
                <dl className="grid sm:grid-cols-2 gap-x-8 gap-y-2">
                  {Object.entries(product.specs).map(([k, v]) => (
                    <div key={k} className="flex justify-between border-b border-ud-dark/8 py-2">
                      <dt className="text-ud-dark/50">{k}</dt>
                      <dd className="font-semibold text-ud-dark">{v}</dd>
                    </div>
                  ))}
                </dl>
              ) : <p className="text-ud-dark/40">No specifications listed.</p>
            )}
            {tab === "usage" && (
              <p>Supplied by Ujenzi Dhabiti. For application guidance, technical data sheets, or bulk pricing, <Link href={`/request-a-quote?product=${encodeURIComponent(product.name)}`} className="text-ud-burgundy font-semibold hover:underline">request a quote</Link> or chat with our team on WhatsApp. We can also supply the labour to install it — see <Link href="/services" className="text-ud-burgundy font-semibold hover:underline">Our Services</Link>.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
