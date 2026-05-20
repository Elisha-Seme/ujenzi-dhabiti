import * as dotenv from "dotenv";
dotenv.config({ path: ".env.local" });

import { db } from "../lib/db";
import { products } from "../lib/db/schema";
import { eq } from "drizzle-orm";

async function run() {
  // Show DATABASE_URL host so we know which DB we're hitting
  const url = process.env.DATABASE_URL ?? "";
  const host = url.match(/@([^/]+)/)?.[1] ?? "(unknown)";
  console.log(`Connecting to: ${host}`);

  // Before
  const [before] = await db.select().from(products).where(eq(products.id, "cem-003")).limit(1);
  console.log("Before:", before ? `cem-003 price=${before.priceKES}` : "cem-003 NOT FOUND");

  // Update
  const updated = await db
    .update(products)
    .set({ priceKES: 1 })
    .where(eq(products.id, "cem-003"))
    .returning({ id: products.id, priceKES: products.priceKES });
  console.log(`Updated rows: ${updated.length}`, updated);

  // After
  const [after] = await db.select().from(products).where(eq(products.id, "cem-003")).limit(1);
  console.log("After:", after ? `cem-003 price=${after.priceKES}` : "cem-003 NOT FOUND");

  process.exit(0);
}

run().catch((err) => { console.error("❌", err); process.exit(1); });
