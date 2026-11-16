// Server loader for one service page's package builder: gathers the service,
// its sub-services (with admin labour rates), linked house plans,
// architectural add-ons, materials, related services and delivery zones into
// plain serialisable props.
import { and, asc, eq, inArray } from "drizzle-orm";
import { db, products, services } from "@/lib/db";
import { getAllPlans } from "@/lib/plans-store";
import { PLAN_CATEGORIES } from "@/lib/house-plans";
import { PRODUCTS, type ProductCategory } from "@/lib/products";
import { getPublishedDeliveryZones, type PublishedZone } from "@/lib/delivery-server";
import { isLabourUnit } from "./labour";
import {
  addOnServicesForService,
  architecturalSectionIdsForService,
  areaLabelForService,
  areaModeForService,
  groupSubsections,
  materialCategoriesForService,
  planCategoriesForService,
  planMatchForSection,
  relatedServiceSlugs,
  type AreaMode,
} from "./package-links";
import type { PackageItem } from "./package-math";
import { readSubsections, type SubsectionRow } from "./subsections-read";

type ServiceRow = typeof services.$inferSelect;

export interface ServicePackageData {
  service: Pick<ServiceRow, "id" | "slug" | "title" | "description" | "quoteType" | "image" | "iconName" | "includes" | "materialProductIds">;
  areaMode: AreaMode;
  areaLabel: string;
  subsections: SubsectionRow[];
  items: PackageItem[];
  materialsAreSuggested: boolean;
  related: { slug: string; title: string }[];
  zones: PublishedZone[];
  allServices: { id: string; slug: string; title: string }[];
  /** House plans illustrating each property-type sub-service, keyed by its sectionId. */
  plansBySection: Record<string, { itemId: string; name: string; fromKES: number; href: string }[]>;
}

function labourItem(row: SubsectionRow, group: "work" | "design", opts: { detail?: string; section?: string } = {}): PackageItem {
  const unit = isLabourUnit(row.labourUnit) ? row.labourUnit : null;
  return {
    id: `${group === "work" ? "work" : "arch"}:${row.id}`,
    group,
    label: row.title,
    kind: "labour",
    rateKES: unit && row.labourRateKES !== null ? row.labourRateKES : null,
    unit,
    defaultQty: 1,
    detail: opts.detail,
    section: opts.section,
  };
}

/** A service's own sub-services as work items: a parent with children becomes their heading. */
function workItems(rows: SubsectionRow[], sectionPrefix?: string): PackageItem[] {
  const out: PackageItem[] = [];
  for (const { row, children } of groupSubsections(rows)) {
    if (children.length === 0) {
      out.push(labourItem(row, "work", { section: sectionPrefix }));
    } else {
      const heading = sectionPrefix ? `${sectionPrefix} › ${row.title}` : row.title;
      children.forEach((child) => out.push(labourItem(child, "work", { section: heading })));
    }
  }
  return out;
}

interface MaterialSource {
  id: string;
  name: string;
  category: string;
  priceKES: number;
  unit: string;
  image: string;
  coverageSqmPerUnit?: number;
}

async function loadMaterials(service: ServiceRow): Promise<{ list: MaterialSource[]; suggested: boolean }> {
  const curated = service.materialProductIds;
  const categories = materialCategoriesForService(service.slug);
  if (curated.length === 0 && categories.length === 0) return { list: [], suggested: false };

  const columns = {
    id: products.id, name: products.name, category: products.category, priceKES: products.priceKES,
    unit: products.unit, images: products.images, coverageSqmPerUnit: products.coverageSqmPerUnit,
  };
  const toSource = (row: { id: string; name: string; category: string; priceKES: number; unit: string; images: string[]; coverageSqmPerUnit: number | null }): MaterialSource => ({
    id: row.id, name: row.name, category: row.category, priceKES: row.priceKES, unit: row.unit,
    image: row.images[0] ?? "", coverageSqmPerUnit: row.coverageSqmPerUnit ?? undefined,
  });

  try {
    if (curated.length > 0) {
      const rows = await db.select(columns).from(products).where(and(inArray(products.id, curated), eq(products.isActive, true)));
      rows.sort((a, b) => curated.indexOf(a.id) - curated.indexOf(b.id));
      return { list: rows.map(toSource), suggested: false };
    }
    const rows = await db.select(columns).from(products)
      .where(and(inArray(products.category, categories), eq(products.isActive, true)))
      .orderBy(asc(products.category), asc(products.priceKES));
    return { list: rows.map(toSource), suggested: true };
  } catch (err) {
    console.error("Package materials load failed, using static catalogue:", err);
    const source = curated.length > 0
      ? PRODUCTS.filter((p) => curated.includes(p.id))
      : PRODUCTS.filter((p) => categories.includes(p.category as ProductCategory));
    return {
      list: source.filter((p) => p.inStock).map((p) => ({
        id: p.id, name: p.name, category: p.category, priceKES: p.priceKES, unit: p.unit, image: p.image, coverageSqmPerUnit: p.coverageSqmPerUnit,
      })),
      suggested: curated.length === 0,
    };
  }
}

/** Returns null when the service doesn't exist or isn't published. Throws if services can't be read at all. */
export async function loadServicePackage(slug: string): Promise<ServicePackageData | null> {
  const published = await db.select().from(services).where(eq(services.published, true)).orderBy(asc(services.sortOrder));
  const service = published.find((row) => row.slug === slug);
  if (!service) return null;

  let subsections: SubsectionRow[] = [];
  try {
    subsections = await readSubsections({ serviceSlug: slug });
  } catch (err) {
    console.error("Package subsections load failed:", err);
  }

  const items: PackageItem[] = [];

  // Work items: the service's own sub-services (children grouped under their
  // parent), or one overview item when the service has none.
  if (subsections.length > 0) {
    items.push(...workItems(subsections));
  } else {
    items.push({ id: `work:${service.id}-overview`, group: "work", label: `${service.title} services`, kind: "labour", rateKES: null, unit: null, defaultQty: 1 });
  }

  // Work items from add-on services (e.g. cabro and drainage inside Civil Works),
  // each grouped under that service's name.
  for (const addOnSlug of addOnServicesForService(slug)) {
    const addOn = published.find((row) => row.slug === addOnSlug);
    if (!addOn) continue;
    try {
      items.push(...workItems(await readSubsections({ serviceSlug: addOnSlug }), addOn.title));
    } catch (err) {
      console.error(`Package add-on ${addOnSlug} load failed:`, err);
    }
  }

  // Design: matching house plans, grouped by plan category.
  const plansBySection: ServicePackageData["plansBySection"] = {};
  const planCategories = planCategoriesForService(slug, subsections.map((row) => row.planType));
  if (planCategories.length > 0) {
    try {
      const plans = (await getAllPlans())
        .filter((plan) => planCategories.includes(plan.category))
        .sort((a, b) => PLAN_CATEGORIES.indexOf(a.category) - PLAN_CATEGORIES.indexOf(b.category) || a.priceDigitalKES - b.priceDigitalKES);
      for (const plan of plans) {
        const facts = [plan.category, plan.bedrooms ? `${plan.bedrooms} bed` : null, plan.plinthAreaSqM ? `${plan.plinthAreaSqM} m²` : null].filter(Boolean);
        items.push({
          id: `plan:${plan.id}`, group: "design", label: plan.name, kind: "plan", rateKES: null, unit: null, defaultQty: 1,
          options: { digitalKES: plan.priceDigitalKES, printKES: plan.pricePrintKES },
          detail: facts.join(" · "),
          section: `${plan.category} plans`,
          cart: { productId: plan.id, name: plan.name, unit: "plan", image: plan.image },
          href: `/shop/plans/${plan.id}`,
        });
      }
      // The profile asks for each property type's plans "here as well": match them per sub-service.
      for (const row of subsections) {
        const match = planMatchForSection(row.sectionId);
        if (!match) continue;
        plansBySection[row.sectionId] = plans
          .filter((plan) => plan.category === match.category && (!match.pattern || match.pattern.test(`${plan.name} ${plan.planType}`)))
          .map((plan) => ({ itemId: `plan:${plan.id}`, name: plan.name, fromKES: plan.priceDigitalKES, href: `/shop/plans/${plan.id}` }));
      }
    } catch (err) {
      console.error("Package plans load failed:", err);
    }
  }

  // Design: architectural add-ons (only while the Architectural service is published).
  const archIds = architecturalSectionIdsForService(slug);
  const architecturalPublished = published.some((row) => row.slug === "architectural");
  if (architecturalPublished && (archIds === "all" || archIds.length > 0)) {
    try {
      const archRows = (await readSubsections({ serviceSlug: "architectural" }))
        .filter((row) => archIds === "all" || archIds.includes(row.sectionId));
      archRows.forEach((row) => items.push(labourItem(row, "design", { section: "Architectural services" })));
    } catch (err) {
      console.error("Package architectural add-ons load failed:", err);
    }
  }

  // Materials: curated by admin, else suggested by category.
  const materials = await loadMaterials(service);
  for (const product of materials.list) {
    items.push({
      id: `mat:${product.id}`, group: "materials", label: product.name, kind: "material",
      rateKES: product.priceKES, unit: "each", defaultQty: 1,
      detail: `${product.category} · ${product.unit}`,
      coverageSqmPerUnit: product.coverageSqmPerUnit,
      cart: { productId: product.id, name: product.name, unit: product.unit, image: product.image },
      href: `/shop/${product.id}`,
    });
  }

  if (items.some((item) => item.kind === "material" || item.kind === "plan")) {
    items.push({ id: "delivery", group: "delivery", label: "Delivery", kind: "delivery", rateKES: null, unit: null, defaultQty: 1 });
  }

  const relatedSlugs = relatedServiceSlugs(slug);
  const related = published.filter((row) => relatedSlugs.includes(row.slug)).map((row) => ({ slug: row.slug, title: row.title }));

  return {
    service: {
      id: service.id, slug: service.slug, title: service.title, description: service.description, quoteType: service.quoteType,
      image: service.image, iconName: service.iconName, includes: service.includes, materialProductIds: service.materialProductIds,
    },
    areaMode: areaModeForService(slug),
    areaLabel: areaLabelForService(slug),
    subsections,
    items,
    materialsAreSuggested: materials.suggested,
    related,
    zones: await getPublishedDeliveryZones(),
    allServices: published.map((row) => ({ id: row.id, slug: row.slug, title: row.title })),
    plansBySection,
  };
}
