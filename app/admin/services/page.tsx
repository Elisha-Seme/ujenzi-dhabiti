"use client";

import ResourceManager, { FieldDef } from "@/components/admin/ResourceManager";

const FIELDS: FieldDef[] = [
  { name: "slug", label: "Url Slug", type: "text", required: true, help: "e.g. gypsum-ceilings, building-works (lowercase, no spaces)" },
  { name: "title", label: "Service Title", type: "text", required: true },
  { name: "description", label: "Description Blurb", type: "textarea", required: true },
  { name: "iconName", label: "Icon Name", type: "text", required: true, default: "Layout", help: "Lucide icon name (e.g. Layout, PaintBucket, Grid, Hammer, Pipette, HardHat, Wrench, PencilRuler)" },
  { name: "image", label: "Cover Image", type: "image", required: true, help: "Upload cover photo or paste image URL." },
  { name: "quoteType", label: "Quote Type Label", type: "text", required: true, help: "Label for pre-filling quote requests, e.g. Plumbing & Drainage" },
  { name: "includes", label: "Scope / Includes", type: "tags", help: "Comma-separated items included in the service scope." },
  { name: "materials", label: "Key Materials", type: "tags", help: "Comma-separated list of materials used." },
  { name: "sortOrder", label: "Sort Order", type: "number", default: 0, help: "Higher or lower numbers specify sorting sequence." },
  { name: "published", label: "Published (visible on site)", type: "checkbox", default: true },
];

export default function AdminServicesPage() {
  return (
    <ResourceManager
      title="Services Catalog"
      subtitle="Manage main service categories, descriptions, scopes, and key materials."
      endpoint="/api/admin/services"
      fields={FIELDS}
      columns={["title", "slug", "published", "sortOrder"]}
      viewHref="/services"
    />
  );
}
