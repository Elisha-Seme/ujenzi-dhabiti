"use client";

import ResourceManager, { FieldDef } from "@/components/admin/ResourceManager";

const FIELDS: FieldDef[] = [
  { name: "slug", label: "URL Slug", type: "text", required: true },
  { name: "title", label: "Title", type: "text", required: true },
  { name: "excerpt", label: "Excerpt", type: "textarea", required: true },
  { name: "body", label: "Article Body", type: "textarea", required: true, help: "Plain text with blank lines between paragraphs." },
  { name: "coverImage", label: "Cover Image", type: "image" },
  { name: "category", label: "Category", type: "text", default: "Resources" },
  { name: "tags", label: "Tags", type: "tags" },
  { name: "author", label: "Author", type: "text", required: true },
  { name: "published", label: "Published", type: "checkbox", default: false },
];

export default function AdminBlogPage() {
  return <ResourceManager title="Blog & Resources" subtitle="Draft, review, and publish construction resources." endpoint="/api/admin/blog" fields={FIELDS} columns={["title", "category", "author", "published"]} viewHref="/blog" rowHref={(row) => row.slug ? `/blog/${row.slug}` : null} />;
}
