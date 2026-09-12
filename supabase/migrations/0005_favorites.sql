create table public.favorites (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  video_id uuid not null references public.videos (id) on delete cascade,
  created_at timestamptz not null default now(),
  unique (user_id, video_id)
);

create index idx_favorites_user_id on public.favorites (user_id);
create index idx_favorites_video_id on public.favorites (video_id);
