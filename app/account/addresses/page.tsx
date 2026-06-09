import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { db, addresses } from "@/lib/db";
import { eq, desc } from "drizzle-orm";
import AddressesClient from "./AddressesClient";

export default async function AddressBookPage() {
  const session = await auth();
  
  if (!session?.user?.id) {
    redirect("/auth/signin");
  }

  const userAddresses = await db
    .select()
    .from(addresses)
    .where(eq(addresses.userId, session.user.id))
    .orderBy(desc(addresses.createdAt));

  return <AddressesClient initialAddresses={userAddresses} />;
}
