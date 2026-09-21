# Website Feedback — Line-by-Line Implementation Checklist

**Source:** `Website Feedback.docx` (Wanjala, rev 12) · **Companion:** `WEBSITE_FEEDBACK_ANALYSIS.md`
**Last audit:** 2026-09-21 — local source, production build, runtime smoke tests, and authorized read-only browser checks were re-run. Environment/content-dependent items remain explicitly marked.

Legend: ✅ done & verified · 🟡 partial / groundwork done · ⬜ not started · 🔒 blocked on client input

---

## 1. Registration Section

| # | Feedback (verbatim intent) | Status | Evidence / What remains |
|---|---|---|---|
| 1.1 | Email section: **Google account prompt** (sign in with Google) | 🟡 | `lib/auth.ts` conditionally registers Google and safely upserts buyers; dedicated and homepage auth pages render the button when the provider is configured. Google Cloud access showed no Ujenzi project/client, so live OAuth remains unverified. |
| 1.2 | User can **see the password while creating it** | ✅ | Dedicated and homepage auth have Eye/EyeOff controls; local browser verification changed the control to “Hide password”. Signup and profile password validation are 8–128 characters. |

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
| 3.1 | **Each service on its own tab**, with sub-services (Cabro Paving → Driveway cabro paving) | 🟡 | Every published CMS service now links to a dynamic detail page; subsection navigation is rendered when subsection data exists, with a CMS overview fallback otherwise. A nested sub-service data model/content set is still needed for the full Cabro→Driveway hierarchy. |
| 3.2 | **Bundle construction materials under each service** ("shop the materials" tab per service) | 🟡 | `ServiceMaterialsBar` already links each service to a fallback shop category (`app/services/[slug]/page.tsx:34-93`). Curated per-service product packages **not yet built** — 🔒 needs client's service→products mapping. |
| 3.3 | **All services from the profile + descriptions must appear** | 🟡 | Public index now uses every published `services` row and no longer filters to five core slugs or injects a stale static list. Production data still needs post-migration verification. |

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
| 7.1 | Profile section with **Key competences** (like Ardhi Safi) | 🟡 | Added `bio` and `competences[]` schema fields, admin inputs, public competence chips, and dedicated `/about/team/[id]` pages. Drizzle migration `0012_dizzy_mantis.sql` is generated; apply it only to the authorized deployment database and populate approved staff data. |

## 8. "More Recommendations"

| # | Recommendation | Status | Evidence / What remains |
|---|---|---|---|
| 8.1 | Trust & credibility: testimonials, client logos, NCA registration, insurance, years in business | 🟡 | Added unpublished-by-default testimonials and credentials models, admin CRUD, validation, and conditional public About sections. No proof is fabricated; approved content remains to be supplied and published. |
| 8.2 | Pricing transparency + bulk calculator + build-cost estimator | 🟡 | Unit prices, bulk calculator, category estimator, and a coverage-based material estimator are present. The estimator documents 10% waste and excludes labour, delivery, and non-catalogue materials; it is not a full project quote engine. |
| 8.3 | Order tracking (placed → processing → out for delivery → delivered) | ✅ | Wiring verified end-to-end: `/track/[orderId]` fetches `/api/orders/[id]`; admin sets status via `/api/admin/orders/[id]/status` (STATUS_STEPS: pending→paid→processing→dispatched→delivered). Added a `/track` **landing page** (order-number lookup) linked from the Help Center. |
| 8.4 | Project portfolio depth (before/after, timelines, budgets, filters) | 🟡 | Added country/year/timeline/budget/client-name permission fields, admin controls, public metadata, and category/country/year filters. Approved content and migration deployment remain. |
| 8.5 | House plans: comparison filters + request-modification flow | 🟡 | Added up-to-three-plan comparison and a structured customization request with admin status workflow and migration. Safe DB-backed E2E remains. |
| 8.6 | Blog / SEO resource hub | 🟡 | Added draft-by-default blog schema, admin CRUD, published-only listing/detail routes, navigation, and an honest empty state. Reviewed articles remain to be authored. |
| 8.7 | M-Pesa visible at checkout | ✅ (pre-existing) | Checkout references M-Pesa 25× incl. payment method selector; Daraja STK APIs live under `app/api/payments/mpesa/*`. To do: end-to-end STK test on production creds (currently sandbox env). |

---

## Extras completed beyond the document (this session)

- ✅ Empty product-image warnings eliminated — `ProductCard` now resolves `image` **or** DB `images[0]` with a Package-icon placeholder; same guard on CartSidebar + checkout thumbnails. Zero DB changes. Browser-verified: 0 empty-src imgs, clean console.
- ✅ Cart now stores the resolved image so no-image products stay clean through cart → checkout.
- ✅ `tsc --noEmit`, `npm run build`, `git diff --check`, and local production-server smoke tests pass. Lint exits 0 with the existing `<img>` optimization warnings in blog/track pages.
- ✅ Public local runtime checks: 200 for primary pages, 404 for unknown dynamic records, 400 for invalid write payloads, 403 for unauthenticated admin APIs, and 47 unique delivery counties.
- ✅ Removed the active hardcoded Gypsum sample bundle so fake product IDs/prices cannot appear as a real package.

## Blocked-on-client summary (nothing moves without these)

1. **Google OAuth credentials and deployment configuration** → unlocks live verification for 1.1.
2. **Full services list + descriptions + sub-services** → unlocks 3.1/3.3.
3. **Service → materials package mapping** → unlocks 3.2.
4. **Real freight fees per county** → replaces placeholder rates in 2.2.
5. **Approval for team/content schema migration** (deployment DB) → unlocks production verification for 7.1, 8.1, 8.4, 8.5, and 8.6.
6. **Disposable database/staging credentials** → unlocks role-based and database-backed E2E tests. A guarded `npm run db:seed-qa` script is available but refuses unapproved execution.

## Suggested build order for the remaining work

1. `<ServiceRequestForm>` (4.1) → reuse for Contact (6.1) + service-page embeds (4.2) — three items, one build.
2. Help page Grainger layout (5.1) — mostly wiring to existing pages.
3. Google Places autocomplete on checkout address (2.3) — key already in env.
4. Team competences (7.1) once migration is approved.
5. Trust/testimonials (8.1) → then 8.2–8.6 as prioritized.
