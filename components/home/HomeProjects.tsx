import Link from "next/link";
import { ArrowRight, MapPin } from "lucide-react";
import { db, projects } from "@/lib/db";
import { desc, eq } from "drizzle-orm";
import { PROJECTS } from "@/lib/constants";
import SectionPatches from "@/components/ui/SectionPatches";

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
    <section className="bg-white/60 py-16 md:py-24 relative isolate overflow-hidden">
      <SectionPatches />
      <div className="relative z-10 max-w-content mx-auto px-6">
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-10">
          <div>
            <div className="text-xs font-bold uppercase tracking-[0.25em] text-ud-burgundy mb-3">What We&apos;ve Built</div>
            <h2 className="text-3xl md:text-4xl font-bold text-ud-dark">Projects We&apos;re Proud Of</h2>
          </div>
          <Link href="/what-we-built" className="inline-flex items-center gap-1.5 text-sm font-semibold text-ud-burgundy hover:underline whitespace-nowrap">
            View Projects <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {featured.map((p) => (
            <Link key={p.id} href="/what-we-built" className="group bg-ud-light-gray rounded-[4px] overflow-hidden border border-ud-dark/8 hover:shadow-md transition-shadow">
              <div className="relative h-48 overflow-hidden bg-ud-dark/5">
                {p.image && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={p.image} alt={p.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                )}
                <span className="absolute top-3 left-3 bg-ud-burgundy text-white text-[10px] font-bold uppercase tracking-wide px-2 py-1 rounded-[4px]">{p.category}</span>
              </div>
              <div className="p-5">
                <h3 className="text-base font-bold text-ud-dark leading-snug mb-1.5">{p.title}</h3>
                {p.location && (
                  <p className="flex items-center gap-1.5 text-xs text-ud-dark/50 mb-2">
                    <MapPin className="w-3.5 h-3.5 text-ud-burgundy" /> {p.location}
                  </p>
                )}
                <p className="text-sm text-ud-dark/60 leading-relaxed line-clamp-2">{p.description}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
