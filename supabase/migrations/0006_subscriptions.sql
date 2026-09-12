-- One row per user, kept in sync exclusively by the Stripe webhook handler
-- (service-role client). Never written to by anon/authenticated clients.
create table public.subscriptions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null unique references auth.users (id) on delete cascade,
  stripe_customer_id text not null unique,
  stripe_subscription_id text unique,
  -- Mirrors Stripe's subscription.status verbatim: active, trialing,
  -- past_due, canceled, unpaid, incomplete, incomplete_expired.
  status text not null default 'incomplete',
  price_id text,
  current_period_start timestamptz,
  current_period_end timestamptz,
  cancel_at_period_end boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index idx_subscriptions_status on public.subscriptions (status);

create trigger subscriptions_set_updated_at
  before update on public.subscriptions
  for each row
  execute function public.set_updated_at();

-- Idempotency log for Stripe webhook events. Replayed events (Stripe
-- retries on non-2xx or timeout) are detected via primary key conflict
-- and skipped without reprocessing.
create table public.stripe_events (
  id text primary key,
  type text not null,
  processed_at timestamptz not null default now()
);
