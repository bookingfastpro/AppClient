-- Broadcast notifications sent by the super admin (/admin/notifications),
-- visible to every signed-in user. Read state is tracked per user via a
-- separate join table rather than a column on notifications itself, so
-- one broadcast row serves every reader without being mutated per-user.
create table public.notifications (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  body text not null,
  created_at timestamptz not null default now()
);

create index idx_notifications_created_at on public.notifications (created_at desc);

create table public.notification_reads (
  notification_id uuid not null references public.notifications (id) on delete cascade,
  user_id uuid not null references auth.users (id) on delete cascade,
  read_at timestamptz not null default now(),
  primary key (notification_id, user_id)
);

alter table public.notifications enable row level security;
alter table public.notification_reads enable row level security;

-- Every signed-in user can read every broadcast notification. Only the
-- admin panel (service-role client, after lib/auth/admin.ts confirms the
-- predefined admin email) writes here — no insert/update/delete policy
-- for authenticated.
create policy "notifications_select_all"
  on public.notifications for select
  using (true);

grant select on public.notifications to authenticated;

-- A user may read and create only their own read-receipts — this is how
-- they mark a notification as read. Receipts are permanent (no update
-- policy: "read" never reverts to "unread").
create policy "notification_reads_select_own"
  on public.notification_reads for select
  using (auth.uid() = user_id);

create policy "notification_reads_insert_own"
  on public.notification_reads for insert
  with check (auth.uid() = user_id);

grant select, insert on public.notification_reads to authenticated;
