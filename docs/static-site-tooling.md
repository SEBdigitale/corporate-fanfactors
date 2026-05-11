# Static Site Tooling

## Purpose

The public corporate pages are still static HTML, but the repo now runs through Next.js so Payload can own `/admin`. Metadata and crawl files should still be generated from reusable modules instead of edited by hand on every page.

## Page Registry

`data/site-pages.json` is the source of truth for:

- public page list
- sitemap priority
- sitemap change frequency
- social preview image
- schema type

## Navigation Registry

`data/site-navigation.json` is the source of truth for:

- expected header links
- expected footer links
- protected admin links

The current public site still duplicates the header and footer in each HTML file. The validator protects that duplicated shell until those pages move to component templates or Next.js components.

## Route Registry

`data/site-routes.json` is the source of truth for compatibility rewrites such as `/indy` to `/admin`.

## Blog Registry

`data/blog-posts.json` mirrors the future Supabase blog fields for the current static posts.

The validator checks that registered blog posts:

- satisfy Supabase-aligned content constraints
- use unique URL-safe slugs
- map to an `Article` page in `data/site-pages.json`
- appear on `blog.html`
- include their registry title, excerpt, category, SEO title, SEO description, and featured image

## Scripts

Use:

```bash
npm run seo:apply
npm run seo:validate
npm run site:validate
npm run docs:validate
npm run validate
```

`seo:apply` rewrites generated metadata blocks and regenerates `sitemap.xml`.

`seo:validate` is kept as a compatibility alias for the broader site validator.

`site:validate` and `validate` check:

- every registered HTML page exists
- every page has one `main#main` landmark and one `h1`
- images and buttons have accessible names
- each page has exactly one canonical URL
- JSON-LD is valid JSON
- Payload admin compatibility rewrites stay aligned with Vercel
- expected header and footer links are present on each page
- registered blog posts match their static pages
- required module documentation files exist
- sitemap includes only indexable pages
- every top-level HTML page is registered
- local `href` and `src` targets exist
- required crawl and standards files exist

## Migration Note

As public pages move to React components, the registry can become route metadata in `app/`, and the validation rules should move into a test or build check.
