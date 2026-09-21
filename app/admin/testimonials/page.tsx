"use client";

import ResourceManager, { FieldDef } from "@/components/admin/ResourceManager";

const FIELDS: FieldDef[] = [
  { name: "quote", label: "Client Quote", type: "textarea", required: true, help: "Publish only an approved quote." },
  { name: "authorName", label: "Client Name", type: "text", required: true },
  { name: "authorRole", label: "Role / Project", type: "text" },
  { name: "company", label: "Company", type: "text" },
  { name: "rating", label: "Rating (1–5)", type: "number" },
  { name: "image", label: "Photo / Logo", type: "image" },
  { name: "published", label: "Published", type: "checkbox", default: false },
  { name: "sortOrder", label: "Sort Order", type: "number", default: 0 },
];

export default function AdminTestimonialsPage() {
  return <ResourceManager title="Testimonials" subtitle="Publish approved client feedback and ratings." endpoint="/api/admin/testimonials" fields={FIELDS} columns={["authorName", "company", "rating", "published"]} viewHref="/about" />;
}
