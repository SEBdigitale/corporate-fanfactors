# AGENTS.md

This corporate site should move toward the main FanFactors engineering standard without creating unnecessary complexity.

## Current State

- Static HTML, CSS, and JavaScript deployed through Vercel.
- GitHub `main` triggers production deployment for `corporate.fanfactors.com`.
- Supabase is the preferred backend for future dynamic content.

## Target Standard

- Use TypeScript for application code when the site is migrated to an app framework.
- Prefer Next.js App Router for dynamic routes, admin workflows, and server-side data loading.
- Keep components small, reusable, and domain-focused.
- Put shared UI in `components/`, utilities in `lib/`, business logic in `services/`, shared types in `types/`, and database code in `supabase/`.
- Fetch data server-side where possible.
- Never expose Supabase service-role keys or other secrets to browser code.
- Enforce Row Level Security on all Supabase user and content tables.
- Keep admin mutations behind authenticated server-side routes or server actions.

## Static Site Rules

- Preserve the current static deploy until a dynamic migration is intentionally started.
- Avoid broad rewrites when a small metadata, content, or documentation change solves the issue.
- Keep SEO, AI crawler files, and content architecture documentation in sync with published pages.
- Reuse existing assets, layout classes, and JavaScript helpers before adding new patterns.

## Documentation Rules

- Update `docs/` when architecture, routing, publishing flow, SEO, AI discoverability, or Supabase schema changes.
- Update `supabase/README.md` when database responsibilities or migrations change.
- Include migration dependencies and deployment notes in final responses.

## FanFactors Safety Rules

- Treat future payment, resale, wallet, commission, royalty, tax, payout, and ledger logic as high-risk code.
- Store and calculate money in integer minor units only.
- Keep final financial calculations server-side and database-backed.
- Do not add financial marketplace logic to this corporate site unless explicitly requested and documented.
