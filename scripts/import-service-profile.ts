import { and, eq } from "drizzle-orm";
import { db, services, serviceSubsections } from "../lib/db";
import { profileSubsections } from "../lib/service-profile-subsections";

/** Insert-only import of client-supplied profile sub-services. Never resets CMS data. */
async function main() {
  const apply = process.argv.includes("--apply");
  if (apply && process.env.ALLOW_PROFILE_IMPORT !== "true") {
    throw new Error("Set ALLOW_PROFILE_IMPORT=true to apply the insert-only profile import.");
  }

  const existingServices = await db.select({ slug: services.slug }).from(services);
  const knownSlugs = new Set(existingServices.map((row) => row.slug));
  const existingSections = await db.select({
    serviceSlug: serviceSubsections.serviceSlug,
    sectionId: serviceSubsections.sectionId,
    sortOrder: serviceSubsections.sortOrder,
  }).from(serviceSubsections);
  const existingKeys = new Set(existingSections.map((row) => `${row.serviceSlug}/${row.sectionId}`));
  const nextSort = new Map<string, number>();
  for (const row of existingSections) {
    nextSort.set(row.serviceSlug, Math.max(nextSort.get(row.serviceSlug) ?? 0, row.sortOrder + 1));
  }

  const missingParents = Array.from(new Set(profileSubsections.map((row) => row.serviceSlug)))
    .filter((slug) => !knownSlugs.has(slug));
  if (missingParents.length) {
    throw new Error(`Missing parent service slugs: ${missingParents.join(", ")}. No changes made.`);
  }

  const pending = profileSubsections.filter((row) => !existingKeys.has(`${row.serviceSlug}/${row.sectionId}`));
  console.log(`Profile rows: ${profileSubsections.length}; already present: ${profileSubsections.length - pending.length}; pending: ${pending.length}.`);
  if (!apply) {
    console.log("Dry run only. Re-run with --apply and ALLOW_PROFILE_IMPORT=true after reviewing the content.");
    return;
  }

  for (const row of pending) {
    const [duplicate] = await db.select({ id: serviceSubsections.id }).from(serviceSubsections)
      .where(and(eq(serviceSubsections.serviceSlug, row.serviceSlug), eq(serviceSubsections.sectionId, row.sectionId)))
      .limit(1);
    if (duplicate) continue;
    const sortOrder = nextSort.get(row.serviceSlug) ?? 0;
    await db.insert(serviceSubsections).values({
      id: `profile-${row.serviceSlug}-${row.sectionId}`,
      serviceSlug: row.serviceSlug,
      sectionId: row.sectionId,
      title: row.title,
      body: row.body,
      sortOrder,
      bullets: [],
      planType: null,
    });
    nextSort.set(row.serviceSlug, sortOrder + 1);
  }

  console.log("Insert-only profile import complete.");
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : "Profile import failed.");
  process.exitCode = 1;
});
