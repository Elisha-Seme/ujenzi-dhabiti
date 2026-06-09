"use server";

import { auth } from "@/lib/auth";
import { db, addresses } from "@/lib/db";
import { eq, and } from "drizzle-orm";
import { revalidatePath } from "next/cache";

export async function createAddress(data: {
  label: string;
  fullName: string;
  phone: string;
  address: string;
  city: string;
  county: string;
  isDefault: boolean;
}) {
  const session = await auth();
  if (!session?.user?.id) return { error: "Unauthorized" };

  try {
    if (data.isDefault) {
      await db.update(addresses)
        .set({ isDefault: false })
        .where(eq(addresses.userId, session.user.id));
    }

    const id = `addr-${Date.now()}`;
    await db.insert(addresses).values({
      id,
      userId: session.user.id,
      ...data,
    });

    revalidatePath("/account/addresses");
    return { success: true };
  } catch (err) {
    console.error(err);
    return { error: "Failed to create address" };
  }
}

export async function deleteAddress(id: string) {
  const session = await auth();
  if (!session?.user?.id) return { error: "Unauthorized" };

  try {
    await db.delete(addresses).where(
      and(eq(addresses.id, id), eq(addresses.userId, session.user.id))
    );
    revalidatePath("/account/addresses");
    return { success: true };
  } catch (err) {
    console.error(err);
    return { error: "Failed to delete address" };
  }
}

export async function setDefaultAddress(id: string) {
  const session = await auth();
  if (!session?.user?.id) return { error: "Unauthorized" };

  try {
    await db.update(addresses)
      .set({ isDefault: false })
      .where(eq(addresses.userId, session.user.id));

    await db.update(addresses)
      .set({ isDefault: true })
      .where(and(eq(addresses.id, id), eq(addresses.userId, session.user.id)));

    revalidatePath("/account/addresses");
    return { success: true };
  } catch (err) {
    console.error(err);
    return { error: "Failed to set default address" };
  }
}
