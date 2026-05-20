import * as dotenv from "dotenv";
dotenv.config({ path: ".env.local" });

import { db } from "../lib/db";
import { products } from "../lib/db/schema";
import { eq } from "drizzle-orm";

async function run() {
  await db.update(products).set({ priceKES: 1 }).where(eq(products.id, "cem-003"));
  console.log("✅ Concrete Blocks (140mm) price set to KES 1");
  process.exit(0);
}

run().catch((err) => { console.error("❌", err); process.exit(1); });
