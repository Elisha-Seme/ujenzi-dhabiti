"use client";

import ResourceManager, { FieldDef } from "@/components/admin/ResourceManager";

const FIELDS: FieldDef[] = [
  { name: "title", label: "Title", type: "text", required: true },
  { name: "summary", label: "Summary / Tagline", type: "text" },
  { name: "body", label: "Body", type: "textarea", required: true, help: "Full description. Line breaks are preserved." },
  { name: "image", label: "Image URL", type: "image" },
  { name: "published", label: "Published (visible on site)", type: "checkbox", default: true },
  { name: "sortOrder", label: "Sort Order", type: "number", default: 0, help: "Lower numbers appear first." },
];

export default function AdminArchitecturalPage() {
  return (
    <ResourceManager
      title="Architectural Services"
      subtitle="Manage the content blocks shown on the Architectural services page."
      endpoint="/api/admin/architectural"
      fields={FIELDS}
      columns={["title", "summary", "published"]}
      viewHref="/services/architectural"
    />
  );
}
