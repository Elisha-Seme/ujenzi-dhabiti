"use client";

import ResourceManager, { FieldDef } from "@/components/admin/ResourceManager";

const FIELDS: FieldDef[] = [
  { name: "name", label: "Full Name", type: "text", required: true },
  { name: "title", label: "Job Title", type: "text", required: true },
  { name: "image", label: "Profile Photo", type: "image", help: "Upload profile image or paste image URL." },
  { name: "sortOrder", label: "Sort Order", type: "number", default: 0, help: "Higher or lower numbers specify sorting sequence." },
];

export default function AdminTeamPage() {
  return (
    <ResourceManager
      title="Team Members"
      subtitle="Manage team members displayed on the about page."
      endpoint="/api/admin/team"
      fields={FIELDS}
      columns={["name", "title", "sortOrder"]}
      viewHref="/about"
    />
  );
}
