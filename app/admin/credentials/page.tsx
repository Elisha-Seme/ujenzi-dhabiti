"use client";

import ResourceManager, { FieldDef } from "@/components/admin/ResourceManager";

const FIELDS: FieldDef[] = [
  { name: "title", label: "Credential / Registration", type: "text", required: true },
  { name: "detail", label: "Verified Detail", type: "textarea", required: true, help: "Use the exact approved legal or certification wording." },
  { name: "credentialNumber", label: "Registration / Policy Number", type: "text" },
  { name: "issuedYear", label: "Issued Year", type: "number" },
  { name: "expiresYear", label: "Expiry Year", type: "number" },
  { name: "image", label: "Certificate Image", type: "image" },
  { name: "published", label: "Published", type: "checkbox", default: false },
  { name: "sortOrder", label: "Sort Order", type: "number", default: 0 },
];

export default function AdminCredentialsPage() {
  return <ResourceManager title="Credentials" subtitle="Publish only verified NCA, insurance, registration, and experience information." endpoint="/api/admin/credentials" fields={FIELDS} columns={["title", "credentialNumber", "published"]} viewHref="/about" />;
}
