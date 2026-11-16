import { asc, eq, getTableColumns, inArray, type SQL } from "drizzle-orm";
import { db, serviceSubsections } from "@/lib/db";
import { isMissingColumnError } from "./db-errors";

export { isMissingColumnError };

export type SubsectionRow = typeof serviceSubsections.$inferSelect;

// Every column except the labour fields added in migration 0016.
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
 * migration 0016 (no labour columns), retries without them and returns the
 * labour fields as null, so pages keep working and labour shows unpriced.
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
    return rows.map((row) => ({ ...row, labourRateKES: null, labourUnit: null }));
  }
}

export const LABOUR_MIGRATION_MESSAGE = "Labour rates need database migration 0016 before subsections can be saved.";
