-- Public aggregate of favorite counts per video, without exposing which
-- user favorited what. public.favorites has row-level RLS restricting
-- select to the owning user (favorites_select_own), so a plain view would
-- only ever count the querying user's own rows. A SECURITY DEFINER
-- function bypasses that per-row restriction internally while returning
-- only the safe aggregate (video_id, count) — no user_id ever leaves
-- this function.
create or replace function public.get_top_favorited_videos(video_limit int default 10)
returns table (video_id uuid, favorite_count bigint)
language sql
security definer
set search_path = public
stable
as $$
  select video_id, count(*) as favorite_count
  from public.favorites
  group by video_id
  order by favorite_count desc, video_id
  limit video_limit;
$$;

grant execute on function public.get_top_favorited_videos(int) to anon, authenticated;
