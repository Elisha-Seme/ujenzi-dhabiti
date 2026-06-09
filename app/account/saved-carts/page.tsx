import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { db, savedCarts } from "@/lib/db";
import { eq, desc } from "drizzle-orm";
import SavedCartsClient from "./SavedCartsClient";

export default async function SavedCartsPage() {
  const session = await auth();
  
  if (!session?.user?.id) {
    redirect("/auth/signin");
  }

  const carts = await db
    .select()
    .from(savedCarts)
    .where(eq(savedCarts.userId, session.user.id))
    .orderBy(desc(savedCarts.savedAt));

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return <SavedCartsClient initialCarts={carts as any} />;
}
