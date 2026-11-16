import { test } from "node:test";
import assert from "node:assert/strict";
import { parseParentSectionId } from "./subsection-input";

test("an empty parent means a top-level sub-service", () => {
  assert.deepEqual(parseParentSectionId("", "bungalows"), { ok: true, value: null });
  assert.deepEqual(parseParentSectionId(undefined, "bungalows"), { ok: true, value: null });
  assert.deepEqual(parseParentSectionId(null, "bungalows"), { ok: true, value: null });
});

test("a parent must be a lowercase anchor slug", () => {
  assert.deepEqual(parseParentSectionId(" residential ", "residential-bungalows"), { ok: true, value: "residential" });
  assert.equal(parseParentSectionId("Residential Homes", "x").ok, false);
});

test("a sub-service cannot be its own parent", () => {
  assert.deepEqual(parseParentSectionId("residential", "residential"), { ok: false, error: "A sub-service can't be its own parent" });
});
