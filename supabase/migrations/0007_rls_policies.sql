-- RLS is mandatory on every table in this project. Never disable it, even
-- temporarily for local development convenience.
alter table public.profiles enable row level security;
alter table public.categories enable row level security;
alter table public.videos enable row level security;
alter table public.favorites enable row level security;
alter table public.subscriptions enable row level security;
alter table public.stripe_events enable row level security;

-- =========================================================================
-- profiles: a user may read and update only their own row. Rows are
-- created by handle_new_user() (security definer) and removed via the
-- auth.users cascade, so there is deliberately no insert/delete policy.
-- =========================================================================
create policy "profiles_select_own"
  on public.profiles for select
  using (auth.uid() = id);

create policy "profiles_update_own"
  on public.profiles for update
  using (auth.uid() = id)
  with check (auth.uid() = id);

-- =========================================================================
-- categories: public read, no client writes.
-- =========================================================================
create policy "categories_select_all"
  on public.categories for select
  using (true);

-- =========================================================================
-- videos: only published videos are visible, and — critically — anon and
-- authenticated roles are never granted select on video_path at the
-- column level. This is what lets an unsubscribed user see a premium
-- video's thumbnail/title/description/duration/level while making the
-- actual storage path unreachable even via a direct table query. Only the
-- service-role client (which bypasses RLS and column grants) can read
-- video_path, inside lib/video/signed-url.ts after authorization.
-- =========================================================================
create policy "videos_select_published"
  on public.videos for select
  using (published_at is not null and published_at <= now());

revoke all on public.videos from anon, authenticated;
grant select (
  id,
  slug,
  title,
  description,
  category_id,
  is_premium,
  thumbnail_path,
  duration_seconds,
  level,
  instructor,
  published_at,
  created_at
) on public.videos to anon, authenticated;

-- =========================================================================
-- favorites: strictly the owning user's rows.
-- =========================================================================
create policy "favorites_select_own"
  on public.favorites for select
  using (auth.uid() = user_id);

create policy "favorites_insert_own"
  on public.favorites for insert
  with check (auth.uid() = user_id);

create policy "favorites_delete_own"
  on public.favorites for delete
  using (auth.uid() = user_id);

-- =========================================================================
-- subscriptions: a user may only ever READ their own billing status.
-- Deliberately no insert/update/delete policy for anon/authenticated —
-- the Stripe webhook handler (service-role client) is the sole writer,
-- so client-reported subscription state can never be trusted or forged.
-- =========================================================================
create policy "subscriptions_select_own"
  on public.subscriptions for select
  using (auth.uid() = user_id);

-- =========================================================================
-- stripe_events: no policies at all for anon/authenticated. This table
-- exists purely as a server-side idempotency log; it must never be
-- client-readable or client-writable.
-- =========================================================================
