import { test } from "node:test";
import assert from "node:assert/strict";
import {
  architecturalSectionIdsForService,
  areaModeForService,
  expandPlanTypes,
  materialCategoriesForService,
  planCategoriesForService,
  relatedServiceSlugs,
} from "./package-links";

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
