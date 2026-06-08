export type ProductCategory =
  | "Cement & Concrete"
  | "Steel & Rebar"
  | "Pipes & Fittings"
  | "Safety Equipment"
  | "Heavy Equipment"
  | "Tools & Accessories";

export interface Product {
  id: string;
  name: string;
  category: ProductCategory;
  description: string;
  unit: string;
  priceKES: number;
  image: string;
  inStock: boolean;
  sellerId: string;
  specs?: Record<string, string>;
}

export const PRODUCT_CATEGORIES: ProductCategory[] = [
  "Cement & Concrete",
  "Steel & Rebar",
  "Pipes & Fittings",
  "Safety Equipment",
  "Heavy Equipment",
  "Tools & Accessories",
];

export const PLATFORM_FEE_PERCENT = 3;

export const PRODUCTS: Product[] = [
  // Cement & Concrete — seller: sel-001
  {
    id: "cem-001",
    name: "Portland Cement (50kg)",
    category: "Cement & Concrete",
    sellerId: "sel-001",
    description:
      "High-strength ordinary Portland cement suitable for general construction, foundations, and structural works. Meets KS EAS 18-1 standard.",
    unit: "per bag",
    priceKES: 850,
    image:
      "https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=500&q=70&auto=format&fit=crop",
    inStock: true,
    specs: { Grade: "42.5N", "Bag weight": "50kg", Standard: "KS EAS 18-1" },
  },
  {
    id: "cem-002",
    name: "Ready-Mix Concrete (1m³)",
    category: "Cement & Concrete",
    sellerId: "sel-001",
    description:
      "Factory-batched ready-mix concrete delivered to site. Available in C20, C25, C30, and C35 grades.",
    unit: "per m³",
    priceKES: 14500,
    image:
      "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=500&q=70&auto=format&fit=crop",
    inStock: true,
    specs: { Grades: "C20 / C25 / C30 / C35", "Lead time": "24 hrs", Delivery: "Included" },
  },
  {
    id: "cem-003",
    name: "Concrete Blocks (140mm)",
    category: "Cement & Concrete",
    sellerId: "sel-001",
    description:
      "Solid concrete masonry blocks for load-bearing and partition walls. Cured 28 days.",
    unit: "per block",
    priceKES: 1,
    image:
      "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=500&q=70&auto=format&fit=crop",
    inStock: true,
    specs: { Size: "390×190×140mm", Strength: "7 N/mm²", MOQ: "500 blocks" },
  },
  // Steel & Rebar — sellers: sel-001, sel-002
  {
    id: "stl-001",
    name: "Deformed Rebar Y12 (12m)",
    category: "Steel & Rebar",
    sellerId: "sel-002",
    description:
      "High-yield deformed steel bars for reinforced concrete structures. Grade 500B. Full-length 12m bars, cut-to-length available.",
    unit: "per bar",
    priceKES: 1150,
    image:
      "https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=500&q=70&auto=format&fit=crop",
    inStock: true,
    specs: { Diameter: "12mm", Grade: "500B", Length: "12m", Standard: "KS 572" },
  },
  {
    id: "stl-002",
    name: "BRC Welded Mesh A393",
    category: "Steel & Rebar",
    sellerId: "sel-002",
    description:
      "Factory-welded high-tensile steel mesh for floor slabs, walls, and industrial floors.",
    unit: "per sheet (2.4×4.8m)",
    priceKES: 8900,
    image:
      "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=500&q=70&auto=format&fit=crop",
    inStock: true,
    specs: { Size: "2.4m × 4.8m", Wire: "10mm @ 200mm", Grade: "500B" },
  },
  {
    id: "stl-003",
    name: "Structural Steel I-Beam (6m)",
    category: "Steel & Rebar",
    sellerId: "sel-001",
    description:
      "Hot-rolled universal I-beams for structural frames, mezzanines, and bridge girders. Grade S275. Primed finish.",
    unit: "per 6m length",
    priceKES: 24000,
    image:
      "https://images.unsplash.com/photo-1545558014-8692077e9b5c?w=500&q=70&auto=format&fit=crop",
    inStock: true,
    specs: { Section: "203×133×25kg/m", Grade: "S275", Finish: "Mill scale / primed" },
  },
  // Pipes & Fittings — seller: sel-003
  {
    id: "pip-001",
    name: "HDPE Pipe 110mm PN16 (6m)",
    category: "Pipes & Fittings",
    sellerId: "sel-003",
    description:
      "High-density polyethylene pressure pipe for water supply and irrigation mains. 50-year design life.",
    unit: "per 6m length",
    priceKES: 3800,
    image:
      "https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=500&q=70&auto=format&fit=crop",
    inStock: true,
    specs: { Diameter: "110mm OD", Pressure: "PN16 (16 bar)", Material: "PE100", Standard: "ISO 4427" },
  },
  {
    id: "pip-002",
    name: "uPVC Sewer Pipe 160mm (6m)",
    category: "Pipes & Fittings",
    sellerId: "sel-003",
    description:
      "Unplasticised PVC gravity sewer pipe. Smooth bore for self-cleaning velocity. Suitable for sewage and drainage.",
    unit: "per 6m length",
    priceKES: 2200,
    image:
      "https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=500&q=70&auto=format&fit=crop",
    inStock: false,
    specs: { Diameter: "160mm", Class: "SN8", Standard: "ISO 1452" },
  },
  {
    id: "pip-003",
    name: "Gate Valve 100mm PN16",
    category: "Pipes & Fittings",
    sellerId: "sel-003",
    description:
      "Ductile iron resilient-seated gate valve for potable water mains. Flanged ends.",
    unit: "per unit",
    priceKES: 18500,
    image:
      "https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=500&q=70&auto=format&fit=crop",
    inStock: true,
    specs: { Size: "DN100", Pressure: "PN16", Body: "Ductile iron", Standard: "BS 5163" },
  },
  // Safety Equipment — seller: sel-004
  {
    id: "sft-001",
    name: "Construction Hard Hat (Class E)",
    category: "Safety Equipment",
    sellerId: "sel-004",
    description:
      "Electrical-rated hard hat with 6-point suspension harness and ratchet adjustment. ANSI/ISEA Z89.1 compliant.",
    unit: "per unit",
    priceKES: 1200,
    image:
      "https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=500&q=70&auto=format&fit=crop",
    inStock: true,
    specs: { Rating: "Class E", Standard: "ANSI/ISEA Z89.1", Colors: "White / Yellow / Orange" },
  },
  {
    id: "sft-002",
    name: "Hi-Vis Safety Vest (Class 2)",
    category: "Safety Equipment",
    sellerId: "sel-004",
    description:
      "Class 2 high-visibility vest with 50mm retroreflective tape. Mesh body for ventilation.",
    unit: "per unit",
    priceKES: 450,
    image:
      "https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=500&q=70&auto=format&fit=crop",
    inStock: true,
    specs: { Class: "Class 2", Standard: "EN ISO 20471", Sizes: "S–XXL" },
  },
  {
    id: "sft-003",
    name: "Safety Boot (Steel Toe S3)",
    category: "Safety Equipment",
    sellerId: "sel-004",
    description:
      "Mid-cut leather safety boot with 200J steel toecap and steel midsole. Oil-resistant sole.",
    unit: "per pair",
    priceKES: 4800,
    image:
      "https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=500&q=70&auto=format&fit=crop",
    inStock: true,
    specs: { Rating: "S3 SRC", Toecap: "200J steel", Standard: "EN ISO 20345", Sizes: "38–48 EU" },
  },
  // Heavy Equipment — seller: sel-005
  {
    id: "heq-001",
    name: "Concrete Mixer 350L (Diesel)",
    category: "Heavy Equipment",
    sellerId: "sel-005",
    description:
      "Site-mounted diesel concrete mixer with 350-litre drum capacity. Electric start. Suitable for remote sites without grid power.",
    unit: "per unit",
    priceKES: 185000,
    image:
      "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=500&q=70&auto=format&fit=crop",
    inStock: true,
    specs: { Capacity: "350L", Engine: "10HP diesel", Output: "~10 batches/hr" },
  },
  {
    id: "heq-002",
    name: "Plate Compactor 100kg",
    category: "Heavy Equipment",
    sellerId: "sel-005",
    description:
      "Forward-plate vibrating compactor for granular soils and road sub-base preparation. Honda GX160 engine.",
    unit: "per unit",
    priceKES: 95000,
    image:
      "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=500&q=70&auto=format&fit=crop",
    inStock: true,
    specs: { Plate: "500×400mm", Weight: "100kg", Engine: "Honda GX160" },
  },
  {
    id: "heq-003",
    name: "Hydraulic Breaker 1500J",
    category: "Heavy Equipment",
    sellerId: "sel-005",
    description:
      "Medium class hydraulic rock breaker for excavator attachment. 1500J impact energy. For rock, concrete, and hard pavement.",
    unit: "per unit",
    priceKES: 480000,
    image:
      "https://images.unsplash.com/photo-1545558014-8692077e9b5c?w=500&q=70&auto=format&fit=crop",
    inStock: false,
    specs: { Energy: "1500J", Weight: "650kg", "Carrier class": "8–20T excavator" },
  },
  // Tools & Accessories — seller: sel-006
  {
    id: "tol-001",
    name: "Laser Level (Self-Levelling)",
    category: "Tools & Accessories",
    sellerId: "sel-006",
    description:
      "360° self-levelling cross-line laser level with green beam. ±30m indoor range. IP54 rated.",
    unit: "per unit",
    priceKES: 28000,
    image:
      "https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=500&q=70&auto=format&fit=crop",
    inStock: true,
    specs: { Range: "±30m indoor", Accuracy: "±0.2mm/m", Rating: "IP54" },
  },
  {
    id: "tol-002",
    name: "Scaffolding Tube 48.3mm × 6m",
    category: "Tools & Accessories",
    sellerId: "sel-006",
    description:
      "Hot-dip galvanised steel scaffolding tube. 48.3mm OD × 3.2mm wall. Fits all standard system couplers.",
    unit: "per tube",
    priceKES: 3200,
    image:
      "https://images.unsplash.com/photo-1545558014-8692077e9b5c?w=500&q=70&auto=format&fit=crop",
    inStock: true,
    specs: { OD: "48.3mm", Wall: "3.2mm", Length: "6.0m", Finish: "Hot-dip galvanised" },
  },
  {
    id: "tol-003",
    name: "Angle Grinder 9″ 2400W",
    category: "Tools & Accessories",
    sellerId: "sel-006",
    description:
      "Heavy-duty 230mm angle grinder for cutting rebar and grinding welds. Soft-start, anti-restart safety.",
    unit: "per unit",
    priceKES: 12500,
    image:
      "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=500&q=70&auto=format&fit=crop",
    inStock: true,
    specs: { Disc: "230mm (9″)", Power: "2400W", "No-load speed": "6500 RPM" },
  },
];
