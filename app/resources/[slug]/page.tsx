import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { and, eq } from "drizzle-orm";
import { db, resourceArticles } from "@/lib/db";
async function getArticle(slug: string) { try { const [a] = await db.select().from(resourceArticles).where(and(eq(resourceArticles.slug, slug), eq(resourceArticles.published, true))); return a; } catch { return undefined; } }
export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const a = await getArticle(params.slug); if (!a) return {};
  return { title: a.seoTitle || a.title, description: a.seoDescription || a.summary, alternates: { canonical: `/resources/${a.slug}` }, openGraph: { title: a.seoTitle || a.title, description: a.seoDescription || a.summary, images: a.coverImage ? [a.coverImage] : [] } };
}
export default async function ArticlePage({ params }: { params: { slug: string } }) {
  const a = await getArticle(params.slug); if (!a) notFound();
  const jsonLd = { "@context": "https://schema.org", "@type": "Article", headline: a.title, description: a.summary, author: { "@type": "Person", name: a.author }, datePublished: a.publishedAt?.toISOString() };
  return <article className="max-w-3xl mx-auto px-6 py-20"><script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} /><p className="text-sm text-ud-burgundy">{a.category}</p><h1 className="text-4xl font-bold mt-2">{a.title}</h1><p className="mt-3 text-ud-dark/55">{a.summary}</p><div className="mt-10 whitespace-pre-wrap leading-7 text-ud-dark/80">{a.body}</div></article>;
}
