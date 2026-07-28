"use client";
import ResourceManager, { FieldDef } from "@/components/admin/ResourceManager";
const fields: FieldDef[] = [
  { name: "title", label: "Title", type: "text", required: true }, { name: "slug", label: "Slug", type: "text", required: true }, { name: "summary", label: "Summary", type: "textarea", required: true },
  { name: "body", label: "Body", type: "textarea", required: true }, { name: "coverImage", label: "Cover Image", type: "image" }, { name: "author", label: "Author", type: "text", required: true },
  { name: "category", label: "Category", type: "text", required: true }, { name: "tags", label: "Tags", type: "tags" }, { name: "seoTitle", label: "SEO Title", type: "text" },
  { name: "seoDescription", label: "SEO Description", type: "textarea" }, { name: "published", label: "Published", type: "checkbox" },
];
export default function ResourcesAdmin() { return <ResourceManager title="Resource Articles" subtitle="Draft, review and publish construction resources." endpoint="/api/admin/resources" fields={fields} columns={["title", "category", "author", "published"]} viewHref="/resources" rowHref={(r) => r.slug ? `/resources/${r.slug}` : null} />; }
