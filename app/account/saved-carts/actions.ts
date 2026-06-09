"use server";

import { auth } from "@/lib/auth";
import { db, savedCarts } from "@/lib/db";
import { eq, and } from "drizzle-orm";
import { revalidatePath } from "next/cache";

export async function deleteSavedCart(cartId: string) {
  const session = await auth();
  
  if (!session?.user?.id) {
    return { error: "Unauthorized" };
  }

  try {
    await db.delete(savedCarts).where(
      and(
        eq(savedCarts.id, cartId),
        eq(savedCarts.userId, session.user.id)
      )
    );
    
    revalidatePath("/account/saved-carts");
    return { success: true };
  } catch (err) {
    console.error("Error deleting saved cart", err);
    return { error: "Failed to delete saved cart" };
  }
}

interface CartItemPayload {
  productId: string;
  kind: "material" | "plan";
  name: string;
  unit: string;
  priceKES: number;
  image: string;
  sellerId: string;
  sellerName: string;
  quantity: number;
}

export async function createSavedCart(data: { name: string; items: CartItemPayload[] }) {
  const session = await auth();
  
  if (!session?.user?.id) {
    return { error: "Unauthorized" };
  }

  try {
    const id = `sc-${Date.now()}`;
    await db.insert(savedCarts).values({
      id,
      userId: session.user.id,
      name: data.name,
      items: data.items,
    });
    
    revalidatePath("/account/saved-carts");
    return { success: true, id };
  } catch (err) {
    console.error("Error creating saved cart", err);
    return { error: "Failed to create saved cart" };
  }
}
