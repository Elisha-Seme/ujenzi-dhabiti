"use client";

import ResourceManager, { FieldDef } from "@/components/admin/ResourceManager";

const FIELDS: FieldDef[] = [
  { name: "title", label: "Title", type: "text", required: true },
  { name: "category", label: "Category", type: "select", options: ["Building", "Civil", "Interior", "Architectural"], default: "Building" },
  { name: "propertyType", label: "Property Type", type: "select", options: ["Residential", "Commercial", "Institutional"] },
  { name: "location", label: "Location", type: "text" },
  { name: "description", label: "Description", type: "textarea", required: true },
  { name: "scope", label: "Scope of Work", type: "textarea" },
  { name: "coverImage", label: "Cover Image", type: "image", help: "Upload, or paste an image URL." },
  { name: "beforeImage", label: "Before Image", type: "image", help: "Optional. When both Before & After are set, the site shows a before/after slider." },
  { name: "afterImage", label: "After Image", type: "image", help: "Optional 'after' photo for the before/after slider." },
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
      viewHref="/what-we-built"
    />
  );
}
