# Quality Gates

## GitHub Actions

`.github/workflows/validate.yml` runs on pushes to `main` and on pull requests.

The workflow uses Node.js 20. Local shells should use the same major version through `.nvmrc`.

It runs:

```bash
npm run validate
```

## What It Protects

The validation job checks the static site contracts before Vercel receives new production changes:

- registered pages exist
- baseline accessibility contracts pass
- SEO metadata is present and valid
- sitemap entries match indexable pages
- header and footer links stay consistent
- local links and assets resolve
- `/indy` remains a compatibility rewrite to Payload Admin
- Vercel rewrites match `data/site-routes.json`
- blog post metadata matches static blog pages
- Supabase blog migration keeps required tables, columns, RLS policies, and publishing constraints
- required repository and module documentation files exist
- local Node runtime pin exists for validation parity
- environment template and committed secret guardrails pass
- required crawl and standards files exist

## Why This Exists

The public corporate pages are still static, so repeated markup can drift. This workflow keeps the current site stable while the codebase moves toward reusable components and a Payload-backed publishing workflow.
