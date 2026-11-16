import { test } from "node:test";
import assert from "node:assert/strict";
import {
  addOnServicesForService,
  architecturalSectionIdsForService,
  areaModeForService,
  expandPlanTypes,
  groupSubsections,
  materialCategoriesForService,
  planCategoriesForService,
  planMatchForSection,
  relatedServiceSlugs,
} from "./package-links";

test("civil works packages include cabro and road drainage; interior design includes gypsum, flooring, painting", () => {
  assert.deepEqual(addOnServicesForService("civil-works"), ["cabro-road-works", "plumbing"]);
  assert.deepEqual(addOnServicesForService("interior-design"), ["gypsum-ceilings", "flooring", "paint-finishes"]);
  assert.deepEqual(addOnServicesForService("flooring"), []);
});

test("materials follow the add-on services", () => {
  assert.deepEqual(materialCategoriesForService("interior-design"), ["Gypsum & Ceilings", "Hardware", "Electrical", "Flooring", "Paint & Finishes"]);
  assert.deepEqual(materialCategoriesForService("civil-works"), ["Cabro & Road Works", "Structural Materials", "Plumbing"]);
});

test("groupSubsections nests children under their parent and keeps order", () => {
  const rows = [
    { sectionId: "residential", parentSectionId: null },
    { sectionId: "residential-villas", parentSectionId: "residential" },
    { sectionId: "boundary-walls", parentSectionId: null },
    { sectionId: "residential-bungalows", parentSectionId: "residential" },
  ];
  const grouped = groupSubsections(rows);
  assert.deepEqual(grouped.map((g) => g.row.sectionId), ["residential", "boundary-walls"]);
  assert.deepEqual(grouped[0].children.map((c) => c.sectionId), ["residential-villas", "residential-bungalows"]);
  assert.deepEqual(grouped[1].children, []);
});

test("groupSubsections treats a child with a missing parent as top-level", () => {
  const grouped = groupSubsections([{ sectionId: "orphan", parentSectionId: "gone" }]);
  assert.deepEqual(grouped.map((g) => g.row.sectionId), ["orphan"]);
});

test("planMatchForSection maps property types to the right house plans", () => {
  assert.deepEqual(planMatchForSection("residential-bungalows"), { category: "Bungalow" });
  const studio = planMatchForSection("apartments-studio");
  assert.equal(studio?.category, "Apartment");
  assert.ok(studio?.pattern?.test("Urban Studio / Bedsitter Block"));
  assert.ok(!studio?.pattern?.test("Metro One-Bedroom Apartment Block"));
  assert.ok(planMatchForSection("commercial-warehouses")?.pattern?.test("Logistix Warehouse & Yard"));
  assert.ok(planMatchForSection("commercial-offices")?.pattern?.test("Summit Office Block"));
  assert.equal(planMatchForSection("renovation-bungalows"), null);
  assert.equal(planMatchForSection("tile-flooring"), null);
});

test("building and architectural measure floor area; finishes measure coverage", () => {
  assert.equal(areaModeForService("building-works"), "floor");
  assert.equal(areaModeForService("architectural"), "floor");
  assert.equal(areaModeForService("flooring"), "coverage");
});

test("expandPlanTypes understands Residential and Commercial keywords", () => {
  assert.deepEqual(
    new Set(expandPlanTypes("Residential, commercial")),
    new Set(["Bungalow", "Townhouse", "Maisonette", "Villa", "Apartment", "Commercial"]),
  );
});

test("expandPlanTypes drops unknown names and ignores null", () => {
  assert.deepEqual(expandPlanTypes("Bungalow, Nope"), ["Bungalow"]);
  assert.deepEqual(expandPlanTypes(null), []);
});

test("finishing services offer no house plans unless a subsection links one", () => {
  assert.deepEqual(planCategoriesForService("flooring", [null]), []);
  assert.deepEqual(planCategoriesForService("flooring", ["Villa"]), ["Villa"]);
});

test("building works and architectural offer every plan category", () => {
  assert.equal(planCategoriesForService("architectural", []).length, 6);
  assert.equal(planCategoriesForService("building-works", ["Bungalow"]).length, 6);
});

test("overview fallback: a service with no subsections gets no plans", () => {
  assert.deepEqual(planCategoriesForService("gypsum-ceilings", []), []);
});

test("architectural add-ons per service", () => {
  assert.equal(architecturalSectionIdsForService("building-works"), "all");
  assert.deepEqual(architecturalSectionIdsForService("civil-works"), ["structural-engineering"]);
  assert.deepEqual(architecturalSectionIdsForService("interior-design"), ["architectural-design"]);
  assert.deepEqual(architecturalSectionIdsForService("architectural"), []);
  assert.deepEqual(architecturalSectionIdsForService("flooring"), []);
});

test("material categories follow the spec table", () => {
  assert.deepEqual(materialCategoriesForService("flooring"), ["Flooring"]);
  assert.deepEqual(materialCategoriesForService("building-works"), ["Structural Materials", "Hardware", "Electrical", "Plumbing"]);
  assert.deepEqual(materialCategoriesForService("architectural"), []);
  assert.deepEqual(materialCategoriesForService("unknown-service"), []);
});

test("related services are symmetric and exclude the service itself", () => {
  assert.ok(relatedServiceSlugs("flooring").includes("paint-finishes"));
  assert.ok(relatedServiceSlugs("paint-finishes").includes("flooring"));
  assert.ok(!relatedServiceSlugs("flooring").includes("flooring"));
});
