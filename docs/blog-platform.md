# FanFactors Corporate Blog Platform

## Purpose

The corporate blog should become the daily publishing engine for FanFactors. It should support fast content creation without weakening SEO, AI discoverability, or admin security.

## Recommended Path

Use Payload Admin as the production CMS inside the Next.js App Router app, and keep the public blog indexable and stable by merging published Payload posts with typed Next.js cluster fallback content. Keep the existing Supabase migration as a compatibility/reference schema until the final content database decision is locked.

1. Keep the current public static pages live through the Next.js static-file route handler.
2. Use Payload Admin at `/admin` for authenticated editor workflows.
3. Model blog posts, pages, media and users in modular Payload collections.
4. Render the public SEO blog from typed cluster content plus published Payload posts so public pages do not fail when the admin or database has a runtime issue.
5. Keep typed content as the durable SEO fallback while Payload owns editorial publishing.

## Content Model

Posts should include:

- title
- slug
- excerpt
- body
- featured image URL
- Blog Cluster, stored in the existing `category` column as a controlled cluster slug
- tags
- Payload draft or published status
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

## SEO Cluster Blog Routes

The Next.js app includes indexable blog routes:

- `/blog`
- `/blog/[slug]`
- `/blog/cluster/[clusterSlug]`

The public routes use typed clusters from `content/blogClusters.ts`, typed fallback posts from `content/blogPosts.ts`, published Payload posts from `services/payloadBlog.ts`, helpers in `lib/blog.ts`, and reusable components under `components/blog/`. Existing static `.html` blog pages remain in place as launch fallbacks while the broader public site migration continues.

The public blog is organized into the following SEO clusters:

- Free Music Distribution
- Spotify Royalties
- Sell Music Online
- Make Money as an Independent Artist
- Fan-Powered Promotion
- Music Royalties Explained
- Music Distribution Platforms
- Music Marketplace
- Music Resale Rights
- FanFactors Revolution

Public site navigation points to `/blog`, and the legacy `blog.html` URL redirects to `/blog`.

Published Payload posts and typed fallback posts are indexable public content. `/blog`, `/blog/[slug]`, and `/blog/cluster/[clusterSlug]` emit canonical metadata, Open Graph and Twitter card metadata, and JSON-LD. `app/sitemap.ts` is dynamic and generates the production sitemap from the static public pages plus all published cluster and post routes, excluding legacy static blog HTML fallbacks to avoid duplicate canonical targets.

Each cluster has a pillar post. Each post links back to its cluster and shows related posts from the same cluster. CTAs point visitors toward the FanFactors Alpha.

The `/blog` homepage uses the same dark FanFactors visual direction as the static corporate site: green brand accent, compact premium cards, the real FanFactors wordmark, published-date/read-time metadata on post cards, and an animated hero image rotation from checked-in public assets under `assets/images/blog-hero/`.

## Payload Admin Notes

Featured images are managed through Payload's `media` collection. Production uploads require the Vercel Blob storage adapter and `BLOB_READ_WRITE_TOKEN`; without that token, Payload can save post metadata but cannot persist uploaded image files on Vercel.

Dynamic blog publishing uses Payload's native `_status` draft/published field in the admin UI and public read filters. The static JSON registry keeps its legacy `status` property so launch-content validation and seeding can map old posts into Payload without changing the static fallback format; Payload mirrors that hidden legacy column automatically for compatibility.

Blog Posts use the existing `category` database column as the Blog Cluster selector. The dropdown values are the cluster slugs from `content/blogClusters.ts`, which avoids adding a new database column just to support cluster publishing. The production column must remain plain text/varchar rather than a database enum so older categories can be normalized safely. Legacy free-text categories are normalized into the closest current cluster during validation.

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
- simple post status filters from Payload's native status

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

The public blog merges published Payload posts with typed cluster fallback content for reliability and SEO. Keep `npm run payload:verify-blog-publish`, `npm run payload:verify-blob`, `npm run build`, and production smoke tests green whenever the Payload collection or public blog read path changes.
