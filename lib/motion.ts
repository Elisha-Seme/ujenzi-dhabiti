// Site motion tokens ("Corporate" personality: solid, decisive, no overshoot).
// One easing family for 80% of motion, three durations, exits faster than entrances.

/** Entrances and on-screen moves: fast start, gentle landing. */
export const EASE_OUT = [0.2, 0, 0, 1] as const;
/** Exits and dismissals: gentle start, quick departure. */
export const EASE_IN = [0.3, 0, 1, 1] as const;

export const DUR = {
  quick: 0.14,
  standard: 0.24,
  slow: 0.36,
} as const;

/** Per-item delay for list cascades (keep total under ~200ms). */
export const STAGGER = 0.02;
