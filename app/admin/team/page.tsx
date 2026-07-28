"use client";

import ResourceManager, { FieldDef } from "@/components/admin/ResourceManager";

const FIELDS: FieldDef[] = [
  { name: "name", label: "Full Name", type: "text", required: true },
  { name: "title", label: "Job Title", type: "text", required: true },
  { name: "image", label: "Profile Photo", type: "image", help: "Upload profile image or paste image URL." },
  { name: "bio", label: "Profile / Biography", type: "textarea", help: "Approved public profile text." },
  { name: "competencies", label: "Key Competencies", type: "tags", help: "Enter one competency per line or separate them with commas." },
  { name: "qualifications", label: "Qualifications & Registrations", type: "tags", help: "Enter one qualification or professional registration per line." },
  { name: "linkedinUrl", label: "LinkedIn URL", type: "text" },
  { name: "published", label: "Published", type: "checkbox", default: true },
  { name: "sortOrder", label: "Sort Order", type: "number", default: 0, help: "Higher or lower numbers specify sorting sequence." },
];

export default function AdminTeamPage() {
  return (
    <ResourceManager
      title="Team Members"
      subtitle="Manage team members displayed on the about page."
      endpoint="/api/admin/team"
      fields={FIELDS}
      columns={["name", "title", "published", "sortOrder"]}
      viewHref="/about"
    />
  );
}
