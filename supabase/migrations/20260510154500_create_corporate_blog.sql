-- FanFactors corporate blog publishing schema.
-- Apply this to the Supabase project before wiring the production admin UI.

create table if not exists public.corporate_admin_profiles (
  user_id uuid primary key references auth.users(id) on delete cascade,
  role text not null check (role in ('admin', 'editor')),
  display_name text not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.corporate_blog_posts (
  id uuid primary key default gen_random_uuid(),
  author_id uuid references public.corporate_admin_profiles(user_id) on delete set null,
  title text not null check (char_length(title) between 3 and 160),
  slug text not null unique check (slug ~ '^[a-z0-9]+(?:-[a-z0-9]+)*$'),
  excerpt text not null check (char_length(excerpt) between 20 and 320),
  body text not null,
  category text not null default 'FanFactors',
  tags text[] not null default '{}',
  featured_image_url text,
  seo_title text check (seo_title is null or char_length(seo_title) <= 160),
  seo_description text check (seo_description is null or char_length(seo_description) <= 320),
  social_image_url text,
  status text not null default 'draft' check (status in ('draft', 'published', 'archived')),
  published_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint published_posts_need_date check (status <> 'published' or published_at is not null)
);

create index if not exists corporate_blog_posts_status_published_at_idx
  on public.corporate_blog_posts (status, published_at desc);

create index if not exists corporate_blog_posts_slug_idx
  on public.corporate_blog_posts (slug);

alter table public.corporate_admin_profiles enable row level security;
alter table public.corporate_blog_posts enable row level security;

create or replace function public.is_corporate_content_editor()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.corporate_admin_profiles
    where user_id = auth.uid()
      and role in ('admin', 'editor')
  );
$$;

drop policy if exists "Public can read published corporate blog posts" on public.corporate_blog_posts;
create policy "Public can read published corporate blog posts"
on public.corporate_blog_posts
for select
using (status = 'published' and published_at <= now());

drop policy if exists "Editors can manage corporate blog posts" on public.corporate_blog_posts;
create policy "Editors can manage corporate blog posts"
on public.corporate_blog_posts
for all
to authenticated
using (public.is_corporate_content_editor())
with check (public.is_corporate_content_editor());

drop policy if exists "Editors can read corporate admin profiles" on public.corporate_admin_profiles;
create policy "Editors can read corporate admin profiles"
on public.corporate_admin_profiles
for select
to authenticated
using (public.is_corporate_content_editor() or user_id = auth.uid());
