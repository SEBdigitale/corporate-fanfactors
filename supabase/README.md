# Supabase

This folder holds database migrations and policy notes for the future corporate blog platform.

## Current Migration

- `migrations/20260510154500_create_corporate_blog.sql`

The migration creates a small publishing model for corporate blog posts and enables Row Level Security.

## Deployment Dependency

Apply migrations to the Supabase project that will back `corporate.fanfactors.com` before wiring the production admin UI.

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
