# FanFactors Website v3 — We're taking music back.

This package updates the prior FanFactors site around the actual platform story:

- Legal music listening
- Direct copyright-owner payment logic
- Artist-set pricing and rights control
- Fans becoming music business owners through artist-approved selling
- FanScore, quests, invites and social proof
- Blog and Payload Admin foundation
- SEO and AI crawl foundation for the corporate domain
- Supabase-ready blog publishing schema
- The mission to make one billion millionaires through music-powered ownership

## Create Account button

The header now has a right-side **Create Account** button.

Current staging URL:
https://staging.fanfactors.com

Production URL stored on CTA elements as `data-production-url`:
https://www.fanfactors.com

For launch, switch the href values from staging to the live registration URL.

## Admin Area

`/admin` is now reserved for Payload Admin. The old static admin prototypes were removed so the repo has one admin direction only.

Payload is configured through `payload.config.ts` with modular collections in `collections/` for users, media, blog posts and pages. Details are documented in `docs/payload-admin.md`.

## Dynamic blog path

Payload is the production admin path for corporate publishing. The existing Supabase migration is retained as the shared corporate blog schema reference and can be applied if the site needs to expose content through Supabase-backed services:

```text
supabase/migrations/20260510154500_create_corporate_blog.sql
```

The recommended implementation path is documented in `docs/blog-platform.md`.

Current static blog metadata lives in `data/blog-posts.json`, shaped to match the future publishing model.
The reusable validation rules live in `scripts/lib/blog-content.mjs`.

## SEO and AI discoverability

The site includes:

- `robots.txt`
- `sitemap.xml`
- `llms.txt`
- canonical URLs
- Open Graph and Twitter card metadata
- JSON-LD structured data

Ongoing SEO and AI requirements are documented in `docs/seo-ai-optimization.md`.

## Static tooling

Use Node.js 20 or newer for the validation scripts. `.nvmrc` and GitHub Actions are pinned to Node.js 20.

The page/navigation registries and validation tooling keep repeated static markup safer while the public pages remain static and are served through Next.js:

```bash
npm run seo:apply
npm run seo:validate
npm run supabase:validate
npm run docs:validate
npm run security:validate
npm run validate
```

Tooling details are documented in `docs/static-site-tooling.md`.

Environment and secret-handling rules are documented in `docs/environment-security.md`.

AGENTS.md migration progress is tracked in `docs/agents-alignment.md`.

## Quality gates

GitHub Actions runs `npm run validate` on pushes to `main` and pull requests. The workflow is documented in `docs/quality-gates.md`.

## Preview locally

```bash
cd fanfactors-music-back-v3
npm run dev
```

Then open `http://localhost:3000`. Payload Admin is available at `http://localhost:3000/admin` after `DATABASE_URL` and `PAYLOAD_SECRET` are configured.
