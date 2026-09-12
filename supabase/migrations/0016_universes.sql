-- Replaces the six starter categories with the ten "univers" shown on the
-- Explorer screen.
--
-- videos.category_id is ON DELETE RESTRICT, so the three starter categories
-- that have no counterpart in the new set (meditation, relaxation,
-- flexibility) are REPURPOSED in place rather than deleted: renaming keeps
-- every existing video attached to a real row instead of orphaning it or
-- blocking the migration. Each is mapped to its nearest new universe, and
-- any video that ends up mis-filed can be re-assigned from /admin/videos.
--
-- image_path points at files the team drops into public/univers/. The
-- Explorer card falls back to a video thumbnail while a file is missing,
-- so this migration is safe to run before the artwork exists.

-- 1. The three that carry over unchanged in meaning.
update public.categories
set name = 'Yoga', sort_order = 1, image_path = '/univers/yoga.webp'
where slug = 'yoga';

update public.categories
set name = 'Respiration', sort_order = 3, image_path = '/univers/respiration.webp'
where slug = 'breathing';

update public.categories
set name = 'Sommeil', sort_order = 8, image_path = '/univers/sommeil.webp'
where slug = 'sleep';

-- 2. The three repurposed into their nearest new universe.
update public.categories
set slug = 'bains-sonores',
    name = 'Bains sonores',
    description = 'Des bols chantants et des paysages sonores pour relâcher le mental.',
    sort_order = 2,
    image_path = '/univers/bains-sonores.webp'
where slug = 'relaxation';

update public.categories
set slug = 'comprendre-son-corps',
    name = 'Comprendre son corps',
    description = 'Anatomie, mobilité et repères simples pour pratiquer sans se blesser.',
    sort_order = 5,
    image_path = '/univers/comprendre-son-corps.webp'
where slug = 'flexibility';

update public.categories
set slug = 'mental-et-emotions',
    name = 'Mental & émotions',
    description = 'Méditation, introspection et outils pour traverser ce qui vous traverse.',
    sort_order = 9,
    image_path = '/univers/mental-et-emotions.webp'
where slug = 'meditation';

-- 3. The four with no existing counterpart.
insert into public.categories (slug, name, description, sort_order, image_path)
values
  (
    'auto-massages',
    'Auto-massages',
    'Des gestes simples pour dénouer les tensions par vous-même.',
    4,
    '/univers/auto-massages.webp'
  ),
  (
    'sante-de-la-femme',
    'Santé de la femme',
    'Cycle, grossesse, post-partum : une pratique adaptée à chaque étape.',
    6,
    '/univers/sante-de-la-femme.webp'
  ),
  (
    'nutrition',
    'Nutrition',
    'Manger pour soutenir votre énergie, sans régime ni culpabilité.',
    7,
    '/univers/nutrition.webp'
  ),
  (
    'podcasts',
    'Podcasts',
    'Des conversations à écouter en marchant, en cuisinant, ou les yeux fermés.',
    10,
    '/univers/podcasts.webp'
  )
on conflict (slug) do nothing;
