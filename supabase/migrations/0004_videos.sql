create table public.videos (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title text not null,
  description text not null,
  category_id uuid not null references public.categories (id) on delete restrict,
  is_premium boolean not null default false,
  -- Private Supabase Storage object path in the 'videos' bucket. Never a
  -- public URL. Column-level grants in 0007_rls_policies.sql keep this
  -- unreadable by anon/authenticated roles; only the service-role client
  -- (lib/video/signed-url.ts) may read it.
  video_path text not null,
  -- Public Supabase Storage object path in the 'video-thumbnails' bucket.
  thumbnail_path text not null,
  duration_seconds int not null check (duration_seconds > 0),
  level text check (level in ('beginner', 'intermediate', 'advanced')),
  instructor text not null,
  published_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index idx_videos_category_id on public.videos (category_id);
create index idx_videos_is_premium on public.videos (is_premium);
create index idx_videos_published_at on public.videos (published_at desc) where published_at is not null;

create trigger videos_set_updated_at
  before update on public.videos
  for each row
  execute function public.set_updated_at();
