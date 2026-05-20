import * as dotenv from "dotenv";
dotenv.config({ path: ".env.local" });

import { db } from "../lib/db";
import { users, sellers, products } from "../lib/db/schema";
import bcrypt from "bcryptjs";

async function run() {
  // Ensure a seller user exists
  const hash = await bcrypt.hash("Seller@Temp2025!", 12);
  await db.insert(users).values({
    id: "usr-sel-001",
    name: "Nairobi Building Supplies",
    email: "info@nairobibuilding.co.ke",
    passwordHash: hash,
    role: "seller",
    emailVerified: true,
  }).onConflictDoNothing();

  // Ensure the seller profile exists
  await db.insert(sellers).values({
    id: "sel-001",
    userId: "usr-sel-001",
    businessName: "Nairobi Building Supplies",
    tagline: "Your one-stop shop for all structural materials",
    location: "Industrial Area, Nairobi",
    phone: "+254711000001",
    description: "Construction materials supplier.",
    categories: ["Cement & Concrete"],
    status: "approved",
    verified: true,
    rating: 48,
    reviewCount: 312,
    totalSales: 1840,
    joinedYear: 2021,
  }).onConflictDoNothing();

  // Insert the 1 KES test product
  await db.insert(products).values({
    id: "test-001",
    sellerId: "sel-001",
    name: "Test Product (1 KES)",
    category: "Cement & Concrete",
    description: "Test product for payment verification only. Do not order.",
    unit: "per unit",
    priceKES: 1,
    stock: 999,
    images: ["https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=500&q=70&auto=format&fit=crop"],
    isActive: true,
  }).onConflictDoNothing();

  console.log("✅ Seller + test product inserted (1 KES) — id: test-001");
  process.exit(0);
}

run().catch((err) => {
  console.error("❌ Failed:", err);
  process.exit(1);
});
