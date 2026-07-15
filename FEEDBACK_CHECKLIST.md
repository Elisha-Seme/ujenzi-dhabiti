# Website Feedback — Line-by-Line Implementation Checklist

**Source:** `Website Feedback.docx` (Wanjala, rev 12) · **Companion:** `WEBSITE_FEEDBACK_ANALYSIS.md`
**Last audit:** 2026-07-15 — every tick below was verified against the actual code, not memory.

Legend: ✅ done & verified · 🟡 partial / groundwork done · ⬜ not started · 🔒 blocked on client input

---

## 1. Registration Section

| # | Feedback (verbatim intent) | Status | Evidence / What remains |
|---|---|---|---|
| 1.1 | Email section: **Google account prompt** (sign in with Google) | 🔒 ⬜ | No Google provider wired (`grep google app/auth/signup/page.tsx` → 0). **Blocked:** client to provide Google OAuth Client ID + Secret ("i'll do the google thing later"). |
| 1.2 | User can **see the password while creating it** | ✅ | `app/auth/signup/page.tsx` — Eye/EyeOff toggle on both Password + Confirm (aria-labels flip Show/Hide). Bonus: same toggle on `app/auth/signin/page.tsx`. Browser-verified: type flips `password`↔`text`. |

## 2. Shop

| # | Feedback | Status | Evidence / What remains |
|---|---|---|---|
| 2.1 | Category page (e.g. **gypsum**): **bulk calculator + delivery estimator must appear** | ✅ | `app/shop/category/[slug]/page.tsx:8-9,99-100` — Smart Tools section renders both; BulkCalculator scoped to that category's products. Browser-verified on `/shop/category/gypsum-ceilings` (product select = exactly the 3 gypsum items). |
| 2.2 | Delivery estimator: **all counties must appear** | ✅ | New `lib/kenya-counties.ts` (47 counties, verified count). `DeliveryEstimator.tsx:42` maps `KENYA_COUNTIES`; `lib/delivery.ts` has a placeholder fee for every county. Browser-verified: 47 options, Baringo→West Pokot. ⚠️ Fees are placeholders — client to confirm real freight schedule. |
| 2.3 | Checkout → Delivery address: **Google-based** (autocomplete) | ✅ | New `components/ui/PlacesAutocompleteInput.tsx` (Kenya-restricted, graceful fallback to plain input if the key/script fails). Wired into checkout Delivery Address + the request form's location fields. Browser-verified: Google Places API loaded and `Autocomplete` active on localhost. ⚠️ Still recommend a dedicated, domain-restricted Ujenzi key before production. |
| 2.4 | Checkout → County: **dropdown with all counties** | ✅ | `app/shop/checkout/page.tsx:299` — `SelectField` fed by `KENYA_COUNTIES`. Browser-verified: 47 options + "Select your county…" placeholder. |

## 3. Our Services

| # | Feedback | Status | Evidence / What remains |
|---|---|---|---|
| 3.1 | **Each service on its own tab**, with sub-services (Cabro Paving → Driveway cabro paving) | ⬜ | Current `/services/[slug]` pages exist but no sub-service hierarchy. Needs data-model decision (parent/child services). |
| 3.2 | **Bundle construction materials under each service** ("shop the materials" tab per service) | 🟡 | `ServiceMaterialsBar` already links each service to a fallback shop category (`app/services/[slug]/page.tsx:34-93`). Curated per-service product packages **not yet built** — 🔒 needs client's service→products mapping. |
| 3.3 | **All services from the profile + descriptions must appear** | 🔒 ⬜ | `app/services/page.tsx:140-141` still filters to 5 core slugs. **Blocked:** client to supply the complete services list + descriptions. |

## 4. Request a Quote

| # | Feedback | Status | Evidence / What remains |
|---|---|---|---|
| 4.1 | Rebuild in the **house-ofk.com/service-form format** (sectioned form; full field map captured in analysis §4A) | ✅ | New `components/sections/ServiceRequestForm.tsx` — 6 titled section cards (Client Info · Project Overview · Location · Timelines & Budget · Supporting Docs · Notes & Consent), Places location search, county dropdown, multi-file upload, consent checkboxes. Wired to existing `/api/contact`. `app/request-a-quote/page.tsx` rebuilt. Browser + production-build verified. |
| 4.2 | Same form **at the end of every service page** | ✅ | `components/services/ServiceEnquiry.tsx` now renders `ServiceRequestForm`, pre-checking the page's service family (e.g. Building Works page ticks both Building Works options). Verified on `/services/building-works`. |

## 5. Help Section

| # | Feedback | Status | Evidence / What remains |
|---|---|---|---|
| 5.1 | Adopt **Grainger help-desk format**; keep existing content, add what's missing | ✅ | `app/help/page.tsx` rebuilt: "Ujenzi Dhabiti Help Center" hero → **Self-Service tiles** (Track Order → new `/track`, Orders/Invoices, Update Account) → **Popular Topics** 3 columns → existing FAQ (retained) → **"How can I contact us?"** WhatsApp/Call/Email tiles → email directory (retained). Browser-verified, clean console. |

## 6. Contact Us

| # | Feedback | Status | Evidence / What remains |
|---|---|---|---|
| 6.1 | Same **house-ofk service-form format**, tailored to Ujenzi | ✅ | `app/contact/page.tsx` now leads with the shared `ServiceRequestForm` (subject prefix "Contact Enquiry"), keeping the contact details + map below. Browser-verified, clean console. |

## 7. Admin — Team Members

| # | Feedback | Status | Evidence / What remains |
|---|---|---|---|
| 7.1 | Profile section with **Key competences** (like Ardhi Safi) | ⬜ | `team_members` schema still only `id, name, title, image, sortOrder` (`grep competences lib/db/schema.ts` → 0). Needs migration (`bio`, `competences[]`) + admin form + public profile. ⚠️ Schema change touches the production DB — do via a reviewed Drizzle migration, coordinated with client. |

## 8. "More Recommendations"

| # | Recommendation | Status | Evidence / What remains |
|---|---|---|---|
| 8.1 | Trust & credibility: testimonials, client logos, NCA registration, insurance, years in business | ⬜ | No testimonials component on home (`components/home/` has none; grep → 0). Needs testimonials model + homepage section + credentials strip. |
| 8.2 | Pricing transparency + bulk calculator + build-cost estimator | 🟡 | Prices shown per unit on cards ✅; BulkCalculator ✅ (now also on category pages). "Build cost estimator" (sqft→materials) ⬜ — note `products.coverageSqmPerUnit` column already exists to power it. |
| 8.3 | Order tracking (placed → processing → out for delivery → delivered) | ✅ | Wiring verified end-to-end: `/track/[orderId]` fetches `/api/orders/[id]`; admin sets status via `/api/admin/orders/[id]/status` (STATUS_STEPS: pending→paid→processing→dispatched→delivered). Added a `/track` **landing page** (order-number lookup) linked from the Help Center. |
| 8.4 | Project portfolio depth (before/after, timelines, budgets, filters) | ⬜ | `app/what-we-built` + admin exist but thin. Schema extension needed. |
| 8.5 | House plans: comparison filters + request-modification flow | ⬜ | `/shop/plans` exists; no compare/modify flow yet. |
| 8.6 | Blog / SEO resource hub | ⬜ | No blog module in the codebase. Largest net-new build. |
| 8.7 | M-Pesa visible at checkout | ✅ (pre-existing) | Checkout references M-Pesa 25× incl. payment method selector; Daraja STK APIs live under `app/api/payments/mpesa/*`. To do: end-to-end STK test on production creds (currently sandbox env). |

---

## Extras completed beyond the document (this session)

- ✅ Empty product-image warnings eliminated — `ProductCard` now resolves `image` **or** DB `images[0]` with a Package-icon placeholder; same guard on CartSidebar + checkout thumbnails. Zero DB changes. Browser-verified: 0 empty-src imgs, clean console.
- ✅ Cart now stores the resolved image so no-image products stay clean through cart → checkout.
- ✅ `tsc --noEmit` + `eslint` clean on every touched file.

## Blocked-on-client summary (nothing moves without these)

1. **Google OAuth credentials** → unlocks 1.1 (client: "later").
2. **Full services list + descriptions + sub-services** → unlocks 3.1/3.3.
3. **Service → materials package mapping** → unlocks 3.2.
4. **Real freight fees per county** → replaces placeholder rates in 2.2.
5. **Approval for team schema migration** (production DB) → unlocks 7.1.

## Suggested build order for the remaining work

1. `<ServiceRequestForm>` (4.1) → reuse for Contact (6.1) + service-page embeds (4.2) — three items, one build.
2. Help page Grainger layout (5.1) — mostly wiring to existing pages.
3. Google Places autocomplete on checkout address (2.3) — key already in env.
4. Team competences (7.1) once migration is approved.
5. Trust/testimonials (8.1) → then 8.2–8.6 as prioritized.
