"use client";

import { motion, useReducedMotion } from "motion/react";
import { Check, Plus } from "lucide-react";
import { DUR, EASE_OUT } from "@/lib/motion";
import { useOptionalPackage } from "./package-context";

// "Add to package" toggle shown on sub-service sections, child cards and their
// house plans. It ticks the same line as the builder, so both stay in sync.
// `compact` is a small inline button (used beside each house plan in a card).
export default function AddToPackageToggle({ itemId, label, compact = false }: { itemId: string; label: string; compact?: boolean }) {
  const pkg = useOptionalPackage();
  const reduce = useReducedMotion() ?? false;
  if (!pkg || !pkg.items.some((item) => item.id === itemId)) return null;
  const selected = pkg.isSelected(itemId);

  const button = (
    <motion.button
      type="button"
      aria-pressed={selected}
      aria-label={selected ? `Remove ${label} from your package` : `Add ${label} to your package`}
      onClick={() => pkg.toggle(itemId)}
      whileTap={reduce ? undefined : { scale: 0.97 }}
      transition={{ duration: DUR.quick, ease: EASE_OUT }}
      className={`inline-flex items-center gap-1.5 rounded-[4px] font-bold transition-colors ${compact ? "px-3 py-2 text-[11px]" : "px-4 py-2.5 text-xs"} ${selected ? "bg-ud-burgundy text-white hover:bg-ud-burgundy-hover" : "border border-ud-burgundy text-ud-burgundy hover:bg-ud-burgundy hover:text-white"}`}
    >
      {selected ? <Check size={compact ? 12 : 14} aria-hidden /> : <Plus size={compact ? 12 : 14} aria-hidden />}
      {selected ? (compact ? "Added" : "In your package") : (compact ? "Add" : "Add to package")}
    </motion.button>
  );

  if (compact) return button;
  return (
    <div className="mt-6 flex flex-wrap items-center gap-3">
      {button}
      <a href="#package" className="text-xs font-semibold text-ud-dark/60 hover:text-ud-burgundy">
        {pkg.totals.selectedCount > 0 ? `View package (${pkg.totals.selectedCount})` : "Build your package"}
      </a>
    </div>
  );
}
