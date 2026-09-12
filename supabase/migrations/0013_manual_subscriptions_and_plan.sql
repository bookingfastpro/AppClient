-- Lets the admin panel grant premium access to a user without a real
-- Stripe subscription behind it (comp access, manual overrides). Distinct
-- from a Stripe-synced row so the UI never confuses the two, and so the
-- admin "revoke" action can refuse to touch a real subscription by
-- mistake (it only ever acts when is_manual = true).
alter table public.subscriptions add column is_manual boolean not null default false;

-- A single-row settings table holding the currently active membership
-- price/copy. Lets the admin change the Stripe price and the pricing
-- page's copy without a redeploy. stripe_price_id is nullable until the
-- admin configures it for the first time via /admin/plan.
create table public.membership_plan (
  id int primary key default 1,
  stripe_product_id text,
  stripe_price_id text,
  title text not null default 'Abonnement Yogella',
  description text not null default 'Accès illimité à toutes les séances premium.',
  features text[] not null default '{}',
  updated_at timestamptz not null default now(),
  constraint membership_plan_single_row check (id = 1)
);

insert into public.membership_plan (id) values (1) on conflict (id) do nothing;

alter table public.membership_plan enable row level security;

-- Public read (the pricing page needs this while logged out) — only the
-- admin panel (service-role client) ever writes here.
create policy "membership_plan_select_all"
  on public.membership_plan for select
  using (true);

grant select on public.membership_plan to anon, authenticated;
