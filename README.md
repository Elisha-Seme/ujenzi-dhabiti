# Ujenzi Dhabiti

Ujenzi Dhabiti is a Next.js application for construction services, building materials, house plans, quotations, customer accounts, order tracking, and content administration.

## Requirements

- Node.js 20
- npm
- PostgreSQL or Neon Postgres
- Cloudinary account for uploads
- Resend account for transactional email
- Google Maps Places API key for address autocomplete
- Safaricom Daraja credentials for M-Pesa
- Flutterwave credentials for card payments

## Local setup

1. Install dependencies:

   ```powershell
   npm ci
   ```

2. Copy `.env.example` to `.env.local` and fill in the development values.

3. Apply database migrations:

   ```powershell
   npm run db:migrate
   ```

4. Seed development content if required:

   ```powershell
   npm run db:seed
   ```

5. Start the application:

   ```powershell
   npm run dev
   ```

The default local URL is `http://localhost:3000`.

## Verification

Run the same checks used by continuous integration:

```powershell
npm run check
```

The command runs TypeScript validation, ESLint, and the production build. Dependency risks can be reviewed separately:

```powershell
npm audit --omit=dev
```

## Database

The schema is defined in `lib/db/schema.ts`; generated migrations live in `drizzle/migrations`.

```powershell
npm run db:generate
npm run db:migrate
npm run db:studio
```

Always review generated SQL before applying a migration to staging or production. Back up production data before schema changes.

## Authentication

Auth.js currently supports:

- Email and password
- Email magic links

Admin and account routes are protected by `middleware.ts`. Google OAuth is part of the outstanding client-feedback work and requires approved OAuth credentials and callback domains.

## External integrations

- **Google Maps:** Kenya-restricted Places autocomplete for addresses.
- **Cloudinary:** images and supported uploads.
- **Resend:** enquiries, acknowledgements, and payment/order notifications.
- **M-Pesa:** Daraja STK Push and callback/query handling.
- **Flutterwave:** hosted card checkout and webhook confirmation.

Use sandbox/test credentials outside production. Never commit `.env.local` or provider secrets.

## Deployment

Before deploying:

1. Run `npm run check`.
2. Run `npm audit --omit=dev` and resolve or formally accept remaining risks.
3. Apply reviewed migrations to staging.
4. Test authentication, uploads, email, Google Places, M-Pesa, Flutterwave, order tracking, and admin authorization.
5. Configure the exact public `NEXTAUTH_URL` and provider callback URLs.
6. Deploy the same commit that passed acceptance testing.

## Feedback completion

The governing implementation checklist is maintained separately as `UJENZI_DHABITI_STRICT_FEEDBACK_CHECKLIST.md`. A feedback item must not be marked complete until its acceptance criteria and verification gates pass.
