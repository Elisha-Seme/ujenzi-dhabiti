"use client";

import { useEffect, useState } from "react";
import ResourceManager, { FieldDef } from "@/components/admin/ResourceManager";
import { LABOUR_UNITS, LABOUR_UNIT_LABEL } from "@/lib/services/labour";

const DETAIL_FIELDS: FieldDef[] = [
  { name: "sectionId", label: "Section Anchor ID", type: "text", required: true, help: "e.g. residential, commercial, renovation, boundary-walls, murram-roads, cabro-paving, road-drainage" },
  { name: "title", label: "Subsection Title", type: "text", required: true },
  { name: "body", label: "Subsection Description", type: "textarea", required: true },
  { name: "planType", label: "Plan Category Link", type: "text", help: "Optional. One or more house plan categories, comma-separated (e.g. Bungalow, Villa), or Residential / Commercial." },
  { name: "bullets", label: "Bullet Points Highlights", type: "tags", help: "Comma-separated key highlights for this subsection." },
  { name: "labourRateKES", label: "Labour rate (KES)", type: "number", help: "Leave empty to show \"Priced after site visit\"." },
  { name: "labourUnit", label: "Labour unit", type: "select", options: LABOUR_UNITS.map((unit) => ({ value: unit, label: LABOUR_UNIT_LABEL[unit] })), help: "How the rate is charged in the customer's package builder." },
  { name: "sortOrder", label: "Sort Order", type: "number", default: 0, help: "Higher or lower numbers specify sorting sequence." },
];

export default function AdminServiceSubsectionsPage() {
  const [serviceSlugs, setServiceSlugs] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/admin/services")
      .then((res) => {
        if (!res.ok) throw new Error("Could not load services");
        return res.json();
      })
      .then((rows: { slug: string }[]) => setServiceSlugs(rows.map((row) => row.slug)))
      .catch(() => setError("Could not load parent services. Refresh this page and try again."))
      .finally(() => setLoading(false));
  }, []);

  if (error) return <p role="alert" className="p-8 text-ud-burgundy">{error}</p>;
  if (loading) return <p className="p-8 text-ud-dark/60">Loading parent services…</p>;
  if (serviceSlugs.length === 0) return <p className="p-8 text-ud-dark/60">Create a service in the Services Catalog before adding sub-services.</p>;

  const fields: FieldDef[] = [
    { name: "serviceSlug", label: "Parent Service", type: "select", options: serviceSlugs, required: true, help: "Choose any existing service in the catalogue." },
    ...DETAIL_FIELDS,
  ];

  return (
    <ResourceManager
      title="Service Detail Subsections"
      subtitle="Manage individual subsection cards and copy shown inside specific service subpages."
      endpoint="/api/admin/service-subsections"
      fields={fields}
      columns={["serviceSlug", "sectionId", "title", "labourRateKES", "labourUnit", "sortOrder"]}
      rowHref={(row) => `/services/${row.serviceSlug}#${row.sectionId}`}
    />
  );
}
