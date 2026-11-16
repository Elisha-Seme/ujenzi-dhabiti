"use client";

import { useEffect, useState } from "react";

export interface NavService {
  slug: string;
  title: string;
  iconName: string;
  description: string;
  hasPlans: boolean;
  /** What this service's package builder can combine, e.g. Labour, Materials, House plans. */
  packageParts: string[];
  /** Selectable sub-services (a parent with children counts as its children). */
  subsectionCount: number;
  /** Every sub-service; children (e.g. Bungalows) nested under their parent (e.g. Residential). */
  groups: { sectionId: string; title: string; children: { sectionId: string; title: string }[] }[];
}

// One request per page load, shared by the desktop and mobile menus.
let cache: Promise<NavService[]> | null = null;

function loadNavigation(): Promise<NavService[]> {
  if (!cache) {
    cache = fetch("/api/services/navigation")
      .then((response) => (response.ok ? response.json() : Promise.reject(new Error("Service navigation unavailable"))))
      .then((data: { services?: NavService[] }) => data.services ?? [])
      .catch(() => {
        cache = null; // allow a retry on the next mount
        return [];
      });
  }
  return cache;
}

export function useServiceNavigation(): { services: NavService[]; loaded: boolean } {
  const [state, setState] = useState<{ services: NavService[]; loaded: boolean }>({ services: [], loaded: false });
  useEffect(() => {
    let alive = true;
    loadNavigation().then((services) => { if (alive) setState({ services, loaded: true }); });
    return () => { alive = false; };
  }, []);
  return state;
}
