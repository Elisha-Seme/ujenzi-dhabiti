"use client";

import ResourceManager, { FieldDef } from "@/components/admin/ResourceManager";

const FIELDS: FieldDef[] = [
  { name: "value", label: "Stat Value", type: "text", required: true, help: "e.g. 150+, 8, 15+, 500+" },
  { name: "label", label: "Stat Label", type: "text", required: true, help: "e.g. Projects Completed, Years Experience" },
  { name: "sortOrder", label: "Sort Order", type: "number", default: 0, help: "Higher or lower numbers specify sorting sequence." },
];

export default function AdminStatsPage() {
  return (
    <ResourceManager
      title="Company Statistics"
      subtitle="Manage key metrics displayed on the about page."
      endpoint="/api/admin/stats"
      fields={FIELDS}
      columns={["value", "label", "sortOrder"]}
      viewHref="/about"
    />
  );
}
