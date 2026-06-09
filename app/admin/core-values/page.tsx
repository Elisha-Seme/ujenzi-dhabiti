"use client";

import ResourceManager, { FieldDef } from "@/components/admin/ResourceManager";

const FIELDS: FieldDef[] = [
  { name: "title", label: "Title", type: "text", required: true },
  { name: "description", label: "Description", type: "textarea", required: true },
  { name: "iconName", label: "Icon Name", type: "text", required: true, default: "Award", help: "Lucide icon name, e.g. Award, Scale, Lightbulb, HeartHandshake, Leaf, Users." },
  { name: "sortOrder", label: "Sort Order", type: "number", default: 0, help: "Higher or lower numbers specify sorting sequence." },
];

export default function AdminCoreValuesPage() {
  return (
    <ResourceManager
      title="Company Core Values"
      subtitle="Manage the core values displayed on the about page."
      endpoint="/api/admin/core-values"
      fields={FIELDS}
      columns={["title", "iconName", "sortOrder"]}
      viewHref="/about"
    />
  );
}
