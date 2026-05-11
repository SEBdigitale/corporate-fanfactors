# Environment And Security

## Environment Variables

The public corporate pages are static, but Payload Admin requires server-side runtime secrets.

Payload Admin should use:

- `DATABASE_URL`
- `PAYLOAD_SECRET`
- `NEXT_PUBLIC_SITE_URL`

Retained Supabase-backed services should use:

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`

Use `.env.example` as the template only. Real values must live in Vercel Environment Variables or a local `.env` file that is ignored by Git.

## Secret Handling

- Never commit `.env` files.
- Never expose `DATABASE_URL` or `PAYLOAD_SECRET` in browser code.
- Never expose `SUPABASE_SERVICE_ROLE_KEY` in browser code.
- Keep service-role access server-side only.
- Use Row Level Security for public/client Supabase access.
- Run `npm run security:validate` before pushing sensitive integration work.

## Static Site Note

Payload Admin is the server-side admin workflow. Any future Supabase auth or write workflow should stay server-side rather than browser-only JavaScript.
