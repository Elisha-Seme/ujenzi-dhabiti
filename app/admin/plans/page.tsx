"use client";

import ResourceManager, { FieldDef } from "@/components/admin/ResourceManager";

const FIELDS: FieldDef[] = [
  { name: "name", label: "Plan Name", type: "text", required: true },
  { name: "category", label: "Category", type: "select", required: true, options: ["Bungalow", "Townhouse", "Maisonette", "Villa", "Apartment", "Commercial"] },
  { name: "planType", label: "Plan Type", type: "text", required: true, help: "e.g. Three-Bedroom Bungalow" },
  { name: "description", label: "Description", type: "textarea", required: true },
  { name: "priceDigitalKES", label: "Digital Price (KES)", type: "number", required: true },
  { name: "pricePrintKES", label: "Printed Price (KES)", type: "number", required: true },
  { name: "image", label: "Image URL", type: "image" },
  { name: "bedrooms", label: "Bedrooms", type: "number" },
  { name: "bathrooms", label: "Bathrooms", type: "number" },
  { name: "floors", label: "Floors", type: "number", default: 1 },
  { name: "plinthAreaSqM", label: "Plinth Area (sqm)", type: "number" },
  { name: "downloadFile", label: "Download File", type: "text", help: "PDF filename placed in /public/plans/ (digital delivery). Leave blank if catalogue-only." },
  { name: "published", label: "Published (on sale)", type: "checkbox", default: true },
];

export default function AdminPlansPage() {
  return (
    <ResourceManager
      title="House Plans"
      subtitle="Manage the house-plan catalogue. Built-in seed plans become editable after running the seed migration."
      endpoint="/api/admin/plans"
      fields={FIELDS}
      columns={["name", "category", "priceDigitalKES", "published"]}
    />
  );
}
