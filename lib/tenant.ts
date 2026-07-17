import "server-only";
import { prisma } from "./db";
import { getPlan, type Plan } from "./plans";

/**
 * Resolves the "current business" for a request.
 *
 * Phase 1 (now): the platform runs a single business, so this returns the
 * seeded default tenant (slug "mahadev"). The seam is here so Phase 2 can
 * resolve the tenant from the request host / subdomain without touching
 * callers.
 */

export const DEFAULT_TENANT_SLUG = "mahadev";

export type CurrentTenant = {
  id: string;
  slug: string;
  name: string;
  plan: string;
  status: string;
  planDetails: Plan;
};

/** Just the current tenant id — for scoping queries (`where: { tenantId }`). */
export async function getTenantId(): Promise<string> {
  return (await getCurrentTenant()).id;
}

/** The current business account, or a safe fallback if none is seeded yet. */
export async function getCurrentTenant(): Promise<CurrentTenant> {
  let row = null;
  try {
    row = await prisma.tenant.findUnique({ where: { slug: DEFAULT_TENANT_SLUG } });
  } catch {
    row = null;
  }

  // Fallback: before the tenant table is seeded, treat the running business as
  // a fully-featured account so nothing is gated off unexpectedly.
  const plan = row?.plan ?? "max";
  return {
    id: row?.id ?? "tenant_mahadev", // matches the DB column defaults
    slug: row?.slug ?? DEFAULT_TENANT_SLUG,
    name: row?.name ?? "Mahadev APF",
    plan,
    status: row?.status ?? "active",
    planDetails: getPlan(plan),
  };
}
