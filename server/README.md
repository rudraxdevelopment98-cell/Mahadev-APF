# Mahadev APF — Backend API

NestJS + Prisma (PostgreSQL) backend foundation for the Mahadev APF enterprise
platform. This is the API layer that the marketing site, customer portal and
admin panel build on.

## Stack

- **NestJS 10** (modular architecture)
- **Prisma 5** ORM + **PostgreSQL**
- **JWT** auth (access + refresh) with **bcrypt** password hashing
- **Role-based access control** (`ADMIN` / `STAFF` / `CUSTOMER`)
- **class-validator** DTO validation
- **Swagger** API docs at `/api/docs`

## Modules

| Module     | Responsibility                                              |
| ---------- | ----------------------------------------------------------- |
| `auth`     | Register, login, JWT issuance, `/auth/me`                    |
| `users`    | Profile + admin user listing                                |
| `products` | Public catalogue + admin/staff CRUD                         |
| `orders`   | Authenticated order creation & history                      |
| `leads`    | Public RFQ/contact capture + CRM pipeline (lead scoring)    |
| `prisma`   | Shared database client                                      |

The data model (see `prisma/schema.prisma`) also includes refresh tokens,
category trees, order items and an audit log — the scaffolding for the wider
admin / CRM / e-commerce roadmap.

## Getting started

```bash
cd server
cp .env.example .env          # set DATABASE_URL + JWT secrets
npm install
npm run prisma:generate
npm run prisma:migrate        # requires a running PostgreSQL
npm run prisma:seed           # creates an admin + sample product
npm run start:dev             # http://localhost:4000/api
```

Swagger UI: <http://localhost:4000/api/docs>

### Default seeded admin

```
email:    admin@mahadevapf.com
password: ChangeMe123!
```

Change this immediately in any real environment.

## Connecting the marketing site

The Next.js site's contact / quote forms can `POST /api/leads` to capture RFQs
directly into the CRM pipeline. Point the frontend at this API via an
`NEXT_PUBLIC_API_URL` environment variable when wiring the integration.

## Scope note

This is a **foundation**, not a finished platform. It establishes the
architecture (auth, RBAC, catalogue, orders, CRM) so the broader brief —
payments/checkout, coupons, invoicing, marketing campaigns, multi-vendor,
ERP integrations, AI chatbot — can be layered on module by module.
