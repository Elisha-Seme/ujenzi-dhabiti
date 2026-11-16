const SLUG = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

/** Validates the admin's optional "parent section" for a sub-service. */
export function parseParentSectionId(raw: unknown, ownSectionId: string): { ok: true; value: string | null } | { ok: false; error: string } {
  const value = typeof raw === "string" ? raw.trim() : "";
  if (!value) return { ok: true, value: null };
  if (!SLUG.test(value)) return { ok: false, error: "Parent section must be another sub-service's Section Anchor ID (lowercase, e.g. residential)" };
  if (value === ownSectionId) return { ok: false, error: "A sub-service can't be its own parent" };
  return { ok: true, value };
}
