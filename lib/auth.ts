import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import Google from "next-auth/providers/google";
import type { Provider } from "next-auth/providers";
import { db, users, verificationTokens } from "@/lib/db";
import { eq } from "drizzle-orm";
import bcrypt from "bcryptjs";
import { randomUUID } from "crypto";

const providers: Provider[] = [
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
        .where(eq(users.email, String(credentials.email).trim().toLowerCase()))
        .limit(1);

      if (!user || !user.passwordHash) return null;

      const valid = await bcrypt.compare(String(credentials.password), user.passwordHash);
      if (!valid) return null;

      return {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      };
    },
  }),
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
        .where(eq(verificationTokens.token, String(credentials.token)))
        .limit(1);

      if (!record) return null;
      if (record.expiresAt < new Date()) {
        await db.delete(verificationTokens).where(eq(verificationTokens.token, record.token));
        return null;
      }

      const [user] = await db
        .select()
        .from(users)
        .where(eq(users.email, record.email))
        .limit(1);

      if (!user) return null;

      await db
        .update(users)
        .set({ emailVerified: true, updatedAt: new Date() })
        .where(eq(users.id, user.id));
      await db.delete(verificationTokens).where(eq(verificationTokens.token, record.token));

      return {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      };
    },
  }),
];

if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) {
  providers.push(
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    })
  );
}

export const { handlers, signIn, signOut, auth } = NextAuth({
  trustHost: true,
  session: { strategy: "jwt" },
  pages: {
    signIn: "/auth/signin",
    error: "/auth/error",
    verifyRequest: "/auth/verify",
  },
  providers,
  callbacks: {
    async signIn({ user, account }) {
      if (account?.provider !== "google" || !user.email) return true;

      const email = user.email.trim().toLowerCase();
      const [existing] = await db.select().from(users).where(eq(users.email, email)).limit(1);
      if (existing) {
        user.id = existing.id;
        user.role = existing.role;
        await db
          .update(users)
          .set({ emailVerified: true, updatedAt: new Date() })
          .where(eq(users.id, existing.id));
        return true;
      }

      const id = `usr-${randomUUID().slice(0, 8)}`;
      await db.insert(users).values({
        id,
        name: user.name || email.split("@")[0],
        email,
        passwordHash: null,
        phone: null,
        role: "buyer",
        emailVerified: true,
      });
      user.id = id;
      user.role = "buyer";
      return true;
    },
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
