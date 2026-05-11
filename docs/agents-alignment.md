# AGENTS.md Alignment Tracker

## Current Percentages

- Static public-site compliance: 100%
- Next.js, React, TypeScript and Payload target standard: 85%

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
- `/blog` and `/blog/[slug]` now render server-side from Payload through reusable React components.
- Shared static serving logic lives in `lib/static-site.ts`.
- Documentation covers Payload admin, security, quality gates and deployment notes.
- Supabase service-role keys remain server-only by policy and validation.

## Remaining Work To Reach 100%

1. Configure production `DATABASE_URL` and `PAYLOAD_SECRET`.
2. Run Payload migrations against the production database.
3. Convert repeated public page shells into reusable React components.
4. Move route metadata from static registries into typed Next.js route/content modules.
5. Add focused tests for Payload collection access rules and public rendering.
6. Update Vercel production settings from static deploy assumptions to Next.js build/runtime.

## Percentage Rules

- 70% when Payload can boot locally with real environment variables.
- 75% when generated Payload types are committed and used by app code. Complete.
- 78% when the reusable Payload blog seed/import path is committed. Complete.
- 80% when blog content is seeded into a configured Payload database. Complete.
- 85% when public blog routes render server-side from Payload. Complete.
- 90% when shared public layout/header/footer are React components.
- 95% when page metadata and sitemap generation are typed Next modules.
- 100% when production deploy, admin auth, migrations, server rendering, docs and validation are all aligned.

## Current Deployment Dependencies

- Vercel must build the repo as a Next.js app.
- `DATABASE_URL` must point to a production Postgres database supported by Payload.
- `PAYLOAD_SECRET` must be a strong server-side secret.
- Existing Supabase migration validation remains until the final shared-data strategy is decided.
