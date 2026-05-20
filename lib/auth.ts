import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { db, users, verificationTokens } from "@/lib/db";
import { eq } from "drizzle-orm";
import bcrypt from "bcryptjs";

export const { handlers, signIn, signOut, auth } = NextAuth({
  session: { strategy: "jwt" },
  pages: {
    signIn: "/auth/signin",
    error: "/auth/error",
    verifyRequest: "/auth/verify",
  },
  providers: [
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
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = (user as { role?: string }).role;
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
