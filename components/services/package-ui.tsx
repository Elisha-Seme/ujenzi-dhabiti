"use client";

import { useEffect, useRef, useState, type KeyboardEvent } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { Minus, Plus } from "lucide-react";
import { DUR, EASE_IN, EASE_OUT } from "@/lib/motion";
import { formatKES } from "@/lib/services/package-math";
import { nextRadioIndex, parseQtyDraft } from "@/lib/ui-helpers";

/** Visual checkbox; pair with a visually hidden <input type="checkbox" className="peer sr-only"> before it. */
export function CheckMark({ checked }: { checked: boolean }) {
  const reduce = useReducedMotion() ?? false;
  return (
    <span
      aria-hidden
      className={`mt-0.5 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-[4px] border-2 transition-colors duration-150 peer-focus-visible:ring-2 peer-focus-visible:ring-ud-burgundy/60 peer-focus-visible:ring-offset-2 ${checked ? "border-ud-burgundy bg-ud-burgundy" : "border-ud-dark/25 bg-white"}`}
    >
      <svg viewBox="0 0 16 16" className="h-3.5 w-3.5" fill="none">
        <motion.path
          d="M3.5 8.5l3 3 6-7"
          stroke="white"
          strokeWidth={2.2}
          strokeLinecap="round"
          strokeLinejoin="round"
          initial={false}
          animate={{ pathLength: checked ? 1 : 0, opacity: checked ? 1 : 0 }}
          transition={{ duration: reduce ? 0 : DUR.standard, ease: EASE_OUT }}
        />
      </svg>
    </span>
  );
}

/** A KES amount that crossfades (with a small vertical slide) when it changes. */
export function AnimatedAmount({ value, className = "", live = false }: { value: number; className?: string; live?: boolean }) {
  const reduce = useReducedMotion() ?? false;
  const text = formatKES(value);
  return (
    <span className={`relative inline-flex overflow-hidden tabular-nums ${className}`} aria-live={live ? "polite" : undefined}>
      <AnimatePresence mode="popLayout" initial={false}>
        <motion.span
          key={text}
          initial={{ y: reduce ? 0 : 6, opacity: 0 }}
          animate={{ y: 0, opacity: 1, transition: { duration: DUR.quick, ease: EASE_OUT } }}
          exit={{ y: reduce ? 0 : -6, opacity: 0, transition: { duration: 0.1, ease: EASE_IN } }}
        >
          {text}
        </motion.span>
      </AnimatePresence>
    </span>
  );
}

/**
 * Accessible segmented control (role="radiogroup"): one tab stop, arrow keys
 * move the selection, Home/End jump. Optional layoutId animates the highlight.
 */
export function SegmentedRadio<T extends string>({
  label,
  options,
  value,
  onChange,
  layoutId,
  className = "",
}: {
  label: string;
  options: { value: T; label: string }[];
  value: T;
  onChange: (value: T) => void;
  layoutId?: string;
  className?: string;
}) {
  const reduce = useReducedMotion() ?? false;
  const refs = useRef<(HTMLButtonElement | null)[]>([]);
  const index = Math.max(0, options.findIndex((o) => o.value === value));

  const onKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    const next = nextRadioIndex(event.key, index, options.length);
    if (next === null) return;
    event.preventDefault();
    onChange(options[next].value);
    refs.current[next]?.focus();
  };

  return (
    <div role="radiogroup" aria-label={label} onKeyDown={onKeyDown} className={`inline-flex rounded-[4px] border border-ud-dark/15 bg-white p-0.5 ${className}`}>
      {options.map((option, i) => {
        const active = i === index;
        return (
          <button
            key={option.value}
            ref={(el) => { refs.current[i] = el; }}
            type="button"
            role="radio"
            aria-checked={active}
            tabIndex={active ? 0 : -1}
            onClick={() => onChange(option.value)}
            className={`relative rounded-[3px] px-3 py-1.5 text-xs font-semibold transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-ud-burgundy ${active ? "text-white" : "text-ud-dark/65 hover:text-ud-dark"} ${active && !layoutId ? "bg-ud-dark" : ""}`}
          >
            {active && layoutId && (
              <motion.span layoutId={layoutId} aria-hidden className="absolute inset-0 rounded-[3px] bg-ud-dark" transition={{ duration: reduce ? 0 : DUR.quick, ease: EASE_OUT }} />
            )}
            <span className="relative">{option.label}</span>
          </button>
        );
      })}
    </div>
  );
}

export function QtyStepper({ value, onChange, unit, label }: { value: number; onChange: (qty: number) => void; unit: string; label: string }) {
  // Local draft so clearing the field to retype doesn't snap it to 1 (e.g. "40" → "140").
  const [draft, setDraft] = useState(String(value));
  useEffect(() => { setDraft(String(value)); }, [value]);
  const commit = () => {
    const parsed = parseQtyDraft(draft);
    if (parsed === null) setDraft(String(value));
    else if (parsed !== value) onChange(parsed);
    else setDraft(String(value));
  };

  return (
    <div className="inline-flex items-center gap-2">
      <div className="inline-flex items-stretch overflow-hidden rounded-[4px] border border-ud-dark/15 bg-white">
        <button type="button" aria-label={`Decrease ${label}`} onClick={() => onChange(value - 1)} disabled={value <= 1} className="flex h-10 w-10 items-center justify-center text-ud-dark/70 hover:bg-ud-dark/5 disabled:opacity-35 sm:h-9 sm:w-9">
          <Minus size={14} aria-hidden />
        </button>
        <input
          type="number"
          inputMode="numeric"
          min={1}
          aria-label={label}
          value={draft}
          onChange={(event) => {
            setDraft(event.target.value);
            const parsed = parseQtyDraft(event.target.value);
            if (parsed !== null && parsed !== value) onChange(parsed);
          }}
          onBlur={commit}
          onKeyDown={(event) => { if (event.key === "Enter") commit(); }}
          className="w-16 border-x border-ud-dark/10 text-center text-sm font-semibold tabular-nums text-ud-dark outline-none focus:bg-ud-burgundy/[0.04] [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
        />
        <button type="button" aria-label={`Increase ${label}`} onClick={() => onChange(value + 1)} className="flex h-10 w-10 items-center justify-center text-ud-dark/70 hover:bg-ud-dark/5 sm:h-9 sm:w-9">
          <Plus size={14} aria-hidden />
        </button>
      </div>
      {unit && <span className="text-xs text-ud-dark/55">{unit}</span>}
    </div>
  );
}
