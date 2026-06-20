# Deploying Mahadev APF to Vercel

This is a standard Next.js app, so Vercel runs it with **zero configuration** —
server features included: the `/api/leads` route runs as a serverless function,
pages are server-rendered / statically optimized, and images are optimized
on demand.

## Deploy from GitHub (recommended)

1. Push this repo to GitHub (already done).
2. Go to <https://vercel.com> and sign in with GitHub.
3. **Add New… → Project**, then **Import** `rudraxdevelopment98-cell/mahadev-apf`.
4. Vercel auto-detects Next.js — leave the build settings as-is and click
   **Deploy**.
5. You'll get a live URL like `https://mahadev-apf.vercel.app`.

That's it. After import, Vercel deploys automatically on every push:

- **Production** comes from your production branch (default `main`).
- **Every other branch / PR** gets its own **preview URL** automatically — so
  pushing `claude/dreamy-curie-dog0h7` gives you a live preview link right away,
  before merging to `main`.

## Connecting the contact / quote forms (optional)

The forms work out of the box (they validate and acknowledge). To persist
enquiries into the CRM, point the site at the NestJS backend in
[`server/`](server/):

1. Deploy the backend somewhere public (Render, Fly.io, Railway, a VPS, …).
2. In Vercel: **Project → Settings → Environment Variables**, add
   `BACKEND_API_URL` = the backend base URL (e.g. `https://api.mahadevapf.com`).
3. Redeploy. The `/api/leads` route now forwards leads to
   `${BACKEND_API_URL}/api/leads`.

Because the form posts to the site's **own** `/api/leads` route (same origin),
no backend CORS changes are needed — the forwarding happens server-side on
Vercel.

## Custom domain

**Project → Settings → Domains** → add `mahadevapf.com` and follow the DNS
instructions. HTTPS is provisioned automatically.

## Run / build locally

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # production build
npm run start    # serve the production build
```
