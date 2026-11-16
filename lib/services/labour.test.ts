import { test } from "node:test";
import assert from "node:assert/strict";
import { parseLabourInput } from "./labour";

test("empty rate and unit means unpriced", () => {
  assert.deepEqual(parseLabourInput("", ""), { ok: true, labourRateKES: null, labourUnit: null });
});

test("accepts a whole-KES rate with a known unit", () => {
  assert.deepEqual(parseLabourInput("1200", "sqm"), { ok: true, labourRateKES: 1200, labourUnit: "sqm" });
});

test("rejects a negative rate", () => {
  assert.equal(parseLabourInput(-5, "sqm").ok, false);
});

test("rejects a fractional rate (integer KES only)", () => {
  assert.equal(parseLabourInput("12.5", "m").ok, false);
});

test("rejects an unknown unit", () => {
  assert.equal(parseLabourInput(500, "hour").ok, false);
});

test("a rate needs a unit", () => {
  assert.deepEqual(parseLabourInput(500, ""), { ok: false, error: "Choose a labour unit for the rate" });
});

test("a unit without a rate is kept but stays unpriced", () => {
  assert.deepEqual(parseLabourInput("", "lump"), { ok: true, labourRateKES: null, labourUnit: "lump" });
});
