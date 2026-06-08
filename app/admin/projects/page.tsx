"use client";

import ResourceManager, { FieldDef } from "@/components/admin/ResourceManager";

const FIELDS: FieldDef[] = [
  { name: "title", label: "Title", type: "text", required: true },
  { name: "category", label: "Category", type: "select", options: ["Building", "Civil", "Interior", "Architectural"], default: "Building" },
  { name: "propertyType", label: "Property Type", type: "select", options: ["Residential", "Commercial", "Institutional"] },
  { name: "location", label: "Location", type: "text" },
  { name: "description", label: "Description", type: "textarea", required: true },
  { name: "scope", label: "Scope of Work", type: "textarea" },
  { name: "coverImage", label: "Cover Image URL", type: "image", help: "Paste an image URL (e.g. from Cloudinary or Unsplash)." },
  { name: "images", label: "Gallery Images", type: "tags", help: "Comma-separated image URLs." },
  { name: "materialsUsed", label: "Materials Used", type: "tags", help: "Comma-separated, e.g. Cement, Gypsum boards." },
  { name: "featured", label: "Featured on homepage", type: "checkbox", default: false },
  { name: "published", label: "Published (visible on site)", type: "checkbox", default: true },
  { name: "sortOrder", label: "Sort Order", type: "number", default: 0, help: "Higher numbers appear first." },
];

export default function AdminProjectsPage() {
  return (
    <ResourceManager
      title="What We've Built"
      subtitle="Add, edit, and remove completed projects shown on the public portfolio."
      endpoint="/api/admin/projects"
      fields={FIELDS}
      columns={["title", "category", "location", "published"]}
    />
  );
}
