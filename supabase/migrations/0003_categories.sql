create table public.categories (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  slug text not null unique,
  description text,
  image_path text,
  sort_order int not null default 0,
  created_at timestamptz not null default now()
);

create index idx_categories_sort_order on public.categories (sort_order);
