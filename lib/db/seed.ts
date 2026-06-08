import * as dotenv from "dotenv";
dotenv.config({ path: ".env.local" });

import { db } from "./index";
import { users, housePlans } from "./schema";
import { HOUSE_PLANS } from "../house-plans";
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

  console.log("\n✅ Seed complete!");
  console.log(`   ${HOUSE_PLANS.length} house plans`);
  console.log("\n   Admin login: admin@ujenzidhabiti.co.ke / Admin@UjenziDhabiti2025!");
  console.log("   Change this password immediately after first login.\n");

  process.exit(0);
}

seed().catch((err) => {
  console.error("❌ Seed failed:", err);
  process.exit(1);
});
