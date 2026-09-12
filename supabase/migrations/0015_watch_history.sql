-- Per-user watch progress, powering "Reprends là où tu t'étais arrêtée"
-- on the home screen and the practice history on /practice.
--
-- One row per (user, video): the composite primary key makes the
-- player's periodic progress report a plain upsert with no read first.
create table public.watch_history (
  user_id uuid not null references auth.users (id) on delete cascade,
  video_id uuid not null references public.videos (id) on delete cascade,
  progress_seconds int not null default 0,
  -- Set once the viewer passes ~90% of the runtime, so a finished
  -- session stops being offered as "resume" while still counting as
  -- practice on /practice.
  completed boolean not null default false,
  updated_at timestamptz not null default now(),
  primary key (user_id, video_id)
);

-- Both reads are "this user's rows, most recent first".
create index idx_watch_history_user_recent
  on public.watch_history (user_id, updated_at desc);

alter table public.watch_history enable row level security;

create policy "watch_history_select_own"
  on public.watch_history for select
  using (auth.uid() = user_id);

create policy "watch_history_insert_own"
  on public.watch_history for insert
  with check (auth.uid() = user_id);

create policy "watch_history_update_own"
  on public.watch_history for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

grant select, insert, update on public.watch_history to authenticated;
