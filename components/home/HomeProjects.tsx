import Link from "next/link";
import { ArrowRight, MapPin } from "lucide-react";
import { db, projects } from "@/lib/db";
import { desc, eq } from "drizzle-orm";
import { PROJECTS } from "@/lib/constants";

export const dynamic = "force-dynamic";

interface Card {
  id: string;
  title: string;
  location: string | null;
  category: string;
  description: string;
  image: string | null;
}

// Admin-managed featured projects (falls back to the static showcase if none yet).
async function loadProjects(): Promise<Card[]> {
  try {
    const rows = await db
      .select()
      .from(projects)
      .where(eq(projects.published, true))
      .orderBy(desc(projects.featured), desc(projects.sortOrder), desc(projects.createdAt))
      .limit(3);
    if (rows.length) {
      return rows.map((r) => ({
        id: r.id,
        title: r.title,
        location: r.location,
        category: r.category,
        description: r.description,
        image: r.afterImage ?? r.coverImage,
      }));
    }
  } catch {
    /* fall through to static */
  }
  return PROJECTS.slice(0, 3).map((p) => ({
    id: String(p.id),
    title: p.name,
    location: p.location,
    category: p.category,
    description: p.description,
    image: p.image,
  }));
}

export default async function HomeProjects() {
  const featured = await loadProjects();

  return (
    <section className="py-16 md:py-24">
      <div className="max-w-content mx-auto px-6">
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-10">
          <div>
            <div className="text-xs font-bold uppercase tracking-[0.25em] text-ud-burgundy mb-3">What We&apos;ve Built</div>
            <h2 className="text-3xl md:text-4xl font-bold text-white">Projects We&apos;re Proud Of</h2>
          </div>
          <Link href="/what-we-built" className="inline-flex items-center gap-1.5 text-sm font-semibold text-ud-burgundy hover:underline whitespace-nowrap">
            View Projects <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {featured.map((p, i) => {
            const variant = i % 3;
            const cardCls =
              variant === 1
                ? "group relative overflow-hidden rounded-[4px] border border-ud-burgundy/30 bg-ud-burgundy/[0.10] hover:-translate-y-1 hover:border-ud-burgundy/55 transition-all"
                : variant === 2
                ? "group relative overflow-hidden rounded-[4px] border border-white/15 border-t-2 border-t-ud-burgundy/60 bg-white/[0.06] hover:-translate-y-1 hover:border-white/25 transition-all"
                : "group relative overflow-hidden rounded-[4px] border border-white/10 bg-white/[0.04] hover:-translate-y-1 hover:bg-white/[0.07] transition-all";
            return (
              <Link key={p.id} href="/what-we-built" className={cardCls}>
                <div className="relative h-48 overflow-hidden">
                  {p.image && (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={p.image} alt={p.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  )}
                  {/* Dark tint so text badge stays readable */}
                  <div className="absolute inset-0 bg-ud-dark/30" />
                  <span className="absolute top-3 left-3 bg-ud-burgundy text-white text-[10px] font-bold uppercase tracking-wide px-2 py-1 rounded-[4px]">{p.category}</span>
                  {/* Reddish bottom-left glow on accent variant */}
                  {variant === 1 && (
                    <div aria-hidden className="absolute -bottom-4 -left-4 w-20 h-20 rounded-full bg-ud-burgundy/40 blur-2xl pointer-events-none" />
                  )}
                </div>
                <div className="p-5">
                  <h3 className="text-base font-bold text-white leading-snug mb-1.5">{p.title}</h3>
                  {p.location && (
                    <p className="flex items-center gap-1.5 text-xs text-white/50 mb-2">
                      <MapPin className="w-3.5 h-3.5 text-ud-burgundy" /> {p.location}
                    </p>
                  )}
                  <p className="text-sm text-white/55 leading-relaxed line-clamp-2">{p.description}</p>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
