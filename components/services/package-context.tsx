"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import type { AreaMode } from "@/lib/services/package-links";
import {
  clampQty,
  computeTotals,
  materialQuantity,
  restoreSelection,
  sanitiseArea,
  type PackageItem,
  type PackageTotals,
  type Selection,
} from "@/lib/services/package-math";

export interface PackageZone { county: string; feeKES: number; isConfigured: boolean }

export interface PackageConfig {
  slug: string;
  title: string;
  areaMode: AreaMode;
  areaLabel: string;
  items: PackageItem[];
  zones: PackageZone[];
  materialsAreSuggested: boolean;
}

interface PackageContextValue extends PackageConfig {
  selection: Selection;
  isSelected: (id: string) => boolean;
  toggle: (id: string) => void;
  setQty: (id: string, qty: number) => void;
  setMode: (id: string, mode: "digital" | "print") => void;
  clear: () => void;
  areaRaw: string;
  setAreaRaw: (value: string) => void;
  areaUnit: "sqm" | "sqft";
  setAreaUnit: (unit: "sqm" | "sqft") => void;
  areaSqm: number;
  county: string | null;
  setCounty: (county: string | null) => void;
  zone: PackageZone | null;
  totals: PackageTotals;
}

const PackageContext = createContext<PackageContextValue | null>(null);

const storageKey = (slug: string) => `ud:package:${slug}:v1`;

/** Quantity a line gets from the area, unless the customer has typed their own. */
function autoQty(item: PackageItem, areaSqm: number, mode: AreaMode): number {
  if (item.kind === "material") return materialQuantity(areaSqm, item.coverageSqmPerUnit, mode);
  if (item.kind === "labour" && item.unit === "sqm") return clampQty(Math.ceil(areaSqm));
  return 1;
}

export function PackageProvider({ config, children }: { config: PackageConfig; children: ReactNode }) {
  const { items, areaMode, slug, zones } = config;
  const [selection, setSelection] = useState<Selection>({});
  const [manual, setManual] = useState<string[]>([]); // lines whose quantity the customer typed
  const [areaRaw, setAreaRaw] = useState("");
  const [areaUnit, setAreaUnit] = useState<"sqm" | "sqft">("sqm");
  const [county, setCounty] = useState<string | null>(null);
  // Saving waits for the restore to land; otherwise the first save (and React's
  // dev-mode double effect run) overwrites the saved package with empty state.
  const [hydrated, setHydrated] = useState(false);

  const itemsById = useMemo(() => new Map(items.map((item) => [item.id, item])), [items]);
  const areaSqm = sanitiseArea(areaRaw, areaUnit);

  // Restore after mount (never during render) so server and client markup match.
  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(storageKey(slug));
      if (raw) {
        const saved = JSON.parse(raw) as { selection?: unknown; manual?: unknown; areaRaw?: unknown; areaUnit?: unknown; county?: unknown };
        setSelection(restoreSelection(saved.selection, items));
        if (Array.isArray(saved.manual)) setManual(saved.manual.filter((id): id is string => typeof id === "string" && itemsById.has(id)));
        if (typeof saved.areaRaw === "string") setAreaRaw(saved.areaRaw.slice(0, 12));
        if (saved.areaUnit === "sqft" || saved.areaUnit === "sqm") setAreaUnit(saved.areaUnit);
        if (typeof saved.county === "string" && zones.some((z) => z.county === saved.county)) setCounty(saved.county);
      }
    } catch {
      /* storage unavailable or corrupt: start empty */
    }
    setHydrated(true);
  }, [slug, items, itemsById, zones]);

  useEffect(() => {
    if (!hydrated) return;
    try {
      window.localStorage.setItem(storageKey(slug), JSON.stringify({ selection, manual, areaRaw, areaUnit, county }));
    } catch {
      /* private mode / quota: selection simply isn't remembered */
    }
  }, [hydrated, slug, selection, manual, areaRaw, areaUnit, county]);

  // Area changes re-flow quantities the customer hasn't set by hand.
  useEffect(() => {
    setSelection((prev) => {
      let changed = false;
      const next: Selection = { ...prev };
      for (const [id, sel] of Object.entries(prev)) {
        const item = itemsById.get(id);
        if (!item || manual.includes(id) || item.kind === "plan") continue;
        const qty = autoQty(item, areaSqm, areaMode);
        if (qty !== sel.qty) { next[id] = { ...sel, qty }; changed = true; }
      }
      return changed ? next : prev;
    });
  }, [areaSqm, areaMode, itemsById, manual]);

  const toggle = useCallback((id: string) => {
    const item = itemsById.get(id);
    if (!item || item.kind === "delivery") return;
    setSelection((prev) => {
      if (prev[id]) {
        const rest = { ...prev };
        delete rest[id];
        return rest;
      }
      return { ...prev, [id]: item.kind === "plan" ? { qty: 1, mode: "digital" } : { qty: autoQty(item, areaSqm, areaMode) } };
    });
    setManual((prev) => prev.filter((m) => m !== id));
  }, [itemsById, areaSqm, areaMode]);

  const setQty = useCallback((id: string, qty: number) => {
    setSelection((prev) => (prev[id] ? { ...prev, [id]: { ...prev[id], qty: clampQty(qty) } } : prev));
    setManual((prev) => (prev.includes(id) ? prev : [...prev, id]));
  }, []);

  const setMode = useCallback((id: string, mode: "digital" | "print") => {
    setSelection((prev) => (prev[id] ? { ...prev, [id]: { ...prev[id], mode } } : prev));
  }, []);

  const clear = useCallback(() => { setSelection({}); setManual([]); }, []);

  const zone = zones.find((z) => z.county === county) ?? null;
  const totals = useMemo(() => computeTotals(items, selection, zone?.feeKES ?? null), [items, selection, zone]);

  const value: PackageContextValue = {
    ...config,
    selection,
    isSelected: (id) => Boolean(selection[id]),
    toggle,
    setQty,
    setMode,
    clear,
    areaRaw,
    setAreaRaw,
    areaUnit,
    setAreaUnit,
    areaSqm,
    county,
    setCounty,
    zone,
    totals,
  };

  return <PackageContext.Provider value={value}>{children}</PackageContext.Provider>;
}

export function usePackage(): PackageContextValue {
  const ctx = useContext(PackageContext);
  if (!ctx) throw new Error("usePackage must be used inside <PackageProvider>");
  return ctx;
}

/** Same as usePackage, but returns null outside a provider (for optional widgets). */
export function useOptionalPackage(): PackageContextValue | null {
  return useContext(PackageContext);
}
