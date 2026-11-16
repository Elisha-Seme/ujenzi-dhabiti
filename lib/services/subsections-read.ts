import { asc, eq, getTableColumns, inArray, type SQL } from "drizzle-orm";
import { db, serviceSubsections } from "@/lib/db";
import { isMissingColumnError } from "./db-errors";

export { isMissingColumnError };

export type SubsectionRow = typeof serviceSubsections.$inferSelect;

// Every column except those added by migrations 0016 (labour) and 0017 (parent).
const ALL_COLUMNS = getTableColumns(serviceSubsections);
const LEGACY_COLUMNS = {
  id: ALL_COLUMNS.id,
  serviceSlug: ALL_COLUMNS.serviceSlug,
  sectionId: ALL_COLUMNS.sectionId,
  title: ALL_COLUMNS.title,
  body: ALL_COLUMNS.body,
  planType: ALL_COLUMNS.planType,
  bullets: ALL_COLUMNS.bullets,
  sortOrder: ALL_COLUMNS.sortOrder,
  createdAt: ALL_COLUMNS.createdAt,
  updatedAt: ALL_COLUMNS.updatedAt,
};

/**
 * Reads service sub-sections ordered by sortOrder. If the database predates
 * migrations 0016/0017 (no labour or parent columns), retries without them and
 * returns those fields as null, so pages keep working (labour shows unpriced,
 * nothing is grouped).
 */
export async function readSubsections(opts: { serviceSlug?: string; serviceSlugs?: string[] } = {}): Promise<SubsectionRow[]> {
  if (opts.serviceSlugs && opts.serviceSlugs.length === 0) return [];
  const where: SQL | undefined = opts.serviceSlug
    ? eq(serviceSubsections.serviceSlug, opts.serviceSlug)
    : opts.serviceSlugs
      ? inArray(serviceSubsections.serviceSlug, opts.serviceSlugs)
      : undefined;

  try {
    return await db.select().from(serviceSubsections).where(where).orderBy(asc(serviceSubsections.sortOrder));
  } catch (err) {
    if (!isMissingColumnError(err)) throw err;
    const rows = await db.select(LEGACY_COLUMNS).from(serviceSubsections).where(where).orderBy(asc(serviceSubsections.sortOrder));
    return rows.map((row) => ({ ...row, labourRateKES: null, labourUnit: null, parentSectionId: null }));
  }
}

export const LABOUR_MIGRATION_MESSAGE = "Sub-services need database migrations 0016 and 0017 before they can be saved.";
