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

## Navigation Registry

`data/site-navigation.json` is the source of truth for:

- expected header links
- expected footer links
- protected admin links

The current site still duplicates the header and footer in each HTML file. The validator protects that duplicated shell until the site moves to component templates or Next.js components.

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
npm run validate
```

`seo:apply` rewrites generated metadata blocks and regenerates `sitemap.xml`.

`seo:validate` is kept as a compatibility alias for the broader site validator.

`site:validate` and `validate` check:

- every registered HTML page exists
- each page has exactly one canonical URL
- JSON-LD is valid JSON
- admin pages have `noindex`
- expected header and footer links are present on each page
- registered blog posts match their static pages
- sitemap includes only indexable pages
- every top-level HTML page is registered
- local `href` and `src` targets exist
- required crawl and standards files exist

## Migration Note

When this site moves to Next.js, the registry can become route metadata in `app/`, and the validation rules should move into a test or build check.
