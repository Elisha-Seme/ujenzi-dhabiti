# Ujenzi Dhabiti Remediation Plan

## Rules

- Work only in `Elisha-Seme/ujenzi-dhabiti` on `master` unless a dedicated branch is created before implementation.
- Preserve the current product architecture and existing data. No production deletes, resets, credential rotation, DNS changes, or infrastructure changes.
- Never commit secrets. Use local/staging environment variables and redact credentials from logs and reports.
- Do not mark an item verified from source inspection alone; each item needs browser/API/database evidence or an explicit external-content blocker.
- Do not create real-person accounts. Test accounts must be clearly labeled and created only in a disposable/staging database.

## Phase 1 — Baseline and access

1. Reconfirm repository, branch, working-tree state, deployment host, domain mapping, database provider, and environment-variable names.
2. Reconcile F01–F24 against the current code, live site, database schema, migrations, and admin CMS.
3. Use authorized browser access to identify the deployment/database/Google projects. The user completes passwords, OTPs, CAPTCHAs, and security prompts directly.
4. Establish a safe staging or disposable database path before any state-changing test.

Gate: no production write is performed until the target environment and rollback path are known.

## Phase 2 — Security, identity, and roles

1. Add/configure Google OAuth only after the authorized OAuth client and callback origins are confirmed.
2. Harden signup, password handling, email verification, rate limits, validation, session behavior, and role boundaries.
3. Verify administrator, buyer/client, and seller behavior from separate test accounts.
4. Verify every admin API returns 401/403 correctly and that seller/buyer users cannot access admin routes.

Gate: typecheck, auth/API tests, and browser login checks pass without exposing credentials.

## Phase 3 — Services, quote, help, and contact

1. Ensure every published service has a discoverable detail page, subsections, materials mapping, quote CTA, loading state, empty state, and error state.
2. Complete the House-of-K quote/contact journey and persist submissions safely.
3. Add reviewed team competence fields and display only approved content.
4. Add approved testimonials, credentials, certifications, insurance/NCA/years-in-business content; no invented claims.

Gate: each service page and form is verified at desktop/mobile widths, including validation and authorized database visibility.

## Phase 4 — Shop, delivery, plans, and payment

1. Configure real county delivery rates or clearly label unavailable rates; verify all 47 counties.
2. Complete bulk/build-cost estimation with documented assumptions, rounding, stock, waste, delivery, and labour boundaries.
3. Add house-plan comparison and a structured customization request flow.
4. Verify M-Pesa STK, card, callbacks/webhooks, idempotency, failure states, receipts, and order totals in sandbox.

Gate: no real payment is used; all payment tests use sandbox credentials and test phone/card data.

## Phase 5 — Portfolio and resource hub

1. Add portfolio metadata for project type, country, year, timeline, budget range, before/after media, and client-name permission.
2. Add filters with empty/loading/error states and verify query behavior.
3. Add a blog/resource model, public listing/detail pages, SEO metadata, admin editing, and safe draft/published states.

Gate: only approved project/client content is published; filters and article pages pass responsive/browser checks.

## Phase 6 — Regression and release

1. Run `npm ci`, typecheck, lint, build, migration inspection, API checks, browser E2E, mobile checks, console/network review, and security review.
2. Run complete journeys: registration → login → account → quote/order → database record → admin visibility → user output.
3. Update the audit checklist with original status, changes, evidence, final status, and remaining recommendations.
4. Commit with a focused message and push only after all required gates pass.
5. Verify the deployed commit, rerun read-only production smoke checks, and report any environment-specific blocker.

## Completion criteria

The work is complete only when every F01–F24 is either verified implemented in the target environment or explicitly blocked by missing approved content/credentials, all fixes are tested, the checklist is updated, and the pushed commit is confirmed on the remote repository.

## Execution log and release gates

- Repository confirmed: `Elisha-Seme/ujjenzi-dhabiti`; working branch: `codex/ujenzi-remediation`.
- Local architecture, database schema, migrations, authentication, admin guards, public workflows, API routes, deployment assumptions, and environment variable names were inspected without exposing secret values.
- Implemented and locally verified: conditional Google OAuth wiring, password visibility controls, all-county delivery surface, category tools, dynamic service catalogue/detail routing, shared quote/contact form coverage, team profiles/competences, testimonial and credential CMS, portfolio metadata/filters, house-plan comparison/customization requests, blog/resource CMS, terms route, input/rate-limit hardening, and removal of hardcoded Gypsum sample bundle data.
- Local production build, TypeScript, lint, diff hygiene, public route smoke tests, invalid-input checks, unauthenticated admin checks, and 47-county API checks must remain green before commit.
- Release blockers requiring authorized external state: apply the migration to the deployment database, configure Google OAuth/Maps and email/payment variables, create TEST role accounts in a disposable database, run authenticated role/E2E tests, and verify the deployed branch.
- Latest read-only live check: `/terms` and `/blog` return 404 and the live `/api/delivery-zones` response contains 11 zones, confirming the custom-domain deployment has not received this branch. The accessible Neon console is `KuzaConnect` production, not an authorized Ujenzi Dhabiti QA target; no migration or seed was run there.
- Repository security review found order/payment authorization and public tracking-data exposure risks; these were fixed with session/email authorization, expiring HMAC tracking tokens, and redaction of private order fields for unauthenticated tracking requests. Typecheck, lint, production build, local HTTP smoke tests, and token tamper checks passed.
- The branch was pushed only after the final local gates passed and staged secret/configuration scans found no committed secrets.
