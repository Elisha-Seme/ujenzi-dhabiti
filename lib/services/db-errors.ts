// Recognises Postgres "undefined_column" (SQLSTATE 42703), whether raised
// directly by the driver or wrapped by Drizzle as the error's `cause`.
// Used where new code must keep working before its migration is applied.
export function isMissingColumnError(err: unknown): boolean {
  for (let e: unknown = err, depth = 0; e && typeof e === "object" && depth < 4; depth++) {
    const { code, message, cause } = e as { code?: unknown; message?: unknown; cause?: unknown };
    if (code === "42703") return true;
    if (typeof message === "string" && /column "?[\w.]+"? does not exist/i.test(message)) return true;
    e = cause;
  }
  return false;
}
