import type { MetadataRoute } from "next";
import { eq } from "drizzle-orm";
import { db, blogPosts, services } from "@/lib/db";

// Rebuilt per request so newly published services and posts appear without a redeploy.
export const dynamic = "force-dynamic";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = process.env.NEXT_PUBLIC_SITE_URL ?? "https://ujenzidhabiti.co.ke";
  const staticPaths = ["", "/shop", "/shop/plans", "/services", "/what-we-built", "/about", "/contact", "/request-a-quote", "/help", "/blog", "/estimator"];
  let dynamicPaths: { url: string; lastModified?: Date }[] = [];
  try {
    const [posts, serviceRows] = await Promise.all([
      db.select().from(blogPosts).where(eq(blogPosts.published, true)),
      db.select().from(services).where(eq(services.published, true)),
    ]);
    dynamicPaths = [
      ...posts.map((p) => ({ url: `${base}/blog/${p.slug}`, lastModified: p.updatedAt })),
      ...serviceRows.map((s) => ({ url: `${base}/services/${s.slug}`, lastModified: s.updatedAt })),
    ];
  } catch {
    // Database unavailable: still serve the static routes.
  }
  return [...staticPaths.map((path) => ({ url: `${base}${path}`, lastModified: new Date() })), ...dynamicPaths];
}
