import { asc, eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { services } from "@/lib/db/schema";

/** The published CMS catalogue is the source of truth for quote choices. */
export async function getPublishedServiceTitles(): Promise<string[]> {
  try {
    const rows = await db.select({ title: services.title })
      .from(services)
      .where(eq(services.published, true))
      .orderBy(asc(services.sortOrder));
    return rows.map((row) => row.title);
  } catch (error) {
    console.error("Quote service choices could not be loaded:", error);
    return [];
  }
}
