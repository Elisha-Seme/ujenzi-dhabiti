import type { MetadataRoute } from "next";
import { eq } from "drizzle-orm";
import { db, resourceArticles, services } from "@/lib/db";
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = process.env.NEXT_PUBLIC_SITE_URL ?? "https://ujenzidhabiti.co.ke";
  const staticPaths = ["", "/shop", "/shop/plans", "/services", "/what-we-built", "/about", "/contact", "/request-a-quote", "/resources", "/estimator"];
  let dynamicPaths: { url: string; lastModified?: Date }[] = [];
  try {
    const [articles, serviceRows] = await Promise.all([
      db.select().from(resourceArticles).where(eq(resourceArticles.published, true)),
      db.select().from(services).where(eq(services.published, true)),
    ]);
    dynamicPaths = [
      ...articles.map((a) => ({ url: `${base}/resources/${a.slug}`, lastModified: a.updatedAt })),
      ...serviceRows.map((s) => ({ url: `${base}/services/${s.slug}`, lastModified: s.updatedAt })),
    ];
  } catch {}
  return [...staticPaths.map((path) => ({ url: `${base}${path}`, lastModified: new Date() })), ...dynamicPaths];
}
