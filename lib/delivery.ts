// Indicative delivery zones for the estimator. These are PLACEHOLDER rates —
// the client should confirm the real freight schedule. Estimates are shown to
// the buyer for guidance; the final delivery cost is confirmed on the invoice.
//
// Zones are derived from the canonical 47-county list so every county is always
// covered. Tune the per-county fees below (or manage them from the admin
// Delivery page, which overrides these defaults for the live estimator).

import { KENYA_COUNTIES } from "./kenya-counties";

export interface DeliveryZone {
  county: string;
  feeKES: number;
  isConfigured?: boolean;
}

// Per-county placeholder freight fees (KES). Any county not listed here falls
// back to DEFAULT_FEE. Grouped roughly by distance from the Nairobi hub.
const FEE_BY_COUNTY: Record<string, number> = {
  // Nairobi metro
  Nairobi: 1500,
  Kiambu: 2000,
  Kajiado: 2500,
  Machakos: 2500,
  // Central & lower Eastern
  "Murang'a": 3000,
  Makueni: 3000,
  Kirinyaga: 3500,
  Nyandarua: 3500,
  Nyeri: 3500,
  Embu: 3500,
  Kitui: 3500,
  "Tharaka-Nithi": 4000,
  Meru: 4000,
  Laikipia: 4000,
  Narok: 4000,
  // Rift Valley
  Nakuru: 3500,
  Kericho: 4500,
  Bomet: 4500,
  Nandi: 4500,
  "Uasin Gishu": 4500,
  "Elgeyo-Marakwet": 5000,
  Baringo: 5000,
  "Trans Nzoia": 5000,
  Isiolo: 5000,
  // Western & Nyanza
  Kakamega: 5000,
  Vihiga: 5000,
  Siaya: 5000,
  Kisumu: 5000,
  Kisii: 5000,
  Nyamira: 5000,
  Bungoma: 5500,
  Busia: 5500,
  "Homa Bay": 5500,
  Migori: 5500,
  // Coast
  Mombasa: 5000,
  Kwale: 5500,
  Kilifi: 5500,
  "Taita-Taveta": 5500,
  "Tana River": 6000,
  Lamu: 6500,
  // Northern / remote
  "West Pokot": 6000,
  Samburu: 6000,
  Garissa: 6500,
  Marsabit: 7000,
  Turkana: 7500,
  Wajir: 7500,
  Mandera: 8000,
};

const DEFAULT_FEE = 6000;

export const DELIVERY_ZONES: DeliveryZone[] = KENYA_COUNTIES.map((county) => ({
  county,
  feeKES: FEE_BY_COUNTY[county] ?? DEFAULT_FEE,
  isConfigured: false,
}));

export function deliveryFeeForCounty(county: string): number | null {
  const z = DELIVERY_ZONES.find((z) => z.county.toLowerCase() === county.toLowerCase());
  return z ? z.feeKES : null;
}
