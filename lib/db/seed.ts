import * as dotenv from "dotenv";
dotenv.config({ path: ".env.local" });

import { db } from "./index";
import { users, sellers, products, housePlans } from "./schema";
import { HOUSE_PLANS } from "../house-plans";
import bcrypt from "bcryptjs";

// ─── Seed data mirrors lib/sellers.ts and lib/products.ts ────────────────────

async function seed() {
  console.log("🌱 Seeding database...\n");

  // ─── Admin user ─────────────────────────────────────────────
  console.log("Creating admin user...");
  const adminHash = await bcrypt.hash("Admin@UjenziDhabiti2025!", 12);
  await db
    .insert(users)
    .values({
      id: "usr-admin-001",
      name: "Admin",
      email: "admin@ujenzidhabiti.co.ke",
      passwordHash: adminHash,
      role: "admin",
      emailVerified: true,
    })
    .onConflictDoNothing();

  // ─── Seller users ────────────────────────────────────────────
  console.log("Creating seller users...");
  const sellerUsers = [
    { id: "usr-sel-001", name: "Nairobi Building Supplies", email: "info@nairobibuilding.co.ke" },
    { id: "usr-sel-002", name: "Eastlands Steel Merchants", email: "info@eastlandssteel.co.ke" },
    { id: "usr-sel-003", name: "AquaFlow Pipes Kenya", email: "info@aquaflow.co.ke" },
    { id: "usr-sel-004", name: "SafeGuard PPE Africa", email: "info@safeguardppe.co.ke" },
    { id: "usr-sel-005", name: "Jua Kali Heavy Equipment", email: "info@juakali.co.ke" },
    { id: "usr-sel-006", name: "ProBuild Tools Ltd", email: "info@probuild.co.ke" },
  ];

  const defaultHash = await bcrypt.hash("Seller@Temp2025!", 12);
  for (const u of sellerUsers) {
    await db
      .insert(users)
      .values({ ...u, passwordHash: defaultHash, role: "seller", emailVerified: true })
      .onConflictDoNothing();
  }

  // ─── Seller profiles ─────────────────────────────────────────
  console.log("Creating seller profiles...");
  const sellerProfiles = [
    {
      id: "sel-001",
      userId: "usr-sel-001",
      businessName: "Nairobi Building Supplies",
      tagline: "Your one-stop shop for all structural materials",
      location: "Industrial Area, Nairobi",
      phone: "+254711000001",
      description: "We have supplied construction materials to contractors, developers, and individual builders across Kenya for over 12 years.",
      categories: ["Cement & Concrete", "Steel & Rebar"],
      status: "approved" as const,
      verified: true,
      rating: 48,
      reviewCount: 312,
      totalSales: 1840,
      joinedYear: 2021,
    },
    {
      id: "sel-002",
      userId: "usr-sel-002",
      businessName: "Eastlands Steel Merchants",
      tagline: "High-yield steel direct from mill",
      location: "Eastlands, Nairobi",
      phone: "+254722000002",
      description: "Specialist steel stockist and distributor. We hold mill certificates for every batch and can cut-to-length on site.",
      categories: ["Steel & Rebar"],
      status: "approved" as const,
      verified: true,
      rating: 46,
      reviewCount: 189,
      totalSales: 920,
      joinedYear: 2022,
    },
    {
      id: "sel-003",
      userId: "usr-sel-003",
      businessName: "AquaFlow Pipes Kenya",
      tagline: "Water infrastructure specialists",
      location: "Athi River, Nairobi",
      phone: "+254733000003",
      description: "Importers and distributors of HDPE, uPVC, and ductile iron pipe systems.",
      categories: ["Pipes & Fittings"],
      status: "approved" as const,
      verified: true,
      rating: 47,
      reviewCount: 143,
      totalSales: 670,
      joinedYear: 2020,
    },
    {
      id: "sel-004",
      userId: "usr-sel-004",
      businessName: "SafeGuard PPE Africa",
      tagline: "Keeping your workforce safe",
      location: "Westlands, Nairobi",
      phone: "+254744000004",
      description: "East Africa's leading PPE supplier. All products certified to European and international standards.",
      categories: ["Safety Equipment"],
      status: "approved" as const,
      verified: true,
      rating: 49,
      reviewCount: 428,
      totalSales: 3100,
      joinedYear: 2019,
    },
    {
      id: "sel-005",
      userId: "usr-sel-005",
      businessName: "Jua Kali Heavy Equipment",
      tagline: "Heavy machinery for serious builders",
      location: "Mombasa Road, Nairobi",
      phone: "+254755000005",
      description: "Importers of construction equipment — mixers, compactors, breakers, and vibrators.",
      categories: ["Heavy Equipment"],
      status: "approved" as const,
      verified: false,
      rating: 42,
      reviewCount: 67,
      totalSales: 290,
      joinedYear: 2023,
    },
    {
      id: "sel-006",
      userId: "usr-sel-006",
      businessName: "ProBuild Tools Ltd",
      tagline: "Professional tools for professional builders",
      location: "Karen, Nairobi",
      phone: "+254766000006",
      description: "Stockists of surveying instruments, scaffolding, power tools, and site accessories.",
      categories: ["Tools & Accessories"],
      status: "approved" as const,
      verified: true,
      rating: 45,
      reviewCount: 211,
      totalSales: 1450,
      joinedYear: 2021,
    },
  ];

  for (const s of sellerProfiles) {
    await db.insert(sellers).values(s).onConflictDoNothing();
  }

  // ─── Products ─────────────────────────────────────────────────
  console.log("Creating products...");
  const productData = [
    {
      id: "cem-001",
      sellerId: "sel-001",
      name: "Portland Cement (50kg)",
      category: "Cement & Concrete",
      description: "High-strength ordinary Portland cement suitable for general construction, foundations, and structural works. Meets KS EAS 18-1 standard.",
      unit: "per bag",
      priceKES: 850,
      stock: 500,
      images: ["https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=500&q=70&auto=format&fit=crop"],
      specs: { Grade: "42.5N", "Bag weight": "50kg", Standard: "KS EAS 18-1" },
    },
    {
      id: "cem-002",
      sellerId: "sel-001",
      name: "Ready-Mix Concrete (1m³)",
      category: "Cement & Concrete",
      description: "Factory-batched ready-mix concrete delivered to site. Available in C20, C25, C30, and C35 grades.",
      unit: "per m³",
      priceKES: 14500,
      stock: 50,
      images: ["https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=500&q=70&auto=format&fit=crop"],
      specs: { Grades: "C20 / C25 / C30 / C35", "Lead time": "24 hrs", Delivery: "Included" },
    },
    {
      id: "cem-003",
      sellerId: "sel-001",
      name: "Concrete Blocks (140mm)",
      category: "Cement & Concrete",
      description: "Solid concrete masonry blocks for load-bearing and partition walls. Cured 28 days.",
      unit: "per block",
      priceKES: 65,
      stock: 2000,
      images: ["https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=500&q=70&auto=format&fit=crop"],
      specs: { Size: "390×190×140mm", Strength: "7 N/mm²", MOQ: "500 blocks" },
    },
    {
      id: "stl-001",
      sellerId: "sel-002",
      name: "Deformed Rebar Y12 (12m)",
      category: "Steel & Rebar",
      description: "High-yield deformed steel bars for reinforced concrete structures. Grade 500B. Full-length 12m bars, cut-to-length available.",
      unit: "per bar",
      priceKES: 1150,
      stock: 300,
      images: ["https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=500&q=70&auto=format&fit=crop"],
      specs: { Diameter: "12mm", Grade: "500B", Length: "12m", Standard: "KS 572" },
    },
    {
      id: "stl-002",
      sellerId: "sel-002",
      name: "BRC Welded Mesh A393",
      category: "Steel & Rebar",
      description: "Factory-welded high-tensile steel mesh for floor slabs, walls, and industrial floors.",
      unit: "per sheet (2.4×4.8m)",
      priceKES: 8900,
      stock: 80,
      images: ["https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=500&q=70&auto=format&fit=crop"],
      specs: { Size: "2.4m × 4.8m", Wire: "10mm @ 200mm", Grade: "500B" },
    },
    {
      id: "stl-003",
      sellerId: "sel-001",
      name: "Structural Steel I-Beam (6m)",
      category: "Steel & Rebar",
      description: "Hot-rolled universal I-beams for structural frames, mezzanines, and bridge girders. Grade S275. Primed finish.",
      unit: "per 6m length",
      priceKES: 24000,
      stock: 40,
      images: ["https://images.unsplash.com/photo-1545558014-8692077e9b5c?w=500&q=70&auto=format&fit=crop"],
      specs: { Section: "203×133×25kg/m", Grade: "S275", Finish: "Mill scale / primed" },
    },
    {
      id: "pip-001",
      sellerId: "sel-003",
      name: "HDPE Pipe 110mm PN16 (6m)",
      category: "Pipes & Fittings",
      description: "High-density polyethylene pressure pipe for water supply and irrigation mains. 50-year design life.",
      unit: "per 6m length",
      priceKES: 3800,
      stock: 120,
      images: ["https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=500&q=70&auto=format&fit=crop"],
      specs: { Diameter: "110mm OD", Pressure: "PN16 (16 bar)", Material: "PE100", Standard: "ISO 4427" },
    },
    {
      id: "pip-002",
      sellerId: "sel-003",
      name: "uPVC Sewer Pipe 160mm (6m)",
      category: "Pipes & Fittings",
      description: "Unplasticised PVC gravity sewer pipe. Smooth bore for self-cleaning velocity.",
      unit: "per 6m length",
      priceKES: 2200,
      stock: 0,
      images: ["https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=500&q=70&auto=format&fit=crop"],
      specs: { Diameter: "160mm", Class: "SN8", Standard: "ISO 1452" },
    },
    {
      id: "pip-003",
      sellerId: "sel-003",
      name: "Gate Valve 100mm PN16",
      category: "Pipes & Fittings",
      description: "Ductile iron resilient-seated gate valve for potable water mains. Flanged ends.",
      unit: "per unit",
      priceKES: 18500,
      stock: 25,
      images: ["https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=500&q=70&auto=format&fit=crop"],
      specs: { Size: "DN100", Pressure: "PN16", Body: "Ductile iron", Standard: "BS 5163" },
    },
    {
      id: "sft-001",
      sellerId: "sel-004",
      name: "Construction Hard Hat (Class E)",
      category: "Safety Equipment",
      description: "Electrical-rated hard hat with 6-point suspension harness and ratchet adjustment. ANSI/ISEA Z89.1 compliant.",
      unit: "per unit",
      priceKES: 1200,
      stock: 200,
      images: ["https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=500&q=70&auto=format&fit=crop"],
      specs: { Rating: "Class E", Standard: "ANSI/ISEA Z89.1", Colors: "White / Yellow / Orange" },
    },
    {
      id: "sft-002",
      sellerId: "sel-004",
      name: "Hi-Vis Safety Vest (Class 2)",
      category: "Safety Equipment",
      description: "Class 2 high-visibility vest with 50mm retroreflective tape. Mesh body for ventilation.",
      unit: "per unit",
      priceKES: 450,
      stock: 500,
      images: ["https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=500&q=70&auto=format&fit=crop"],
      specs: { Class: "Class 2", Standard: "EN ISO 20471", Sizes: "S–XXL" },
    },
    {
      id: "sft-003",
      sellerId: "sel-004",
      name: "Safety Boot (Steel Toe S3)",
      category: "Safety Equipment",
      description: "Mid-cut leather safety boot with 200J steel toecap and steel midsole. Oil-resistant sole.",
      unit: "per pair",
      priceKES: 4800,
      stock: 150,
      images: ["https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=500&q=70&auto=format&fit=crop"],
      specs: { Rating: "S3 SRC", Toecap: "200J steel", Standard: "EN ISO 20345", Sizes: "38–48 EU" },
    },
    {
      id: "heq-001",
      sellerId: "sel-005",
      name: "Concrete Mixer 350L (Diesel)",
      category: "Heavy Equipment",
      description: "Site-mounted diesel concrete mixer with 350-litre drum capacity. Electric start.",
      unit: "per unit",
      priceKES: 185000,
      stock: 5,
      images: ["https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=500&q=70&auto=format&fit=crop"],
      specs: { Capacity: "350L", Engine: "10HP diesel", Output: "~10 batches/hr" },
    },
    {
      id: "heq-002",
      sellerId: "sel-005",
      name: "Plate Compactor 100kg",
      category: "Heavy Equipment",
      description: "Forward-plate vibrating compactor for granular soils and road sub-base preparation. Honda GX160 engine.",
      unit: "per unit",
      priceKES: 95000,
      stock: 8,
      images: ["https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=500&q=70&auto=format&fit=crop"],
      specs: { Plate: "500×400mm", Weight: "100kg", Engine: "Honda GX160" },
    },
    {
      id: "heq-003",
      sellerId: "sel-005",
      name: "Hydraulic Breaker 1500J",
      category: "Heavy Equipment",
      description: "Medium class hydraulic rock breaker for excavator attachment. 1500J impact energy.",
      unit: "per unit",
      priceKES: 480000,
      stock: 0,
      images: ["https://images.unsplash.com/photo-1545558014-8692077e9b5c?w=500&q=70&auto=format&fit=crop"],
      specs: { Energy: "1500J", Weight: "650kg", "Carrier class": "8–20T excavator" },
    },
    {
      id: "tol-001",
      sellerId: "sel-006",
      name: "Laser Level (Self-Levelling)",
      category: "Tools & Accessories",
      description: "360° self-levelling cross-line laser level with green beam. ±30m indoor range. IP54 rated.",
      unit: "per unit",
      priceKES: 28000,
      stock: 20,
      images: ["https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=500&q=70&auto=format&fit=crop"],
      specs: { Range: "±30m indoor", Accuracy: "±0.2mm/m", Rating: "IP54" },
    },
    {
      id: "tol-002",
      sellerId: "sel-006",
      name: "Scaffolding Tube 48.3mm × 6m",
      category: "Tools & Accessories",
      description: "Hot-dip galvanised steel scaffolding tube. 48.3mm OD × 3.2mm wall. Fits all standard system couplers.",
      unit: "per tube",
      priceKES: 3200,
      stock: 200,
      images: ["https://images.unsplash.com/photo-1545558014-8692077e9b5c?w=500&q=70&auto=format&fit=crop"],
      specs: { OD: "48.3mm", Wall: "3.2mm", Length: "6.0m", Finish: "Hot-dip galvanised" },
    },
    {
      id: "tol-003",
      sellerId: "sel-006",
      name: "Angle Grinder 9″ 2400W",
      category: "Tools & Accessories",
      description: "Heavy-duty 230mm angle grinder for cutting rebar and grinding welds. Soft-start, anti-restart safety.",
      unit: "per unit",
      priceKES: 12500,
      stock: 35,
      images: ["https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=500&q=70&auto=format&fit=crop"],
      specs: { Disc: "230mm (9″)", Power: "2400W", "No-load speed": "6500 RPM" },
    },
  ];

  for (const p of productData) {
    await db
      .insert(products)
      .values({ ...p, specs: p.specs as unknown as Record<string, string> })
      .onConflictDoNothing();
  }

  // ─── House plans (so admin can fully CRUD them, nothing hard-coded) ───
  console.log("Creating house plans...");
  for (const p of HOUSE_PLANS) {
    await db
      .insert(housePlans)
      .values({
        id: p.id,
        name: p.name,
        category: p.category,
        planType: p.planType,
        description: p.description,
        priceDigitalKES: p.priceDigitalKES,
        pricePrintKES: p.pricePrintKES,
        image: p.image ?? null,
        bedrooms: p.bedrooms ?? null,
        bathrooms: p.bathrooms ?? null,
        floors: p.floors,
        plinthAreaSqM: p.plinthAreaSqM,
        downloadFile: p.downloadFile ?? null,
        downloadSizeBytes: p.downloadSizeBytes ?? null,
        published: true,
      })
      .onConflictDoNothing();
  }

  console.log("\n✅ Seed complete!");
  console.log(`   ${sellerUsers.length} seller users`);
  console.log(`   ${sellerProfiles.length} seller profiles`);
  console.log(`   ${productData.length} products`);
  console.log(`   ${HOUSE_PLANS.length} house plans`);
  console.log("\n   Admin login: admin@ujenzidhabiti.co.ke / Admin@UjenziDhabiti2025!");
  console.log("   Change this password immediately after first login.\n");

  process.exit(0);
}

seed().catch((err) => {
  console.error("❌ Seed failed:", err);
  process.exit(1);
});
