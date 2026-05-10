# Indy Admin Prototype

## Purpose

`/indy` is a static admin prototype for the future FanFactors content studio.

It supports local browser CRUD for blog posts:

- create posts
- edit posts
- delete posts
- modify title, slug, category, status, excerpt, body, images, tags, and links
- preview the selected post

## Current Limits

This is not the production CMS.

- Data is saved to browser `localStorage`.
- It does not write to Supabase.
- It does not publish changes to the public blog.
- It is marked `noindex` and routed through `vercel.json`.

## Production Path

The production version should move to Next.js App Router and Supabase:

- authenticated `/indy` routes
- server-side Supabase clients
- RLS-backed post mutations
- image upload/storage
- WYSIWYG section editing
- left-side page and folder tree
- editable page sections backed by reusable components
