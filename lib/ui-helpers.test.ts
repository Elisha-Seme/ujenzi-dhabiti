import { test } from "node:test";
import assert from "node:assert/strict";
import { cartLineId } from "./cart-line";
import { cartSyncPlan, isLikelyPhone, nextRadioIndex, parseQtyDraft, shouldPreviewOnTap } from "./ui-helpers";

test("parseQtyDraft keeps an empty or partial draft instead of snapping to 1", () => {
  assert.equal(parseQtyDraft(""), null);
  assert.equal(parseQtyDraft("   "), null);
  assert.equal(parseQtyDraft("abc"), null);
});

test("parseQtyDraft clamps real numbers to whole units of at least 1", () => {
  assert.equal(parseQtyDraft("40"), 40);
  assert.equal(parseQtyDraft("0"), 1);
  assert.equal(parseQtyDraft("-3"), 1);
  assert.equal(parseQtyDraft("2.7"), 2);
  assert.equal(parseQtyDraft("999999999"), 100000);
});

test("nextRadioIndex moves with arrows, wraps, and supports Home/End", () => {
  assert.equal(nextRadioIndex("ArrowRight", 0, 2), 1);
  assert.equal(nextRadioIndex("ArrowDown", 1, 2), 0);
  assert.equal(nextRadioIndex("ArrowLeft", 0, 2), 1);
  assert.equal(nextRadioIndex("ArrowUp", 1, 3), 0);
  assert.equal(nextRadioIndex("Home", 2, 3), 0);
  assert.equal(nextRadioIndex("End", 0, 3), 2);
  assert.equal(nextRadioIndex("Enter", 0, 2), null);
});

test("isLikelyPhone accepts Kenyan and international formats", () => {
  assert.equal(isLikelyPhone("0712 345 678"), true);
  assert.equal(isLikelyPhone("+254 712-345-678"), true);
  assert.equal(isLikelyPhone("(020) 123 4567"), true);
});

test("isLikelyPhone rejects empty, short or non-numeric input", () => {
  assert.equal(isLikelyPhone(""), false);
  assert.equal(isLikelyPhone("12345"), false);
  assert.equal(isLikelyPhone("call me"), false);
  assert.equal(isLikelyPhone("0712abc678"), false);
});

test("a touch tap on an unselected service previews it instead of navigating", () => {
  assert.equal(shouldPreviewOnTap("touch", false), true);
  assert.equal(shouldPreviewOnTap("pen", false), true);
  assert.equal(shouldPreviewOnTap("touch", true), false);
  assert.equal(shouldPreviewOnTap("mouse", false), false);
  assert.equal(shouldPreviewOnTap(null, false), false);
});

test("cartSyncPlan updates lines already in the cart instead of stacking them", () => {
  const plan = cartSyncPlan(["a::std", "p::digital"], [{ lineId: "a::std", qty: 5 }, { lineId: "b::std", qty: 2 }, { lineId: "p::digital", qty: 1 }]);
  assert.deepEqual(plan.add, ["b::std"]);
  assert.deepEqual(plan.update, [{ lineId: "a::std", qty: 5 }, { lineId: "p::digital", qty: 1 }]);
});

test("cartLineId matches the cart's product + delivery-mode key", () => {
  assert.equal(cartLineId("mat-1"), "mat-1::std");
  assert.equal(cartLineId("plan-1", "print"), "plan-1::print");
});
