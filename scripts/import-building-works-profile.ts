import { and, eq } from "drizzle-orm";
import { db, serviceSubsections } from "../lib/db";
import { buildingWorksProfileSubsections } from "../lib/service-profile-building-works";

/**
 * Insert-only import of the company profile's Building Works sub-services
 * (property types, commercial categories, renovation types, boundary walls),
 * grouped under their existing parent sections. Never edits or deletes rows.
 * Dry run by default; apply with --apply and ALLOW_PROFILE_IMPORT=true.
 * Requires migration 0017 (service_subsections.parent_section_id).
 */
async function main() {
  const apply = process.argv.includes("--apply");
  if (apply && process.env.ALLOW_PROFILE_IMPORT !== "true") {
    throw new Error("Set ALLOW_PROFILE_IMPORT=true to apply the insert-only Building Works import.");
  }

  const existing = await db
    .select({ serviceSlug: serviceSubsections.serviceSlug, sectionId: serviceSubsections.sectionId, parentSectionId: serviceSubsections.parentSectionId })
    .from(serviceSubsections)
    .where(eq(serviceSubsections.serviceSlug, "building-works"));
  const existingIds = new Set(existing.map((row) => row.sectionId));

  const parents = Array.from(new Set(buildingWorksProfileSubsections.map((row) => row.parentSectionId)));
  const missingParents = parents.filter((parent) => !existingIds.has(parent));
  if (missingParents.length) {
    throw new Error(`Missing parent sections on building-works: ${missingParents.join(", ")}. No changes made.`);
  }

  const pending = buildingWorksProfileSubsections.filter((row) => !existingIds.has(row.sectionId));
  console.log(`Profile rows: ${buildingWorksProfileSubsections.length}; already present: ${buildingWorksProfileSubsections.length - pending.length}; pending: ${pending.length}.`);
  for (const parent of parents) {
    console.log(`  under ${parent}: ${pending.filter((row) => row.parentSectionId === parent).length} pending`);
  }
  if (!apply) {
    console.log("Dry run only. Re-run with --apply and ALLOW_PROFILE_IMPORT=true to insert.");
    return;
  }

  let inserted = 0;
  for (const row of pending) {
    const [duplicate] = await db.select({ id: serviceSubsections.id }).from(serviceSubsections)
      .where(and(eq(serviceSubsections.serviceSlug, row.serviceSlug), eq(serviceSubsections.sectionId, row.sectionId)))
      .limit(1);
    if (duplicate) continue;
    await db.insert(serviceSubsections).values({
      id: `profile-${row.serviceSlug}-${row.sectionId}`,
      serviceSlug: row.serviceSlug,
      parentSectionId: row.parentSectionId,
      sectionId: row.sectionId,
      title: row.title,
      body: row.body,
      bullets: row.bullets,
      planType: row.planType,
      sortOrder: row.sortOrder,
    });
    inserted++;
  }
  console.log(`Insert-only Building Works import complete: ${inserted} inserted.`);
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : "Building Works import failed.");
  process.exitCode = 1;
});
