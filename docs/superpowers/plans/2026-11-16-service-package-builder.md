# Service Package Builder & Services Menu Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Every service page gets a multi-select "Build your package" builder (work items with admin-set labour, house plans, architectural add-ons, materials, delivery → itemised quote or cart), and the header gets an animated Services mega-menu.

**Architecture:**
- Pure rule and maths modules (`lib/services/package-links.ts`, `lib/services/package-math.ts`) are unit-tested with Node's test runner.
- A server loader (`lib/services/package-data.ts`) gathers everything for one service into serialisable props.
- A client context (`components/services/package-context.tsx`) holds the selection, shared by the builder and the per-section "Add to package" toggles.
- Subsection reads tolerate a missing migration 0016 through one helper.

**Tech Stack:** Next.js 16.2 App Router, React 18, Tailwind 3 (`ud-*` tokens), Drizzle ORM, `motion` (new dependency, `motion/react`), Node 24 `node:test` via `tsx`.

**Spec:** `docs/superpowers/specs/2026-11-16-service-package-builder-design.md`

## Global Constraints

- The preview DB (`.env.local`) is **read-only**: never run `db:migrate`, never POST to `/api/contact` or the admin APIs from verification. Migrations are generated only (`drizzle-kit generate`).
- Payment code is untouched: `lib/daraja.ts`, `lib/flutterwave.ts`, `app/api/payments/**`.
- No invented prices. A labour line with no admin rate renders exactly `Priced after site visit` and contributes 0. The total is labelled `Indicative total`.
- Labour units are exactly `sqm` | `m` | `item` | `lump`, shown as `per m²` / `per metre` / `per item` / `lump sum`.
- Area fields: `Floor area` for `building-works` and `architectural`; `Area to be covered` for every other service. m² by default, with an ft² toggle (1 ft² = 0.092903 m²).
- Material quantity (coverage services only) = `ceil(areaSqm × 1.1 ÷ coverageSqmPerUnit)`, minimum 1. It is 1 when there is no coverage, no area, or the service is floor-area mode.
- Every group is multi-select. Nothing is pre-ticked except delivery, which is automatic: on when any material or printed plan is selected, off otherwise.
- Next.js 16: `params`/`searchParams` are Promises.
- `prefers-reduced-motion: reduce` → no translate/scale/stagger. Opacity-only or instant.
- No git commits (the owner reviews locally before anything is committed).
- Before the first UI code, invoke the owner's required skills: `ui-ux-pro-max` and `redesign-existing-projects` (design), then `motion-design` and `motion-framer` (animation).

## Review Focus

1. Area cleared, `0`, negative, non-numeric or absurdly large: totals must stay finite non-negative numbers, never `NaN`, and quantities clamp to integers ≥ 1. Covered by `package-math.test.ts › sanitises area input`.
2. Stale `localStorage` selection that references an item no longer offered (deleted product, unpublished plan): ignore it silently, with no crash and no ghost line. Covered by `package-math.test.ts › restoreSelection drops unknown ids`.
3. A service with no subsection rows (page falls back to an "overview" section): the builder still renders a single unpriced work item. Covered by `package-links.test.ts › overview fallback`, and checked in the browser on a service with rows removed via the fallback path (DB-unavailable case).
4. Touch devices at ≥1024 px (tablets): the mega-menu must open on tap and close on outside tap or Escape, not only on hover. Checked in the browser in Task 4.
5. DB unavailable: the navigation API returns 503 and the menu still shows "All services" and "Request a quote". The service page shows the enquiry form without crashing. Checked in Task 3 by the loader's catch paths (typecheck) and in Task 4 (menu with an empty list).

---

### Task 1: Labour-rate fields, migration 0016, resilient subsection reads, admin form

**Files:**
- Modify: `lib/db/schema.ts` (serviceSubsections: add `labourRateKES: integer("labour_rate_kes")`, `labourUnit: text("labour_unit")`)
- Create: `drizzle/migrations/0016_*.sql` (generated: `npx drizzle-kit generate --name subsection_labour_rates`)
- Create: `lib/services/subsections-read.ts`
- Create: `lib/services/labour.ts` (+ `lib/services/labour.test.ts`)
- Modify: `app/api/admin/service-subsections/route.ts`, `app/api/admin/service-subsections/[id]/route.ts`
- Modify: `app/admin/services/subsections/page.tsx`, `components/admin/ResourceManager.tsx` (select options may be `{ value, label }`)
- Modify: `package.json` (script `"test": "node --import tsx --test \"lib/**/*.test.ts\""`)

**Interfaces:**
- Produces: `type LabourUnit = "sqm" | "m" | "item" | "lump"`; `LABOUR_UNITS: readonly LabourUnit[]`; `LABOUR_UNIT_LABEL: Record<LabourUnit, string>`; `parseLabourInput(rate: unknown, unit: unknown): { ok: true; labourRateKES: number | null; labourUnit: LabourUnit | null } | { ok: false; error: string }` in `lib/services/labour.ts`.
- Produces: `type SubsectionRow = typeof serviceSubsections.$inferSelect` (labour fields typed `number | null` / `string | null`); `readSubsections(opts?: { serviceSlug?: string; serviceSlugs?: string[] }): Promise<SubsectionRow[]>` (ordered by `sortOrder`; on Postgres error code `42703` it re-selects without the two labour columns and fills them with `null`); `isMissingColumnError(err: unknown): boolean` in `lib/services/subsections-read.ts`.

- [ ] **Step 1: Write failing tests** in `lib/services/labour.test.ts`:
  - `parseLabourInput("", "")` → `{ ok: true, labourRateKES: null, labourUnit: null }`
  - `parseLabourInput("1200", "sqm")` → ok with `1200`, `"sqm"`
  - `parseLabourInput(-5, "sqm")` → `{ ok: false }`
  - `parseLabourInput("12.5", "m")` → `{ ok: false }` (integer KES only)
  - `parseLabourInput(500, "hour")` → `{ ok: false }`
  - `parseLabourInput(500, "")` → `{ ok: false, error: "Choose a labour unit for the rate" }`
  - `parseLabourInput("", "lump")` → ok, rate `null`, unit `"lump"` (unit kept, still unpriced)
- [ ] **Step 2: Run** `npm test`. Expected: FAIL (module not found).
- [ ] **Step 3: Implement `lib/services/labour.ts`**, add the two schema columns, generate migration 0016, and check that its SQL is exactly two `ALTER TABLE "service_subsections" ADD COLUMN …` statements.
- [ ] **Step 4: Implement `readSubsections`.** Wire it into the admin GET. In admin POST/PATCH, call `parseLabourInput` (400 on error), write the fields, and wrap the DB calls: when `isMissingColumnError(err)`, return 503 `{ error: "Labour rates need database migration 0016 before subsections can be saved." }`.
- [ ] **Step 5: Admin form fields.**
  - `labourRateKES`: number, label `Labour rate (KES)`, help `Leave empty to show "Priced after site visit".`
  - `labourUnit`: select, label `Labour unit`, options `""` + the four units with `LABOUR_UNIT_LABEL` labels.
  - Extend `ResourceManager`'s `FieldDef.options` to accept `string | { value: string; label: string }`.
- [ ] **Step 6: Run** `npm test` and `npx tsc --noEmit`. Expected: tests PASS, 0 type errors.

### Task 2: Package rules and maths (pure)

**Files:**
- Create: `lib/services/package-links.ts`, `lib/services/package-links.test.ts`
- Create: `lib/services/package-math.ts`, `lib/services/package-math.test.ts`

**Interfaces:**
- Produces (`package-links.ts`, no DB imports):
  - `type AreaMode = "floor" | "coverage"`
  - `areaModeForService(slug: string): AreaMode`
  - `planCategoriesForService(slug: string, subsectionPlanTypes: (string | null)[]): PlanCategory[]` (`building-works` and `architectural` → all six categories; otherwise the union of `expandPlanTypes` over the subsections)
  - `expandPlanTypes(planType: string | null): PlanCategory[]` (comma list; `Residential` → Bungalow, Townhouse, Maisonette, Villa, Apartment; `Commercial` → Commercial; case-insensitive; unknown names dropped)
  - `architecturalSectionIdsForService(slug: string): string[] | "all"` (`building-works` → `"all"`; `civil-works` → `["structural-engineering"]`; `interior-design` → `["architectural-design"]`; others, including `architectural`, → `[]`)
  - `materialCategoriesForService(slug: string): ProductCategory[]` (exact table from spec §1)
  - `relatedServiceSlugs(slug: string): string[]` (pairs from spec §1, symmetric)
- Produces (`package-math.ts`, no imports beyond types):
  - `type PackageGroup = "work" | "design" | "materials" | "delivery"`
  - `type PackageItem = { id: string; group: PackageGroup; label: string; kind: "labour" | "plan" | "material" | "delivery"; rateKES: number | null; unit: LabourUnit | "each" | null; defaultQty: number; options?: { digitalKES: number; printKES: number } }`
  - `type Selection = Record<string, { qty: number; mode?: "digital" | "print" }>`
  - `sanitiseArea(raw: string, unit: "sqm" | "sqft"): number` (sqm, finite, ≥ 0, capped at 1,000,000)
  - `materialQuantity(areaSqm: number, coverage: number | undefined, mode: AreaMode): number`
  - `lineTotal(item: PackageItem, sel: Selection[string]): number | null` (`null` = priced after site visit)
  - `computeTotals(items: PackageItem[], selection: Selection): { byGroup: Record<PackageGroup, number>; total: number; unpricedCount: number; physicalSelected: boolean }`
  - `restoreSelection(raw: unknown, items: PackageItem[]): Selection`
  - `formatQuoteMessage(input: { serviceTitle: string; areaSqm: number; areaLabel: string; county: string | null; items: PackageItem[]; selection: Selection; notes?: string }): string`

- [ ] **Step 1: Write failing tests**
  - `package-links.test.ts`:
    - `areaModeForService("building-works") === "floor"`, `("flooring") === "coverage"`
    - `expandPlanTypes("Residential, commercial")` → the 6 categories
    - `expandPlanTypes("Bungalow, Nope")` → `["Bungalow"]`
    - `planCategoriesForService("flooring", [null])` → `[]`
    - `planCategoriesForService("architectural", [])` length 6
    - `architecturalSectionIdsForService("building-works") === "all"`
    - `relatedServiceSlugs("flooring")` includes `"paint-finishes"`, and `relatedServiceSlugs("paint-finishes")` includes `"flooring"`
    - **overview fallback:** `planCategoriesForService("gypsum-ceilings", [])` → `[]`
  - `package-math.test.ts`:
    - **sanitises area input:** `sanitiseArea("", "sqm") === 0`, `("-4","sqm") === 0`, `("abc","sqm") === 0`, `("1e12","sqm") === 1000000`, `("100","sqft")` ≈ `9.2903`
    - `materialQuantity(40, 3, "coverage") === 15` (ceil(44/3))
    - `materialQuantity(40, undefined, "coverage") === 1`
    - `materialQuantity(120, 0.08, "floor") === 1`
    - `lineTotal` of a labour `sqm` item with rate 500 and qty 40 === 20000
    - `lineTotal` with `rateKES: null` === null
    - lump rate 35000 → 35000 regardless of qty
    - plan item: digital → `digitalKES`, print → `printKES`
    - `computeTotals`: one unpriced labour + one material (2 × 850) → `total === 1700`, `unpricedCount === 1`, `physicalSelected === true`
    - **restoreSelection drops unknown ids:** `restoreSelection({ ghost: { qty: 1 }, "m1": { qty: 0 } }, [m1])` → `{ m1: { qty: 1 } }`
    - `restoreSelection("not json-ish", items)` → `{}`
    - `formatQuoteMessage` output contains `Priced after site visit`, `Indicative total: KES 1,700`, and the area line
- [ ] **Step 2: Run** `npm test`. Expected: FAIL (modules not found).
- [ ] **Step 3: Implement both modules.** Format KES with `toLocaleString("en-KE")`. `formatQuoteMessage` is plain text, one line per selected item as `- <label> — <qty> <unit> × KES <rate> = KES <total>` or `- <label> — Priced after site visit`, then group subtotals, `Indicative total: KES …`, area, county, notes.
- [ ] **Step 4: Run** `npm test`. Expected: all PASS.

### Task 3: Server loader and navigation API

**Files:**
- Create: `lib/services/package-data.ts`
- Modify: `app/api/services/navigation/route.ts`

**Interfaces:**
- Consumes: `readSubsections`, the `package-links` functions, `getAllPlans()` from `lib/plans-store.ts`, `deliveryZones`/`DELIVERY_ZONES` fallback (same merge as `app/api/delivery-zones/route.ts`; extract that merge into `lib/delivery.ts` as `getPublishedDeliveryZones(): Promise<{ county: string; feeKES: number; isConfigured: boolean }[]>` and use it in both places).
- Produces: `loadServicePackage(slug: string): Promise<ServicePackageData | null>` where `ServicePackageData = { service: { slug; title; description; quoteType }; areaMode: AreaMode; areaLabel: string; subsections: SubsectionRow[]; items: PackageItem[]; materialsAreSuggested: boolean; related: { slug: string; title: string }[]; zones: { county: string; feeKES: number; isConfigured: boolean }[]; allServiceTitles: string[] }`.
  - Item ids: `work:<subsectionId>`, `arch:<subsectionId>`, `plan:<planId>`, `mat:<productId>`, `delivery`.
  - Materials: curated `materialProductIds` (in order) if non-empty, else active products in `materialCategoriesForService`, DB first with `PRODUCTS` as fallback.
  - The `delivery` item has `rateKES: null` and its fee is resolved client-side from the county.
- Produces: `GET /api/services/navigation` → `{ services: { slug; title; iconName; description; hasPlans: boolean; subsections: { sectionId; title }[] }[] }` (description trimmed to 140 chars; subsections capped at 6).

- [ ] **Step 1: Implement the loader and the API.** Every DB read sits in try/catch, with fallbacks as in the spec. If no subsection rows exist, emit one `work:<serviceId>-overview` item labelled `<title> services`.
- [ ] **Step 2: Run** `npx tsc --noEmit`. Expected: 0 errors.
- [ ] **Step 3: Verify read-only** on the dev server: `GET /api/services/navigation` returns 9 services, and `building-works` has `hasPlans: true` and 4 subsections.

### Task 4: Animated Services mega-menu (desktop) and accordion (mobile)

**Files:**
- Create: `components/layout/ServicesMegaMenu.tsx`, `components/layout/MobileServicesMenu.tsx`
- Modify: `components/layout/Header.tsx` (replace the inline dropdown and mobile list; the fetch moves into a shared hook `useServiceNavigation()` in `components/layout/useServiceNavigation.ts`)
- Modify: `package.json` (dependency `motion`)

**Interfaces:**
- Consumes: the navigation API shape from Task 3.
- Produces: `<ServicesMegaMenu pathname: string />`, `<MobileServicesMenu pathname: string onNavigate: () => void />`, `useServiceNavigation(): { services: NavService[]; loaded: boolean }`.

- [ ] **Step 1: Invoke the design and motion skills** (`ui-ux-pro-max`, `redesign-existing-projects`, `motion-design`, `motion-framer`). Fix the timing and easing values in a `MENU_MOTION` constant at the top of `ServicesMegaMenu.tsx`.
- [ ] **Step 2: Build the desktop panel.**
  - Layout: left column of services with icons, right preview with up to 6 sub-service links (`/services/<slug>#<sectionId>`), a "House plans available" chip, "Build your package" (`/services/<slug>#package`) and "View service" actions, and a footer row with "All services" and "Request a quote".
  - Behaviour: hover with a 120 ms close delay; click and tap toggle; outside click closes; Escape closes and returns focus to the trigger; Up/Down move within the left column; correct `aria-expanded`/`aria-controls`.
  - Motion: `AnimatePresence` enter/exit; reduced motion switches to opacity only.
- [ ] **Step 3: Build the mobile accordion.** Nested expandable rows with animated height, each with sub-service links and "Build your package".
- [ ] **Step 4: Verify in the browser.**
  - Desktop 1280 px: hover, tap, keyboard and Escape.
  - Tablet 1024 px: open by click.
  - Mobile 375 px: drawer accordion.
  - Reduced-motion emulation.
  - Empty list (nav API fails) still shows the footer links.
  - Console free of errors.

### Task 5: Package builder on the service page

**Files:**
- Create: `components/services/package-context.tsx` (`PackageProvider`, `usePackage()`)
- Create: `components/services/PackageBuilder.tsx`, `components/services/PackageSummary.tsx`, `components/services/AddToPackageToggle.tsx`
- Modify: `app/services/[slug]/page.tsx` (use `loadServicePackage`; wrap the builder and sections in `PackageProvider`; builder section `id="package"` placed after the service tabs; each `ServiceSection` gets an `AddToPackageToggle itemId="work:<id>"`; the "Shop Materials" section becomes the builder's materials group, while the existing `ServiceEnquiry` stays at the bottom; add an "Often combined with" related-services strip)

**Interfaces:**
- Consumes: `ServicePackageData`, the `package-math` functions, `useCart().addItem`.
- Produces: `usePackage(): { selection: Selection; toggle(id: string): void; setQty(id: string, qty: number): void; setMode(id: string, mode: "digital" | "print"): void; areaSqm: number; county: string | null; ... }`. `localStorage` key `ud:package:<slug>:v1`, with try/catch on every access.

- [ ] **Step 1: Build the builder.**
  - Inputs: area field with an m²/ft² toggle and the service's area label, plus a county select (zones; shows "(estimate)" when `!isConfigured`).
  - Groups in order: Work items, Design (plans grouped by category, each with a Digital/Printed segmented control; architectural add-ons), Materials (heading suffix `(suggested)` when `materialsAreSuggested`), Delivery (automatic, not user-toggled).
  - Rows: checkbox, label, quantity input where the unit needs one, and the line total or `Priced after site visit`.
- [ ] **Step 2: Build the summary.**
  - Desktop: sticky card with group subtotals, `Indicative total`, `N item(s) priced after site visit`, and a disclaimer line.
  - Mobile: sticky bottom bar that expands into a sheet.
  - Actions:
    - **Send as quote request:** an inline step with name, email, phone, notes and a consent checkbox (required). It POSTs `{ name, email, phone, subject: "Package quote — <title>", message: formatQuoteMessage(...) }` to `/api/contact`, then shows success or error states.
    - **Add materials & plans to cart:** materials as `kind: "material"` with their quantity; plans as `kind: "plan"` with their `deliveryMode`. Labour, architectural and delivery items are never added. After adding, a confirmation is shown with a link to the cart.
  - Both actions are disabled when nothing is selected.
- [ ] **Step 3: Wire the page** as described under Files. Groups with no items are not rendered.
- [ ] **Step 4: Verify in the browser** on `building-works` (plans + architectural visible, floor area, quantities stay 1) and `flooring` (no plans, suggested Flooring materials, quantities from area):
  - tick and untick;
  - quantity edits;
  - ft² toggle;
  - delivery switching on and off automatically;
  - totals match a hand calculation;
  - reload restores the selection;
  - "Add to cart" updates the cart count;
  - **send quote with `window.fetch` patched in the tab** to capture the `/api/contact` request without sending it, then check the payload text;
  - 375 px bottom sheet;
  - console clean.

### Task 6: Services index actions and counts

**Files:**
- Modify: `app/services/page.tsx`

**Interfaces:**
- Consumes: `readSubsections({ serviceSlugs })`, `planCategoriesForService`, `materialCategoriesForService`, and product counts per category.

- [ ] **Step 1: Add the actions and counts.**
  - Primary action: `Build your package` → `/services/<slug>#package`.
  - Keep "View Service" and "Request Service Quote"; drop the duplicate "Review Material Options".
  - Count line: `N work items · N house plans · N materials` (each part omitted when 0).
- [ ] **Step 2: Verify in the browser** that the counts match the data (e.g. Building Works: 4 work items, 10 plans).

### Task 7: Final verification

- [ ] **Step 1: Run** `npm test`, `npx tsc --noEmit`, `npx eslint .` and `npx next build`. Expected: all pass, with no new lint errors.
- [ ] **Step 2: Run a browser pass** on the production build (`ujenzi-prod`): Home, Services, 3 service pages, menu (desktop and mobile), console and server log clean.
- [ ] **Step 3: Leave the dev server running** for the owner, and report what's verified, what couldn't be (admin save, real quote submission, priced labour in live data) and the deploy order (0015, then 0016, then code).
