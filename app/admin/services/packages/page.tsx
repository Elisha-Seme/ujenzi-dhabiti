"use client";

import ResourceManager, { FieldDef } from "@/components/admin/ResourceManager";

const FIELDS: FieldDef[] = [
  { name: "serviceSlug", label: "Service Slug", type: "text", required: true },
  { name: "subsectionId", label: "Subsection Database ID", type: "text" },
  { name: "title", label: "Package Title", type: "text", required: true },
  { name: "description", label: "Description", type: "textarea" },
  { name: "productIds", label: "Product IDs", type: "tags", help: "Choose approved product IDs from the materials catalogue." },
  { name: "quantityGuidance", label: "Quantity Guidance", type: "textarea" },
  { name: "published", label: "Published", type: "checkbox", default: true },
  { name: "sortOrder", label: "Sort Order", type: "number", default: 0 },
];

export default function ServicePackagesAdminPage() {
  return <ResourceManager title="Service Material Packages" subtitle="Curate exact products for each service or sub-service." endpoint="/api/admin/service-packages" fields={FIELDS} columns={["serviceSlug", "title", "published", "sortOrder"]} />;
}
