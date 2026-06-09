import Link from "next/link";
import { notFound } from "next/navigation";
import { MapPin, ArrowLeft, ShoppingCart, FileText } from "lucide-react";
import { db, projects } from "@/lib/db";
import { eq } from "drizzle-orm";
import BeforeAfter from "@/components/ui/BeforeAfter";
import CTABanner from "@/components/sections/CTABanner";
import { PROJECTS, whatsappLink } from "@/lib/constants";
import { PRODUCT_CATEGORIES } from "@/lib/products";

export const dynamic = "force-dynamic";

// ─── Types ────────────────────────────────────────────────────────────────────

interface ProjectDetail {
  id: string;
  title: string;
  location: string | null;
  category: string;
  propertyType: string | null;
  description: string;
  scope: string | null;
  coverImage: string | null;
  beforeImage: string | null;
  afterImage: string | null;
  images: string[];
  materialsUsed: string[];
}

// ─── Data loading ─────────────────────────────────────────────────────────────

async function loadProject(id: string): Promise<ProjectDetail | null> {
  // Try DB first
  try {
    const rows = await db.select().from(projects).where(eq(projects.id, id)).limit(1);
    if (rows.length) {
      const r = rows[0];
      return {
        id: r.id,
        title: r.title,
        location: r.location,
        category: r.category,
        propertyType: r.propertyType,
        description: r.description,
        scope: r.scope,
        coverImage: r.coverImage,
        beforeImage: r.beforeImage,
        afterImage: r.afterImage,
        images: r.images,
        materialsUsed: r.materialsUsed,
      };
    }
  } catch { /* fall through */ }

  // Static fallback (for demo / development)
  const staticId = parseInt(id, 10);
  const s = PROJECTS.find((p) => p.id === staticId);
  if (!s) return null;
  return {
    id: String(s.id),
    title: s.name,
    location: s.location,
    category: s.category,
    propertyType: null,
    description: s.description,
    scope: null,
    coverImage: s.image,
    beforeImage: null,
    afterImage: null,
    images: [],
    materialsUsed: [],
  };
}

// Map project categories to shop categories for "Order Similar Materials"
const CATEGORY_TO_SHOP: Record<string, string> = {
  Roads: "Cabro & Road Works",
  Buildings: "Structural Materials",
  Water: "Plumbing",
  Transport: "Cabro & Road Works",
  Interior: "Gypsum & Ceilings",
  Building: "Structural Materials",
  Civil: "Cabro & Road Works",
  Architectural: "Structural Materials",
};

// ─── Page ─────────────────────────────────────────────────────────────────────

export default async function ProjectDetailPage({ params }: { params: { id: string } }) {
  const project = await loadProject(params.id);
  if (!project) notFound();

  const shopCategory = CATEGORY_TO_SHOP[project.category] ?? "Structural Materials";
  const hasBeforeAfter = !!(project.beforeImage && project.afterImage);
  const heroImage = project.afterImage ?? project.coverImage ?? project.images[0];

  const waMessage = `Hello Ujenzi Dhabiti, I'd like to order materials for a project similar to: ${project.title}.`;

  return (
    <>
      {/* ─── Back nav ─── */}
      <div className="bg-ud-dark pt-24 pb-6">
        <div className="max-w-content mx-auto px-6">
          <Link
            href="/what-we-built"
            className="inline-flex items-center gap-1.5 text-sm text-white/60 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-4 h-4" /> All Projects
          </Link>
        </div>
      </div>

      {/* ─── Hero ─── */}
      <section className="bg-ud-dark pb-12">
        <div className="max-w-content mx-auto px-6">
          {/* Category + property type badges */}
          <div className="flex flex-wrap gap-2 mb-4">
            <span className="text-[11px] font-bold uppercase tracking-wider bg-ud-burgundy text-white px-2.5 py-1 rounded-[4px]">
              {project.category}
            </span>
            {project.propertyType && (
              <span className="text-[11px] font-bold uppercase tracking-wider border border-white/25 text-white/70 px-2.5 py-1 rounded-[4px]">
                {project.propertyType}
              </span>
            )}
          </div>

          <h1 className="text-3xl md:text-4xl font-bold text-white mb-3 leading-tight">{project.title}</h1>

          {project.location && (
            <p className="flex items-center gap-1.5 text-sm text-white/55 mb-6">
              <MapPin className="w-4 h-4 text-ud-burgundy" /> {project.location}
            </p>
          )}

          {/* Before / after or single image */}
          <div className="rounded-[4px] overflow-hidden">
            {hasBeforeAfter ? (
              <div className="h-[420px] md:h-[520px]">
                <BeforeAfter
                  before={project.beforeImage!}
                  after={project.afterImage!}
                  alt={project.title}
                />
              </div>
            ) : heroImage ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={heroImage}
                alt={project.title}
                className="w-full h-[360px] md:h-[480px] object-cover"
              />
            ) : null}
          </div>

          {/* Extra images */}
          {project.images.length > 1 && (
            <div className="flex gap-3 mt-3 overflow-x-auto pb-1">
              {project.images.slice(1).map((img, i) => (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  key={i}
                  src={img}
                  alt={`${project.title} ${i + 2}`}
                  className="flex-shrink-0 w-24 h-20 object-cover rounded-[4px] border border-white/15"
                />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ─── Detail body ─── */}
      <section className="bg-ud-white py-16 md:py-24">
        <div className="max-w-content mx-auto px-6">
          <div className="grid lg:grid-cols-3 gap-10">
            {/* Main content */}
            <div className="lg:col-span-2 space-y-10">
              {/* Description */}
              <div>
                <h2 className="text-xl font-bold text-ud-dark mb-3">About This Project</h2>
                <p className="text-ud-dark/70 font-light leading-relaxed">{project.description}</p>
              </div>

              {/* Scope of work */}
              {project.scope && (
                <div>
                  <h2 className="text-xl font-bold text-ud-dark mb-3">Scope of Work</h2>
                  <div className="prose prose-sm text-ud-dark/70 max-w-none whitespace-pre-line leading-relaxed">
                    {project.scope}
                  </div>
                </div>
              )}

              {/* Materials used */}
              {project.materialsUsed.length > 0 && (
                <div>
                  <h2 className="text-xl font-bold text-ud-dark mb-4">Materials Used</h2>
                  <div className="flex flex-wrap gap-2 mb-5">
                    {project.materialsUsed.map((m) => {
                      // Try to find a matching shop category for this material tag
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
                          className="text-sm bg-ud-light-gray text-ud-dark/70 hover:bg-ud-burgundy hover:text-white px-3 py-1.5 rounded-[4px] transition-colors font-semibold"
                        >
                          {m}
                        </Link>
                      );
                    })}
                  </div>
                  <p className="text-xs text-ud-dark/40">Click a material to shop it →</p>
                </div>
              )}
            </div>

            {/* Sidebar — "Order Similar Materials" CTA */}
            <aside className="space-y-4">
              <div className="bg-ud-dark rounded-[4px] p-6">
                <h3 className="text-base font-bold text-white mb-2">Want a similar build?</h3>
                <p className="text-sm text-white/60 leading-relaxed mb-5">
                  We can source the materials and provide the labour — get a tailored quote for your project.
                </p>
                <Link
                  href={`/request-a-quote?projectType=${encodeURIComponent("Building Works — Residential")}`}
                  className="block w-full text-center bg-ud-burgundy text-white text-sm font-bold px-4 py-3 rounded-[4px] hover:bg-ud-burgundy-hover transition-colors mb-3"
                >
                  <FileText className="inline w-4 h-4 mr-1.5" />
                  Request a Quote
                </Link>
                <a
                  href={whatsappLink(waMessage)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block w-full text-center border border-[#25D366] text-[#1c8c44] text-sm font-bold px-4 py-3 rounded-[4px] hover:bg-[#25D366] hover:text-white transition-colors"
                >
                  WhatsApp Us
                </a>
              </div>

              {/* Order Similar Materials */}
              <div className="border border-ud-burgundy/20 rounded-[4px] p-6 bg-ud-burgundy/[0.04]">
                <h3 className="text-base font-bold text-ud-dark mb-2">Order Similar Materials</h3>
                <p className="text-sm text-ud-dark/60 leading-relaxed mb-4">
                  Browse the same category of materials used in this project and order online.
                </p>
                <Link
                  href={`/shop/category/${shopCategory.toLowerCase().replace(/\s+&\s+/g, "-").replace(/\s+/g, "-")}`}
                  className="block w-full text-center bg-ud-burgundy text-white text-sm font-bold px-4 py-3 rounded-[4px] hover:bg-ud-burgundy-hover transition-colors"
                >
                  <ShoppingCart className="inline w-4 h-4 mr-1.5" />
                  Shop {shopCategory}
                </Link>
              </div>

              {/* Project info card */}
              <div className="bg-ud-light-gray rounded-[4px] p-5 space-y-3 text-sm">
                {project.location && (
                  <div className="flex items-start gap-2">
                    <MapPin className="w-4 h-4 text-ud-burgundy mt-0.5 flex-shrink-0" />
                    <span className="text-ud-dark/70">{project.location}</span>
                  </div>
                )}
                <div className="flex items-start gap-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-ud-dark/40 mt-0.5">Type</span>
                  <span className="text-ud-dark/70">{project.category}{project.propertyType ? ` — ${project.propertyType}` : ""}</span>
                </div>
                {project.materialsUsed.length > 0 && (
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-ud-dark/40 block mb-1">Key Materials</span>
                    <span className="text-ud-dark/70">{project.materialsUsed.slice(0, 3).join(", ")}{project.materialsUsed.length > 3 ? ` +${project.materialsUsed.length - 3} more` : ""}</span>
                  </div>
                )}
              </div>
            </aside>
          </div>
        </div>
      </section>

      <CTABanner />
    </>
  );
}
