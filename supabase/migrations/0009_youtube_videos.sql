-- Switch video hosting from private Supabase Storage to YouTube embeds.
-- Existing rows referenced storage paths from the old model (no files
-- were ever uploaded) — cleared here since the admin panel becomes the
-- way real content gets added going forward. Favorites cascade-delete
-- automatically via the existing FK.
delete from public.videos;

alter table public.videos drop column video_path;
alter table public.videos drop column thumbnail_path;

alter table public.videos
  add column youtube_id text not null
  constraint videos_youtube_id_format check (youtube_id ~ '^[A-Za-z0-9_-]{11}$');

comment on column public.videos.youtube_id is
  'The 11-character YouTube video ID. Thumbnails are derived from this '
  'and are public for every video (including premium) per product spec, '
  'so this column is no longer column-grant-restricted like video_path '
  'was — the real gate is application-level: the (app) video detail page '
  'only renders the embedded player for authorized users.';

-- Re-grant full SELECT on videos: there is no longer a column that needs
-- to stay hidden from anon/authenticated (see comment above).
revoke all on public.videos from anon, authenticated;
grant select on public.videos to anon, authenticated;
