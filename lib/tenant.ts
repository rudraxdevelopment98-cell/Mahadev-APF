import "server-only";
import { headers } from "next/headers";
import { prisma } from "./db";
import { getPlan, type Plan } from "./plans";
import { tenantSlugFromHost } from "./host";

/**
 * Resolves the "current business" for a request.
 *
 * The tenant is derived from the request host: `<slug>.rudrone.com` selects
 * that business. The bare portal, a client's own custom domain, localhost and
 * previews resolve to the default tenant, so the current single-tenant
 * deployment on its own domain keeps working unchanged.
 */

export const DEFAULT_TENANT_SLUG = "mahadev";

/** The tenant slug for the current request host, or the default. */
async function currentSlug(): Promise<string> {
  try {
    const host = (await headers()).get("host");
    return tenantSlugFromHost(host) ?? DEFAULT_TENANT_SLUG;
  } catch {
    // Outside a request scope (e.g. build-time) — fall back to the default.
    return DEFAULT_TENANT_SLUG;
  }
}

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
  const slug = await currentSlug();

  let row = null;
  try {
    row = await prisma.tenant.findUnique({ where: { slug } });
    // If a subdomain points at a tenant that doesn't exist, don't silently
    // serve the default business's data — fall back to default only for the
    // default slug itself.
    if (!row && slug === DEFAULT_TENANT_SLUG) {
      row = null;
    }
  } catch {
    row = null;
  }

  // Fallback: before the tenant table is seeded, treat the running business as
  // a fully-featured account so nothing is gated off unexpectedly.
  const isDefault = slug === DEFAULT_TENANT_SLUG;
  const plan = row?.plan ?? (isDefault ? "max" : "free");
  return {
    id: row?.id ?? (isDefault ? "tenant_mahadev" : `tenant_${slug}`),
    slug: row?.slug ?? slug,
    name: row?.name ?? "Mahadev APF",
    plan,
    status: row?.status ?? "active",
    planDetails: getPlan(plan),
  };
}
