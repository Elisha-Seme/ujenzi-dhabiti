import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import Google from "next-auth/providers/google";
import { db, users, verificationTokens } from "@/lib/db";
import { eq } from "drizzle-orm";
import bcrypt from "bcryptjs";

const googleEnabled = !!(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET);

export const { handlers, signIn, signOut, auth } = NextAuth({
  // Trust the deployment host (we run behind a reverse proxy at ujenzidhabiti.co.ke).
  // Without this, Auth.js v5 rejects /api/auth/* with "UntrustedHost" in production.
  trustHost: true,
  session: { strategy: "jwt" },
  pages: {
    signIn: "/auth/signin",
    error: "/auth/error",
    verifyRequest: "/auth/verify",
  },
  providers: [
    ...(googleEnabled
      ? [
          Google({
            clientId: process.env.GOOGLE_CLIENT_ID!,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
          }),
        ]
      : []),
    // ─── Email + password ──────────────────────────────────────
    Credentials({
      id: "credentials",
      name: "Email & Password",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;

        const [user] = await db
          .select()
          .from(users)
          .where(eq(users.email, credentials.email as string))
          .limit(1);

        if (!user || !user.passwordHash) return null;

        const valid = await bcrypt.compare(
          credentials.password as string,
          user.passwordHash
        );
        if (!valid) return null;

        return {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
        };
      },
    }),

    // ─── Magic link (token-based, sent via Resend) ─────────────
    Credentials({
      id: "magic-link",
      name: "Magic Link",
      credentials: {
        token: { label: "Token", type: "text" },
      },
      async authorize(credentials) {
        if (!credentials?.token) return null;

        const [record] = await db
          .select()
          .from(verificationTokens)
          .where(eq(verificationTokens.token, credentials.token as string))
          .limit(1);

        if (!record) return null;
        if (record.expiresAt < new Date()) {
          // Token expired — clean it up
          await db
            .delete(verificationTokens)
            .where(eq(verificationTokens.token, credentials.token as string));
          return null;
        }

        const [user] = await db
          .select()
          .from(users)
          .where(eq(users.email, record.email))
          .limit(1);

        if (!user) return null;

        // Mark email as verified and delete the used token
        await db.delete(verificationTokens).where(eq(verificationTokens.token, credentials.token as string));

        return {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
        };
      },
    }),
  ],
  callbacks: {
    async signIn({ user, account }) {
      if (account?.provider !== "google") return true;
      if (!user.email) return false;

      const email = user.email.trim().toLowerCase();
      const [existing] = await db.select().from(users).where(eq(users.email, email)).limit(1);
      if (existing) {
        user.id = existing.id;
        user.name = existing.name;
        user.role = existing.role;
        return true;
      }

      const [created] = await db
        .insert(users)
        .values({
          id: `usr-${crypto.randomUUID().slice(0, 8)}`,
          name: user.name?.trim() || email.split("@")[0],
          email,
          passwordHash: null,
          role: "buyer",
          emailVerified: true,
        })
        .returning();
      user.id = created.id;
      user.role = created.role;
      return true;
    },
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = (user as { role?: string }).role ?? "buyer";
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id as string;
        session.user.role = token.role as string;
      }
      return session;
    },
  },
});

// Extend NextAuth types
declare module "next-auth" {
  interface User {
    role?: string;
  }
  interface Session {
    user: {
      id: string;
      name?: string | null;
      email?: string | null;
      role?: string;
    };
  }
}
