"use client";

import ResourceManager from "@/components/admin/ResourceManager";

export default function AdminDeliveryPage() {
  return (
    <ResourceManager
      title="Delivery Rates"
      subtitle="Delivery fees by county/area. These power the delivery estimator shown to customers."
      endpoint="/api/admin/delivery"
      fields={[
        { name: "county", label: "County / Area", type: "text", required: true },
        { name: "region", label: "Region", type: "text", help: "Optional grouping — e.g. Nairobi Metro, Coast, Upcountry" },
        { name: "feeKES", label: "Delivery Fee (KES)", type: "number", required: true },
        { name: "sortOrder", label: "Sort Order", type: "number", default: 0, help: "Lower numbers show first" },
        { name: "published", label: "Show to customers", type: "checkbox", default: true },
      ]}
      columns={["county", "region", "feeKES", "published"]}
    />
  );
}
