import { NextResponse } from "next/server";
import { asc, eq } from "drizzle-orm";
import { db, services } from "@/lib/db";
import { readSubsections } from "@/lib/services/subsections-read";
import { addOnServicesForService, architecturalSectionIdsForService, groupSubsections, materialCategoriesForService, planCategoriesForService } from "@/lib/services/package-links";

export const dynamic = "force-dynamic";

const MAX_DESCRIPTION = 140;

function trimDescription(text: string): string {
  if (text.length <= MAX_DESCRIPTION) return text;
  const cut = text.slice(0, MAX_DESCRIPTION);
  return `${cut.slice(0, cut.lastIndexOf(" ") > 80 ? cut.lastIndexOf(" ") : MAX_DESCRIPTION).trimEnd()}…`;
}

// Header Services menu: published services with all their sub-services, grouped.
export async function GET() {
  try {
    const rows = await db
      .select({ slug: services.slug, title: services.title, iconName: services.iconName, description: services.description, materialProductIds: services.materialProductIds })
      .from(services)
      .where(eq(services.published, true))
      .orderBy(asc(services.sortOrder));

    let subsections: Awaited<ReturnType<typeof readSubsections>> = [];
    try {
      subsections = await readSubsections({ serviceSlugs: rows.map((row) => row.slug) });
    } catch {
      /* menu still works without sub-service previews */
    }

    return NextResponse.json({
      services: rows.map((row) => {
        const own = subsections.filter((sub) => sub.serviceSlug === row.slug);
        const hasPlans = planCategoriesForService(row.slug, own.map((sub) => sub.planType)).length > 0;
        const hasMaterials = row.materialProductIds.length > 0 || materialCategoriesForService(row.slug).length > 0;
        const arch = architecturalSectionIdsForService(row.slug);
        const hasArchitectural = (arch === "all" || arch.length > 0) && rows.some((r) => r.slug === "architectural");
        const addOns = addOnServicesForService(row.slug)
          .map((slug) => rows.find((r) => r.slug === slug)?.title)
          .filter((title): title is string => Boolean(title));
        const packageParts = [
          "Labour",
          ...addOns,
          ...(hasMaterials ? ["Materials"] : []),
          ...(hasPlans ? ["House plans"] : []),
          ...(hasArchitectural ? ["Architectural"] : []),
          ...(hasMaterials || hasPlans ? ["Delivery"] : []),
        ];
        // Every sub-service, children nested under their parent (no cap: the menu scrolls).
        const groups = groupSubsections(own).map(({ row: sub, children }) => ({
          sectionId: sub.sectionId,
          title: sub.title,
          children: children.map((child) => ({ sectionId: child.sectionId, title: child.title })),
        }));
        return {
          slug: row.slug,
          title: row.title,
          iconName: row.iconName,
          description: trimDescription(row.description),
          hasPlans,
          packageParts,
          // Selectable items: a parent with children is a heading, not an item.
          subsectionCount: groups.reduce((sum, group) => sum + (group.children.length || 1), 0),
          groups,
        };
      }),
    });
  } catch {
    return NextResponse.json({ services: [], error: "Service navigation is temporarily unavailable" }, { status: 503 });
  }
}
