# Yogella

A premium, mobile-first wellness app: yoga, meditation, breathing, relaxation, sleep, and flexibility sessions. Free sessions stream for anyone; premium sessions require an active membership (Stripe subscription).

Design direction and tokens are documented in [`DESIGN.md`](./DESIGN.md); product strategy and register in [`PRODUCT.md`](./PRODUCT.md). Architecture rationale lives in the plan this project was built from.

## Stack

Next.js (App Router) + TypeScript + Tailwind CSS v4, Supabase (Postgres, Auth, RLS), Stripe (subscriptions + webhooks), YouTube (video hosting), Docker, deployed via Coolify.

## 1. Local setup

```bash
npm install
cp .env.example .env.local
```

Fill in `.env.local` with real values (see [Environment variables](#environment-variables) below), then:

```bash
npm run dev
```

The app runs at `http://localhost:3000`. Every route under `(app)` (home, explore, favorites, account, etc.) requires a signed-in session — the marketing site (`/`, `/pricing`) and auth pages (`/sign-in`, `/sign-up`) work without one.

## 2. Supabase setup

1. Create a project at [supabase.com](https://supabase.com).
2. Copy the Project URL and publishable key into `NEXT_PUBLIC_SUPABASE_URL` / `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`.
3. Copy the service role key into `SUPABASE_SERVICE_ROLE_KEY` — **never expose this to the browser**, it is only read server-side (`lib/supabase/admin.ts`).
4. Under Authentication → URL Configuration, set the Site URL and add `<your-site-url>/auth/callback` as a redirect URL.

### Database migrations

Migrations live in `supabase/migrations/`, numbered and applied in order. Using the [Supabase CLI](https://supabase.com/docs/guides/cli):

```bash
npx supabase login
npx supabase link --project-ref <your-project-ref>
npx supabase db push
```

Or paste each migration file's contents into the Supabase SQL editor, in numeric order (`0001_...` through `0009_...`).

Migration `0007_rls_policies.sql` enables RLS on every table. Migration `0009_youtube_videos.sql` switches the `videos` table from private Supabase Storage paths to a public `youtube_id` column (see [Video hosting](#video-hosting) below) — it clears any rows from the old model, so run it before adding real content.

### Seed data

`supabase/seed.sql` adds the 6 categories only. There is no video seed data — add sessions through the admin panel (`/admin/videos`) once you have an admin account (see [Admin panel](#admin-panel) below).

```bash
npx supabase db reset   # local dev only — re-applies migrations + seed
```

## 3. Authentication

Supabase Auth (email/password) via `@supabase/ssr`. Sign-up, sign-in, forgot/reset password, and session refresh are implemented in `app/(auth)/*` and `lib/auth/`. `proxy.ts` (Next.js's middleware-successor convention) refreshes the session cookie on every request and redirects unauthenticated visitors away from gated `(app)` routes.

A new user automatically gets a `profiles` row via a database trigger (`handle_new_user()` in migration `0002`) — no client-side insert race.

## 4. Stripe setup

1. Create a Product and a recurring Price in the [Stripe Dashboard](https://dashboard.stripe.com/products). Copy the Price ID into `STRIPE_PRICE_ID`.
2. Copy your secret key into `STRIPE_SECRET_KEY`.
3. Enable the [Customer Portal](https://dashboard.stripe.com/settings/billing/portal) so `ManageBillingButton` works.

### Stripe webhook

Register a webhook endpoint at `<your-production-domain>/api/stripe/webhook` listening for:

- `checkout.session.completed`
- `customer.subscription.created`
- `customer.subscription.updated`
- `customer.subscription.deleted`

Copy the webhook signing secret into `STRIPE_WEBHOOK_SECRET`. For local testing:

```bash
stripe listen --forward-to localhost:3000/api/stripe/webhook
```

The webhook handler (`app/api/stripe/webhook/route.ts`) is the **only** writer to `public.subscriptions` — this is enforced both by RLS (no insert/update policy for `anon`/`authenticated`) and by idempotency via the `stripe_events` table, so replayed events are safely skipped.

## 5. Video hosting

Videos are hosted on YouTube, not self-hosted — the app never stores video files. Each `videos` row carries a `youtube_id`; thumbnails are YouTube's own (`https://i.ytimg.com/vi/<id>/hqdefault.jpg`) and playback is a click-to-load embedded YouTube iframe (`components/video/VideoPlayer.tsx`).

**Important trade-off:** because premium videos must still show their real thumbnail to non-subscribers (per the product spec), and YouTube thumbnail URLs are keyed by video ID, the video ID isn't cryptographically secret the way the old private-storage signed URLs were — a sufficiently technical non-subscriber could extract the ID from a thumbnail's URL and watch it directly on youtube.com. The gate that *is* enforced: `app/(app)/videos/[slug]/page.tsx` only ever passes the `youtube_id` to the player (and only renders it at all) for free videos or authorized subscribers — `hasActivePremiumAccess()` (`lib/access/subscription.ts`) is checked server-side before that happens, so casual/browsing users never see a play button or embed for premium content they haven't paid for. If you need true DRM-grade protection, don't use YouTube — go back to the private-Storage-plus-signed-URL model this replaced.

## Admin panel

A single predefined admin account (`ADMIN_EMAIL` in your env) can add, edit, and delete videos at `/admin/videos` — paste a YouTube link, and the title/thumbnail auto-fill via YouTube's oEmbed endpoint. `lib/auth/admin.ts` gates every `/admin/*` route: anyone else (logged out, or logged in as a different user) gets an identical 404, so the panel's existence isn't advertised. To create the admin account, sign up normally through `/sign-up` using the address in `ADMIN_EMAIL`; a link to the panel then appears on that account's `/account` page.

## Environment variables

See [`.env.example`](./.env.example) for the full list. `NEXT_PUBLIC_*` variables are inlined at **build** time by Next.js — when deploying, make sure they're available during `next build`, not just at runtime.

## Local development

```bash
npm run dev     # start the dev server
npm run lint     # ESLint
npm run build    # type-check + production build
```

## Docker

```bash
docker build \
  --build-arg NEXT_PUBLIC_SUPABASE_URL=... \
  --build-arg NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=... \
  --build-arg NEXT_PUBLIC_SITE_URL=... \
  -t quiet-studio .

docker run -p 3000:3000 \
  -e SUPABASE_SERVICE_ROLE_KEY=... \
  -e STRIPE_SECRET_KEY=... \
  -e STRIPE_WEBHOOK_SECRET=... \
  -e STRIPE_PRICE_ID=... \
  quiet-studio
```

Health check: `GET /api/healthz` (pure liveness, no external calls).

## Coolify deployment

1. Point Coolify at this repository, build type **Dockerfile**.
2. Mark `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`, and `NEXT_PUBLIC_SITE_URL` as **build-time** variables (Coolify passes them as Docker build args) — they must be present during `next build`, not only at container runtime.
3. Set `SUPABASE_SERVICE_ROLE_KEY`, `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET`, `STRIPE_PRICE_ID` as **runtime-only** secrets — never build args, never `NEXT_PUBLIC_`.
4. Set the health check path to `/api/healthz`.
5. Configure your domain and HTTPS in Coolify, then register the Stripe webhook at `https://<your-domain>/api/stripe/webhook`.

## Troubleshooting

- **"Your project's URL and Key are required to create a Supabase client"** — `.env.local` is missing or incomplete. Copy `.env.example` and fill in real values.
- **`/admin/videos` 404s for the account you expect to be admin** — `ADMIN_EMAIL` doesn't match that account's email exactly (case-insensitive, but no typos/whitespace), or it isn't set at all.
- **Webhook returns 400 "Invalid signature"** — `STRIPE_WEBHOOK_SECRET` doesn't match the endpoint's signing secret in the Stripe Dashboard, or you're forwarding raw JSON instead of the exact request body.
- **Premium video plays without a subscription** — check `lib/access/subscription.ts` and confirm the `subscriptions` row's `status` is actually being synced by the webhook; client-side subscription state is never trusted.
