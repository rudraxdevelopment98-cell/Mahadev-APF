import { PrismaClient } from "@prisma/client";

// The admin/billing area needs a Postgres database. Set DATABASE_URL (and
// DIRECT_URL for migrations) in your environment / Vercel project settings.
// The public website does not use the database, so it works without it.
if (!process.env.DATABASE_URL) {
  console.warn(
    "[db] DATABASE_URL is not set — the /admin billing area will not work " +
      "until you configure a Postgres DATABASE_URL.",
  );
}

// Reuse a single PrismaClient across hot reloads / serverless invocations.
const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === "development" ? ["error", "warn"] : ["error"],
  });

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
