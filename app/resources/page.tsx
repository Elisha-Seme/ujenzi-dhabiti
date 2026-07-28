import Link from "next/link";
import { and, desc, eq, ilike, or } from "drizzle-orm";
import { db, resourceArticles } from "@/lib/db";
export const dynamic = "force-dynamic";
export const metadata = { title: "Construction Resources — Ujenzi Dhabiti", description: "Practical Kenyan construction guides and project resources." };
export default async function ResourcesPage({ searchParams }: { searchParams: { q?: string; category?: string } }) {
  const filters = [eq(resourceArticles.published, true)];
  if (searchParams.category) filters.push(eq(resourceArticles.category, searchParams.category));
  if (searchParams.q) filters.push(or(ilike(resourceArticles.title, `%${searchParams.q}%`), ilike(resourceArticles.summary, `%${searchParams.q}%`))!);
  let rows: (typeof resourceArticles.$inferSelect)[] = [];
  try { rows = await db.select().from(resourceArticles).where(and(...filters)).orderBy(desc(resourceArticles.publishedAt)); } catch {}
  return <main className="max-w-content mx-auto px-6 py-20"><h1 className="text-3xl font-bold">Construction Resources</h1>
    <form className="mt-6"><input name="q" defaultValue={searchParams.q} placeholder="Search resources" className="border rounded px-4 py-2 w-full max-w-md" /></form>
    <div className="mt-8 grid md:grid-cols-3 gap-5">{rows.map((a) => <article key={a.id} className="border rounded p-5"><p className="text-xs text-ud-burgundy">{a.category}</p><h2 className="font-bold mt-1"><Link href={`/resources/${a.slug}`}>{a.title}</Link></h2><p className="text-sm text-ud-dark/60 mt-2">{a.summary}</p></article>)}</div>
    {!rows.length && <p className="mt-8 text-sm text-ud-dark/50">No approved resources found.</p>}</main>;
}
