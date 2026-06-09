"use client";

import ResourceManager, { FieldDef } from "@/components/admin/ResourceManager";

const FIELDS: FieldDef[] = [
  { name: "question", label: "Question", type: "text", required: true },
  { name: "answer", label: "Answer", type: "textarea", required: true },
  { name: "iconName", label: "Icon Name", type: "text", required: true, default: "ShoppingBag", help: "Lucide icon name, e.g. ShoppingBag, CreditCard, Truck, User, Info." },
  { name: "sortOrder", label: "Sort Order", type: "number", default: 0, help: "Higher or lower numbers specify sorting sequence." },
];

export default function AdminFaqsPage() {
  return (
    <ResourceManager
      title="Frequently Asked Questions"
      subtitle="Manage FAQs shown on the customer help center page."
      endpoint="/api/admin/faqs"
      fields={FIELDS}
      columns={["question", "iconName", "sortOrder"]}
      viewHref="/help"
    />
  );
}
