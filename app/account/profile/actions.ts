"use server";

import { auth } from "@/lib/auth";
import { db, users } from "@/lib/db";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import bcrypt from "bcryptjs";

export async function updateProfile(data: { name: string; phone: string }) {
  const session = await auth();
  
  if (!session?.user?.id) {
    return { error: "Unauthorized" };
  }

  try {
    await db.update(users)
      .set({
        name: data.name,
        phone: data.phone,
        updatedAt: new Date(),
      })
      .where(eq(users.id, session.user.id));
      
    revalidatePath("/account/profile");
    return { success: true };
  } catch (err) {
    console.error("Error updating profile", err);
    return { error: "Failed to update profile" };
  }
}

export async function setPassword(password: string) {
  const session = await auth();
  
  if (!session?.user?.id) {
    return { error: "Unauthorized" };
  }

  if (password.length < 6) {
    return { error: "Password must be at least 6 characters" };
  }

  try {
    const hash = await bcrypt.hash(password, 10);

    await db.update(users)
      .set({
        passwordHash: hash,
        updatedAt: new Date(),
      })
      .where(eq(users.id, session.user.id));
      
    revalidatePath("/account/profile");
    return { success: true };
  } catch (err) {
    console.error("Error setting password", err);
    return { error: "Failed to set password" };
  }
}

export async function deleteAccount() {
  const session = await auth();
  
  if (!session?.user?.id) {
    return { error: "Unauthorized" };
  }

  try {
    // Delete the user from the database. 
    // Related records (sessions, sellers) will cascade.
    // Orders will have buyerId set to null (anonymized).
    await db.delete(users).where(eq(users.id, session.user.id));
    
    // We don't sign out from here since NextAuth signOut needs to happen on the client
    // or via a separate route handler, but we return success so the client can trigger signOut.
    return { success: true };
  } catch (err) {
    console.error("Error deleting account", err);
    return { error: "Failed to delete account" };
  }
}
