"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import {
  ShoppingCart, Calculator, Loader2, ArrowLeft, FileText, Check, Minus, Plus,
  ZoomIn, ZoomOut, X, ChevronLeft, ChevronRight, Star, Zap,
} from "lucide-react";
import { useCart } from "@/context/CartContext";
import { whatsappLink } from "@/lib/constants";
import DeliveryEstimator from "@/components/shop/DeliveryEstimator";

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
  const router = useRouter();

  const [product, setProduct] = useState<ApiProduct | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [activeImg, setActiveImg] = useState(0);
  const [qty, setQty] = useState(1);
  const [tab, setTab] = useState<"description" | "specs" | "usage" | "reviews">("description");
  const [added, setAdded] = useState(false);

  // Lightbox / zoom state
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const dragRef = useRef<{ sx: number; sy: number; spx: number; spy: number } | null>(null);

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

  // Keyboard nav — must be before early returns to satisfy rules-of-hooks
  useEffect(() => {
    if (!lightboxOpen) return;
    const imgCount = product?.images.length ?? 0;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") { setLightboxOpen(false); setZoom(1); setPan({ x: 0, y: 0 }); }
      if (e.key === "ArrowLeft") setActiveImg((i) => (i - 1 + imgCount) % imgCount);
      if (e.key === "ArrowRight") setActiveImg((i) => (i + 1) % imgCount);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [lightboxOpen, product?.images.length]);

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

  const prev = () => { setActiveImg((i) => (i - 1 + images.length) % images.length); resetZoom(); };
  const next = () => { setActiveImg((i) => (i + 1) % images.length); resetZoom(); };
  const resetZoom = () => { setZoom(1); setPan({ x: 0, y: 0 }); };
  const openLightbox = () => { setLightboxOpen(true); resetZoom(); };
  const closeLightbox = () => { setLightboxOpen(false); resetZoom(); };

  // Scroll to zoom in lightbox
  const onWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    setZoom((z) => Math.max(1, Math.min(4, z - e.deltaY * 0.0015)));
  };

  // Drag to pan when zoomed
  const onMouseDown = (e: React.MouseEvent) => {
    if (zoom <= 1) return;
    e.preventDefault();
    dragRef.current = { sx: e.clientX, sy: e.clientY, spx: pan.x, spy: pan.y };
  };
  const onMouseMove = (e: React.MouseEvent) => {
    if (!dragRef.current) return;
    setPan({ x: dragRef.current.spx + e.clientX - dragRef.current.sx, y: dragRef.current.spy + e.clientY - dragRef.current.sy });
  };
  const onMouseUp = () => { dragRef.current = null; };

  const add = (quantity: number) => {
    addItem(
      { productId: product.id, kind: "material", name: product.name, unit: product.unit, priceKES: product.priceKES, image: images[0], sellerId: "", sellerName: "Ujenzi Dhabiti" },
      quantity
    );
    setAdded(true);
    setTimeout(() => setAdded(false), 1600);
  };

  const buyNow = (quantity: number) => {
    addItem(
      { productId: product.id, kind: "material", name: product.name, unit: product.unit, priceKES: product.priceKES, image: images[0], sellerId: "", sellerName: "Ujenzi Dhabiti" },
      quantity
    );
    router.push("/shop/checkout");
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
            {/* Main image */}
            <div
              className="relative aspect-[4/3] rounded-[4px] overflow-hidden bg-white border border-ud-dark/8 cursor-zoom-in group"
              onClick={openLightbox}
            >
              {images[activeImg] ? (
                <Image src={images[activeImg]} alt={product.name} fill className="object-cover group-hover:scale-[1.03] transition-transform duration-300" sizes="(max-width: 1024px) 100vw, 50vw" priority />
              ) : null}
              <span className="absolute top-3 left-3 bg-ud-dark/70 text-white text-xs font-bold uppercase tracking-wide px-2 py-1 rounded-[4px] z-10">{product.category}</span>
              {/* Zoom hint overlay */}
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors flex items-center justify-center pointer-events-none">
                <ZoomIn className="w-8 h-8 text-white opacity-0 group-hover:opacity-70 transition-opacity drop-shadow" />
              </div>
              {/* Prev / Next arrows */}
              {images.length > 1 && (
                <>
                  <button onClick={(e) => { e.stopPropagation(); prev(); }} className="absolute left-2 top-1/2 -translate-y-1/2 z-10 w-8 h-8 rounded-full bg-black/40 hover:bg-black/65 text-white flex items-center justify-center transition-colors">
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  <button onClick={(e) => { e.stopPropagation(); next(); }} className="absolute right-2 top-1/2 -translate-y-1/2 z-10 w-8 h-8 rounded-full bg-black/40 hover:bg-black/65 text-white flex items-center justify-center transition-colors">
                    <ChevronRight className="w-5 h-5" />
                  </button>
                  {/* Dot indicators */}
                  <div className="absolute bottom-3 left-1/2 -translate-x-1/2 z-10 flex gap-1.5">
                    {images.map((_, i) => (
                      <button key={i} onClick={(e) => { e.stopPropagation(); setActiveImg(i); }} className={`w-1.5 h-1.5 rounded-full transition-colors ${i === activeImg ? "bg-white" : "bg-white/40"}`} />
                    ))}
                  </div>
                </>
              )}
            </div>

            {/* Thumbnails */}
            {images.length > 1 && (
              <div className="flex gap-2 mt-3 overflow-x-auto pb-1">
                {images.map((img, i) => (
                  <button key={i} onClick={() => { setActiveImg(i); resetZoom(); }} className={`relative flex-shrink-0 w-16 h-16 rounded-[4px] overflow-hidden border-2 transition-colors ${i === activeImg ? "border-ud-burgundy" : "border-ud-dark/10 hover:border-ud-dark/30"}`}>
                    <Image src={img} alt={`${product.name} ${i + 1}`} fill className="object-cover" sizes="64px" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Lightbox */}
          {lightboxOpen && (
            <div
              className="fixed inset-0 z-50 bg-black/92 flex items-center justify-center"
              onClick={closeLightbox}
            >
              {/* Controls bar */}
              <div className="absolute top-4 right-4 flex items-center gap-2 z-10">
                <button onClick={(e) => { e.stopPropagation(); setZoom((z) => Math.min(4, z + 0.5)); }} className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors" title="Zoom in">
                  <ZoomIn className="w-4 h-4" />
                </button>
                <button onClick={(e) => { e.stopPropagation(); setZoom((z) => Math.max(1, z - 0.5)); if (zoom <= 1.5) resetZoom(); }} className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors" title="Zoom out">
                  <ZoomOut className="w-4 h-4" />
                </button>
                <span className="text-white/50 text-xs w-10 text-center">{Math.round(zoom * 100)}%</span>
                <button onClick={(e) => { e.stopPropagation(); closeLightbox(); }} className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors ml-1" title="Close">
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Prev / Next */}
              {images.length > 1 && (
                <>
                  <button onClick={(e) => { e.stopPropagation(); prev(); }} className="absolute left-4 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-white/10 hover:bg-white/25 text-white flex items-center justify-center transition-colors">
                    <ChevronLeft className="w-6 h-6" />
                  </button>
                  <button onClick={(e) => { e.stopPropagation(); next(); }} className="absolute right-4 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-white/10 hover:bg-white/25 text-white flex items-center justify-center transition-colors">
                    <ChevronRight className="w-6 h-6" />
                  </button>
                </>
              )}

              {/* Zoomable image */}
              <div
                className="relative overflow-hidden max-w-[90vw] max-h-[85vh]"
                style={{ cursor: zoom > 1 ? "grab" : "zoom-in" }}
                onClick={(e) => e.stopPropagation()}
                onWheel={onWheel}
                onMouseDown={onMouseDown}
                onMouseMove={onMouseMove}
                onMouseUp={onMouseUp}
                onMouseLeave={onMouseUp}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={images[activeImg]}
                  alt={product.name}
                  className="max-w-[90vw] max-h-[85vh] object-contain select-none"
                  style={{ transform: `scale(${zoom}) translate(${pan.x / zoom}px, ${pan.y / zoom}px)`, transition: dragRef.current ? "none" : "transform 0.15s ease" }}
                  draggable={false}
                />
              </div>

              {/* Thumbnail strip */}
              {images.length > 1 && (
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                  {images.map((img, i) => (
                    <button key={i} onClick={(e) => { e.stopPropagation(); setActiveImg(i); resetZoom(); }} className={`w-12 h-12 rounded-[4px] overflow-hidden border-2 transition-colors flex-shrink-0 ${i === activeImg ? "border-white" : "border-white/20 hover:border-white/50"}`}>
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={img} alt="" className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}

              {/* Image counter */}
              {images.length > 1 && (
                <div className="absolute top-4 left-4 text-white/50 text-sm">
                  {activeImg + 1} / {images.length}
                </div>
              )}
            </div>
          )}

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
            <div className="mt-6">
              <div className="flex items-center gap-3 mb-3">
                <div className="flex items-center border border-ud-dark/20 rounded-[4px]">
                  <button onClick={() => setQty((q) => Math.max(1, q - 1))} className="px-3 py-2.5 text-ud-dark/60 hover:text-ud-burgundy transition-colors"><Minus className="w-4 h-4" /></button>
                  <input value={qty} onChange={(e) => setQty(Math.max(1, Number(e.target.value) || 1))} className="w-12 text-center text-sm font-semibold text-ud-dark focus:outline-none" />
                  <button onClick={() => setQty((q) => q + 1)} className="px-3 py-2.5 text-ud-dark/60 hover:text-ud-burgundy transition-colors"><Plus className="w-4 h-4" /></button>
                </div>
                <button onClick={() => add(qty)} className="flex-1 flex items-center justify-center gap-2 bg-ud-burgundy text-white text-sm font-bold py-3 rounded-[4px] hover:bg-ud-burgundy-hover transition-colors">
                  {added ? <><Check className="w-4 h-4" /> Added</> : <><ShoppingCart className="w-4 h-4" /> Add to Cart</>}
                </button>
              </div>
              {/* Buy Now — skip cart, go straight to checkout */}
              <button
                onClick={() => buyNow(qty)}
                className="w-full flex items-center justify-center gap-2 bg-ud-dark text-white text-sm font-bold py-3 rounded-[4px] hover:bg-black transition-colors"
              >
                <Zap className="w-4 h-4" /> Buy Now
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

            <DeliveryEstimator className="mt-5" />
          </div>
        </div>

        {/* Tabs */}
        <div className="mt-12 bg-white border border-ud-dark/10 rounded-[4px]">
          <div className="flex border-b border-ud-dark/10">
            {([["description", "Description"], ["specs", "Specifications"], ["usage", "Usage"], ["reviews", "Reviews"]] as const).map(([key, label]) => (
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
            {tab === "reviews" && (
              <div>
                {/* Summary bar */}
                <div className="flex items-center gap-4 mb-6 pb-6 border-b border-ud-dark/8">
                  <div className="text-center">
                    <p className="text-5xl font-bold text-ud-dark">4.7</p>
                    <div className="flex items-center gap-0.5 mt-1 justify-center">
                      {[1,2,3,4,5].map((s) => <Star key={s} className={`w-4 h-4 ${s <= 5 ? "fill-amber-400 text-amber-400" : "text-ud-dark/20"}`} />)}
                    </div>
                    <p className="text-xs text-ud-dark/40 mt-1">12 reviews</p>
                  </div>
                  <div className="flex-1 space-y-1.5">
                    {[5,4,3,2,1].map((star) => (
                      <div key={star} className="flex items-center gap-2">
                        <span className="text-xs text-ud-dark/50 w-3">{star}</span>
                        <div className="flex-1 h-2 bg-ud-dark/10 rounded-full overflow-hidden">
                          <div className="h-full bg-amber-400 rounded-full" style={{ width: star === 5 ? "75%" : star === 4 ? "15%" : star === 3 ? "7%" : "3%" }} />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                {/* Sample reviews */}
                <div className="space-y-5">
                  {[
                    { name: "James M.", date: "March 2025", rating: 5, body: "Excellent quality cement. Arrived on time and in perfect condition. Our site foreman confirmed it's consistently good — will definitely reorder." },
                    { name: "Grace W.", date: "January 2025", rating: 5, body: "Ordered a bulk supply for our apartment block and the pricing was very competitive. Delivery to Upper Hill was smooth." },
                    { name: "Peter O.", date: "December 2024", rating: 4, body: "Good product overall. Would appreciate same-day delivery option for urgent orders but otherwise no complaints." },
                  ].map((r) => (
                    <div key={r.name} className="border-b border-ud-dark/8 pb-5 last:border-0">
                      <div className="flex items-center justify-between mb-2">
                        <div>
                          <p className="text-sm font-bold text-ud-dark">{r.name}</p>
                          <p className="text-xs text-ud-dark/40">{r.date}</p>
                        </div>
                        <div className="flex gap-0.5">
                          {[1,2,3,4,5].map((s) => <Star key={s} className={`w-3.5 h-3.5 ${s <= r.rating ? "fill-amber-400 text-amber-400" : "text-ud-dark/20"}`} />)}
                        </div>
                      </div>
                      <p className="text-sm text-ud-dark/70 leading-relaxed">{r.body}</p>
                    </div>
                  ))}
                </div>
                {/* Leave a review CTA */}
                <div className="mt-6 bg-ud-light-gray rounded-[4px] p-5">
                  <p className="text-sm font-bold text-ud-dark mb-1">Have you used this product?</p>
                  <p className="text-xs text-ud-dark/50 mb-3">Share your experience to help other buyers.</p>
                  <Link href="/auth/signin" className="inline-flex items-center gap-2 bg-ud-burgundy text-white text-xs font-bold px-4 py-2.5 rounded-[4px] hover:bg-ud-burgundy-hover transition-colors">
                    <Star className="w-3.5 h-3.5" /> Write a Review
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
