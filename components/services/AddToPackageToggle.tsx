"use client";

import { motion, useReducedMotion } from "motion/react";
import { Check, Plus } from "lucide-react";
import { DUR, EASE_OUT } from "@/lib/motion";
import { useOptionalPackage } from "./package-context";

// "Add to package" toggle shown on each sub-service section of a service page.
// It ticks the same line as the builder, so both stay in sync.
export default function AddToPackageToggle({ itemId, label }: { itemId: string; label: string }) {
  const pkg = useOptionalPackage();
  const reduce = useReducedMotion() ?? false;
  if (!pkg || !pkg.items.some((item) => item.id === itemId)) return null;
  const selected = pkg.isSelected(itemId);

  return (
    <div className="mt-6 flex flex-wrap items-center gap-3">
      <motion.button
        type="button"
        aria-pressed={selected}
        aria-label={selected ? `Remove ${label} from your package` : `Add ${label} to your package`}
        onClick={() => pkg.toggle(itemId)}
        whileTap={reduce ? undefined : { scale: 0.97 }}
        transition={{ duration: DUR.quick, ease: EASE_OUT }}
        className={`inline-flex items-center gap-2 rounded-[4px] px-4 py-2.5 text-xs font-bold transition-colors ${selected ? "bg-ud-burgundy text-white hover:bg-ud-burgundy-hover" : "border border-ud-burgundy text-ud-burgundy hover:bg-ud-burgundy hover:text-white"}`}
      >
        {selected ? <Check size={14} aria-hidden /> : <Plus size={14} aria-hidden />}
        {selected ? "In your package" : "Add to package"}
      </motion.button>
      <a href="#package" className="text-xs font-semibold text-ud-dark/60 hover:text-ud-burgundy">
        {pkg.totals.selectedCount > 0 ? `View package (${pkg.totals.selectedCount})` : "Build your package"}
      </a>
    </div>
  );
}
