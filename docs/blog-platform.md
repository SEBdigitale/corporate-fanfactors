# FanFactors Corporate Blog Platform

## Purpose

The corporate blog should become the daily publishing engine for FanFactors. It should support fast content creation without weakening SEO, AI discoverability, or admin security.

## Recommended Path

Use the existing Supabase stack instead of introducing a separate CMS.

1. Keep the current static site live while the publishing backend is prepared.
2. Add the Supabase blog schema from `supabase/migrations/20260510154500_create_corporate_blog.sql`.
3. Build the production admin in a future Next.js App Router migration.
4. Render public blog pages server-side from Supabase published posts.
5. Keep the static blog pages as launch content until dynamic routes replace them.

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

- Row Level Security must stay enabled.
- Public visitors can read only published posts.
- Editors can manage draft and published posts only after authentication.
- Service-role keys must never be used in browser code.
- Admin writes should go through server-side routes or server actions.

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

The current static admin dashboard stores demo drafts in browser local storage only. It is useful as a UX prototype, not as a production CMS.
