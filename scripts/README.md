# Scripts

This folder contains Node.js scripts used to keep the public static pages and migration contracts aligned with the AGENTS.md standards.

## Commands

- `npm run seo:apply`: rewrites generated SEO metadata and regenerates `sitemap.xml`.
- `npm run site:validate`: validates pages, blog posts, metadata, navigation, local links, assets, crawl files, and required documentation.
- `npm run supabase:validate`: validates the corporate blog Supabase migration contract.
- `npm run security:validate`: validates the environment template and scans tracked source files for obvious committed secrets.
- `npm run payload:env:check`: checks whether the local or shell environment is ready to boot Payload Admin.
- `npm run payload:repair-blog`: normalizes existing Payload blog records after editorial schema or validation updates.
- `npm run payload:seed:blog-clusters`: creates missing typed SEO cluster posts in Payload without overwriting existing editor changes.
- `npm run validate`: runs the complete validation suite used by GitHub Actions.

## Structure

- `scripts/lib/`: reusable validation and generation helpers.
- top-level script files: command entry points only.

## Rules

- Keep business rules in reusable `scripts/lib/` modules.
- Keep command scripts thin.
- Add TSDoc for exported functions and constants.
- Update documentation when a validation rule changes.
