import type { NodePgDatabase } from "drizzle-orm/node-postgres";
import * as schema from "./schema";

const url = process.env.DATABASE_URL ?? "";
const isNeon = url.includes("neon.tech");

// Use Neon HTTP driver for Neon (handles cold starts/hibernation gracefully — no pool to manage).
// Use standard pg Pool for everything else (local Postgres, VPS deployment).
// Both expose the same Drizzle query-builder API.

function buildDb() {
  if (isNeon) {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const { neon } = require("@neondatabase/serverless");
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const { drizzle } = require("drizzle-orm/neon-http");
    const sql = neon(url);
    return drizzle(sql, { schema });
  }

  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const { Pool } = require("pg");
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const { drizzle } = require("drizzle-orm/node-postgres");

  const g = global as unknown as { __pgPool?: InstanceType<typeof Pool> };
  const pool =
    g.__pgPool ??
    new Pool({
      connectionString: url,
      max: 10,
      idleTimeoutMillis: 30000,
      connectionTimeoutMillis: 10000,
      ssl: url.includes("sslmode=require") ? { rejectUnauthorized: false } : undefined,
    });
  if (process.env.NODE_ENV !== "production") g.__pgPool = pool;

  pool.on("error", (err: Error) => {
    console.error("[pg pool] Idle client error (will recover):", err.message);
  });

  return drizzle(pool, { schema });
}

// Cast to NodePgDatabase: both drivers implement the same query-builder API surface,
// so this gives us proper TypeScript inference downstream while letting us swap drivers.
export const db = buildDb() as NodePgDatabase<typeof schema>;
export * from "./schema";
