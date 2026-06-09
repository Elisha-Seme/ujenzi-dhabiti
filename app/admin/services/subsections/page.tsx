"use client";

import ResourceManager, { FieldDef } from "@/components/admin/ResourceManager";

const FIELDS: FieldDef[] = [
  { name: "serviceSlug", label: "Parent Service Pillar", type: "select", options: ["building-works", "civil-works", "interior-design", "architectural"], required: true, help: "URL slug of the parent service, e.g. building-works" },
  { name: "sectionId", label: "Section Anchor ID", type: "text", required: true, help: "e.g. residential, commercial, renovation, boundary-walls, murram-roads, cabro-paving, road-drainage" },
  { name: "title", label: "Subsection Title", type: "text", required: true },
  { name: "body", label: "Subsection Description", type: "textarea", required: true },
  { name: "planType", label: "Plan Category Link", type: "text", help: "Optional. Link this to a House Plan catalog filter, e.g. Bungalow, Villa, Townhouse." },
  { name: "bullets", label: "Bullet Points Highlights", type: "tags", help: "Comma-separated key highlights for this subsection." },
  { name: "sortOrder", label: "Sort Order", type: "number", default: 0, help: "Higher or lower numbers specify sorting sequence." },
];

export default function AdminServiceSubsectionsPage() {
  return (
    <ResourceManager
      title="Service Detail Subsections"
      subtitle="Manage individual subsection cards and copy shown inside specific service subpages."
      endpoint="/api/admin/service-subsections"
      fields={FIELDS}
      columns={["serviceSlug", "sectionId", "title", "sortOrder"]}
      rowHref={(row) => `/services/${row.serviceSlug}#${row.sectionId}`}
    />
  );
}
