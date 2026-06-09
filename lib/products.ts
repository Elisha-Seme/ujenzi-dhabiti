// Single-vendor materials catalogue (sold by Ujenzi Dhabiti).
// Categories follow the client website wireframe. This static list is the
// seed + fallback; the DB `products` table is authoritative at runtime.

export type ProductCategory =
  | "Structural Materials"
  | "Gypsum & Ceilings"
  | "Paint & Finishes"
  | "Flooring"
  | "Plumbing"
  | "Electrical"
  | "Cabro & Road Works"
  | "Hardware";

export const PRODUCT_CATEGORIES: ProductCategory[] = [
  "Structural Materials",
  "Gypsum & Ceilings",
  "Paint & Finishes",
  "Flooring",
  "Plumbing",
  "Electrical",
  "Cabro & Road Works",
  "Hardware",
];

export interface Product {
  id: string;
  name: string;
  category: ProductCategory;
  description: string;
  unit: string;
  priceKES: number;
  image: string;
  inStock: boolean;
  sellerId?: string; // legacy/optional — single-vendor catalogue has no seller
  specs?: Record<string, string>;
  // How many square metres ONE unit covers. Drives the material calculator.
  // Omit for items that aren't area-based (valves, tanks, tools…).
  coverageSqmPerUnit?: number;
}

const IMG = {
  cement: "https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=700&q=70&auto=format&fit=crop",
  rebar: "https://images.unsplash.com/photo-1581092160562-40aa08e78837?w=700&q=70&auto=format&fit=crop",
  blocks: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=700&q=70&auto=format&fit=crop",
  gypsum: "https://images.unsplash.com/photo-1607400201889-565b1ee75f8e?w=700&q=70&auto=format&fit=crop",
  paint: "https://images.unsplash.com/photo-1589939705384-5185137a7f0f?w=700&q=70&auto=format&fit=crop",
  tiles: "https://images.unsplash.com/photo-1615873968403-89e068629265?w=700&q=70&auto=format&fit=crop",
  pipes: "https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=700&q=70&auto=format&fit=crop",
  electrical: "https://images.unsplash.com/photo-1565608087341-404b25492fee?w=700&q=70&auto=format&fit=crop",
  cabro: "https://images.unsplash.com/photo-1597844808175-0d5c4f7b3c8c?w=700&q=70&auto=format&fit=crop",
  hardware: "https://images.unsplash.com/photo-1530124566582-a618bc2615dc?w=700&q=70&auto=format&fit=crop",
};

export const PRODUCTS: Product[] = [
  // ─── Structural Materials ───────────────────────────────────
  {
    id: "str-cement",
    name: "Portland Cement (50kg)",
    category: "Structural Materials",
    description: "High-strength ordinary Portland cement for foundations, slabs, and general structural works. Meets KS EAS 18-1.",
    unit: "per bag",
    priceKES: 850,
    image: IMG.cement,
    inStock: true,
    specs: { Grade: "42.5N", "Bag weight": "50kg", Standard: "KS EAS 18-1" },
  },
  {
    id: "str-rebar-y12",
    name: "Deformed Steel Bar Y12 (12m)",
    category: "Structural Materials",
    description: "High-yield deformed reinforcement bar for reinforced concrete. Grade 500B, cut-to-length on request.",
    unit: "per bar",
    priceKES: 1150,
    image: IMG.rebar,
    inStock: true,
    specs: { Diameter: "12mm", Grade: "500B", Length: "12m" },
  },
  {
    id: "str-blocks",
    name: "Concrete Wall Block (200mm)",
    category: "Structural Materials",
    description: "Solid concrete masonry blocks for load-bearing and partition walls. Cured 28 days.",
    unit: "per block",
    priceKES: 75,
    image: IMG.blocks,
    inStock: true,
    specs: { Size: "400×200×200mm", Strength: "7 N/mm²" },
    coverageSqmPerUnit: 0.08, // ~12.5 blocks per m² of wall
  },
  {
    id: "str-ballast",
    name: "Ballast / Aggregate (per tonne)",
    category: "Structural Materials",
    description: "Clean crushed stone aggregate for concrete mixing. Delivered by tipper.",
    unit: "per tonne",
    priceKES: 2200,
    image: IMG.blocks,
    inStock: true,
    specs: { Size: "20mm / 14mm", Delivery: "Tipper" },
  },

  // ─── Gypsum & Ceilings ──────────────────────────────────────
  {
    id: "gyp-board",
    name: "Gypsum Board 12.5mm (1.2×2.4m)",
    category: "Gypsum & Ceilings",
    description: "Standard gypsum plasterboard for ceilings and dry-wall partitioning. Smooth, paint-ready face.",
    unit: "per board",
    priceKES: 1100,
    image: IMG.gypsum,
    inStock: true,
    specs: { Size: "1.2m × 2.4m", Thickness: "12.5mm" },
    coverageSqmPerUnit: 2.88, // one board = 2.88 m²
  },
  {
    id: "gyp-channel",
    name: "Metal Furring Channel (3m)",
    category: "Gypsum & Ceilings",
    description: "Galvanised steel furring channel for suspended ceiling and partition framing.",
    unit: "per length",
    priceKES: 450,
    image: IMG.gypsum,
    inStock: true,
    specs: { Length: "3m", Finish: "Galvanised" },
  },
  {
    id: "gyp-tgrid",
    name: "Suspended Ceiling T-Grid System",
    category: "Gypsum & Ceilings",
    description: "Exposed-grid suspended ceiling system including main runners, cross tees, and wall angle. Priced per m².",
    unit: "per m²",
    priceKES: 900,
    image: IMG.gypsum,
    inStock: true,
    specs: { Module: "600×600mm", Finish: "White" },
    coverageSqmPerUnit: 1,
  },

  // ─── Paint & Finishes ───────────────────────────────────────
  {
    id: "pnt-emulsion",
    name: "Vinyl Silk Emulsion (20L)",
    category: "Paint & Finishes",
    description: "Premium washable interior emulsion with a smooth silk finish. Excellent coverage and durability.",
    unit: "per 20L tin",
    priceKES: 6500,
    image: IMG.paint,
    inStock: true,
    specs: { Volume: "20L", Coats: "2", Finish: "Silk" },
    coverageSqmPerUnit: 120, // 20L ≈ 120 m² at 2 coats
  },
  {
    id: "pnt-undercoat",
    name: "Wall Primer / Undercoat (4L)",
    category: "Paint & Finishes",
    description: "Alkali-resistant primer that seals fresh plaster and improves topcoat adhesion.",
    unit: "per 4L tin",
    priceKES: 1800,
    image: IMG.paint,
    inStock: true,
    specs: { Volume: "4L", Finish: "Matt" },
    coverageSqmPerUnit: 28,
  },
  {
    id: "pnt-putty",
    name: "Skim Coat Wall Putty (20kg)",
    category: "Paint & Finishes",
    description: "Fine white putty for levelling walls and ceilings before painting.",
    unit: "per 20kg bag",
    priceKES: 1200,
    image: IMG.paint,
    inStock: true,
    specs: { Weight: "20kg", Colour: "White" },
    coverageSqmPerUnit: 12,
  },

  // ─── Flooring ───────────────────────────────────────────────
  {
    id: "flr-ceramic",
    name: "Ceramic Floor Tile 600×600",
    category: "Flooring",
    description: "Hard-wearing glazed ceramic floor tile for living spaces and circulation areas. Priced per m².",
    unit: "per m²",
    priceKES: 1450,
    image: IMG.tiles,
    inStock: true,
    specs: { Size: "600×600mm", Finish: "Matt", Class: "PEI III" },
    coverageSqmPerUnit: 1,
  },
  {
    id: "flr-porcelain",
    name: "Porcelain Tile 800×800",
    category: "Flooring",
    description: "Premium rectified porcelain tile with low water absorption — ideal for high-traffic and wet areas.",
    unit: "per m²",
    priceKES: 2600,
    image: IMG.tiles,
    inStock: true,
    specs: { Size: "800×800mm", Finish: "Polished" },
    coverageSqmPerUnit: 1,
  },
  {
    id: "flr-adhesive",
    name: "Tile Adhesive (20kg)",
    category: "Flooring",
    description: "Cement-based tile adhesive for floors and walls. Strong bond on concrete and screed.",
    unit: "per 20kg bag",
    priceKES: 1100,
    image: IMG.tiles,
    inStock: true,
    specs: { Weight: "20kg", Coverage: "~5 m²/bag" },
    coverageSqmPerUnit: 5,
  },

  // ─── Plumbing ───────────────────────────────────────────────
  {
    id: "plm-ppr20",
    name: "PPR Hot/Cold Pipe 20mm (4m)",
    category: "Plumbing",
    description: "Polypropylene random copolymer pressure pipe for hot and cold water supply. Heat-fused joints.",
    unit: "per length",
    priceKES: 480,
    image: IMG.pipes,
    inStock: true,
    specs: { Diameter: "20mm", Length: "4m", Pressure: "PN20" },
  },
  {
    id: "plm-upvc110",
    name: "uPVC Soil Pipe 110mm (6m)",
    category: "Plumbing",
    description: "Unplasticised PVC waste and soil pipe for gravity drainage systems.",
    unit: "per length",
    priceKES: 1300,
    image: IMG.pipes,
    inStock: true,
    specs: { Diameter: "110mm", Length: "6m", Class: "SN4" },
  },
  {
    id: "plm-tank",
    name: "Water Storage Tank (1000L)",
    category: "Plumbing",
    description: "UV-stabilised polyethylene water tank, food-grade. Includes lid and outlet fittings.",
    unit: "per unit",
    priceKES: 11500,
    image: IMG.pipes,
    inStock: true,
    specs: { Capacity: "1000L", Material: "LLDPE" },
  },

  // ─── Electrical ─────────────────────────────────────────────
  {
    id: "ele-twincable",
    name: "Twin & Earth Cable 2.5mm² (100m)",
    category: "Electrical",
    description: "PVC-insulated copper cable for ring and radial socket circuits. 100m drum.",
    unit: "per 100m roll",
    priceKES: 8500,
    image: IMG.electrical,
    inStock: true,
    specs: { Size: "2.5mm²", Length: "100m", Conductor: "Copper" },
  },
  {
    id: "ele-conduit",
    name: "PVC Conduit Pipe 20mm (3m)",
    category: "Electrical",
    description: "Heavy-gauge PVC conduit for concealed electrical wiring.",
    unit: "per length",
    priceKES: 180,
    image: IMG.electrical,
    inStock: true,
    specs: { Diameter: "20mm", Length: "3m" },
  },
  {
    id: "ele-db8",
    name: "Distribution Board (8-Way)",
    category: "Electrical",
    description: "Surface-mount consumer unit with main switch — 8 ways for MCBs. Ready for installation.",
    unit: "per unit",
    priceKES: 3800,
    image: IMG.electrical,
    inStock: true,
    specs: { Ways: "8", Mounting: "Surface" },
  },

  // ─── Cabro & Road Works ─────────────────────────────────────
  {
    id: "cab-block60",
    name: "Cabro Paving Block 60mm",
    category: "Cabro & Road Works",
    description: "Interlocking concrete paving block for driveways, yards, and walkways. Priced per m².",
    unit: "per m²",
    priceKES: 1150,
    image: IMG.cabro,
    inStock: true,
    specs: { Thickness: "60mm", Strength: "35 N/mm²" },
    coverageSqmPerUnit: 1,
  },
  {
    id: "cab-kerb",
    name: "Concrete Kerbstone",
    category: "Cabro & Road Works",
    description: "Precast concrete kerb for edging driveways, paving, and roads.",
    unit: "per piece",
    priceKES: 450,
    image: IMG.cabro,
    inStock: true,
    specs: { Size: "500×300×150mm" },
  },
  {
    id: "cab-hardcore",
    name: "Hardcore (per tonne)",
    category: "Cabro & Road Works",
    description: "Crushed stone hardcore for sub-base preparation under slabs and paving.",
    unit: "per tonne",
    priceKES: 1800,
    image: IMG.cabro,
    inStock: true,
    specs: { Delivery: "Tipper" },
  },

  // ─── Hardware ───────────────────────────────────────────────
  {
    id: "hwd-wheelbarrow",
    name: "Heavy-Duty Wheelbarrow",
    category: "Hardware",
    description: "Reinforced steel-pan wheelbarrow with pneumatic tyre for site material handling.",
    unit: "per unit",
    priceKES: 4200,
    image: IMG.hardware,
    inStock: true,
    specs: { Capacity: "90L", Tyre: "Pneumatic" },
  },
  {
    id: "hwd-roofnails",
    name: "Roofing Nails (25kg)",
    category: "Hardware",
    description: "Galvanised twisted-shank roofing nails with rubber washers. Bulk 25kg bag.",
    unit: "per 25kg bag",
    priceKES: 3500,
    image: IMG.hardware,
    inStock: true,
    specs: { Weight: "25kg", Finish: "Galvanised" },
  },
  {
    id: "hwd-bindingwire",
    name: "Binding Wire (per kg)",
    category: "Hardware",
    description: "Soft annealed mild-steel binding wire for tying reinforcement bars.",
    unit: "per kg",
    priceKES: 220,
    image: IMG.hardware,
    inStock: true,
    specs: { Gauge: "16g", Finish: "Annealed" },
  },
  {
    id: "hwd-padlock",
    name: "Heavy-Duty Padlock",
    category: "Hardware",
    description: "Hardened-steel shackle padlock for site stores and gates. Three keys included.",
    unit: "per unit",
    priceKES: 650,
    image: IMG.hardware,
    inStock: true,
    specs: { Body: "Brass", Keys: "3" },
  },
];

const PRODUCT_MAP: Record<string, Product> = Object.fromEntries(
  PRODUCTS.map((p) => [p.id, p])
);

export function getProduct(id: string): Product | undefined {
  return PRODUCT_MAP[id];
}

// Category → icon key + short blurb, for the homepage "Shop by Category" grid.
export const CATEGORY_META: Record<ProductCategory, { icon: string; blurb: string }> = {
  "Structural Materials": { icon: "blocks", blurb: "Cement, rebar, blocks & aggregate" },
  "Gypsum & Ceilings": { icon: "ceiling", blurb: "Boards, framing & ceiling systems" },
  "Paint & Finishes": { icon: "paint", blurb: "Emulsions, primers & putty" },
  "Flooring": { icon: "tiles", blurb: "Ceramic, porcelain & adhesives" },
  "Plumbing": { icon: "pipe", blurb: "Pipes, fittings & tanks" },
  "Electrical": { icon: "plug", blurb: "Cables, conduit & boards" },
  "Cabro & Road Works": { icon: "road", blurb: "Cabro, kerbs & hardcore" },
  "Hardware": { icon: "tools", blurb: "Tools, nails & site essentials" },
};
