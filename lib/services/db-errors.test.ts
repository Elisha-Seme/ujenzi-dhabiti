import { test } from "node:test";
import assert from "node:assert/strict";
import { isMissingColumnError } from "./db-errors";

test("detects Postgres undefined_column (42703) on the error", () => {
  assert.equal(isMissingColumnError({ code: "42703" }), true);
});

test("detects 42703 wrapped as the cause (Drizzle query errors)", () => {
  assert.equal(isMissingColumnError({ message: "Failed query", cause: { code: "42703" } }), true);
});

test("detects the message form when no code is present", () => {
  assert.equal(isMissingColumnError(new Error('column "labour_rate_kes" does not exist')), true);
});

test("ignores unrelated database errors", () => {
  assert.equal(isMissingColumnError({ code: "23505" }), false);
  assert.equal(isMissingColumnError(new Error("connection refused")), false);
  assert.equal(isMissingColumnError(null), false);
});
