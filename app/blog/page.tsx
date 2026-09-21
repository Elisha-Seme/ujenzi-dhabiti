import Link from "next/link";
import { BookOpen, ArrowRight } from "lucide-react";
import { desc, eq } from "drizzle-orm";
import SectionHero from "@/components/ui/SectionHero";
import { blogPosts, db } from "@/lib/db";

export const dynamic = "force-dynamic";

export const metadata = { title: "Resources & Insights — Ujenzi Dhabiti", description: "Construction, materials, planning, and project resources from Ujenzi Dhabiti." };

export default async function BlogPage() {
  let posts: Array<typeof blogPosts.$inferSelect> = [];
  try { posts = await db.select().from(blogPosts).where(eq(blogPosts.published, true)).orderBy(desc(blogPosts.publishedAt), desc(blogPosts.createdAt)); } catch { posts = []; }
  return (
    <>
      <SectionHero title="Resources & Insights" subtitle="Practical guidance for planning, building, and maintaining better spaces." />
      <section className="bg-ud-light-gray py-16 md:py-24 min-h-[40vh]">
        <div className="max-w-content mx-auto px-6">
          {posts.length === 0 ? (
            <div className="max-w-xl mx-auto text-center py-16"><BookOpen className="w-10 h-10 text-ud-burgundy mx-auto mb-5" /><h2 className="text-2xl font-bold text-ud-dark mb-3">Resources are being prepared</h2><p className="text-sm text-ud-dark/60 leading-relaxed">Our team is preparing reviewed construction guides and project resources. Check back soon.</p></div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {posts.map((post) => <article key={post.id} className="bg-white border border-ud-dark/10 rounded-[4px] overflow-hidden flex flex-col">{post.coverImage ? <img src={post.coverImage} alt="" className="w-full h-48 object-cover" /> : <div className="h-48 bg-ud-dark flex items-center justify-center"><BookOpen className="w-10 h-10 text-white/30" /></div>}<div className="p-6 flex flex-col flex-1"><p className="text-[11px] font-bold uppercase tracking-wider text-ud-burgundy mb-2">{post.category}</p><h2 className="text-lg font-bold text-ud-dark mb-3">{post.title}</h2><p className="text-sm text-ud-dark/60 leading-relaxed mb-5">{post.excerpt}</p><Link href={`/blog/${post.slug}`} className="mt-auto inline-flex items-center gap-1.5 text-sm font-semibold text-ud-burgundy hover:underline">Read resource <ArrowRight size={15} /></Link></div></article>)}
            </div>
          )}
        </div>
      </section>
    </>
  );
}
