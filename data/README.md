# Data Registries

This folder contains static registry files that act as the source of truth while the corporate site remains a static deployment.

## Files

- `site-pages.json`: page metadata for SEO generation and sitemap generation.
- `site-navigation.json`: expected header, footer, and protected admin links.
- `site-routes.json`: clean-route rewrites expected by Vercel.
- `blog-posts.json`: published blog metadata shaped to match the future Payload publishing model.

## Rules

- Keep these files small and explicit.
- Update the matching HTML page when changing a page or blog registry entry.
- Run `npm run validate` after every registry change.
- Do not add draft posts here; drafts belong in Payload Admin.
