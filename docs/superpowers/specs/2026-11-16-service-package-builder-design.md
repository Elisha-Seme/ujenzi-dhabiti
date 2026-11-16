# Service Package Builder & Services Menu Redesign

**Date:** 2026-11-16
**Status:** Draft for approval
**Codebase:** Next.js 16.2 (App Router, Turbopack), React 18, Tailwind 3 (brand tokens `ud-*`), Drizzle ORM on Postgres/Neon, NextAuth v5. Branch `master` @ 0c629a4.

## Intent

Ujenzi Dhabiti sells construction services, building materials and house plans. Today a customer sees these separately: a service page describes the work, the shop sells materials, the plan catalogue sells plans, and the quote form is a free-text form. The owner wants **each service page to be a one-stop place**: a customer can see everything related to that service and **assemble their own package**. They tick what they want, untick what they don't, and send the result as an itemised quote request. They also want the **Services dropdown menu redesigned, with animation**, so it's easier to find what each service offers.

## Goals

1. On every service page (`/services/[slug]`), a **package builder** where the customer:
   - enters the project area once (m², with a ft² toggle) and their county;
   - **multi-selects** from every group that applies (several items per group are allowed in every group, never just one):
     - **Work items**: the service's own sub-services, each with a labour line;
     - **Design**: matching house plans (each with a Digital or Printed choice) and architectural sub-services, where they apply to this service;
     - **Materials**: catalogue products for this service, with quantities calculated from area where coverage data exists;
     - **Delivery**: added automatically when anything physical is selected (materials or printed plans), priced by county;
   - sees a live, itemised **indicative total** with subtotals per group;
   - can **send it as a quote request** (stored in the existing admin "Quotes & Enquiries" queue) and/or **add the materials and plans to the cart**.
2. **Labour prices are set by the admin** per sub-service: a rate in KES plus a unit (per m², per metre, per item, or lump sum). A sub-service without a rate shows "Priced after site visit" and adds nothing to the total.
3. **Redesigned, animated Services menu** (desktop and mobile), showing each service with its sub-services and a shortcut to its package builder.
4. Service pages **link to everything relevant**: matching plans, applicable architectural services, materials, and related services.
5. Run it locally for the owner to review **before any deployment**.

## Non-goals

- Paying for services or labour online. The builder produces a quote request; only materials and plans go through the existing cart/checkout.
- A cross-service project builder that combines several services in one quote (approach B). That's a possible later step.
- Admin-designed fixed packages (approach C).
- Any change to payment code (`lib/daraja.ts`, `lib/flutterwave.ts`, `/api/payments/**`). The owner froze it.
- Entering real labour rates, product mappings or delivery fees. That's the client's content, entered by the admin.

## Anti-goals (failure even if it "works")

- **Showing invented prices.** No labour number may appear unless the admin set it. Placeholder delivery fees must stay labelled as estimates (the existing `isConfigured` flag).
- A total that reads like a binding quote. It is always labelled "indicative", with a note listing how many items are "priced after site visit".
- Breaking the existing quote form, contact pipeline, cart or checkout.
- Animation that janks on mid-range phones, blocks interaction, or ignores `prefers-reduced-motion`.
- A page that looks broken when data is missing (no rates, no plans, no materials, DB unavailable). Every group needs a sensible empty state, and groups with nothing to offer are hidden.

## Constraints

- **Production database is live.** Schema changes must be additive migrations. `.env.local` points at a Neon DB that may be production: local preview must only **read** from it. No migrations get applied and no test submissions get sent without the owner's say-so.
- Pending migration `0015_estimator_rates_and_plan_plot` is not applied. Until it is, the plans store falls back to the static catalogue (`lib/house-plans.ts`), which has the same plan ids. The builder must work with either source (use `lib/plans-store.ts`).
- Next.js 16: route `params`/`searchParams` are Promises.
- Brand: burgundy `ud-burgundy`, charcoal `ud-dark`, existing type and spacing. Header is fixed, transparent over heroes and solid when scrolled.
- No animation library is installed today.

## Approaches considered

| | Approach | Trade-off | Decision |
|---|---|---|---|
| **A** | Package builder embedded on every service page | Fits the "one-stop service page" intent and reuses existing pages, data and the quote pipeline. One quote covers one service. | **Chosen by the owner** |
| B | Separate multi-service "Project Builder" page | Combines services into one quote, but duplicates service pages and is roughly twice the work | Later, on top of A |
| C | Admin-defined fixed packages with optional extras | Needs package content that doesn't exist | Out |

Owner refinement: architectural services and other quotable items can be many, so **every group is multi-select**.

## Design

### 1. Data and linking rules

**Labour rates (new, admin-set).** Additive migration `0016` on `service_subsections`:
- `labour_rate_kes integer NULL`: KES per unit. NULL means priced after site visit.
- `labour_unit text NULL`: one of `sqm` | `m` | `item` | `lump`.

**Missing-column safety.** Code must keep working against a database where `0016` isn't applied yet: production before deploy, or the current preview DB. Subsection reads go through one helper that selects the labour columns and, on a "column does not exist" error, retries without them (labour treated as unset). This covers the public service page, the navigation API and the admin subsections API. Admin writes of labour fields return a clear "run migration 0016" error instead of a 500.

Line maths:
- `sqm`: rate × quantity, with quantity defaulting to the project area (converted from ft² if needed) and editable per line.
- `m` and `item`: rate × quantity, quantity entered per line (default 1).
- `lump`: rate, no quantity.

**Which house plans a service offers** (code rules in a new `lib/services/package-links.ts`, so it works without data edits):
- `building-works` and `architectural` offer **all published plans**, grouped by category (Bungalow, Townhouse, Maisonette, Villa, Apartment, Commercial).
- Any other service offers plans only if one of its subsections has a `planType`. The existing field gets extended to accept a comma-separated list of categories (and the keywords `Residential` = Bungalow/Townhouse/Maisonette/Villa/Apartment, `Commercial` = Commercial).
- Today no other service has a `planType`, so in practice only Building Works and Architectural show plans.

**Which architectural sub-services a service offers** (code rules, same file):
- `building-works`: all published `architectural` subsections (drafting and design, structural details, MEP plan sets).
- `civil-works`: structural details.
- `interior-design`: drafting and design.
- `architectural`: its own subsections, shown as the main work items (not repeated under Design).
- Architectural items are priced by their own labour rate and unit (typically `lump` or `sqm`).

**Which materials a service offers:**
- If the admin has curated `services.material_product_ids` (existing "Service Materials" admin), use exactly those, in that order.
- Otherwise show **suggested** products by category mapping, clearly labelled "Suggested materials":

| Service | Product categories |
|---|---|
| gypsum-ceilings | Gypsum & Ceilings |
| paint-finishes | Paint & Finishes |
| flooring | Flooring |
| cabro-road-works | Cabro & Road Works |
| plumbing | Plumbing |
| building-works | Structural Materials, Hardware, Electrical, Plumbing |
| civil-works | Cabro & Road Works, Structural Materials |
| interior-design | Gypsum & Ceilings, Hardware, Electrical |
| architectural | none |

- **What "area" means depends on the service.** For `building-works` and `architectural`, the field is labelled **"Floor area"**. Material quantities there default to 1 and are not calculated, because catalogue coverage figures are per wall or surface area (a wall block covers 0.08 m² of wall), so calculating from floor area would wildly overcount. For every other service, the field is labelled **"Area to be covered"**. Material quantity = `ceil(area × 1.1 ÷ coverageSqmPerUnit)` when the product has coverage data, which matches the shop's existing `BuildCostEstimator` 10% wastage allowance. Otherwise it is 1. Quantities are always editable.

**Related services:** each service page shows "Often combined with" links to other published services. Static pairs live in the same rules file, for example flooring ↔ paint-finishes ↔ gypsum-ceilings, building-works ↔ architectural ↔ civil-works, and cabro-road-works ↔ civil-works ↔ plumbing.

### 2. Package builder (service page)

**Placement:** a new section near the top of `/services/[slug]`, after the hero and service tabs, titled "Build your package". The sub-service content sections stay below it as reference. Each sub-service section gets an "Add to package" toggle that ticks the same item in the builder.

**Layout:**
- **Desktop:** item groups on the left (about 2/3 width). On the right, a sticky summary card: group subtotals, indicative total, "N items priced after site visit", and the action buttons.
- **Mobile:** groups stacked; the summary collapses into a sticky bottom bar (total + "Review") that expands into a bottom sheet.

```
Build your package — Building Works          Area [ 120 ] m² ⇄ ft²   County [ Nairobi ▾ ]
WORK ITEMS
 ☑ Residential construction    120 m² × KES 18,000/m²            KES 2,160,000
 ☐ Boundary wall               [ 60 ] m × KES 4,500/m
 ☑ Renovation & remodelling    Priced after site visit
DESIGN
 ☑ Plan: 3-Bedroom Bungalow    (•) Digital ( ) Printed           KES 4,500
 ☑ Plan: 4-Bedroom Maisonette  ( ) Digital (•) Printed           KES 8,500
 ☑ Structural details          lump sum                          KES 35,000
MATERIALS (suggested)
 ☑ Cement 50kg ×[ 40 ]                                           KES 34,000
DELIVERY
 ☑ Delivery to Nairobi (estimate)                                KES 3,000
                                    ┌ Summary ───────────────────────────┐
                                    │ Work items      KES 2,160,000      │
                                    │ Design          KES 48,000         │
                                    │ Materials       KES 34,000         │
                                    │ Delivery        KES 3,000          │
                                    │ Indicative total KES 2,245,000     │
                                    │ 1 item priced after site visit     │
                                    │ [ Send as quote request ]          │
                                    │ [ Add materials & plans to cart ]  │
                                    └────────────────────────────────────┘
```
(Numbers are illustrative only and must not ship as data.)

**Behaviour:**
- Nothing is pre-ticked except delivery, which switches on automatically once a physical item is ticked and off when none remain.
- Prices for plans and materials come from the server-loaded catalogue. The client never chooses prices that get trusted; the quote is informational.
- The selection is remembered per service in `localStorage` (wrapped in try/catch) as a convenience.
- **Send as quote request:** a short inline step (name, email, phone, optional notes, contact consent) posts to the existing `POST /api/contact`. `subject` is `Package quote — <Service>`, and `message` is the fully itemised text (each line with quantity, unit, rate, line total or "priced after site visit", then subtotals, total, area, county). It lands in the existing quotes table and admin queue with no schema change. A success state replaces the form.
- **Add materials & plans to cart:** uses the existing `useCart().addItem` (materials: `kind: "material"` with quantity; plans: `kind: "plan"` with the chosen `deliveryMode`). Labour and architectural items are never added to the cart.
- **Empty and failure states:** groups with nothing to offer are hidden. If the database is unavailable, the builder shows only what loaded, plus the existing enquiry form.

**Data loading:** the server component loads the service, subsections (with the labour fields), linked plans (via `lib/plans-store.ts`), linked architectural subsections, materials, related services and delivery zones. It passes plain serialisable props to a client `PackageBuilder` component.

### 3. Services index page (`/services`)

Each service card gets a primary "Build your package" action (links to `/services/<slug>#package`) and small counts: N work items, N plans, N materials. The existing "View Service" and "Request Service Quote" actions stay.

### 4. Services menu redesign (header)

**Desktop:** hovering, focusing or clicking "Our Services" opens a wide **mega-menu panel** under the header, in the brand's dark surface:
- **Left column:** the 9 services, each with its icon and title.
- **Right panel:** the hovered or focused service's short description, up to 6 sub-service links (to `/services/<slug>#<sectionId>`), a "House plans available" chip when the service offers plans, and two actions: "Build your package" and "View service". A footer row links "All services" and "Request a quote".

**Mobile drawer:** "Our Services" expands as an accordion. Each service row can expand again to show its sub-services and a "Build your package" link.

**Animation** (timing and easing set with the motion-design skill before implementation):
- panel opens with fade plus a short downward slide (about 8px) and slight scale, quick ease-out; closes faster;
- left-column items stagger in;
- the right panel cross-fades when the hovered service changes;
- chevron rotates;
- mobile accordion animates its height.
- Under `prefers-reduced-motion`, everything switches to instant or opacity-only.

**Accessibility:** Escape closes the menu and returns focus to the trigger. Tab moves through links, arrow keys move within the left column, and `aria-expanded`/`aria-controls` stay correct. Hover intent uses a small close delay so the panel doesn't flicker when the pointer crosses the gap.

**Data:** extend `GET /api/services/navigation` to return, per published service: `slug`, `title`, `iconName`, `description`, `subsections: [{ sectionId, title }]` and `hasPlans`. It stays one request, already fetched by the header.

### 5. Admin

The **Service Subsections** admin form gets two fields: "Labour rate (KES)" (number, optional) and "Labour unit" (select: per m², per metre, per item, lump sum). The admin API create/update routes accept and validate them (rate a non-negative integer or empty; unit one of the four values or empty). Help text: "Leave empty to show 'Priced after site visit'."

### 6. Local preview and verification (owner's choice: current database, read-only)

- The preview runs against the existing `.env.local` database **read-only**: no migrations applied, no rates entered, no quotes submitted, no emails sent.
- **Consequences:**
  - every labour line shows "Priced after site visit";
  - the subsection reads take the missing-`0016` fallback path, which also proves that safety net;
  - plans come from the static catalogue until `0015` is applied.
- **Verification without writes:**
  - typecheck, lint and build;
  - browser checks of the menu (desktop, mobile, keyboard, reduced motion) and of the builder (ticking, unticking, quantities, totals, delivery auto-toggle, empty states, "Add to cart" using the real cart in `localStorage`);
  - the send-quote step checked by intercepting `fetch` to `/api/contact` in the browser tab, so the itemised payload can be inspected without the request reaching the server;
  - the priced-labour maths covered by small unit checks on the pure calculation helpers, since no rates exist in the data.
- The admin labour fields can only be checked by typecheck and build in this round. Saving them needs migration `0016` on a database the owner chooses.

### 7. Deployment notes (not done in this work)

Apply migrations `0015` and `0016` to production **before** deploying the code. Both are additive.

## Decided by the owner

- Approach A (builder on each service page).
- Labour prices are admin-set rates; unset means "priced after site visit".
- Every group is multi-select (several plans, several architectural services, several work items, several materials).
- Preview locally before deploying, against the current database **read-only** (section 6).
- New menu design with animation.

## Builder's calls (made in this document, open to the owner's correction)

- Labour rate and unit live on each sub-service, not on the service.
- Plan, architectural, materials and related-service links are code rules (`lib/services/package-links.ts`) with admin curation overriding materials. No new admin screens for the linking rules in this round.
- The quote goes through the existing `/api/contact` pipeline as itemised text, with no new quote columns.
- Animation library: `motion` (the Framer Motion successor, React 18 compatible) for enter/exit and stagger, unless the motion-design pass shows CSS transitions are enough.
- Nothing is pre-ticked except automatic delivery.
- Area wording and quantity rules per service, and the 10% wastage allowance (see section 1).
- Subsection reads tolerate a missing `0016` migration (see section 1).

## Left to the implementer

Component breakdown, exact styling within brand tokens (guided by the ui-ux-pro-max / redesign-existing-projects skills per the owner's global instructions), exact animation values (motion-design skill), localStorage key naming, and copy polish.
