# Ujenzi Dhabiti Website Feedback Status

**Reviewed:** 23 September 2026
**Source:** `Website Feedback.docx` supplied by the client
**Scope:** Initial assessment plus an ongoing remediation ledger. The document's feature requests are the items being assessed; the user's direct request authorizes the implementation work.

**How to read this checklist:** `[x] Completed` means the requested visible behavior was implemented and checked in a browser or API. `[ ] Partial` means code or a visible surface exists, but a requested part, production content, or end-to-end proof is missing. `[ ] Not done` means the requested feature itself is absent. A successful build, route response, or code path alone does not prove a complete user journey.

## Direct feedback

- [ ] **01 Partial — Google account prompt at registration.** Google is registered as an auth provider on the live site, and its button redirects to Google with the production callback. No TEST Google account completed the callback, account creation, or buyer login; those database and role effects remain unverified.
- [x] **02 Completed — Show or hide the password while creating an account.** Signup and homepage registration controls have the toggle; the local browser check observed the label change to “Hide password.”
- [x] **03 Completed — Bulk calculator and delivery estimator on shop category pages.** Both render on category pages, and the gypsum category was checked locally with its products scoped to that category.
- [x] **04 Completed — All counties in the delivery estimator.** The live delivery-zones API returned 47 counties on 23 September. This completes the county-list request; the displayed freight fees are still placeholders.
- [x] **05 Completed — Google-based delivery address.** On the live checkout, entering “Nairobi” produced Google Places suggestions; selecting “Nairobi, Kenya” populated the delivery-address field. The separate intended-project API enablement/key restrictions remain a Google Cloud setup issue: the Ujenzi project has no linked billing account, so enabling Places redirects to billing setup.
- [x] **06 Completed — All-county checkout dropdown.** Checkout uses the shared 47-county list, and the dropdown was checked locally.
- [ ] **07 Partial — Separate service tabs/pages and sub-services.** Initially, published services had detail pages, but the admin could add subsections under only four parents and Cabro → Driveway was absent. The local change adds navigation across every published service, allows all existing parents in admin, excludes unpublished direct URLs, and prepares an insert-only import of 72 named profile sub-services. Typecheck/build pass; production import and browser verification remain.
- [ ] **08 Partial — Curated materials package for each service.** Initially, “View Materials” led to broad fallback categories. The local change adds an admin-managed service→catalogue-product selection, an additive schema migration, and a public materials section that displays only actual selected active products with current prices. No mappings have been approved or saved; server migration, admin/public journey, and content selection remain. No fixed quantities are invented.
- [ ] **09 Partial — Every service and description from the company profile.** The supplied profile was found in Downloads. Its 72 named variants are mapped into the insert-only import without overwriting CMS edits. Production catalogue reconciliation and browser proof remain; the quote form's service choices are still hardcoded.
- [ ] **10 Partial — Request a Quote in the House of K form format.** A shared, sectioned construction request form exists, including location, file upload, budget, and consent fields. It is an adaptation rather than a demonstrated exact field-for-field match, and a live successful submit, email receipt, and admin handling were not verified.
- [ ] **11 Partial — That form at the end of every service page.** The shared component is in the dynamic service-page template and was checked on one local service page. Every published service and a successful submission from each context were not tested.
- [x] **12 Completed — Grainger-style Help layout while retaining help content.** The page has self-service tiles, popular topics, retained FAQs, contact tiles, and the email directory; it was checked in a local browser. The live Help route returned HTTP 200 on 23 September.
- [ ] **13 Partial — Contact Us using the same tailored form.** Contact uses the shared sectioned form. A live submission and recipient/record verification remain undone.
- [ ] **14 Partial — Team-member profiles and key competences.** The schema, admin editor, and public profile page exist; the migration was applied, and the live admin editor showed the fields. Approved biographies and competences have not been entered or verified publicly.

## Recommendations in the document

- [ ] **15 Partial — Testimonials, reviews, ratings, client logos, and case-study quotes.** Testimonials can be managed in admin and published on About. Approved entries were not added, a homepage social-proof section was not demonstrated, and client logos/case-study quotes were not completed.
- [ ] **16 Partial — NCA, insurance/bonding, certifications, and years in business.** A credentials admin area and conditional About display exist. Verified evidence and approved public content have not been supplied/published.
- [x] **17 Completed — Visible material unit prices.** Product cards display KES prices. This verifies the display feature, not the commercial accuracy of each product price.
- [x] **18 Completed — Bulk-order quantity calculator.** The calculator computes product quantity × unit price and is available in the shop and on category pages; the gypsum category was checked locally.
- [ ] **19 Partial — Build-cost estimator.** A product coverage/quantity estimator exists. It does not implement the document's floor-area/room-based whole-building estimate and excludes labour, delivery, and uncatalogued materials.
- [ ] **20 Partial — Order tracking through delivery.** A tracking lookup and status page exist; admin status changes and privacy hardening are in code. No TEST order was taken through placement, status updates, customer viewing, and delivery in the deployed database.
- [ ] **21 Partial — Deeper project portfolio.** Fields and pages support before/after media, timeline, budget range, year, country, and permission-controlled client names. Approved project evidence/content and database-backed display checks are still missing.
- [ ] **22 Partial — Filter portfolio by type, country, and year.** The filters are implemented in the page. A populated, database-backed regression check has not been completed.
- [ ] **23 Not done — House-plan filters by bedrooms, plot size, budget, and style.** The public catalogue has a category filter; the requested multi-criteria filters are absent.
- [ ] **24 Partial — Compare house plans.** The catalogue can compare up to three plans, including bedrooms and prices. It has not been tested as a complete production user journey.
- [ ] **25 Partial — Request modifications to a house plan.** A detail-page request form, API, database model, and admin request view exist. A TEST submit → record → admin update → customer result journey was not run.
- [ ] **26 Partial — Blog and SEO resources.** Draft/publish CMS and public listing/detail routes are deployed; the live `/blog` route returns HTTP 200. Approved articles and search-performance evidence are absent.
- [ ] **27 Partial — M-Pesa payment.** M-Pesa is visible as a checkout option and Daraja STK initiation/query/callback code exists. A sandbox STK push, webhook confirmation, receipt, failure case, and complete order journey have not been verified.

**Count:** 8 completed, 18 partial, 1 not done. These are statuses against the document's 27 distinct requested outcomes, not a claim that the platform as a whole has passed regression testing.

## Platform audit and release status

- [x] Repository, architecture, roles, admin CMS, database schema, migrations, environment-variable names, and deployment path were inspected.
- [x] Remediation code was built and tested locally; a production migration and the application release were deployed to Contabo. On 23 September, `/`, `/services`, `/help`, `/blog`, `/request-a-quote`, and the gypsum category returned HTTP 200. The live auth-provider endpoint listed `credentials`, `magic-link`, and `google`.
- [x] The remediation branch was pushed to GitHub at `f066278`.
- [ ] The Contabo checkout was still at `ef7908e` on 23 September. The later `f066278` commit contains documentation only; the running application code is unaffected by that gap.
- [ ] No reusable TEST administrator, client/buyer, or seller accounts were created. The QA-account script exists, but it was not executed against a disposable database.
- [ ] Full registration → login → quote/order → database → admin → client-output tests were not completed for each role. Production data was not altered for QA.
- [ ] Google OAuth account creation/callback, production Places suggestions, email delivery, M-Pesa/card sandbox payment, and complete mobile/accessibility/security regression still need direct end-to-end verification.

## Additional findings from this review

1. **Guest enquiries lack guaranteed admin visibility.** `app/api/contact/route.ts` emails all enquiries but inserts a quote row only when the visitor has a signed-in session. There is no admin quote/enquiry listing under `app/admin`. A guest form journey therefore cannot currently be verified as a persisted, admin-manageable request.
2. **An unpublished service may be reachable by its direct URL.** `app/services/page.tsx` filters the index by `published`, but `app/services/[slug]/page.tsx` looks up a slug without checking `published`. This is a code-level finding requiring a focused test and fix before draft service content can be considered private.
3. **Several current fallback values need owner approval.** County freight rates are labelled placeholders; service-to-product package mappings and staff/trust/portfolio/blog content have not been approved or entered.

The earlier `FEEDBACK_CHECKLIST.md` records implementation work and local checks but uses “done” for some paths that were never proven end to end. This dated reassessment is the status to use for decisions about remaining work.
