-- Programmes: an ordered course of existing videos, with per-viewer
-- progress derived from watch_history rather than stored again here.
--
-- A video can belong to several programmes, and dropping a video removes
-- it from every programme it appears in (cascade) rather than blocking
-- the delete, which is what the admin panel expects.
create table public.programs (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title text not null,
  subtitle text,
  description text,
  image_path text,
  level text,
  sort_order int not null default 0,
  published boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index idx_programs_sort_order on public.programs (sort_order);

create table public.program_videos (
  program_id uuid not null references public.programs (id) on delete cascade,
  video_id uuid not null references public.videos (id) on delete cascade,
  -- Not unique per programme on purpose: reordering swaps positions and a
  -- unique constraint would reject the intermediate state.
  position int not null default 0,
  primary key (program_id, video_id)
);

create index idx_program_videos_order on public.program_videos (program_id, position);

alter table public.programs enable row level security;
alter table public.program_videos enable row level security;

-- Readable by everyone (the catalogue is public); only the service-role
-- client used by /admin ever writes.
create policy "programs_select_published"
  on public.programs for select
  using (published = true);

create policy "program_videos_select_all"
  on public.program_videos for select
  using (true);

grant select on public.programs to anon, authenticated;
grant select on public.program_videos to anon, authenticated;
