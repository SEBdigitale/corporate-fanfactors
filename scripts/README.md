# Scripts

This folder contains dependency-free Node.js scripts used to keep the static corporate site aligned with the AGENTS.md standards.

## Commands

- `npm run seo:apply`: rewrites generated SEO metadata and regenerates `sitemap.xml`.
- `npm run site:validate`: validates pages, blog posts, metadata, navigation, local links, assets, crawl files, and required documentation.
- `npm run supabase:validate`: validates the corporate blog Supabase migration contract.
- `npm run validate`: runs the complete validation suite used by GitHub Actions.

## Structure

- `scripts/lib/`: reusable validation and generation helpers.
- top-level script files: command entry points only.

## Rules

- Keep business rules in reusable `scripts/lib/` modules.
- Keep command scripts thin.
- Add TSDoc for exported functions and constants.
- Update documentation when a validation rule changes.
