# FanFactors Website v3 — We're taking music back.

This package updates the prior FanFactors site around the actual platform story:

- Legal music listening
- Direct copyright-owner payment logic
- Artist-set pricing and rights control
- Fans becoming music business owners through artist-approved selling
- FanScore, quests, invites and social proof
- Blog and static Admin Studio prototype
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

## Admin area note

The Admin Area is a polished static prototype. It demonstrates blog/page/campaign/KPI management but does not include real authentication or backend persistence. The dashboard draft form uses local browser storage only.

`/indy` is the newer content-studio prototype for local blog CRUD, image/link fields, previews and future WYSIWYG planning. It is documented in `docs/indy-admin.md`.

## Dynamic blog path

Supabase is the preferred backend for the production blog platform. The first migration lives at:

```text
supabase/migrations/20260510154500_create_corporate_blog.sql
```

The recommended implementation path is documented in `docs/blog-platform.md`.

Current static blog metadata lives in `data/blog-posts.json`, shaped to match the future Supabase publishing model.
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

The page/navigation registries and validation tooling keep repeated static markup safer while this remains a static site:

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

## Quality gates

GitHub Actions runs `npm run validate` on pushes to `main` and pull requests. The workflow is documented in `docs/quality-gates.md`.

## Preview locally

```bash
cd fanfactors-music-back-v3
python -m http.server 8000
```

Then open `http://localhost:8000`.
