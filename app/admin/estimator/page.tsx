"use client";
import ResourceManager, { FieldDef } from "@/components/admin/ResourceManager";
const fields: FieldDef[] = [
  { name: "buildingType", label: "Building Type", type: "text", required: true }, { name: "finishLevel", label: "Finish Level", type: "text", required: true },
  { name: "ratePerSqM", label: "Base Rate / m²", type: "number", required: true }, { name: "labourPercent", label: "Labour %", type: "number", default: 30 },
  { name: "wastagePercent", label: "Wastage %", type: "number", default: 5 }, { name: "locationFactor", label: "Location Factor %", type: "number", default: 100 },
  { name: "notes", label: "Assumptions", type: "textarea" }, { name: "published", label: "Published", type: "checkbox", default: true },
];
export default function EstimatorAdmin() { return <ResourceManager title="Estimator Rates" subtitle="Approved rates and assumptions used by the public estimator." endpoint="/api/admin/estimator-rates" fields={fields} columns={["buildingType", "finishLevel", "ratePerSqM", "published"]} viewHref="/estimator" />; }
