# Mahadev APF — running & deploying

One Next.js app containing **both** the public website and the `/admin` billing
system (customers, rate list, GST/estimate invoices, payments, dashboard).
Data is stored in **Postgres** (e.g. Neon) via Prisma.

> The **public website needs no database** — it always works. Only the `/admin`
> billing area needs `DATABASE_URL`.

---

## Deploy to Vercel + Neon (production)

### 1. Create the database tables (one time)

1. Open your Neon project → **SQL Editor**.
2. Open [`prisma/setup.sql`](prisma/setup.sql) from this repo, copy **all** of
   it, paste into the editor and click **Run**.

This creates every table and seeds the admin user + a starter rate list.
It is safe to run more than once.

### 2. Set environment variables on Vercel

Vercel → your project → **Settings → Environment Variables** → add (for all
environments):

| Name           | Value                                                        |
| -------------- | ------------------------------------------------------------ |
| `DATABASE_URL` | your Neon **pooled** connection string (`...-pooler...`)     |
| `AUTH_SECRET`  | a long random string — e.g. `openssl rand -base64 32`        |

### 3. Redeploy

Vercel → **Deployments** → redeploy the latest (or push a commit). Once it
finishes:

- Website: `https://<your-app>.vercel.app`
- Admin:   `https://<your-app>.vercel.app/admin`
  → sign in with **admin@mahadevapf.com / admin123** (change this — see below).

---

## Run locally

```bash
npm install
# create .env with DATABASE_URL (your Neon string) + AUTH_SECRET
npm run db:push     # create tables in the database from the schema
npm run db:seed     # add the admin user + sample rate list
npm run dev         # http://localhost:3000
```

`.env`:

```
DATABASE_URL="postgresql://USER:PASS@HOST-pooler.../neondb?sslmode=require"
AUTH_SECRET="a-long-random-string-at-least-32-characters"
```

> `npm run db:push` / `db:seed` need outbound access to your database. If your
> network blocks Postgres, use the `prisma/setup.sql` route in Neon's SQL Editor
> instead (see above).

---

## Change the admin password / add staff

The seed creates one admin (`admin@mahadevapf.com` / `admin123`). To change it,
generate a new hash:

```bash
node -e "console.log(require('bcryptjs').hashSync('YOUR_NEW_PASSWORD',10))"
```

then update `passwordHash` for that user — in Neon's SQL Editor:

```sql
UPDATE "User" SET "passwordHash" = '<hash>' WHERE "email" = 'admin@mahadevapf.com';
```

> A "Settings → change password / manage staff" screen is a good next addition —
> ask and it can be built into the admin.

---

## Shop & invoice details

Edit `lib/shop.ts` to set the real shop name, address, **GSTIN**, PAN, bank
details and invoice terms — these appear on printed invoices and across the
site.

## Security note

Treat `DATABASE_URL` and `AUTH_SECRET` as secrets — keep them in environment
variables, never commit them. If a database password is ever exposed, rotate it
in Neon and update `DATABASE_URL` on Vercel.
