# AGENTS.md Alignment Tracker

## Current Percentages

- Static public-site compliance: 100%
- Next.js, React, TypeScript and Payload target standard: 92.5%

## What Is Already Aligned

- The public corporate site remains stable while the dynamic migration is intentional.
- Payload Admin is the only admin direction at `/admin`.
- The old custom static admin files, scripts, styles and validation contract were removed.
- Next.js App Router, React and TypeScript are installed.
- Payload config is centralized in `payload.config.ts`.
- Payload collections are modularized under `collections/`.
- Payload TypeScript types are generated in `types/payload-types.ts`.
- Shared Payload content aliases live in `types/payload-content.ts`.
- Static blog launch content can be mapped and seeded into Payload through `services/payloadBlogSeed.ts` and `npm run payload:seed:blog`.
- Payload environment readiness can be checked with `npm run payload:env:check`.
- Local Payload is connected through the Supabase Session Pooler and the launch blog posts have been seeded.
- `/blog`, `/blog/[slug]` and `/blog/cluster/[clusterSlug]` now render through reusable React components from typed SEO clusters plus published Payload posts.
- Payload Blog Posts expose a real slug field and a controlled Blog Cluster dropdown backed by the existing `category` column to avoid a risky production schema migration.
- Public blog routes now emit indexable metadata, canonical URLs, social metadata and JSON-LD while falling back to typed content if Payload runtime reads fail.
- The public blog homepage now uses reusable FanFactors-styled hero, slider, card and cluster components with published date and read-time metadata on post cards.
- Payload Admin uses the FanFactors green `F` mark for the login logo and admin navigation icon.
- `app/sitemap.ts` and `app/robots.ts` provide typed crawl files for the dynamic app routes.
- Payload Pages continue to use Payload's native `_status` workflow, while Blog Posts use a visible `Publishing Status` field and normal authenticated saves to avoid fragile draft-version publish errors.
- Payload Blog Posts now sanitize editor input before validation, include a repair workflow for existing records, and can seed every typed SEO cluster post into Payload without overwriting manual edits.
- Shared static serving logic lives in `lib/static-site.ts`.
- Documentation covers Payload admin, security, quality gates and deployment notes.
- Supabase service-role keys remain server-only by policy and validation.

## Remaining Work To Reach 100%

1. Configure production `DATABASE_URL` and `PAYLOAD_SECRET`.
2. Run Payload migrations against the production database when new database columns are introduced.
3. Convert repeated non-blog public page shells into reusable React components.
4. Move remaining non-blog static page metadata from static registries into typed Next.js route/content modules.
5. Add focused tests for Payload collection access rules and public rendering.
6. Update Vercel production settings from static deploy assumptions to Next.js build/runtime.

## Percentage Rules

- 70% when Payload can boot locally with real environment variables.
- 75% when generated Payload types are committed and used by app code. Complete.
- 78% when the reusable Payload blog seed/import path is committed. Complete.
- 80% when blog content is seeded into a configured Payload database. Complete.
- 85% when public blog routes render server-side from Payload. Complete.
- 88% when Payload-backed blog SEO metadata and dynamic crawl files are typed Next modules. Complete.
- 89% when Payload content publishing avoids duplicate drift between visible editor state and public read filters. Complete.
- 90% when the public blog has typed content modules, reusable React blog components, cluster routes and typed sitemap entries. Complete.
- 91% when Payload Blog Posts can publish into SEO clusters and public routes merge published Payload posts with typed fallback content. Complete.
- 91.5% when all typed SEO cluster posts can be seeded into Payload and existing Payload blog records can be repaired without replacing editor-authored content. Complete.
- 92% when shared non-blog public layout/header/footer are React components.
- 92.5% when Blog Posts publish through a normal authenticated status save path with repair and smoke-test coverage. Complete.
- 95% when page metadata and sitemap generation are typed Next modules.
- 100% when production deploy, admin auth, migrations, server rendering, docs and validation are all aligned.

## Current Deployment Dependencies

- Vercel must build the repo as a Next.js app.
- `DATABASE_URL` must point to a production Postgres database supported by Payload.
- `PAYLOAD_SECRET` must be a strong server-side secret.
- Existing Supabase migration validation remains until the final shared-data strategy is decided.
