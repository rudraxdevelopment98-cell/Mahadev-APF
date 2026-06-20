import { PrismaClient } from "@prisma/client";

// Default to the local SQLite database when DATABASE_URL is not provided by the
// environment (e.g. a production-mode `next start` that didn't load .env).
// Production deployments set DATABASE_URL to their real (Postgres) database.
if (!process.env.DATABASE_URL) {
  process.env.DATABASE_URL = "file:./dev.db";
  console.warn(
    "[db] DATABASE_URL not set — defaulting to local SQLite (prisma/dev.db). " +
      "Set DATABASE_URL in your environment for production.",
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
