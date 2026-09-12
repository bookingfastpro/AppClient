insert into storage.buckets (id, name, public)
values ('video-thumbnails', 'video-thumbnails', true)
on conflict (id) do nothing;

insert into storage.buckets (id, name, public)
values ('videos', 'videos', false)
on conflict (id) do nothing;

-- Thumbnails are public and directly readable.
create policy "thumbnails_public_read"
  on storage.objects for select
  using (bucket_id = 'video-thumbnails');

-- The 'videos' bucket deliberately has zero policies for anon/authenticated
-- — default-deny. Only the service-role client (which bypasses storage
-- RLS entirely) can read objects or mint signed URLs, and it only does so
-- after lib/access/subscription.ts confirms the requesting user is
-- authorized. See app/api/videos/[id]/signed-url/route.ts.
