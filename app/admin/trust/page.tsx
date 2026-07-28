"use client";
import ResourceManager, { FieldDef } from "@/components/admin/ResourceManager";
const fields: FieldDef[] = [
  { name: "kind", label: "Type", type: "select", options: ["testimonial", "client_logo", "credential"], required: true },
  { name: "title", label: "Client / Credential", type: "text", required: true },
  { name: "subtitle", label: "Organization / Role", type: "text" },
  { name: "body", label: "Quote / Details", type: "textarea" },
  { name: "image", label: "Logo / Image", type: "image" },
  { name: "linkUrl", label: "Evidence / Project URL", type: "text" },
  { name: "expiresAt", label: "Expiry Date", type: "text" },
  { name: "permissionConfirmed", label: "Publication Permission Confirmed", type: "checkbox" },
  { name: "published", label: "Published", type: "checkbox" },
  { name: "sortOrder", label: "Sort Order", type: "number", default: 0 },
];
export default function TrustAdminPage() {
  return <ResourceManager title="Trust & Credentials" subtitle="Only permission-confirmed entries can be published." endpoint="/api/admin/trust-items" fields={fields} columns={["kind", "title", "permissionConfirmed", "published"]} viewHref="/" />;
}
