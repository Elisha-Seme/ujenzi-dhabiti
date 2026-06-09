import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { db, users } from "@/lib/db";
import { eq } from "drizzle-orm";
import ProfileForm from "./ProfileForm";

export default async function AccountProfilePage() {
  const session = await auth();
  
  if (!session?.user?.id) {
    redirect("/auth/signin");
  }

  // Fetch latest user data from DB
  const userRows = await db
    .select({ name: users.name, email: users.email, phone: users.phone, passwordHash: users.passwordHash })
    .from(users)
    .where(eq(users.id, session.user.id))
    .limit(1);

  if (!userRows.length) {
    // If not in DB, fallback to session data or redirect
    redirect("/auth/signin");
  }

  const user = userRows[0];

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-ud-dark">My Profile</h1>
        <p className="text-sm text-ud-dark/50 mt-1">Manage your personal information and security settings.</p>
      </div>

      <ProfileForm user={{ name: user.name, email: user.email, phone: user.phone }} hasPassword={!!user.passwordHash} />
    </div>
  );
}
