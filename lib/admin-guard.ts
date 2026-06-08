import { auth } from "@/lib/auth";

/** Returns true if the current session is an admin. */
export async function isAdmin(): Promise<boolean> {
  const session = await auth();
  return session?.user?.role === "admin";
}

/** Short, URL-safe id with a prefix, e.g. `proj_lk3f9a2x`. */
export function makeId(prefix: string): string {
  return `${prefix}_${Date.now().toString(36)}${Math.random().toString(36).slice(2, 8)}`;
}
