import Link from "next/link";
import { HardHat, MapPin } from "lucide-react";
import { db, projects } from "@/lib/db";
import { eq, desc } from "drizzle-orm";
import SectionHero from "@/components/ui/SectionHero";
import BeforeAfter from "@/components/ui/BeforeAfter";
import CTABanner from "@/components/sections/CTABanner";
import { PRODUCT_CATEGORIES } from "@/lib/products";

export const metadata = {
  title: "What We've Built — Ujenzi Dhabiti",
  description: "A showcase of completed building, civil, and interior projects by Ujenzi Dhabiti.",
};

export const dynamic = "force-dynamic";

async function loadProjects() {
  try {
    return await db
      .select()
      .from(projects)
      .where(eq(projects.published, true))
      .orderBy(desc(projects.sortOrder), desc(projects.createdAt));
  } catch {
    return [];
  }
}

export default async function WhatWeBuiltPage({
  searchParams,
}: {
  searchParams?: { category?: string; country?: string; year?: string };
}) {
  const rows = await loadProjects();
  const categories = Array.from(new Set(rows.map((p) => p.category))).sort();
  const countries = Array.from(new Set(rows.map((p) => p.country).filter(Boolean))).sort();
  const years = Array.from(
    new Set(rows.map((p) => p.completionDate?.slice(0, 4)).filter((v): v is string => !!v))
  ).sort().reverse();
  const filteredRows = rows.filter((p) => {
    if (searchParams?.category && p.category !== searchParams.category) return false;
    if (searchParams?.country && p.country !== searchParams.country) return false;
    if (searchParams?.year && p.completionDate?.slice(0, 4) !== searchParams.year) return false;
    return true;
  });

  return (
    <>
      <SectionHero
        title="What We've Built"
        subtitle="A growing portfolio of the homes, developments, and infrastructure we've delivered across Kenya."
      />

      {rows.length === 0 ? (
        <section className="bg-ud-white py-24 md:py-32">
          <div className="max-w-content mx-auto px-6 text-center">
            <div className="w-16 h-16 rounded-[4px] bg-ud-burgundy/10 flex items-center justify-center mx-auto mb-6">
              <HardHat className="w-7 h-7 text-ud-burgundy" strokeWidth={1.5} />
            </div>
            <h2 className="text-2xl md:text-3xl font-bold text-ud-dark mb-3">Project Showcase Coming Soon</h2>
            <p className="text-ud-dark/60 font-light leading-relaxed max-w-xl mx-auto mb-8">
              We&apos;re assembling photos and details from our completed projects — bungalows, townhouses, commercial developments, roads, and interiors. Check back shortly, or reach out to request our project portfolio directly.
            </p>
            <Link href="/contact" className="inline-block bg-ud-burgundy text-white text-sm font-bold px-6 py-3 rounded-[4px] hover:bg-ud-burgundy-hover transition-colors">
              Request Our Portfolio
            </Link>
          </div>
        </section>
      ) : (
        <section className="bg-ud-white py-20 md:py-28">
          <div className="max-w-content mx-auto px-6">
            <form className="grid sm:grid-cols-3 lg:grid-cols-[1fr_1fr_1fr_auto] gap-3 bg-ud-light-gray border border-ud-dark/8 rounded-[4px] p-4 mb-8">
              <select name="category" defaultValue={searchParams?.category ?? ""} className="bg-white border border-ud-dark/15 rounded-[4px] px-3 py-2.5 text-sm">
                <option value="">All project types</option>
                {categories.map((value) => <option key={value} value={value}>{value}</option>)}
              </select>
              <select name="country" defaultValue={searchParams?.country ?? ""} className="bg-white border border-ud-dark/15 rounded-[4px] px-3 py-2.5 text-sm">
                <option value="">All countries</option>
                {countries.map((value) => <option key={value} value={value}>{value}</option>)}
              </select>
              <select name="year" defaultValue={searchParams?.year ?? ""} className="bg-white border border-ud-dark/15 rounded-[4px] px-3 py-2.5 text-sm">
                <option value="">All years</option>
                {years.map((value) => <option key={value} value={value}>{value}</option>)}
              </select>
              <button className="bg-ud-burgundy text-white text-sm font-bold px-5 py-2.5 rounded-[4px] hover:bg-ud-burgundy-hover">Apply filters</button>
            </form>
            {(searchParams?.category || searchParams?.country || searchParams?.year) && (
              <div className="mb-6 flex items-center justify-between gap-4">
                <p className="text-sm text-ud-dark/55">{filteredRows.length} matching project{filteredRows.length === 1 ? "" : "s"}</p>
                <Link href="/what-we-built" className="text-sm font-semibold text-ud-burgundy hover:underline">Clear filters</Link>
              </div>
            )}
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
              {filteredRows.map((p) => (
                <article key={p.id} className="group rounded-[4px] overflow-hidden shadow-sm hover:shadow-lg transition-shadow border border-ud-dark/8 bg-white flex flex-col">
                  <Link href={`/what-we-built/${p.id}`} className="block">
                    <div className="relative h-52 bg-ud-dark/5 overflow-hidden">
                      {p.beforeImage && p.afterImage ? (
                        <BeforeAfter before={p.beforeImage} after={p.afterImage} alt={p.title} />
                      ) : p.coverImage ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={p.coverImage} alt={p.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-ud-dark/20">
                          <HardHat className="w-10 h-10" />
                        </div>
                      )}
                      {!(p.beforeImage && p.afterImage) && (
                        <span className="absolute top-3 left-3 bg-ud-burgundy text-white text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-[4px]">
                          {p.category}
                        </span>
                      )}
                    </div>
                  </Link>
                  <div className="p-6 flex flex-col flex-1">
                    <Link href={`/what-we-built/${p.id}`} className="group/title">
                      <h3 className="text-base font-bold text-ud-dark mb-1.5 group-hover/title:text-ud-burgundy transition-colors">{p.title}</h3>
                    </Link>
                    {p.location && (
                      <p className="flex items-center gap-1.5 text-xs text-ud-dark/50 mb-3">
                        <MapPin size={13} className="text-ud-burgundy" /> {p.location}
                        {p.propertyType ? ` · ${p.propertyType}` : ""}
                      </p>
                    )}
                    <p className="text-sm text-ud-dark/60 font-light leading-relaxed line-clamp-4">{p.description}</p>
                    {p.materialsUsed.length > 0 && (
                      <div className="mt-4 pt-4 border-t border-ud-dark/8">
                        <p className="text-[10px] font-bold uppercase tracking-wider text-ud-dark/40 mb-2">Materials Used</p>
                        <div className="flex flex-wrap gap-1.5">
                          {p.materialsUsed.map((m) => {
                            const matchedCat = (PRODUCT_CATEGORIES as string[]).find((c) =>
                              m.toLowerCase().includes(c.toLowerCase().split(" ")[0])
                            );
                            const href = matchedCat
                              ? `/shop/category/${matchedCat.toLowerCase().replace(/\s+&\s+/g, "-").replace(/\s+/g, "-")}`
                              : `/shop?search=${encodeURIComponent(m)}`;
                            return (
                              <Link
                                key={m}
                                href={href}
                                className="text-[11px] bg-ud-light-gray text-ud-dark/70 hover:bg-ud-burgundy hover:text-white px-2 py-0.5 rounded-[4px] transition-colors"
                              >
                                {m}
                              </Link>
                            );
                          })}
                        </div>
                      </div>
                    )}
                    <div className="mt-auto pt-4">
                      <Link href={`/what-we-built/${p.id}`} className="text-xs font-bold text-ud-burgundy hover:underline">
                        View Project →
                      </Link>
                    </div>
                  </div>
                </article>
              ))}
            </div>
            {filteredRows.length === 0 && (
              <div className="text-center py-16">
                <p className="text-ud-dark/50">No projects match those filters.</p>
                <Link href="/what-we-built" className="inline-block mt-3 text-sm font-semibold text-ud-burgundy hover:underline">View all projects</Link>
              </div>
            )}
          </div>
        </section>
      )}

      <CTABanner />
    </>
  );
}
