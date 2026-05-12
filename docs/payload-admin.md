# Payload Admin

## Purpose

`/admin` is the production admin direction for FanFactors corporate publishing. The custom static admin prototypes were removed so the repo has one admin surface.

## Current Implementation

- Next.js App Router is installed.
- Payload is mounted under `app/(payload)`.
- Payload config lives in `payload.config.ts`.
- Collection definitions live in `collections/`.
- Generated Payload types live in `types/payload-types.ts`.
- Shared content type aliases live in `types/payload-content.ts`.
- Payload media uploads use Vercel Blob storage in production.
- Public static pages are preserved through `app/[[...path]]/route.ts` and `lib/static-site.ts`.

## Collections

- `users`: Payload-authenticated admins and editors.
- `media`: uploaded images with reusable card and social sizes.
- `blog-posts`: draft/published articles with SEO and AI summary fields.
- `pages`: draft/published page records for the future dynamic site.

## Environment

Required server-side values:

```bash
DATABASE_URL=
PAYLOAD_SECRET=
BLOB_READ_WRITE_TOKEN=
```

Optional public value:

```bash
NEXT_PUBLIC_SITE_URL=
```

Do not expose database credentials or service-role keys to browser code.

`BLOB_READ_WRITE_TOKEN` must come from a Vercel Blob store connected to the Vercel project. Payload stores media metadata in the Supabase-backed Postgres database and stores uploaded files in Vercel Blob, because Vercel serverless deployments cannot persist uploads on local disk.

Production media uploads use the public Vercel Blob store `corporate-fanfactors-payload-media` through Payload's server-side storage adapter. If uploads fail with Payload's generic "Something went wrong" toast, first confirm `BLOB_READ_WRITE_TOKEN` exists in the Vercel Production environment and redeploy after adding or rotating it.

Keep uploaded blog images reasonably compressed for the server-side Payload upload route. Payload's import map is generated during `npm run build` so the Vercel Blob storage admin component is available in production.

For Supabase, use the **Session Pooler** connection string for local IPv4 networks. Direct Supabase database URLs may require IPv6 and can fail locally. The working local shape is:

```text
postgresql://postgres.<project-ref>:<password>@aws-1-us-east-1.pooler.supabase.com:5432/postgres
```

Payload runs on Vercel serverless functions, so the Postgres pool must stay small and release idle connections quickly. The production config uses a small SSL pool for Supabase and reuses the Payload client inside each function instance:

```ts
pool: {
  allowExitOnIdle: true,
  idleTimeoutMillis: 1000,
  max: 2,
  ssl: {
    rejectUnauthorized: false,
  },
}
```

Do not increase the pool casually. Supabase's free session pooler has a low connection limit, and too many concurrent Vercel instances can make the blog fall back to static posts instead of showing live Payload edits.

Check whether the admin can boot:

```bash
npm run payload:env:check
```

## Login Flow

Payload creates the first admin user from `/admin` after the database and secret are configured.

1. Add `DATABASE_URL` and `PAYLOAD_SECRET` to local `.env` or Vercel Environment Variables.
2. Run `npm run payload:env:check`.
3. Run `npm run dev`.
4. Open `http://localhost:3000/admin`.
5. Create the first user when Payload shows the first-user screen.
6. Use that email and password for later Payload logins.

This repo does not ship a default admin email or password.

## Deployment Notes

The Vercel project must move from static hosting to a Next.js build:

```bash
npm run build
npm run start
```

Before production launch, provide a production Postgres database for Payload, set a strong `PAYLOAD_SECRET`, connect Vercel Blob for media uploads, run Payload migrations, and create the first admin user through `/admin`.

Regenerate types after changing Payload collections:

```bash
PAYLOAD_SECRET=local-typegen-secret DATABASE_URL=postgres://localhost/fanfactors npm run payload:types
```

Seed the static launch blog posts into Payload after `DATABASE_URL` and `PAYLOAD_SECRET` point to a configured database:

```bash
npm run payload:seed:blog
```

The seed command is idempotent by slug. It creates missing `blog-posts` records and updates existing records from `data/blog-posts.json` plus the matching static article HTML. The launch blog posts have been seeded into the Supabase-backed Payload database.

Published Payload posts now render through the server-side `/blog` and `/blog/[slug]` routes. The existing static blog HTML files remain available while the rest of the public site is migrated.
