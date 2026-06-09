// Indicative delivery zones for the estimator. These are PLACEHOLDER rates —
// the client should confirm the real freight schedule. Estimates are shown to
// the buyer for guidance; the final delivery cost is confirmed on the invoice.

export interface DeliveryZone {
  county: string;
  feeKES: number;
}

export const DELIVERY_ZONES: DeliveryZone[] = [
  { county: "Nairobi", feeKES: 1500 },
  { county: "Kiambu", feeKES: 2000 },
  { county: "Kajiado", feeKES: 2500 },
  { county: "Machakos", feeKES: 2500 },
  { county: "Murang'a", feeKES: 3000 },
  { county: "Nakuru", feeKES: 3500 },
  { county: "Nyeri", feeKES: 3500 },
  { county: "Uasin Gishu (Eldoret)", feeKES: 4500 },
  { county: "Kisumu", feeKES: 5000 },
  { county: "Mombasa", feeKES: 5000 },
  { county: "Other / Upcountry", feeKES: 6000 },
];

export function deliveryFeeForCounty(county: string): number | null {
  const z = DELIVERY_ZONES.find((z) => z.county.toLowerCase() === county.toLowerCase());
  return z ? z.feeKES : null;
}
