# Supabase

This folder holds database migrations and policy notes for the future corporate blog platform.

## Current Migration

- `migrations/20260510154500_create_corporate_blog.sql`

The migration creates a small publishing model for corporate blog posts and enables Row Level Security.

## Deployment Dependency

Apply migrations to the Supabase project that will back `corporate.fanfactors.com` before wiring the production admin UI.

## Payload Blog Schema Note

Payload's `blog_posts.category` column is used as the Blog Cluster slug for `/blog/cluster/[clusterSlug]`. Keep that column as plain text/varchar with a default of `fanfactors-revolution`; do not convert it to a database enum. The Payload admin field provides the dropdown UI, and the server normalizes older category text into the current SEO cluster slugs before validation.

## Security Contract

- Public reads are limited to published posts.
- Authenticated writes are limited to users with an editor/admin profile row.
- Service-role credentials must only be used server-side.

## Validation

Run:

```bash
npm run supabase:validate
```

This checks that the corporate blog migration still contains the expected tables, fields, RLS policies, and publishing constraints.
