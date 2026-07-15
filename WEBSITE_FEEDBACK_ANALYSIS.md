# Website Feedback — Analysis & Action Plan

**Project:** Ujenzi Dhabiti (`ujenzi-dhabiti`)
**Source document:** `Website Feedback.docx`
**Author:** Namutila Nyandusi Wanjala (client)
**Document revision:** 12 — created 2026‑06‑11, last modified 2026‑06‑30
**Analysis date:** 2026‑07‑15
**Analyzed by:** Claude Code

---

## 0. Reading note — which site this is about

The feedback is for **Ujenzi Dhabiti**, the construction‑materials shop + contracting site. It references **Ardhi Safi Ltd** only as a *comparison* ("just the same as what you did for Ardhi Safi Ltd") — Ardhi Safi is a separate, earlier project and is **not** the subject of this document.

Every item below has been checked against the live codebase so the "Current state" notes are accurate, not assumed.

---

## 1. Executive summary

The client's feedback splits into three buckets:

| Bucket | Items | Character |
|---|---|---|
| **A. Concrete fixes** (things broken / missing) | Shop calculators on category pages, incomplete county list, checkout county dropdown, password visibility | Small, well-defined, high ROI |
| **B. Feature/format requests** (rebuild to a reference) | Per-service tabs + materials bundling, Request‑a‑Quote form format, Help page format, Contact form format, Team profiles with competences, Google sign-in | Medium, some need a reference site copied |
| **C. Strategic recommendations** (growth ideas) | Trust/social proof, pricing transparency, order tracking, portfolio depth, house-plans tooling, blog/SEO, M‑Pesa | Larger; several are partially built already |

**Quick wins to do first (bucket A):** show the Bulk Calculator + Delivery Estimator on shop **category** pages, seed **all 47 counties** into delivery zones, convert checkout **County** to a dropdown, add a **password show/hide** toggle. These are low-risk and directly close reported defects.

**Reference sites the client wants us to match:**
- `https://house-ofk.com/service-form` — desired format for **Request a Quote** *and* **Contact Us**, and to appear at the bottom of **every service page**.
- `https://www.grainger.com/content/help` — desired structure for the **Help** page (keep ours, add what's missing).

---

## 2. Section-by-section analysis

Legend for effort: **S** = small (hours), **M** = medium (1–2 days), **L** = large (multi-day / needs decisions).

---

### 2.1 Registration Section

> **Feedback**
> - Can you have the email section have a Google account prompt.
> - Under the password, can the user be able to see the password while creating it.

**Current state** — `app/auth/signup/page.tsx`
- Form fields: `name, email, phone, password, confirm` (line 12). Password fields are hard-coded `type="password"` (lines 67–68, 75); **no show/hide toggle**.
- Auth uses NextAuth **credentials** provider only (`signIn("credentials", …)`, line 40). **No Google OAuth provider is wired.**

**Gap & work**
1. **Google sign-in** — add Google as a NextAuth provider and a "Continue with Google" button on both signup and signin. *Requires:* Google OAuth client ID/secret (client to provide / we create in Google Cloud), and `GOOGLE_CLIENT_ID` / `GOOGLE_CLIENT_SECRET` env vars. **Effort: M.**
2. **Password visibility toggle** — add an eye icon that flips `type` between `password`/`text` on the Password and Confirm fields. **Effort: S.**

---

### 2.2 Shop

> **Feedback**
> - When you click a specific category (e.g. Gypsum), the **bulk calculator** and **delivery estimator** don't appear on the page. Please include them.
> - Under the delivery estimator, **not all counties appear**.
> - At **proceed to checkout**:
>   - Delivery address — can it be **Google-based** (autocomplete)?
>   - County — can we have a **dropdown for all counties**?

**Current state**
- **Calculators exist and work**, but only on the *main* shop landing page: `app/shop/page.tsx` imports and renders `BulkCalculator` (line 268) and `DeliveryEstimator` (line 269). The **category** page (`app/shop/category/[slug]/CategoryClient.tsx` / `CategoryBundle.tsx`) does **not** render them. → Feedback is correct.
- **Counties:** `DeliveryEstimator` pulls from `/api/delivery-zones`, falling back to the `DELIVERY_ZONES` constant in `lib/delivery.ts`, which currently defines **only ~16 counties** (Kenya has **47**). → That is exactly why "not all counties appear."
- **Checkout** (`app/shop/checkout/page.tsx`):
  - Delivery Address is a plain free-text `<Field>` (line 297) — **not** Google Places autocomplete.
  - County is a plain free-text `<Field>` (line 298) — **not** a dropdown.

**Gap & work**
1. **Render `BulkCalculator` + `DeliveryEstimator` on category pages** — reuse the existing components inside the category view (likely as a sidebar/section in `CategoryClient.tsx`), scoping the calculator's product list to that category. **Effort: S–M.**
2. **Seed all 47 counties** into delivery zones — extend `DELIVERY_ZONES` in `lib/delivery.ts` (and the DB seed at `lib/db/seed.ts:596`) to cover every county with a delivery fee. Decide fee tiers with the client. **Effort: S** (data entry + a fee schedule decision).
3. **Checkout County → dropdown** — replace the free-text field with a `<select>` populated from the 47-county list (single source of truth shared with the estimator). **Effort: S.**
4. **Google-based delivery address** — integrate Google Places Autocomplete on the address field. *Requires:* Google Maps JS API key with Places enabled. Consider capturing lat/lng for delivery routing. **Effort: M.**

> **Decision needed:** a single canonical **47-county list** should live in one module and be reused by the estimator, checkout dropdown, and delivery-zone seed. Recommend creating `lib/kenya-counties.ts`.

---

### 2.3 Our Services

> **Feedback**
> - Have each service appear on **its own tab**, so all construction services from the company profile are represented. This lets us **bundle the construction materials under each service** — more specific than now. Example:
>   - *Our Services → Cabro Paving → Driveway cabro paving → service description + materials package* (with a tab that leads to **shop the materials** — builds client confidence that we can deliver both the service and the materials).
> - Lastly, I'd like **all the services I provided, plus their descriptions**, to appear.

**Current state**
- `app/services/page.tsx` renders a flat list from the `services` DB table (falling back to `SERVICES_STATIC`, line 15), filtered to a set of "core" slugs (line 141).
- `app/services/[slug]/page.tsx` already has the building blocks: `ServiceIntro`, `ServiceSection`, and a **`ServiceMaterialsBar`** that links to a shop category (lines 34–93). So "service → shop the materials" is **partially built** — it currently links to a *fallback category* per slug (`getShopCategory`, lines 35–41), not a curated materials package.
- The `services` schema (`lib/db/schema.ts:449`) already has `includes[]` and `materials[]` arrays — good foundation for bundling.

**Gap & work**
1. **Tabbed / per-service structure** — the client wants each service as its own tab with sub-services (e.g. Cabro Paving → *Driveway* cabro paving). This implies a **service → sub-service** hierarchy that doesn't exist yet. Needs a data-model decision (nested services, or a `parentSlug` column). **Effort: L.**
2. **Curated materials package per service** — link each service to a specific set of shop products (a bundle), not just a fallback category. Leverage `materials[]` / a join to products. Surface a clear "**Shop these materials**" tab/CTA. **Effort: M.**
3. **Show ALL services + descriptions** — remove/relax the "core slugs" filter (line 141) so every service from the company profile appears. *Requires:* the client's **full service list with descriptions** (the doc says "all the services I provided" — we need that source list). **Effort: S once content is supplied.**

> **Content needed from client:** the complete list of services + sub-services + descriptions, and which shop products belong to each service's materials package.

---

### 2.4 Request a Quote

> **Feedback**
> Use this format: `https://house-ofk.com/service-form`. I'd like this format at the **end of every service page** as well. Tailor it to our company and services. **Use the same exact format.**

**Current state** — `app/request-a-quote/page.tsx` exists (~66 lines) — a basic quote page, not modeled on the reference.

**✅ Reference captured** — the House of K `service-form` was rendered live (it's a JS app; a plain fetch only sees a loading logo). It is a **long, single-page form broken into labelled sections**, with radio choices, a Google-based location search, file uploads, and consent checkboxes. Full structure documented in **§4A** below.

**Gap & work**
- Rebuild the Request‑a‑Quote form to match the House of K sectioned layout (see §4A), **re-worded for Ujenzi Dhabiti's construction services** (not architecture/interior design).
- Embed the same form (or a compact variant) at the **bottom of every `/services/[slug]` page**.
- Build it as **one shared `<ServiceRequestForm>` component** so Request‑a‑Quote, Contact Us (§2.6), and the per-service footer all reuse it.
- **Effort: M.**

---

### 2.5 Help Section

> **Feedback**
> Incorporate the format used by `https://www.grainger.com/content/help`. **Retain what you've already put**, but add what's missing from that site.

**Current state** — `app/help/page.tsx` exists (~142 lines).

**✅ Reference captured** (via client screenshot — Grainger is Akamai bot-protected and can't be auto-loaded). Full "Grainger Help Desk" structure documented in **§4B** below. Key takeaway: it's a **tile/topic-based help hub**, not a search-first knowledge base — the only search is the global product search in the top nav.

**Gap & work**
- Keep our existing Help content and layer on Grainger's structure: **hero band → Self-Service tiles → Popular Topics link columns → "How can I contact us?" tiles** (see §4B).
- Map the tiles to Ujenzi Dhabiti equivalents (track order, pay/download invoice, account info; quotes, order tracking, returns; chat/call/email).
- **Effort: M.**

---

### 2.6 Contact Us

> **Feedback**
> Use the `https://house-ofk.com/service-form` format (same as Request a Quote). Tailor to our company/services. **Use the same exact format.**

**Current state** — `app/contact/page.tsx` exists (~136 lines).

**Gap & work**
- Same reference form as Request‑a‑Quote (§2.4). Once that form component is built, reuse it here so Contact and Request‑a‑Quote share one implementation.
- **Effort: S–M** (mostly shared with §2.4).

---

### 2.7 Admin Section — Team Members

> **Feedback**
> Let it have a **profile section with Key competences**, just the same as what you did for Ardhi Safi Ltd.

**Current state**
- `team_members` table (`lib/db/schema.ts:420`) has only: `id, name, title, image, sortOrder`. **No bio / competences / profile fields.**
- Admin at `app/admin/team/page.tsx`; public team display is minimal.
- *Reference:* Ardhi Safi's team model has `bio`, `linkedin`, `email`, and dedicated team-member profile pages (`/about/team/[slug]`).

**Gap & work**
1. **Schema:** add `bio` (text) and `competences` (text[]) — optionally `slug`, `email`, `linkedin` — to `team_members`; write a Drizzle migration. **Effort: S.**
2. **Admin form:** add fields to create/edit the profile + key competences. **Effort: S.**
3. **Public profile:** a team-member profile view mirroring Ardhi Safi's. **Effort: M.**

---

## 3. "More Recommendations" (strategic / growth)

These are the analyst's own gap ideas in the doc. Several are **already partially implemented** — noted below.

| # | Recommendation (client doc) | Current state in codebase | Suggested action | Effort |
|---|---|---|---|---|
| 1 | **Trust & credibility** — no visible testimonials/reviews/ratings; add social proof, client logos, NCA registration, insurance/bonding, years in business | No testimonials surface found on home; `why-choose-us`, `core-values`, `stats` admin sections exist | Add testimonials model + homepage carousel; add a "credentials/registration" strip (NCA, insurance) | M |
| 2 | **Pricing transparency & shop tools** — show upfront unit pricing ("from KES X"), bulk-order calculator, build-cost estimator | Bulk calculator + delivery estimator **already exist** (§2.2); pricing visibility TBD | Ensure product prices are visible pre-quote; add a "build cost estimator" (sq ft/rooms → rough materials cost) | M–L |
| 3 | **Delivery & order tracking** — order-status page (placed → processing → out for delivery → delivered) | **Already scaffolded:** `app/track/[orderId]` exists | Verify the tracking states are wired to order status + notify customer; polish UI | S–M |
| 4 | **Project portfolio depth** — "What We've Built" is thin (3 projects); add before/after, timelines, budgets, filters | `app/what-we-built` + `[id]` detail + `admin/projects` exist | Extend project schema (before/after images, timeline, budget range, type/year filters) | M |
| 5 | **House plans shop** — underdeveloped; add plan comparison (bedrooms/plot/budget/style) + request-modifications flow | `app/shop/plans` + `[id]`, `admin/plans`, `admin/architectural`, plans checkout exist | Add filter/compare UI + "request modifications to this plan" flow | M |
| 6 | **Content / SEO** — no blog or resource hub ("cement for a 3-bed bungalow", "cost per m² Nairobi 2026") | No blog module found | Add a blog/resource CMS + articles targeting self-build search queries | L |
| 7 | **M‑Pesa & local payments** — surface "Pay with M‑Pesa" prominently | **Already integrated:** `app/api/payments/mpesa/{initiate,query,callback}` + Flutterwave | Verify STK push works end-to-end at checkout; add a visible "Pay with M‑Pesa" badge | S–M |

> Notable: items **3, 7** (and partly **2, 5**) are already built or scaffolded. The work there is **verification + surfacing**, not building from scratch — worth confirming with the client that these already exist.

---

## 4. Prioritized action plan

**Phase 1 — Quick defect fixes (bucket A, low risk):**
1. Calculators on shop **category** pages (§2.2‑1)
2. Seed **all 47 counties** into delivery zones + shared county list (§2.2‑2)
3. Checkout **County dropdown** (§2.2‑3)
4. Password **show/hide** toggle (§2.1‑2)

**Phase 2 — Forms & content (needs reference sites + client content):**
5. Request‑a‑Quote form to `house-ofk` format + embed on service pages (§2.4)
6. Contact form sharing the same component (§2.6)
7. Help page — add Grainger-style structure (§2.5)
8. Show **all services + descriptions** (§2.3‑3) — needs client's service list
9. Team profiles + **key competences** (schema + admin + public) (§2.7)

**Phase 3 — Larger features / decisions:**
10. Google sign-in (§2.1‑1) — needs OAuth credentials
11. Google Places autocomplete on delivery address (§2.2‑4) — needs Maps API key
12. Per-service **tabs + sub-services + materials bundling** (§2.3‑1/2) — needs data-model decision + content

**Phase 4 — Strategic growth (§3):**
13. Trust/testimonials + credentials strip
14. Verify & surface order tracking + M‑Pesa (already built)
15. Portfolio depth, house-plan compare/modify, build-cost estimator
16. Blog / SEO resource hub

---

## 4A. Reference form captured — House of K `service-form`

**Source:** `https://house-ofk.com/service-form` (rendered live — it's a JS single-page app).
This is the exact layout Wanjala wants replicated for **Request a Quote** *and* **Contact Us**, and repeated at the bottom of every service page — re-worded for Ujenzi Dhabiti's construction services.

**Header intro:** *"Get in touch with us — Fill in the details below and we will get back to you within 7 days with a designer who will fulfill all you are looking for."* (We'll reword: e.g. "…get back to you within X days with a quote / a specialist for your project.")

The form is **one scrolling page divided into titled sections**:

**1. Client Information & Requirements**
- Name (text)
- Phone number (tel)
- Email address (email)
- Location of Project (text)
- Which service do you require? (single-choice) — *their options:* Architectural Design · Interior Design · Walk your plan · Renovation / Remodeling · Structural Engineering · Other → **replace with Ujenzi Dhabiti's services** (e.g. Cabro Paving, Building Works, Roofing, Plumbing, etc.)

**2. Project Overview**
- Project name (text)
- Brief description of project (textarea)
- Type of project (single-choice): Residential – Single Family · Residential – Apartment/Flats · Commercial – Office/Shop/Hotel · Institutional – School/Church/Hospital · Industrial/Warehousing · Interior Renovation Only · Other

**3. Location information**
- Do you already own the land/site? (Yes / No / In the process)
- Plot Size (sqm or acres) (text)
- **Search Location** — a Google-based location search (ties to the "google-based" requests elsewhere in the feedback)
- Site access & terrain: Easily accessible (flat, road access) · Sloped / Hilly · Remote / Limited access

**4. Required scope** — "What services do you require from the Designer/Architect?" (multi-select checklist) → reword to Ujenzi's deliverables

**5. Project Timelines**
- Estimated Start Date (date)
- Timeline: Less than 1 month · 1–3 months · 3–6 months · 6 months+
- Budget: Below KES 1M · 1M–3M · 3M–7M · 7M–15M · Over 15M · Not Sure

**6. Design Direction (optional uploads + style)**
- Upload hints: Site Plan / Title Deed · Existing Drawings/Sketches · Survey Map · Pinterest/Mood Board · Notes/Vision Document
- Style tags (multi): Modern · Contemporary · Minimalist · Rustic/Afrocentric · Traditional/Swahili · Industrial · Site Supervision · Not sure
- Drag-drop image upload — SVG/PNG/JPG/GIF, max 2MB; plus Links / File Upload

**7. Closing**
- "Anything else you'd like us to know?" (textarea)
- Consent checkboxes: ☑ "I confirm the information provided is accurate" ☑ "I agree to be contacted by a representative"
- **Submit** button

**Implementation notes for Ujenzi Dhabiti:**
- Build one reusable `<ServiceRequestForm serviceContext?="…">` component; when embedded on `/services/[slug]`, pre-select the "Which service" field to that service.
- The **Search Location** + upload fields need the Google Places API key and the existing `/api/upload` route.
- Reword every option set from architecture/interior-design language to construction (materials + contracting).

---

## 4B. Reference help page captured — Grainger Help Desk

**Source:** `grainger.com/content/help` (Akamai bot-protected — captured from a client screenshot). This is the layout Wanjala wants mirrored for **Help**, keeping our current content and adding what's missing.

**Structure, top to bottom:**

**1. Hero band** (dark, full-width) — breadcrumb "Home | Help", large title **"GRAINGER HELP DESK"**, subtitle *"Check out popular help topics or chat, call or email with us. We're standing by and ready to help!"*, friendly staff photo on the right. A small **Feedback** button sits just below the hero.

**2. Self Service Options** — a row of **3 icon tiles**:
- Track Order / Review Order History
- Pay an Invoice Online
- Update My Account Info

**3. Popular Topics** — **3 link columns**, each a grouped topic list:
- **Placing Orders:** Quotes · Auto-Reorder · Lists · Branch Locations and Hours
- **Order Information:** Order History & Tracking · Online Invoices · Returns, Warranty and Cancellations
- **Account Settings:** Checkout Defaults · Order Management System · User Management · Account Settings

**4. "How can I contact Grainger?"** — a row of **3 contact tiles** (red icons):
- **Chat** (with hours)
- **Call** (phone number)
- **Email** (Send a Message)

**5. Mega footer** — About Us · Order Support · social links · email signup · mobile apps · Feedback.

> **Note:** there is **no dedicated help search box** in the body — help is navigated purely via tiles + topic links. So we don't need to build a help-search engine; we need well-organized tiles.

**Suggested mapping → Ujenzi Dhabiti "Help Desk":**

| Grainger element | Ujenzi Dhabiti equivalent |
|---|---|
| Hero "Grainger Help Desk" | "Ujenzi Dhabiti Help Center" + support photo/graphic |
| Self-Service: Track Order | **Track Order** → link to existing `app/track/[orderId]` |
| Self-Service: Pay an Invoice | Download/pay order invoice (from `account/orders`) |
| Self-Service: Update Account | Link to `account/profile` |
| Popular: Placing Orders | Requesting a quote, bulk orders, saved carts (`account/saved-carts`), plans |
| Popular: Order Information | Order tracking, delivery zones/fees, returns policy |
| Popular: Account Settings | Addresses (`account/addresses`), contractor pricing, profile |
| Contact: Chat / Call / Email | WhatsApp/chat · phone · contact form (reuse §4A form) |

**Effort: M** — mostly layout + wiring to pages that already exist (`track`, `account/*`).

---

## 5. Open questions / blockers (need client input before starting)

1. **Reference form** — ✅ House of K `service-form` captured and documented (§4A). Confirm which sections to keep vs. drop (e.g. do we need the "Design Direction / mood board" section for a construction/materials company?).
2. **Help page** — ✅ Grainger Help Desk captured (§4B). Confirm the tile/topic set you want for Ujenzi Dhabiti (proposed mapping in §4B) and the contact channels (WhatsApp vs live chat, support phone, support email).
3. **Full services list** — the client says "all the services I provided" + descriptions. **Please share that source list** (from the company profile) and the **sub-services** under each (e.g. Cabro Paving → Driveway).
4. **Materials bundling** — for each service, which **shop products** form its materials package?
5. **Delivery fees** — fee amount for each of the 47 counties (or a tiered scheme: Nairobi metro / regional / remote).
6. **Google integrations** — who provides the **Google OAuth** credentials and the **Maps/Places API** key (billing enabled)?
7. **Already-built features** — confirm the client is aware that **order tracking** (`/track/[orderId]`) and **M‑Pesa** payments already exist, so effort focuses on surfacing/verifying rather than rebuilding.

---

## 6. Verbatim feedback (for reference)

> **Registration Section**
> - Can you have the email section have a google account prompt
> - Under the password can the user be able to see the password will creating it
>
> **Shop**
> - When you click on a specific category, for example gypsum category, the bulk calculator and the delivery estimator don't appear on the page. Could you include them.
> - Under the delivery estimator all the counties don't appear.
> - At the proceed to check out section, under; Delivery address, can it be google-based / County section, can we have the drop down for all the counties
>
> **Our Services**
> - Can we have each service appear on its own tab so that all the construction services provided in the profile [are shown]. This will help us bundle the construction materials under each service… For example; Our services – Cabro Paving – Driveway cabro paving – Service description plus materials package (whereby there's a tab that leads to shop the materials…). Lastly, I'd like all the services I provided plus their descriptions appear.
>
> **Request a Quote** — Use this format https://house-ofk.com/service-form (…at the end of every page of a service we provide as well). Tailor make it to suit our company and the services we provide. Use the same exact format.
>
> **Help Section** — Can we also incorporate the format used by https://www.grainger.com/content/help. Retain what you've already put but add what's missing from this website.
>
> **Contact Us** — Use this format https://house-ofk.com/service-form (… for Request a quote as well). Tailor make it to suit our company. Use the same exact format.
>
> **ADMIN SECTION — Team Members** — Let it have a profile section with Key competences just the same as what you did for Ardhi Safi Ltd.
>
> **More Recommendations:** Trust & credibility (testimonials, NCA registration, insurance, years in business); Pricing transparency & shop tools; Delivery & order tracking; Project portfolio depth; House plans shop tooling; Content/SEO blog; M‑Pesa payment integration.
