/**
 * Corporate blog migration path validated by local and CI quality gates.
 */
export const CORPORATE_BLOG_MIGRATION = 'supabase/migrations/20260510154500_create_corporate_blog.sql';

/**
 * Tables required for the Supabase-backed corporate publishing workflow.
 */
export const REQUIRED_CORPORATE_BLOG_TABLES = [
  'public.corporate_admin_profiles',
  'public.corporate_blog_posts',
];

/**
 * Columns required by the future admin CMS and current static blog registry.
 */
export const REQUIRED_CORPORATE_BLOG_COLUMNS = [
  'author_id',
  'title',
  'slug',
  'excerpt',
  'body',
  'category',
  'tags',
  'featured_image_url',
  'seo_title',
  'seo_description',
  'social_image_url',
  'status',
  'published_at',
];

/**
 * RLS policies required to keep public reads and editor writes separated.
 */
export const REQUIRED_CORPORATE_BLOG_POLICIES = [
  'Public can read published corporate blog posts',
  'Editors can manage corporate blog posts',
  'Editors can read corporate admin profiles',
];

/**
 * Validates that the corporate blog migration keeps the expected CMS schema,
 * RLS boundaries, and publishing constraints in place.
 */
export function validateCorporateBlogMigration(sql) {
  const failures = [];
  const normalizedSql = sql.replace(/\s+/g, ' ').toLowerCase();

  for (const table of REQUIRED_CORPORATE_BLOG_TABLES) {
    if (!normalizedSql.includes(`create table if not exists ${table}`)) {
      failures.push(`${CORPORATE_BLOG_MIGRATION}: missing table ${table}`);
    }
  }

  for (const column of REQUIRED_CORPORATE_BLOG_COLUMNS) {
    if (!normalizedSql.includes(column.toLowerCase())) {
      failures.push(`${CORPORATE_BLOG_MIGRATION}: missing corporate_blog_posts column ${column}`);
    }
  }

  for (const policy of REQUIRED_CORPORATE_BLOG_POLICIES) {
    if (!sql.includes(policy)) {
      failures.push(`${CORPORATE_BLOG_MIGRATION}: missing RLS policy "${policy}"`);
    }
  }

  const requiredFragments = [
    'alter table public.corporate_admin_profiles enable row level security',
    'alter table public.corporate_blog_posts enable row level security',
    "role in ('admin', 'editor')",
    "status in ('draft', 'published', 'archived')",
    "status = 'published' and published_at <= now()",
    "constraint published_posts_need_date check (status <> 'published' or published_at is not null)",
    'create or replace function public.is_corporate_content_editor()',
    'security definer',
    'set search_path = public',
  ];

  for (const fragment of requiredFragments) {
    if (!normalizedSql.includes(fragment)) {
      failures.push(`${CORPORATE_BLOG_MIGRATION}: missing required SQL fragment: ${fragment}`);
    }
  }

  return failures;
}
