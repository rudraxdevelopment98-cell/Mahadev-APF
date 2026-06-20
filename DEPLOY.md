# Mahadev APF — running & deploying

This is one Next.js app containing **both** the public website and the
`/admin` billing system (customers, rate list, GST/estimate invoices,
payments, dashboard). Data is stored with Prisma.

- **Local development:** SQLite (zero setup — works out of the box).
- **Production (Vercel):** a hosted Postgres database (e.g. free Neon).

---

## Run locally

```bash
npm install
cp .env.example .env        # then edit values
npm run db:migrate          # create the SQLite database
npm run db:seed             # add the admin user + sample rate list
npm run dev                 # http://localhost:3000
```

Admin panel: <http://localhost:3000/admin> — sign in with
**admin@mahadevapf.com / admin123** (change this — see below).

`.env` needs:

```
DATABASE_URL="file:./dev.db"
AUTH_SECRET="a-long-random-string-at-least-32-characters"
```

---

## Deploy to Vercel (with a real database)

GitHub Pages can't run this app (it needs a server + database). Use Vercel.

### 1. Create a Postgres database (Neon — free)

1. Sign up at <https://neon.tech> and create a project.
2. Copy the connection string (looks like
   `postgresql://user:pass@host/db?sslmode=require`).

### 2. Point Prisma at Postgres

In `prisma/schema.prisma`, change the datasource provider:

```prisma
datasource db {
  provider = "postgresql"   // was "sqlite"
  url      = env("DATABASE_URL")
}
```

Commit this change (or keep a separate branch for production).

### 3. Import the repo on Vercel

1. <https://vercel.com> → sign in with GitHub → **Add New… → Project**.
2. Import `rudraxdevelopment98-cell/mahadev-apf`. It auto-detects Next.js.
3. Add **Environment Variables**:
   - `DATABASE_URL` = your Neon connection string
   - `AUTH_SECRET` = a long random string (e.g. `openssl rand -base64 32`)
4. Deploy.

`postinstall` runs `prisma generate` automatically during the build.

### 4. Create the database tables + admin user (one time)

From your machine, pointed at the production database:

```bash
DATABASE_URL="<neon-url>" npx prisma migrate deploy
DATABASE_URL="<neon-url>" npm run db:seed
```

Your site is now live, with the admin at `https://<your-app>.vercel.app/admin`.

---

## Change the admin password / add staff

The seed creates one admin (`admin@mahadevapf.com` / `admin123`). To change it
or add users, open Prisma Studio and edit the `User` table (passwords are
bcrypt hashes), or generate a hash:

```bash
node -e "console.log(require('bcryptjs').hashSync('YOUR_NEW_PASSWORD',10))"
```

then update `passwordHash` for the user (e.g. via `npm run db:studio`).

> A proper "Settings → change password / manage staff" screen is a good next
> addition — ask and it can be built into the admin.

---

## Shop & invoice details

Edit `lib/shop.ts` to set the real shop name, address, **GSTIN**, PAN, bank
details and invoice terms — these appear on printed invoices and across the
site.
