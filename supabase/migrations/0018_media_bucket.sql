-- Public bucket for imagery uploaded from the admin panel (programme
-- covers today, universe covers later). Writing into the app's public/
-- folder is not an option: that filesystem is rebuilt on every deploy,
-- so an uploaded file would vanish at the next release.
insert into storage.buckets (id, name, public)
values ('media', 'media', true)
on conflict (id) do nothing;

-- Readable by anyone, like the thumbnails bucket. Writes are never
-- granted to anon/authenticated: only the service-role admin client
-- uploads here, and it bypasses storage RLS.
create policy "media_public_read"
  on storage.objects for select
  using (bucket_id = 'media');
