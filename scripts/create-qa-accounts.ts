import { randomUUID } from "crypto";
import bcrypt from "bcryptjs";
import { eq } from "drizzle-orm";
import { db, users } from "../lib/db";

type QaRole = "admin" | "buyer" | "seller";

const accountSpecs: Array<{ role: QaRole; name: string; emailEnv: string; passwordEnv: string; fallbackEmail: string }> = [
  { role: "admin", name: "TEST Administrator", emailEnv: "QA_ADMIN_EMAIL", passwordEnv: "QA_ADMIN_PASSWORD", fallbackEmail: "qa-admin@example.test" },
  { role: "buyer", name: "TEST Client", emailEnv: "QA_CLIENT_EMAIL", passwordEnv: "QA_CLIENT_PASSWORD", fallbackEmail: "qa-client@example.test" },
  { role: "seller", name: "TEST Seller", emailEnv: "QA_SELLER_EMAIL", passwordEnv: "QA_SELLER_PASSWORD", fallbackEmail: "qa-seller@example.test" },
];

async function main() {
  if (process.env.ALLOW_QA_ACCOUNT_CREATION !== "true") {
    throw new Error("Set ALLOW_QA_ACCOUNT_CREATION=true in a non-production QA environment before running this script.");
  }
  if (process.env.NODE_ENV === "production") {
    throw new Error("QA account creation is disabled when NODE_ENV=production.");
  }

  for (const spec of accountSpecs) {
    const email = (process.env[spec.emailEnv] || spec.fallbackEmail).trim().toLowerCase();
    const password = process.env[spec.passwordEnv];
    if (!password || password.length < 12 || password.length > 128) {
      throw new Error(`${spec.passwordEnv} must be set and contain 12–128 characters.`);
    }

    const passwordHash = await bcrypt.hash(password, 12);
    const [existing] = await db.select({ id: users.id }).from(users).where(eq(users.email, email)).limit(1);

    if (existing) {
      await db.update(users).set({
        name: spec.name,
        passwordHash,
        role: spec.role,
        emailVerified: true,
        updatedAt: new Date(),
      }).where(eq(users.id, existing.id));
    } else {
      await db.insert(users).values({
        id: `qa-${spec.role}-${randomUUID().slice(0, 8)}`,
        name: spec.name,
        email,
        passwordHash,
        phone: null,
        role: spec.role,
        emailVerified: true,
      });
    }

    console.log(`QA ${spec.role} account ready: ${email}`);
  }
}

main().catch((error) => {
  console.error("QA account provisioning failed:", error instanceof Error ? error.message : error);
  process.exitCode = 1;
});
