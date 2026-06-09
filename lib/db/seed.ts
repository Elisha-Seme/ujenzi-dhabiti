import * as dotenv from "dotenv";
dotenv.config({ path: ".env.local" });

import { db } from "./index";
import { users, housePlans, products, deliveryZones } from "./schema";
import { HOUSE_PLANS } from "../house-plans";
import { PRODUCTS } from "../products";
import { DELIVERY_ZONES } from "../delivery";
import bcrypt from "bcryptjs";

// ─── Single-vendor seed: admin account + house-plan catalogue ────────────────

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

  // ─── House plans (admin can fully CRUD these later — nothing hard-coded) ───
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

  // ─── Materials catalogue (single-vendor; resets to the placeholder set) ───
  // NOTE: this replaces the materials catalogue with the wireframe placeholders.
  // Once the real product list is loaded via /admin/products, stop reseeding
  // (or remove this block) so admin-entered products aren't wiped.
  console.log("Creating materials...");
  await db.delete(products);
  for (const p of PRODUCTS) {
    await db
      .insert(products)
      .values({
        id: p.id,
        sellerId: null,
        name: p.name,
        category: p.category,
        description: p.description,
        priceKES: p.priceKES,
        unit: p.unit,
        stock: p.inStock ? 100 : 0,
        images: [p.image],
        specs: p.specs ?? {},
        coverageSqmPerUnit: p.coverageSqmPerUnit ?? null,
        brand: p.brand ?? null,
        materialType: p.materialType ?? null,
        isActive: true,
      })
      .onConflictDoNothing();
  }

  // ─── Delivery zones (idempotent — won't overwrite admin edits) ───
  console.log("Creating delivery zones...");
  let zi = 0;
  for (const z of DELIVERY_ZONES) {
    await db
      .insert(deliveryZones)
      .values({
        id: `zone-${z.county.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "")}`,
        county: z.county,
        feeKES: z.feeKES,
        sortOrder: zi++,
        published: true,
      })
      .onConflictDoNothing();
  }

  console.log("\n✅ Seed complete!");
  console.log(`   ${PRODUCTS.length} materials`);
  console.log(`   ${HOUSE_PLANS.length} house plans`);
  console.log(`   ${DELIVERY_ZONES.length} delivery zones`);
  console.log("\n   Admin login: admin@ujenzidhabiti.co.ke / Admin@UjenziDhabiti2025!");
  console.log("   Change this password immediately after first login.\n");

  process.exit(0);
}

seed().catch((err) => {
  console.error("❌ Seed failed:", err);
  process.exit(1);
});
