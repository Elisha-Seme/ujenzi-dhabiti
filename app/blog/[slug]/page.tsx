import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { and, eq } from "drizzle-orm";
import { blogPosts, db } from "@/lib/db";

export const dynamic = "force-dynamic";

async function loadPost(slug: string) {
  try {
    const [post] = await db.select().from(blogPosts).where(and(eq(blogPosts.slug, slug), eq(blogPosts.published, true))).limit(1);
    return post ?? null;
  } catch { return null; }
}

export async function generateMetadata({ params }: { params: { slug: string } }) {
  const post = await loadPost(params.slug);
  return post ? { title: `${post.title} — Ujenzi Dhabiti`, description: post.excerpt } : { title: "Resource not found — Ujenzi Dhabiti" };
}

export default async function BlogPostPage({ params }: { params: { slug: string } }) {
  const post = await loadPost(params.slug);
  if (!post) notFound();
  return (
    <article className="bg-ud-light-gray min-h-screen pt-28 pb-20">
      <div className="max-w-3xl mx-auto px-6">
        <Link href="/blog" className="inline-flex items-center gap-1.5 text-sm text-ud-dark/55 hover:text-ud-burgundy mb-8"><ArrowLeft size={15} /> All resources</Link>
        {post.coverImage && <img src={post.coverImage} alt="" className="w-full h-64 md:h-96 object-cover rounded-[4px] mb-8" />}
        <p className="text-xs font-bold uppercase tracking-wider text-ud-burgundy mb-3">{post.category}</p>
        <h1 className="text-3xl md:text-5xl font-bold text-ud-dark leading-tight mb-4">{post.title}</h1>
        <p className="text-lg text-ud-dark/60 leading-relaxed mb-8">{post.excerpt}</p>
        <div className="flex items-center gap-2 text-xs text-ud-dark/45 border-b border-ud-dark/10 pb-6 mb-8">By {post.author}{post.publishedAt ? ` · ${new Date(post.publishedAt).toLocaleDateString("en-KE", { dateStyle: "long" })}` : ""}</div>
        <div className="space-y-5 text-ud-dark/75 leading-relaxed whitespace-pre-line">{post.body}</div>
      </div>
    </article>
  );
}
