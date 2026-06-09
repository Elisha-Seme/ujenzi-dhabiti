"use client";

import ResourceManager, { FieldDef } from "@/components/admin/ResourceManager";

const FIELDS: FieldDef[] = [
  { name: "title", label: "Title", type: "text", required: true },
  { name: "description", label: "Description", type: "textarea", required: true },
  { name: "iconName", label: "Icon Name", type: "text", required: true, default: "Layers", help: "Lucide icon name, e.g. Layers, Target, ShieldCheck, Wrench, Clock, UserCheck." },
  { name: "sortOrder", label: "Sort Order", type: "number", default: 0, help: "Higher or lower numbers specify sorting sequence." },
];

export default function AdminWhyChooseUsPage() {
  return (
    <ResourceManager
      title="Why Choose Us"
      subtitle="Manage the features/benefits displayed on the about page."
      endpoint="/api/admin/why-choose-us"
      fields={FIELDS}
      columns={["title", "iconName", "sortOrder"]}
      viewHref="/about"
    />
  );
}
