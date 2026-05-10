# Environment And Security

## Environment Variables

The current corporate site is static and does not require runtime secrets.

Future Supabase-backed admin work should use:

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`

Use `.env.example` as the template only. Real values must live in Vercel Environment Variables or a local `.env` file that is ignored by Git.

## Secret Handling

- Never commit `.env` files.
- Never expose `SUPABASE_SERVICE_ROLE_KEY` in browser code.
- Keep service-role access server-side only.
- Use Row Level Security for public/client Supabase access.
- Run `npm run security:validate` before pushing sensitive integration work.

## Static Site Note

This repo currently contains static HTML and validation scripts only. Any real Supabase auth or write workflow should be introduced through a server-side app migration rather than browser-only JavaScript.
