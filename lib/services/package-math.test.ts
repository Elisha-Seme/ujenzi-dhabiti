import { test } from "node:test";
import assert from "node:assert/strict";
import {
  computeTotals,
  formatQuoteMessage,
  lineTotal,
  materialQuantity,
  restoreSelection,
  sanitiseArea,
  type PackageItem,
} from "./package-math";

const labourSqm: PackageItem = { id: "work:a", group: "work", label: "Tiling", kind: "labour", rateKES: 500, unit: "sqm", defaultQty: 1 };
const labourUnpriced: PackageItem = { id: "work:b", group: "work", label: "Epoxy flooring", kind: "labour", rateKES: null, unit: null, defaultQty: 1 };
const lump: PackageItem = { id: "arch:s", group: "design", label: "Structural details", kind: "labour", rateKES: 35000, unit: "lump", defaultQty: 1 };
const plan: PackageItem = { id: "plan:p", group: "design", label: "3-Bedroom Bungalow", kind: "plan", rateKES: null, unit: null, defaultQty: 1, options: { digitalKES: 4500, printKES: 7500 } };
const m1: PackageItem = { id: "m1", group: "materials", label: "Tile adhesive", kind: "material", rateKES: 850, unit: "each", defaultQty: 2 };
const delivery: PackageItem = { id: "delivery", group: "delivery", label: "Delivery", kind: "delivery", rateKES: null, unit: null, defaultQty: 1 };

test("sanitises area input", () => {
  assert.equal(sanitiseArea("", "sqm"), 0);
  assert.equal(sanitiseArea("-4", "sqm"), 0);
  assert.equal(sanitiseArea("abc", "sqm"), 0);
  assert.equal(sanitiseArea("1e12", "sqm"), 1_000_000);
  assert.ok(Math.abs(sanitiseArea("100", "sqft") - 9.2903) < 1e-4);
});

test("material quantity adds 10% wastage over coverage, minimum 1", () => {
  assert.equal(materialQuantity(40, 3, "coverage"), 15);
  assert.equal(materialQuantity(40, undefined, "coverage"), 1);
  assert.equal(materialQuantity(0, 3, "coverage"), 1);
});

test("floor-area services never auto-calculate material quantities", () => {
  assert.equal(materialQuantity(120, 0.08, "floor"), 1);
});

test("labour per m² multiplies rate by quantity", () => {
  assert.equal(lineTotal(labourSqm, { qty: 40 }), 20000);
});

test("labour without an admin rate is unpriced (null)", () => {
  assert.equal(lineTotal(labourUnpriced, { qty: 40 }), null);
});

test("lump sum ignores quantity", () => {
  assert.equal(lineTotal(lump, { qty: 9 }), 35000);
});

test("plan price follows the chosen format", () => {
  assert.equal(lineTotal(plan, { qty: 1, mode: "digital" }), 4500);
  assert.equal(lineTotal(plan, { qty: 1, mode: "print" }), 7500);
});

test("computeTotals sums priced lines and counts unpriced ones", () => {
  const totals = computeTotals([labourUnpriced, m1], { "work:b": { qty: 1 }, m1: { qty: 2 } });
  assert.equal(totals.total, 1700);
  assert.equal(totals.byGroup.materials, 1700);
  assert.equal(totals.unpricedCount, 1);
  assert.equal(totals.physicalSelected, true);
});

test("delivery is charged only when something physical is selected", () => {
  const items = [labourSqm, m1, plan, delivery];
  const onlyLabour = computeTotals(items, { "work:a": { qty: 10 } }, 3000);
  assert.equal(onlyLabour.physicalSelected, false);
  assert.equal(onlyLabour.byGroup.delivery, 0);
  const withPrintPlan = computeTotals(items, { "plan:p": { qty: 1, mode: "print" } }, 3000);
  assert.equal(withPrintPlan.physicalSelected, true);
  assert.equal(withPrintPlan.byGroup.delivery, 3000);
  assert.equal(withPrintPlan.total, 7500 + 3000);
  const digitalPlanOnly = computeTotals(items, { "plan:p": { qty: 1, mode: "digital" } }, 3000);
  assert.equal(digitalPlanOnly.physicalSelected, false);
});

test("restoreSelection drops unknown ids and clamps quantities", () => {
  assert.deepEqual(restoreSelection({ ghost: { qty: 1 }, m1: { qty: 0 } }, [m1]), { m1: { qty: 1 } });
  assert.deepEqual(restoreSelection({ "plan:p": { qty: 3, mode: "weird" } }, [plan]), { "plan:p": { qty: 1, mode: "digital" } });
});

test("restoreSelection tolerates garbage", () => {
  assert.deepEqual(restoreSelection("not json-ish", [m1]), {});
  assert.deepEqual(restoreSelection(null, [m1]), {});
});

test("computeTotals counts priced lines per group so unpriced groups aren't shown as KES 0", () => {
  const totals = computeTotals([labourUnpriced, labourSqm, m1], { "work:b": { qty: 1 } });
  assert.equal(totals.pricedCount.work, 0);
  assert.equal(totals.total, 0);
  assert.equal(totals.unpricedCount, 1);
  const mixed = computeTotals([labourUnpriced, labourSqm], { "work:b": { qty: 1 }, "work:a": { qty: 2 } });
  assert.equal(mixed.pricedCount.work, 1);
});

test("quote message never states a KES 0 total when everything is unpriced", () => {
  const message = formatQuoteMessage({
    serviceTitle: "Flooring & Tiling",
    areaSqm: 0,
    areaLabel: "Area to be covered",
    county: null,
    items: [labourUnpriced],
    selection: { "work:b": { qty: 1 } },
  });
  assert.match(message, /Indicative total: To be confirmed after site visit/);
  assert.doesNotMatch(message, /KES 0\b/);
});

test("quote message itemises lines, unpriced work and the total", () => {
  const message = formatQuoteMessage({
    serviceTitle: "Flooring & Tiling",
    areaSqm: 40,
    areaLabel: "Area to be covered",
    county: "Nairobi",
    items: [labourUnpriced, m1],
    selection: { "work:b": { qty: 1 }, m1: { qty: 2 } },
  });
  assert.match(message, /Epoxy flooring — Priced after site visit/);
  assert.match(message, /Tile adhesive — 2 × KES 850 = KES 1,700/);
  assert.match(message, /Indicative total: KES 1,700/);
  assert.match(message, /Area to be covered: 40 m²/);
  assert.match(message, /County: Nairobi/);
});
