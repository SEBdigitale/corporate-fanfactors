# FanFactors Corporate Blog Platform

## Purpose

The corporate blog should become the daily publishing engine for FanFactors. It should support fast content creation without weakening SEO, AI discoverability, or admin security.

## Recommended Path

Use Payload Admin as the production CMS inside the Next.js App Router app. Keep the existing Supabase migration as a compatibility/reference schema until the final content database decision is locked.

1. Keep the current public static pages live through the Next.js static-file route handler.
2. Use Payload Admin at `/admin` for authenticated editor workflows.
3. Model blog posts, pages, media and users in modular Payload collections.
4. Render public blog pages server-side from Payload once dynamic routes replace the static launch pages.
5. Seed `data/blog-posts.json` into Payload with `npm run payload:seed:blog` after the database is configured. This has been completed for the Supabase-backed Payload database.

## Content Model

Posts should include:

- title
- slug
- excerpt
- body
- featured image URL
- category
- tags
- draft or published status
- SEO title
- SEO description
- social image URL
- published date
- author profile

## Static Blog Registry

`data/blog-posts.json` mirrors the future publishing shape for the current static launch posts.

The registry is intentionally small and only includes published posts. It gives the static site a single content contract for validation while Payload is introduced.

`services/payloadBlogSeed.ts` maps registry entries and matching static article HTML into Payload `blog-posts` records. `scripts/seed-payload-blog.ts` performs idempotent create/update operations by slug.

The local Payload connection uses the Supabase Session Pooler because direct Supabase database connections can require IPv6.

## Dynamic Blog Routes

The Next.js app now includes server-rendered Payload blog routes:

- `/blog`
- `/blog/[slug]`

The routes use `services/payloadBlog.ts` for Payload reads and reusable components under `components/blog/`. Existing static `.html` blog pages remain in place as launch fallbacks while the broader public site migration continues.

The validation rules in `scripts/lib/blog-content.mjs` mirror the current Supabase constraints for:

- title length
- URL-safe slugs
- excerpt length
- allowed statuses
- required `publishedAt` values for published posts
- SEO title and description lengths

`scripts/lib/supabase-schema.mjs` validates that the retained Supabase migration keeps the expected blog tables, fields, RLS policies, and publishing constraints in place.

## Admin Flow

The production admin should support:

- authenticated editor login
- draft creation
- editing and preview
- publish and unpublish controls
- featured image management
- SEO fields
- AI/search summary fields
- simple post status filters

## Security Notes

- Row Level Security must stay enabled for Supabase tables.
- Public visitors can read only published posts.
- Editors can manage draft and published posts only after authentication.
- Service-role keys must never be used in browser code.
- Admin writes should go through Payload's server-side admin/API layer.

## SEO And AI Requirements

Every published post should generate:

- canonical URL
- unique title and meta description
- Open Graph and Twitter card metadata
- `Article` JSON-LD
- sitemap entry
- internal links to related FanFactors pages
- concise answer-style summaries for AI crawlers

## Migration Notes

The old static admin dashboard has been removed. Payload Admin is now the only admin direction.
