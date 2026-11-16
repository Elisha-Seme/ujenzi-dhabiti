// Small pure helpers behind interactive controls, kept here so they are unit-tested.

const MAX_QTY = 100_000;

/** Parses a quantity field's text. null = not a number yet (keep the draft as typed). */
export function parseQtyDraft(text: string): number | null {
  const trimmed = text.trim();
  if (trimmed === "") return null;
  const value = Number(trimmed);
  if (!Number.isFinite(value)) return null;
  return Math.min(Math.max(1, Math.floor(value)), MAX_QTY);
}

/** Roving selection for radio groups: arrows move and wrap, Home/End jump. null = not a nav key. */
export function nextRadioIndex(key: string, index: number, count: number): number | null {
  if (count <= 0) return null;
  switch (key) {
    case "ArrowRight":
    case "ArrowDown":
      return (index + 1) % count;
    case "ArrowLeft":
    case "ArrowUp":
      return (index - 1 + count) % count;
    case "Home":
      return 0;
    case "End":
      return count - 1;
    default:
      return null;
  }
}

/** Loose phone check: digits with optional +, spaces, dashes and brackets; 9 to 15 digits. */
export function isLikelyPhone(text: string): boolean {
  const trimmed = text.trim();
  if (!/^\+?[\d\s()-]+$/.test(trimmed)) return false;
  const digits = trimmed.replace(/\D/g, "");
  return digits.length >= 9 && digits.length <= 15;
}

/** On touch, the first tap on a service previews it; a second tap opens it. */
export function shouldPreviewOnTap(pointerType: string | null, isActive: boolean): boolean {
  return (pointerType === "touch" || pointerType === "pen") && !isActive;
}

/** Which package lines to add to the cart and which to set, so repeat clicks never stack. */
export function cartSyncPlan(
  existingLineIds: string[],
  desired: { lineId: string; qty: number }[],
): { add: string[]; update: { lineId: string; qty: number }[] } {
  const existing = new Set(existingLineIds);
  const add: string[] = [];
  const update: { lineId: string; qty: number }[] = [];
  for (const line of desired) {
    if (existing.has(line.lineId)) update.push(line);
    else add.push(line.lineId);
  }
  return { add, update };
}
