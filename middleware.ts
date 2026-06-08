import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function middleware(req: NextRequest) {
  const path = req.nextUrl.pathname;
  const token = await getToken({
    req,
    secret: process.env.NEXTAUTH_SECRET,
  });

  if (!token) {
    if (path.startsWith("/admin") || path.startsWith("/account")) {
      return NextResponse.redirect(
        new URL(`/auth/signin?callbackUrl=${encodeURIComponent(path)}`, req.nextUrl)
      );
    }
    return NextResponse.next();
  }

  const role = token.role;

  if (path.startsWith("/admin") && role !== "admin") {
    return NextResponse.redirect(new URL("/", req.nextUrl));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/account/:path*"],
};
