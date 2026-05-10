# Static Site Tooling

## Purpose

The corporate site is still a static deployment, but metadata and crawl files should be generated from reusable modules instead of edited by hand on every page.

## Page Registry

`data/site-pages.json` is the source of truth for:

- public page list
- sitemap priority
- sitemap change frequency
- social preview image
- schema type
- noindex admin pages

## Scripts

Use:

```bash
npm run seo:apply
npm run seo:validate
npm run site:validate
npm run validate
```

`seo:apply` rewrites generated metadata blocks and regenerates `sitemap.xml`.

`seo:validate` is kept as a compatibility alias for the broader site validator.

`site:validate` and `validate` check:

- every registered HTML page exists
- each page has exactly one canonical URL
- JSON-LD is valid JSON
- admin pages have `noindex`
- sitemap includes only indexable pages
- every top-level HTML page is registered
- local `href` and `src` targets exist
- required crawl and standards files exist

## Migration Note

When this site moves to Next.js, the registry can become route metadata in `app/`, and the validation rules should move into a test or build check.
